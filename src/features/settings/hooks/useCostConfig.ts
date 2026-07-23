"use client";

import { useRecordStore } from "@/hooks/useRecordStore";
import { costConfigStore } from "@/services/storage/costConfigStorage";
import type { CostConfig } from "@/types";

export function useCostConfig() {
  const costConfig = useRecordStore(costConfigStore);

  function updateCostConfig(patch: Partial<CostConfig>) {
    costConfigStore.update(patch);
  }

  return { costConfig, updateCostConfig };
}
