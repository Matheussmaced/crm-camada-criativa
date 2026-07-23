import { AreaChartCard } from "@/components/charts";
import { formatCurrency } from "@/utils/formatCurrency";
import type { CashFlowPoint } from "../utils/chartData";

export function CashFlowChart({ data }: { data: CashFlowPoint[] }) {
  return (
    <AreaChartCard
      title="Fluxo de caixa"
      description="Saldo acumulado nos últimos 6 meses"
      data={data}
      xKey="month"
      series={[{ key: "saldo", label: "Saldo", color: "#22c55e" }]}
      valueFormatter={formatCurrency}
    />
  );
}
