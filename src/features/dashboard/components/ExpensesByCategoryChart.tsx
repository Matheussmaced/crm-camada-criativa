import { PieChartCard } from "@/components/charts";
import { formatCurrency } from "@/utils/formatCurrency";
import { TRANSACTION_CATEGORY_LABELS } from "@/constants/financialCategories";
import type { NamedValue } from "../utils/chartData";
import type { TransactionCategory } from "@/types";

export function ExpensesByCategoryChart({ data }: { data: NamedValue[] }) {
  const labeled = data.map((item) => ({
    name: TRANSACTION_CATEGORY_LABELS[item.name as TransactionCategory] ?? item.name,
    value: item.value,
  }));

  return (
    <PieChartCard title="Despesas por categoria" data={labeled} valueFormatter={formatCurrency} />
  );
}
