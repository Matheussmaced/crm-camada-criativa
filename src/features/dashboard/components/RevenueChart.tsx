import { LineChartCard } from "@/components/charts";
import { formatCurrency } from "@/utils/formatCurrency";
import type { MonthlyFinancialPoint } from "../utils/chartData";

export function RevenueChart({ data }: { data: MonthlyFinancialPoint[] }) {
  return (
    <LineChartCard
      title="Faturamento mensal"
      description="Receita dos últimos 6 meses"
      data={data}
      xKey="month"
      series={[{ key: "receita", label: "Receita", color: "#6366f1" }]}
      valueFormatter={formatCurrency}
    />
  );
}
