"use client";

import { useToast } from "@/contexts/ToastContext";
import { useCollectionStore } from "@/hooks/useCollectionStore";
import { budgetStore } from "@/services/storage/budgetStorage";
import { generateId } from "@/utils/id";
import { nowIso } from "@/utils/formatDate";
import type { Budget, BudgetInput, CostConfig } from "@/types";
import { calculateBudgetPricing } from "../utils/pricingEngine";

export function useBudgets() {
  const budgets = useCollectionStore(budgetStore);
  const { showToast } = useToast();

  function addBudget(input: BudgetInput, costConfig: CostConfig): Budget {
    const now = nowIso();
    const costBreakdown = calculateBudgetPricing(input, costConfig);
    const budget: Budget = {
      id: generateId(),
      ...input,
      status: "rascunho",
      costBreakdown,
      selectedPrice: costBreakdown.consumerFinalPrice,
      createdAt: now,
      updatedAt: now,
    };
    budgetStore.add(budget);
    showToast({ title: "Orçamento criado", variant: "success" });
    return budget;
  }

  function updateBudget(id: string, input: BudgetInput, costConfig: CostConfig): void {
    const costBreakdown = calculateBudgetPricing(input, costConfig);
    budgetStore.update(id, {
      ...input,
      costBreakdown,
      selectedPrice: costBreakdown.consumerFinalPrice,
      updatedAt: nowIso(),
    });
    showToast({ title: "Orçamento atualizado", variant: "success" });
  }

  function updateStatus(id: string, status: Budget["status"]): void {
    budgetStore.update(id, { status, updatedAt: nowIso() });
    showToast({ title: "Status atualizado", variant: "success" });
  }

  function duplicateBudget(budget: Budget): Budget {
    const now = nowIso();
    const duplicated: Budget = {
      ...budget,
      id: generateId(),
      projectName: `${budget.projectName} (cópia)`,
      status: "rascunho",
      createdAt: now,
      updatedAt: now,
    };
    budgetStore.add(duplicated);
    showToast({ title: "Orçamento duplicado", variant: "success" });
    return duplicated;
  }

  function removeBudget(id: string): void {
    budgetStore.remove(id);
    showToast({ title: "Orçamento removido", variant: "success" });
  }

  return { budgets, addBudget, updateBudget, updateStatus, duplicateBudget, removeBudget };
}
