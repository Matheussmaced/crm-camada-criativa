import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { BUDGET_STATUS_LABELS } from "@/constants/budgetStatus";
import type { BudgetStatus } from "@/types";

const VARIANT_BY_STATUS: Record<BudgetStatus, NonNullable<BadgeProps["variant"]>> = {
  rascunho: "neutral",
  enviado: "info",
  aprovado: "success",
  rejeitado: "danger",
  expirado: "warning",
};

export function BudgetStatusBadge({ status }: { status: BudgetStatus }) {
  return <Badge variant={VARIANT_BY_STATUS[status]}>{BUDGET_STATUS_LABELS[status]}</Badge>;
}
