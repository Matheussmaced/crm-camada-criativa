"use client";

import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { DateRangePicker, type DateRange } from "@/components/ui/DateRangePicker";
import { TRANSACTION_CATEGORY_OPTIONS, TRANSACTION_STATUS_OPTIONS } from "@/constants/financialCategories";

export interface TransactionFiltersState {
  search: string;
  category: string;
  status: string;
  dateRange: DateRange;
}

interface TransactionFiltersProps {
  value: TransactionFiltersState;
  onChange: (value: TransactionFiltersState) => void;
}

export function TransactionFilters({ value, onChange }: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-full max-w-xs">
        <SearchInput
          placeholder="Buscar lançamento..."
          value={value.search}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
        />
      </div>
      <div className="w-44">
        <Select
          value={value.category}
          onChange={(event) => onChange({ ...value, category: event.target.value })}
          options={TRANSACTION_CATEGORY_OPTIONS}
          placeholder="Todas as categorias"
        />
      </div>
      <div className="w-40">
        <Select
          value={value.status}
          onChange={(event) => onChange({ ...value, status: event.target.value })}
          options={TRANSACTION_STATUS_OPTIONS}
          placeholder="Todos os status"
        />
      </div>
      <DateRangePicker
        value={value.dateRange}
        onChange={(dateRange) => onChange({ ...value, dateRange })}
      />
    </div>
  );
}
