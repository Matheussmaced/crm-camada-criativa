import { BarChart3, FileText, LayoutDashboard, Settings, Users, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ROUTES } from "./routes";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Financeiro", href: ROUTES.financial, icon: Wallet },
  { label: "Orçamentos", href: ROUTES.budgets, icon: FileText },
  { label: "Clientes", href: ROUTES.customers, icon: Users },
  { label: "Relatórios", href: ROUTES.reports, icon: BarChart3 },
  { label: "Configurações", href: ROUTES.settings, icon: Settings },
];
