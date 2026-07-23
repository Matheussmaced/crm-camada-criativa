import type { BudgetStatus } from "@/types";

export const BUDGET_STATUS_LABELS: Record<BudgetStatus, string> = {
  rascunho: "Rascunho",
  enviado: "Enviado",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
  expirado: "Expirado",
};

export const BUDGET_STATUS_OPTIONS = Object.entries(BUDGET_STATUS_LABELS).map(
  ([value, label]) => ({ value: value as BudgetStatus, label })
);
