import { BarChartCard } from "@/components/charts";
import { formatCurrency } from "@/utils/formatCurrency";
import type { MonthlyFinancialPoint } from "../utils/chartData";

export function ProfitVsRevenueChart({ data }: { data: MonthlyFinancialPoint[] }) {
  return (
    <BarChartCard
      title="Lucro x Receita"
      description="Comparativo mensal"
      data={data}
      xKey="month"
      series={[
        { key: "receita", label: "Receita", color: "#6366f1" },
        { key: "lucro", label: "Lucro", color: "#22c55e" },
      ]}
      valueFormatter={formatCurrency}
    />
  );
}
