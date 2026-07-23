import { Cell, Legend, Pie, PieChart } from "recharts";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_COLORS } from "@/constants/chartColors";

interface PieDatum {
  name: string;
  value: number;
}

interface PieChartCardProps {
  title: string;
  description?: string;
  data: PieDatum[];
  valueFormatter?: (value: number) => string;
}

export function PieChartCard({ title, description, data, valueFormatter }: PieChartCardProps) {
  return (
    <ChartCard title={title} description={description}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <ChartTooltip formatter={valueFormatter} />
      </PieChart>
    </ChartCard>
  );
}
