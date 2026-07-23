"use client";

import { useMemo } from "react";
import { useCostConfig } from "@/features/settings/hooks/useCostConfig";
import { calculateBudgetPricing } from "../utils/pricingEngine";
import type { Budget, CostBreakdown } from "@/types";

type PricingInput = Pick<Budget, "weightGrams" | "quantity" | "printHours">;

export function useBudgetCalculator(input: PricingInput): CostBreakdown {
  const { costConfig } = useCostConfig();

  return useMemo(
    () => calculateBudgetPricing(input, costConfig),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input.weightGrams, input.quantity, input.printHours, costConfig]
  );
}
