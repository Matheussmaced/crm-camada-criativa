# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this project is

A complete CRM for a 3D-printing business ("Câmada Criativa" / STLFLIX-style pricing model). Data (customers, budgets, financial transactions, settings, cost configuration) lives in **Supabase** (Postgres + Auth + Storage), one row per authenticated user via `user_id` + RLS — this is a real multi-tenant backend, not a demo. Next.js is the app shell/router **and** the client that talks to Supabase directly from the browser (no custom API routes). The only browser storage left is a single small `localStorage` key used to avoid a dark/light theme flash before hydration — everything else goes through Supabase.

`supabase/schema.sql` is the single source of truth for the DB schema (tables, RLS policies, the `attachments` Storage bucket + its policies). There is no Supabase CLI link configured for this project — apply schema changes by pasting the file into the Supabase Dashboard's SQL Editor manually, then keep the file in sync with whatever you ran.

## Commands

```bash
npm run dev      # Turbopack dev server, http://localhost:3000
npm run build    # production build (Turbopack)
npm run start    # serve the production build
npm run lint     # eslint (flat config, eslint-config-next)
```

There is no test runner configured in this repo.

`npx tsc --noEmit` is the fastest way to type-check without a full build.

Requires `.env.local` (see `.env.local.example`): `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Supabase's current key naming — replaces the older "anon key"; same client-side/RLS-scoped semantics). Without it, every Supabase client call throws at runtime.

## Tech stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · React Hook Form + Zod v4 · Recharts · jsPDF + jspdf-autotable · lucide-react · `@supabase/supabase-js` + `@supabase/ssr` · `@tanstack/react-query` v5.

**Zod v4 gotcha**: this project uses Zod v4, whose error-customization API differs from v3 — use `z.number({ error: "message" })`, not `invalid_type_error`/`required_error`. Numeric form fields are declared as plain `z.number()` (not `z.coerce.number()`, which breaks the `@hookform/resolvers/zod` generic types) and paired with `register("field", { valueAsNumber: true })` on the input.

**This is not the Next.js/Supabase you know** (see `AGENTS.md`): Next 16 renamed the `middleware.ts` file convention to `proxy.ts` (exported function is `proxy`, not `middleware`) — this project's root file is `src/proxy.ts`, not `middleware.ts`; don't recreate the old name. Supabase now issues a "publishable key" instead of the legacy JWT "anon key" for client use. `cookies()` from `next/headers` is async in this Next version. Check `node_modules/next/dist/docs` before assuming an API shape from training data.

## Architecture

### Folder layout (`src/`)

Feature-based, not type-based-only: `app/` (routes only), `components/{ui,layout,charts}` (generic, reusable, feature-agnostic), `features/{auth,budgets,customers,dashboard,financial,pdf,reports,settings}` (each with its own `components/`, `hooks/`, `utils/`, `schemas.ts`), plus shared `hooks/`, `contexts/`, `lib/supabase/`, `services/supabase/`, `services/storage/` (attachments only now), `types/`, `utils/`, `constants/`.

Rule followed throughout: `page.tsx` files only compose feature components and call feature hooks — no business logic, formatting, or Supabase access directly in a page. Features may import another feature's `hooks/` or read the shared `services/supabase/*`, but never reach into another feature's `components/`.

### Supabase clients (`lib/supabase/`)

- `client.ts` — `createBrowserClient`, used by everything under `services/supabase/*` and `services/storage/attachmentStorage.ts`. This is the one actually used at runtime, since all data access happens client-side.
- `server.ts` — `createServerClient` reading/writing cookies via `next/headers` (`await cookies()`), for Server Components if one ever needs a session-aware read. Not currently on the hot path (`orcamentos/[id]/page.tsx` still just forwards `id` to a client component the same way it always did — the data lookup happens client-side).
- `middleware.ts` — `updateSession(request)`, the shared logic consumed by the root `src/proxy.ts`. Refreshes the Supabase session cookie on every navigation and redirects unauthenticated requests to `/login` **before** any page renders (real server-side protection, not just a client flash-of-content guard).

### Data layer (`services/supabase/` + React Query)

One file per entity — `customers.ts`, `budgets.ts`, `transactions.ts`, `settings.ts`, `costConfig.ts` — each exporting plain async functions (`fetchX`, `insertX`, `updateXRow`, `deleteX`) that call `supabase.from(...)`. Each file also owns a private `mapRow`/`toXRow` pair converting the DB's snake_case columns to/from the app's camelCase `src/types/*` shapes — **the DB schema is snake_case, the TypeScript types are camelCase, on purpose**; don't leak snake_case field names into components.

Feature hooks (`useCustomers`, `useBudgets`, `useTransactions`, `useSettings`, `useCostConfig`) wrap those service functions in `@tanstack/react-query`'s `useQuery` (list/record read, gated with `enabled: isAuthenticated`) and `useMutation` (writes, invalidating the query key — or `setQueryData` for the two singleton-row entities — `onSuccess`, plus a shared `onError` toast since network writes can now actually fail, unlike the old localStorage version). This preserves the pre-migration hook return shape (`{ customers, addCustomer, updateCustomer, removeCustomer }` etc.) almost exactly — the difference is `add*`/`update*`/`remove*` now return a `Promise`, so call sites that navigate right after a write (e.g. `BudgetForm`) `await` it and only navigate on success.

`company_settings` and `cost_config` are one-row-per-user tables (`user_id` is the primary key) rather than real collections — `useSettings`/`useCostConfig` upsert the whole row on every patch (`{ ...current, ...patch }`), mirroring the old `createRecordStore` merge behavior.

`useApproveBudget.ts` is still the one hook that writes across features — approving a budget updates its status **and** inserts a pending "receita" transaction — but now invalidates both the `budgets` and `transactions` React Query keys afterward so both lists refresh. It is not run inside a Postgres transaction (matches the pre-migration behavior, which wasn't atomic either).

On logout, `AuthContext` calls `queryClient.clear()` **in addition to** `supabase.auth.signOut()` — without this, the previous user's cached rows would flash for whoever logs into the same browser tab next. Don't drop this if you touch `AuthContext.tsx`.

### Auth

`contexts/AuthContext.tsx` wraps real Supabase Auth (`supabase.auth.getSession`/`onAuthStateChange`/`signInWithPassword`/`signOut`) behind the same `{ isAuthenticated, email, login, logout }` shape the rest of the app already expected, but `login`/`logout` are now `async`. There is no public sign-up route by design — users are created manually in the Supabase Dashboard (Authentication > Users); `LoginForm` only ever calls `signInWithPassword`.

Two layers of protection, not one: `src/proxy.ts` (see above) is the real, server-side gate. `components/layout/AuthGuard.tsx` is a client-side fallback that still renders `AppShellSkeleton` while the session resolves — keep both; removing the proxy would leave protection purely client-side again, removing the guard would reintroduce a skeleton-less flash.

### Hydration safety

Real data now comes from Supabase (fetched client-side via React Query, `enabled: isAuthenticated`), so the server-rendered HTML never has it — same class of server/client mismatch risk as the old localStorage version, different source. `components/layout/HydrationGate.tsx` still defers rendering real children until after mount (`AppShellSkeleton` first), wrapping `AuthGuard`, which wraps `AppShell`, in `app/(app)/layout.tsx`. Any new top-level client-data-dependent UI should go through the same gate.

The one remaining localStorage read is the anti-flash theme script inlined in `app/layout.tsx`'s `<head>`: it reads a small dedicated key (`crm3d:theme-cache`, just the theme string) written by `ThemeContext` on every change, so the dark/light class can be applied before first paint without waiting on a network round trip to Supabase. `ThemeContext` still applies the class optimistically and persists to `company_settings` in the background (`.catch(() => {})` — a failed save just means the theme reverts on next reload, not worth a rollback UI).

### Routing

- `app/(app)/*` — the authenticated shell (`layout.tsx` = `HydrationGate > AuthGuard > AppShell`). Pages: dashboard (`/`), `/financeiro`, `/orcamentos` (+ `/orcamentos/novo`, `/orcamentos/[id]`), `/clientes`, `/relatorios`, `/configuracoes`.
- `app/login/page.tsx` — outside the group, no shell.
- `orcamentos/[id]/page.tsx` is a Server Component that `await`s the Next.js 16 async `params`, then hands the `id` to a client component (`BudgetEditView`) that looks the budget up from the `useBudgets()` React Query cache.

### Pricing engine (`features/budgets/utils/pricingEngine.ts`)

Deliberately modeled after the business's own pricing spreadsheet, not a generic invented formula — if the math looks unusual, check the spreadsheet-derived reasoning before "fixing" it:

- `totalCost` (the number multiplied by markup) = **material + energy + packaging only.**
- Machine depreciation (`amortization`) and monthly fixed cost (`fixedCostPerUnit`) are computed and shown but **excluded** from `totalCost` — reference figures only.
- Final prices are markup multiples of `totalCost`: `consumerFinalPrice = totalCost * costConfig.markupConsumerFinal`, `resellerPrice = totalCost * costConfig.markupReseller` (a markup of 3 means price = 3× cost, i.e. profit = 2× cost — not "3× profit").
- `taxPercentage` / `cardFeePercentage` / `adCostPercentage` don't change the sale price; they're deducted from gross profit to get `netProfit*`.
- Material is filament-only (`MaterialType` has no "resina" — removed deliberately; don't reintroduce a resin cost field without being asked).
- `Budget.selectedPrice` defaults to `consumerFinalPrice` and is what's shown in tables/PDFs/dashboard totals — always read `budget.selectedPrice ?? budget.costBreakdown?.consumerFinalPrice ?? 0`, not `costBreakdown` fields directly, so a manually overridden price (if that's ever added) would be respected. In Postgres, `cost_breakdown` is stored as a single `jsonb` column (the whole `CostBreakdown` object), not broken into separate columns.

There is no separate "Order"/"Pedido" entity: an approved `Budget` (`status: "aprovado"`) *is* the order, everywhere (dashboard counts, customer stats, reports).

### PDF generation (`features/pdf/utils/`)

`pdfTheme.ts` holds shared header/footer drawing (`addPdfHeader`/`addPdfFooter`, both operate on a raw `jsPDF` instance) used by `generateBudgetPdf.ts` and `generateFinancialReportPdf.ts`. `addPdfHeader` is `async` because the company logo is scaled to fit a fixed box **while preserving its natural aspect ratio** — it loads the image client-side first to read `naturalWidth`/`naturalHeight` before calling `doc.addImage`; never hardcode both width and height for the logo again, that's what caused it to render squashed into a square. The client-facing budget PDF intentionally never prints cost/margin/profit fields — only what the customer should see.

### Attachments (`services/storage/attachmentStorage.ts`)

Company logo and transaction receipts are single-file-per-record, stored in a private Supabase Storage bucket (`attachments`), one folder per user (`{user_id}/{id}`, RLS-restricted via `storage.foldername(name)[1] = auth.uid()::text` — see `supabase/schema.sql`). The module still exposes the same four functions it did when this was IndexedDB (`saveAttachment`, `readAttachmentAsDataUrl`, `readAttachmentAsBlob`, `removeAttachment`), so `useLogo.ts`, `generateBudgetPdf.ts`, `generateFinancialReportPdf.ts`, and `TransactionFormModal.tsx` didn't need to change — only the internals (`.upload`/`.download`/`.remove` instead of IndexedDB calls) did. `Budget.imageAttachmentId` is a schema column with no UI wired to it yet (nothing uploads or reads it) — don't build UI for it without being asked. Transaction attachments are upload-only today; there's no view/download affordance in `TransactionsTable` yet.

### Settings auto-save

`hooks/useAutoSave.ts` debounces a watched form value and `await`s the save through the relevant mutation before flipping the status to "saved" (it used to fire-and-forget since the old localStorage write was synchronous; now that it's a real network call, the hook actually waits on the returned promise). `components/ui/SaveStatusLabel.tsx` renders the "Salvando…/Salvo automaticamente" indicator. Used by `CompanySettingsForm` and `CostConfigForm` — there's no explicit "Save" button on those screens by design.

### Dropdown menus

`components/ui/Dropdown.tsx` renders its menu through a portal into `document.body` with `position: fixed`, positioned from the trigger's `getBoundingClientRect()`, and closes on scroll/resize. This is required because table wrappers use `overflow-x: auto` — an absolutely-positioned menu nested inside would get clipped/scrolled with the table instead of floating above the page. Don't change it back to a plain `absolute` child of the trigger.

### Dashboard / Reports data reuse

`features/dashboard/utils/chartData.ts` and `dashboardMetrics.ts`, and `features/financial/utils/{cashFlow,financialTotals}.ts`, are the shared aggregation functions, fed by the same `useBudgets`/`useTransactions`/`useCustomers` React Query hooks everything else uses. `features/reports` reuses these same builders (filtered by a date range) rather than duplicating aggregation logic — when adding a new metric, check whether it already exists in one of these files before writing a new reducer.
