"use client";

import { useToast } from "@/contexts/ToastContext";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { budgetStore } from "@/services/storage/budgetStorage";
import { transactionStore } from "@/services/storage/financialStorage";
import { generateId } from "@/utils/id";
import { nowIso } from "@/utils/formatDate";
import type { Budget, Transaction } from "@/types";

export function useApproveBudget() {
  const { customers } = useCustomers();
  const { showToast } = useToast();

  function approveBudget(budget: Budget): void {
    if (budget.status === "aprovado") return;

    const now = nowIso();
    budgetStore.update(budget.id, { status: "aprovado", updatedAt: now });

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
    transactionStore.add(transaction);

    showToast({ title: "Orçamento aprovado e lançado no financeiro", variant: "success" });
  }

  return { approveBudget };
}
