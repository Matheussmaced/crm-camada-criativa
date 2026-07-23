import { BarChartCard } from "@/components/charts";
import type { MonthlyCountPoint } from "../utils/chartData";

export function NewCustomersChart({ data }: { data: MonthlyCountPoint[] }) {
  return (
    <BarChartCard
      title="Clientes novos"
      description="Cadastros por mês"
      data={data}
      xKey="month"
      series={[{ key: "total", label: "Clientes", color: "#a855f7" }]}
    />
  );
}
