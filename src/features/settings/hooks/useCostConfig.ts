"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  DEFAULT_COST_CONFIG,
  fetchCostConfig,
  upsertCostConfig,
} from "@/services/supabase/costConfig";
import type { CostConfig } from "@/types";

const COST_CONFIG_KEY = ["cost-config"] as const;

export function useCostConfig() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: costConfig = DEFAULT_COST_CONFIG } = useQuery({
    queryKey: COST_CONFIG_KEY,
    queryFn: fetchCostConfig,
    enabled: isAuthenticated,
  });

  const mutation = useMutation({
    mutationFn: (patch: Partial<CostConfig>) => upsertCostConfig(patch, costConfig),
    onSuccess: (data) => queryClient.setQueryData(COST_CONFIG_KEY, data),
  });

  function updateCostConfig(patch: Partial<CostConfig>) {
    return mutation.mutateAsync(patch);
  }

  return { costConfig, updateCostConfig };
}
