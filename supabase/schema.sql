-- CRM Câmada Criativa — schema Supabase
-- Rode este arquivo inteiro no SQL Editor do seu projeto (supabase.com > SQL Editor > New query).
-- Idempotente: pode rodar de novo sem duplicar nada.

-- ─────────────────────────────────────────────────────────────
-- updated_at automático em toda tabela
-- ─────────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─────────────────────────────────────────────────────────────
-- customers
-- ─────────────────────────────────────────────────────────────
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  phone text,
  whatsapp text,
  email text,
  city text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_customers_updated_at on customers;
create trigger set_customers_updated_at
  before update on customers
  for each row execute function set_updated_at();

alter table customers enable row level security;

drop policy if exists "customers_own_rows" on customers;
create policy "customers_own_rows" on customers
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- budgets
-- ─────────────────────────────────────────────────────────────
create table if not exists budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  customer_id uuid not null references customers(id) on delete cascade,
  project_name text not null,
  description text,
  material text not null check (material in ('pla','abs','petg','tpu','nylon','outro')),
  color text,
  quantity integer not null,
  weight_grams numeric not null,
  print_hours numeric not null,
  notes text,
  deadline date,
  validity_days integer not null,
  status text not null default 'rascunho'
    check (status in ('rascunho','enviado','aprovado','rejeitado','expirado')),
  image_attachment_id text,
  selected_price numeric,
  cost_breakdown jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists budgets_customer_id_idx on budgets(customer_id);
create index if not exists budgets_user_id_idx on budgets(user_id);

drop trigger if exists set_budgets_updated_at on budgets;
create trigger set_budgets_updated_at
  before update on budgets
  for each row execute function set_updated_at();

alter table budgets enable row level security;

drop policy if exists "budgets_own_rows" on budgets;
create policy "budgets_own_rows" on budgets
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- transactions (financeiro)
-- ─────────────────────────────────────────────────────────────
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  description text not null,
  category text not null
    check (category in ('receita','despesa','investimento','taxa','imposto','compra')),
  type text not null check (type in ('entrada','saida')),
  date date not null,
  amount numeric not null,
  payment_method text not null
    check (payment_method in ('dinheiro','pix','cartao_credito','cartao_debito','boleto','transferencia','outro')),
  notes text,
  status text not null check (status in ('pago','pendente','atrasado')),
  attachment_id text,
  attachment_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on transactions(user_id);

drop trigger if exists set_transactions_updated_at on transactions;
create trigger set_transactions_updated_at
  before update on transactions
  for each row execute function set_updated_at();

alter table transactions enable row level security;

drop policy if exists "transactions_own_rows" on transactions;
create policy "transactions_own_rows" on transactions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- company_settings (1 linha por usuário)
-- ─────────────────────────────────────────────────────────────
create table if not exists company_settings (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  theme text not null default 'system' check (theme in ('light','dark','system')),
  logo_attachment_id text,
  name text not null default 'Minha Empresa 3D',
  phone text,
  email text,
  instagram text,
  whatsapp text,
  address text,
  primary_color text not null default '#6366f1',
  currency text not null default 'BRL',
  language text not null default 'pt-BR',
  updated_at timestamptz not null default now()
);

drop trigger if exists set_company_settings_updated_at on company_settings;
create trigger set_company_settings_updated_at
  before update on company_settings
  for each row execute function set_updated_at();

alter table company_settings enable row level security;

drop policy if exists "company_settings_own_row" on company_settings;
create policy "company_settings_own_row" on company_settings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- cost_config (1 linha por usuário)
-- ─────────────────────────────────────────────────────────────
create table if not exists cost_config (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  filament_price_per_kg numeric not null default 130,
  waste_percentage numeric not null default 5,
  printer_power_watts numeric not null default 240,
  kwh_price numeric not null default 1.2,
  packaging_fee_value numeric not null default 0,
  label_value numeric not null default 0,
  internal_shipping_value numeric not null default 0,
  printer_value numeric not null default 2000,
  printer_lifespan_hours numeric not null default 5000,
  monthly_fixed_cost numeric not null default 20,
  monthly_units_produced numeric not null default 1000,
  markup_consumer_final numeric not null default 3,
  markup_reseller numeric not null default 1.5,
  tax_percentage numeric not null default 0,
  card_fee_percentage numeric not null default 0,
  ad_cost_percentage numeric not null default 0,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_cost_config_updated_at on cost_config;
create trigger set_cost_config_updated_at
  before update on cost_config
  for each row execute function set_updated_at();

alter table cost_config enable row level security;

drop policy if exists "cost_config_own_row" on cost_config;
create policy "cost_config_own_row" on cost_config
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- Storage: bucket privado para anexos (logo, comprovantes)
-- Path convention: {user_id}/{id}
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

drop policy if exists "attachments_own_folder_select" on storage.objects;
create policy "attachments_own_folder_select" on storage.objects
  for select using (
    bucket_id = 'attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "attachments_own_folder_insert" on storage.objects;
create policy "attachments_own_folder_insert" on storage.objects
  for insert with check (
    bucket_id = 'attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "attachments_own_folder_update" on storage.objects;
create policy "attachments_own_folder_update" on storage.objects
  for update using (
    bucket_id = 'attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "attachments_own_folder_delete" on storage.objects;
create policy "attachments_own_folder_delete" on storage.objects
  for delete using (
    bucket_id = 'attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
