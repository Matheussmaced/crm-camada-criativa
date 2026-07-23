import { BarChartCard } from "@/components/charts";
import { formatNumber } from "@/utils/formatCurrency";
import type { NamedValue } from "../utils/chartData";

export function TopMaterialsChart({ data }: { data: NamedValue[] }) {
  return (
    <BarChartCard
      title="Top materiais utilizados"
      description="Peso total em gramas"
      data={data}
      xKey="name"
      series={[{ key: "value", label: "Gramas", color: "#06b6d4" }]}
      layout="vertical"
      valueFormatter={formatNumber}
    />
  );
}
