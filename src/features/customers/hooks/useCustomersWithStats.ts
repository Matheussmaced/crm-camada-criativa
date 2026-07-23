"use client";

import { useMemo } from "react";
import { useCollectionStore } from "@/hooks/useCollectionStore";
import { budgetStore } from "@/services/storage/budgetStorage";
import type { Customer, CustomerWithStats } from "@/types";

export function useCustomersWithStats(customers: Customer[]): CustomerWithStats[] {
  const budgets = useCollectionStore(budgetStore);

  return useMemo(() => {
    return customers.map((customer) => {
      const approved = budgets.filter(
        (budget) => budget.customerId === customer.id && budget.status === "aprovado"
      );
      const totalSpent = approved.reduce(
        (sum, budget) => sum + (budget.selectedPrice ?? budget.costBreakdown?.consumerFinalPrice ?? 0),
        0
      );
      const lastPurchaseDate = approved.map((budget) => budget.updatedAt).sort().at(-1);

      return { ...customer, totalSpent, orderCount: approved.length, lastPurchaseDate };
    });
  }, [customers, budgets]);
}
