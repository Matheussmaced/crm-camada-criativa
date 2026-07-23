import { BarChartCard } from "@/components/charts";
import type { MonthlyCountPoint } from "../utils/chartData";

export function OrdersPerMonthChart({ data }: { data: MonthlyCountPoint[] }) {
  return (
    <BarChartCard
      title="Pedidos por mês"
      description="Orçamentos aprovados"
      data={data}
      xKey="month"
      series={[{ key: "total", label: "Pedidos", color: "#f59e0b" }]}
    />
  );
}
