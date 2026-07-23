"use client";

import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBudgets } from "../hooks/useBudgets";
import { BudgetForm } from "./BudgetForm";
import { BudgetStatusActions } from "./BudgetStatusActions";

export function BudgetEditView({ id }: { id: string }) {
  const { budgets } = useBudgets();
  const budget = budgets.find((item) => item.id === id);

  if (!budget) {
    return (
      <EmptyState
        icon={FileQuestion}
        title="Orçamento não encontrado"
        description="Ele pode ter sido excluído. Volte para a lista de orçamentos."
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <BudgetStatusActions budget={budget} />
      </div>
      <BudgetForm budget={budget} />
    </div>
  );
}
