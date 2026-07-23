import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_COLORS } from "@/constants/chartColors";

export interface ChartSeries {
  key: string;
  label: string;
  color?: string;
}

interface LineChartCardProps {
  title: string;
  description?: string;
  data: Record<string, string | number>[];
  xKey: string;
  series: ChartSeries[];
  valueFormatter?: (value: number) => string;
}

export function LineChartCard({
  title,
  description,
  data,
  xKey,
  series,
  valueFormatter,
}: LineChartCardProps) {
  return (
    <ChartCard title={title} description={description}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-100 dark:stroke-zinc-800" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="currentColor" className="text-zinc-400" />
        <YAxis tick={{ fontSize: 12 }} stroke="currentColor" className="text-zinc-400" />
        <ChartTooltip formatter={valueFormatter} />
        {series.map((item, index) => (
          <Line
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.label}
            stroke={item.color ?? CHART_COLORS[index % CHART_COLORS.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartCard>
  );
}
