"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  deleteBudget,
  fetchBudgets,
  insertBudget,
  insertDuplicateBudget,
  updateBudgetRow,
  updateBudgetStatus,
} from "@/services/supabase/budgets";
import type { Budget, BudgetInput, CostConfig } from "@/types";
import { calculateBudgetPricing } from "../utils/pricingEngine";

export const BUDGETS_KEY = ["budgets"] as const;

export function useBudgets() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: budgets = [] } = useQuery({
    queryKey: BUDGETS_KEY,
    queryFn: fetchBudgets,
    enabled: isAuthenticated,
  });

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: BUDGETS_KEY });
  }

  const onError = () => showToast({ title: "Erro ao salvar. Tente novamente.", variant: "error" });

  const addMutation = useMutation({
    mutationFn: ({ input, costConfig }: { input: BudgetInput; costConfig: CostConfig }) =>
      insertBudget(input, calculateBudgetPricing(input, costConfig)),
    onSuccess: () => {
      invalidate();
      showToast({ title: "Orçamento criado", variant: "success" });
    },
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      input,
      costConfig,
    }: {
      id: string;
      input: BudgetInput;
      costConfig: CostConfig;
    }) => updateBudgetRow(id, input, calculateBudgetPricing(input, costConfig)),
    onSuccess: () => {
      invalidate();
      showToast({ title: "Orçamento atualizado", variant: "success" });
    },
    onError,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Budget["status"] }) =>
      updateBudgetStatus(id, status),
    onSuccess: () => {
      invalidate();
      showToast({ title: "Status atualizado", variant: "success" });
    },
    onError,
  });

  const duplicateMutation = useMutation({
    mutationFn: (budget: Budget) => insertDuplicateBudget(budget),
    onSuccess: () => {
      invalidate();
      showToast({ title: "Orçamento duplicado", variant: "success" });
    },
    onError,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      invalidate();
      showToast({ title: "Orçamento removido", variant: "success" });
    },
    onError,
  });

  return {
    budgets,
    addBudget: (input: BudgetInput, costConfig: CostConfig) =>
      addMutation.mutateAsync({ input, costConfig }),
    updateBudget: (id: string, input: BudgetInput, costConfig: CostConfig) =>
      updateMutation.mutateAsync({ id, input, costConfig }),
    updateStatus: (id: string, status: Budget["status"]) =>
      statusMutation.mutateAsync({ id, status }),
    duplicateBudget: (budget: Budget) => duplicateMutation.mutateAsync(budget),
    removeBudget: (id: string) => removeMutation.mutateAsync(id),
  };
}
