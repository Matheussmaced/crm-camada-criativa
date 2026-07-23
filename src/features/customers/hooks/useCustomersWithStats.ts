"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { BUDGETS_KEY } from "@/features/budgets/hooks/useBudgets";
import { fetchBudgets } from "@/services/supabase/budgets";
import type { Customer, CustomerWithStats } from "@/types";

export function useCustomersWithStats(customers: Customer[]): CustomerWithStats[] {
  const { isAuthenticated } = useAuth();
  const { data: budgets = [] } = useQuery({
    queryKey: BUDGETS_KEY,
    queryFn: fetchBudgets,
    enabled: isAuthenticated,
  });

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
