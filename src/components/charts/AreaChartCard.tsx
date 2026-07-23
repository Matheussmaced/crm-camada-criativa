import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_COLORS } from "@/constants/chartColors";
import type { ChartSeries } from "./LineChartCard";

interface AreaChartCardProps {
  title: string;
  description?: string;
  data: Record<string, string | number>[];
  xKey: string;
  series: ChartSeries[];
  valueFormatter?: (value: number) => string;
}

export function AreaChartCard({
  title,
  description,
  data,
  xKey,
  series,
  valueFormatter,
}: AreaChartCardProps) {
  return (
    <ChartCard title={title} description={description}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <defs>
          {series.map((item, index) => {
            const color = item.color ?? CHART_COLORS[index % CHART_COLORS.length];
            return (
              <linearGradient key={item.key} id={`fill-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-100 dark:stroke-zinc-800" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} className="text-zinc-400" />
        <YAxis tick={{ fontSize: 12 }} className="text-zinc-400" />
        <ChartTooltip formatter={valueFormatter} />
        {series.map((item, index) => (
          <Area
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.label}
            stroke={item.color ?? CHART_COLORS[index % CHART_COLORS.length]}
            fill={`url(#fill-${item.key})`}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ChartCard>
  );
}
