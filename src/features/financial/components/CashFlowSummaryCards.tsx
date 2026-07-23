import { CalendarDays, CalendarRange, TrendingUp, Wallet } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { formatCurrency } from "@/utils/formatCurrency";
import type { CashFlowSummary } from "../utils/cashFlow";

export function CashFlowSummaryCards({ summary }: { summary: CashFlowSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard label="Saldo hoje" value={formatCurrency(summary.today)} icon={CalendarDays} />
      <StatCard label="Saldo na semana" value={formatCurrency(summary.week)} icon={CalendarRange} />
      <StatCard label="Saldo no mês" value={formatCurrency(summary.month)} icon={CalendarRange} />
      <StatCard label="Saldo no ano" value={formatCurrency(summary.year)} icon={CalendarRange} />
      <StatCard label="Saldo previsto" value={formatCurrency(summary.projected)} icon={TrendingUp} />
      <StatCard label="Saldo realizado" value={formatCurrency(summary.realized)} icon={Wallet} />
    </div>
  );
}
