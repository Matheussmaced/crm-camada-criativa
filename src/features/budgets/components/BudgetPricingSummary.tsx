"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatCurrency";
import { useBudgetCalculator } from "../hooks/useBudgetCalculator";
import type { BudgetFormValues } from "../schemas";

function SummaryRow({ label, value, emphasis }: { label: string; value: number; emphasis?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={
          emphasis
            ? "font-medium text-zinc-900 dark:text-zinc-50"
            : "text-zinc-500 dark:text-zinc-400"
        }
      >
        {label}
      </span>
      <span
        className={
          emphasis
            ? "font-semibold text-zinc-900 dark:text-zinc-50"
            : "text-zinc-700 dark:text-zinc-300"
        }
      >
        {formatCurrency(value)}
      </span>
    </div>
  );
}

export function BudgetPricingSummary() {
  const { control } = useFormContext<BudgetFormValues>();
  const values = useWatch({ control });
  const breakdown = useBudgetCalculator({
    weightGrams: values.weightGrams ?? 0,
    quantity: values.quantity ?? 1,
    printHours: values.printHours ?? 0,
  });

  return (
    <Card className="h-fit lg:sticky lg:top-4">
      <CardHeader>
        <CardTitle>Resultado do cálculo</CardTitle>
        <CardDescription>Atualizado automaticamente conforme os dados do orçamento.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5 text-sm">
        <SummaryRow label="Material" value={breakdown.materialCost} />
        <SummaryRow label="Energia" value={breakdown.energyCost} />
        <SummaryRow label="Embalagem" value={breakdown.packagingCost} />
        <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
        <SummaryRow label="Custo total" value={breakdown.totalCost} emphasis />
        <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
        <SummaryRow label="Preço consumidor final" value={breakdown.consumerFinalPrice} emphasis />
        <SummaryRow label="Preço lojista" value={breakdown.resellerPrice} />
        <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
        <SummaryRow label="Lucro bruto (consumidor)" value={breakdown.grossProfitConsumer} />
        <SummaryRow label="Lucro líquido (consumidor)" value={breakdown.netProfitConsumer} emphasis />
        <SummaryRow label="Lucro bruto (lojista)" value={breakdown.grossProfitReseller} />
        <SummaryRow label="Lucro líquido (lojista)" value={breakdown.netProfitReseller} />
        <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
        <SummaryRow label="Amortização (referência)" value={breakdown.amortization} />
        <SummaryRow label="Custo fixo/unidade (referência)" value={breakdown.fixedCostPerUnit} />
      </CardContent>
    </Card>
  );
}
