"use client";

import { Button } from "@/components/ui/Button";
import { useBudgets } from "../hooks/useBudgets";
import { useApproveBudget } from "../hooks/useApproveBudget";
import { BudgetStatusBadge } from "./BudgetStatusBadge";
import type { Budget, BudgetStatus } from "@/types";

const NEXT_STATUS_ACTIONS: Partial<Record<BudgetStatus, { label: string; status: BudgetStatus }[]>> = {
  rascunho: [{ label: "Marcar como enviado", status: "enviado" }],
  enviado: [
    { label: "Aprovar", status: "aprovado" },
    { label: "Rejeitar", status: "rejeitado" },
  ],
  aprovado: [{ label: "Reabrir", status: "rascunho" }],
  rejeitado: [{ label: "Reabrir", status: "rascunho" }],
  expirado: [{ label: "Reabrir", status: "rascunho" }],
};

export function BudgetStatusActions({ budget }: { budget: Budget }) {
  const { updateStatus } = useBudgets();
  const { approveBudget } = useApproveBudget();
  const actions = NEXT_STATUS_ACTIONS[budget.status] ?? [];

  function handleClick(status: BudgetStatus) {
    if (status === "aprovado") {
      approveBudget(budget);
    } else {
      updateStatus(budget.id, status);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <BudgetStatusBadge status={budget.status} />
      {actions.map((action) => (
        <Button
          key={action.status}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleClick(action.status)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
