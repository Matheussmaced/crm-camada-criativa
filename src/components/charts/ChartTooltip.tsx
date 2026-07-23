interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{ name: string; value: number; color?: string }>;
  formatter?: (value: number) => string;
}

export function ChartTooltip({ active, label, payload, formatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      {label && <p className="mb-1 font-medium text-zinc-900 dark:text-zinc-50">{label}</p>}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color ?? "#6366f1" }}
          />
          <span>{entry.name}:</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {formatter ? formatter(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}
