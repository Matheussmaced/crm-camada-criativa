import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { formatCurrency } from "@/utils/formatCurrency";
import type { FinancialTotals } from "@/features/financial/utils/financialTotals";
import type { CashFlowSummary } from "@/features/financial/utils/cashFlow";

interface ReportSummaryCardsProps {
  totals: FinancialTotals;
  cashFlow: CashFlowSummary;
}

export function ReportSummaryCards({ totals, cashFlow }: ReportSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Receita no período" value={formatCurrency(totals.revenue)} icon={DollarSign} />
      <StatCard label="Despesas no período" value={formatCurrency(totals.expenses)} icon={TrendingDown} />
      <StatCard label="Lucro no período" value={formatCurrency(totals.profit)} icon={TrendingUp} />
      <StatCard label="Saldo realizado" value={formatCurrency(cashFlow.realized)} icon={Wallet} />
    </div>
  );
}
