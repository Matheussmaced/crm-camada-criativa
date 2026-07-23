"use client";

import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { BUDGET_STATUS_LABELS } from "@/constants/budgetStatus";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { useBudgets } from "@/features/budgets/hooks/useBudgets";
import type { CustomerWithStats } from "@/types";

interface CustomerDetailsDrawerProps {
  customer: CustomerWithStats | null;
  onClose: () => void;
}

export function CustomerDetailsDrawer({ customer, onClose }: CustomerDetailsDrawerProps) {
  const { budgets } = useBudgets();
  const history = customer
    ? budgets
        .filter((budget) => budget.customerId === customer.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : [];

  return (
    <Drawer isOpen={customer !== null} onClose={onClose} title={customer?.name ?? ""}>
      {customer && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-zinc-400">Total gasto</p>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {formatCurrency(customer.totalSpent)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Pedidos aprovados</p>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">{customer.orderCount}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Telefone</p>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">{customer.phone || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">E-mail</p>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">{customer.email || "-"}</p>
            </div>
          </div>

          {customer.notes && <p className="text-sm text-zinc-500 dark:text-zinc-400">{customer.notes}</p>}

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              Histórico de orçamentos
            </p>
            <div className="flex flex-col gap-2">
              {history.length === 0 && (
                <p className="text-sm text-zinc-400">Nenhum orçamento ainda.</p>
              )}
              {history.map((budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {budget.projectName}
                    </p>
                    <p className="text-xs text-zinc-400">{formatDate(budget.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(budget.selectedPrice ?? budget.costBreakdown?.consumerFinalPrice ?? 0)}
                    </p>
                    <Badge variant={budget.status === "aprovado" ? "success" : "neutral"}>
                      {BUDGET_STATUS_LABELS[budget.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
