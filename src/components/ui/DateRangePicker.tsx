import { Input } from "./Input";

export interface DateRange {
  start: string;
  end: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={value.start}
        onChange={(event) => onChange({ ...value, start: event.target.value })}
        className="w-auto"
      />
      <span className="text-xs text-zinc-400">até</span>
      <Input
        type="date"
        value={value.end}
        onChange={(event) => onChange({ ...value, end: event.target.value })}
        className="w-auto"
      />
    </div>
  );
}
