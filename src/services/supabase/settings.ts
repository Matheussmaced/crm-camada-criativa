import { supabase } from "@/lib/supabase/client";
import type { CompanySettings } from "@/types";

interface CompanySettingsRow {
  theme: CompanySettings["theme"];
  logo_attachment_id: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  whatsapp: string | null;
  address: string | null;
  primary_color: string;
  currency: string;
  language: string;
}

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  theme: "system",
  name: "Minha Empresa 3D",
  primaryColor: "#6366f1",
  currency: "BRL",
  language: "pt-BR",
};

function mapRow(row: CompanySettingsRow): CompanySettings {
  return {
    theme: row.theme,
    logoAttachmentId: row.logo_attachment_id ?? undefined,
    name: row.name,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    instagram: row.instagram ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
    address: row.address ?? undefined,
    primaryColor: row.primary_color,
    currency: row.currency,
    language: row.language,
  };
}

export async function fetchCompanySettings(): Promise<CompanySettings> {
  const { data, error } = await supabase.from("company_settings").select("*").maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as CompanySettingsRow) : DEFAULT_COMPANY_SETTINGS;
}

export async function upsertCompanySettings(
  patch: Partial<CompanySettings>,
  current: CompanySettings
): Promise<CompanySettings> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const next = { ...current, ...patch };
  const { data, error } = await supabase
    .from("company_settings")
    .upsert({
      user_id: user.id,
      theme: next.theme,
      logo_attachment_id: next.logoAttachmentId ?? null,
      name: next.name,
      phone: next.phone ?? null,
      email: next.email ?? null,
      instagram: next.instagram ?? null,
      whatsapp: next.whatsapp ?? null,
      address: next.address ?? null,
      primary_color: next.primaryColor,
      currency: next.currency,
      language: next.language,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapRow(data as CompanySettingsRow);
}
