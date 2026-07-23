import { BarChartCard } from "@/components/charts";
import { formatNumber } from "@/utils/formatCurrency";
import type { NamedValue } from "../utils/chartData";

export function TopPiecesChart({ data }: { data: NamedValue[] }) {
  return (
    <BarChartCard
      title="Top peças"
      description="Quantidade produzida"
      data={data}
      xKey="name"
      series={[{ key: "value", label: "Quantidade", color: "#ec4899" }]}
      layout="vertical"
      valueFormatter={formatNumber}
    />
  );
}
