"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/contexts/ToastContext";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { updateBudgetStatus } from "@/services/supabase/budgets";
import { insertApprovedBudgetTransaction } from "@/services/supabase/transactions";
import type { Budget, Transaction } from "@/types";
import { generateId } from "@/utils/id";
import { nowIso } from "@/utils/formatDate";
import { BUDGETS_KEY } from "./useBudgets";
import { TRANSACTIONS_KEY } from "@/features/financial/hooks/useTransactions";

export function useApproveBudget() {
  const { customers } = useCustomers();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (budget: Budget) => {
      const now = nowIso();
      await updateBudgetStatus(budget.id, "aprovado");

      const customerName = customers.find((customer) => customer.id === budget.customerId)?.name;
      const transaction: Transaction = {
        id: generateId(),
        description: `Orçamento aprovado - ${budget.projectName}${customerName ? ` (${customerName})` : ""}`,
        category: "receita",
        type: "entrada",
        date: now.slice(0, 10),
        amount: budget.selectedPrice ?? budget.costBreakdown?.consumerFinalPrice ?? 0,
        paymentMethod: "outro",
        status: "pendente",
        notes: "Lançamento gerado automaticamente ao aprovar o orçamento.",
        createdAt: now,
        updatedAt: now,
      };
      await insertApprovedBudgetTransaction(transaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      showToast({ title: "Orçamento aprovado e lançado no financeiro", variant: "success" });
    },
    onError: () => showToast({ title: "Erro ao aprovar orçamento. Tente novamente.", variant: "error" }),
  });

  function approveBudget(budget: Budget): void {
    if (budget.status === "aprovado") return;
    mutation.mutate(budget);
  }

  return { approveBudget };
}
