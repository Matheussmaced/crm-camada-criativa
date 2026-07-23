import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_COLORS } from "@/constants/chartColors";
import type { ChartSeries } from "./LineChartCard";

interface BarChartCardProps {
  title: string;
  description?: string;
  data: Record<string, string | number>[];
  xKey: string;
  series: ChartSeries[];
  valueFormatter?: (value: number) => string;
  layout?: "horizontal" | "vertical";
}

export function BarChartCard({
  title,
  description,
  data,
  xKey,
  series,
  valueFormatter,
  layout = "horizontal",
}: BarChartCardProps) {
  return (
    <ChartCard title={title} description={description}>
      <BarChart data={data} layout={layout} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-100 dark:stroke-zinc-800" />
        {layout === "horizontal" ? (
          <>
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} className="text-zinc-400" />
            <YAxis tick={{ fontSize: 12 }} className="text-zinc-400" />
          </>
        ) : (
          <>
            <XAxis type="number" tick={{ fontSize: 12 }} className="text-zinc-400" />
            <YAxis dataKey={xKey} type="category" width={100} tick={{ fontSize: 12 }} className="text-zinc-400" />
          </>
        )}
        <ChartTooltip formatter={valueFormatter} />
        {series.map((item, index) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.label}
            fill={item.color ?? CHART_COLORS[index % CHART_COLORS.length]}
            radius={[4, 4, 4, 4]}
          />
        ))}
      </BarChart>
    </ChartCard>
  );
}
