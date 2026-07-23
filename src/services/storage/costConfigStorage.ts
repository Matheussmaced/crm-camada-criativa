import type { CostConfig } from "@/types";
import { createRecordStore } from "./createRecordStore";
import { STORAGE_KEYS } from "./keys";

export const DEFAULT_COST_CONFIG: CostConfig = {
  filamentPricePerKg: 130,
  wastePercentage: 5,

  printerPowerWatts: 240,
  kwhPrice: 1.2,

  packagingFeeValue: 0,
  labelValue: 0,
  internalShippingValue: 0,

  printerValue: 2000,
  printerLifespanHours: 5000,

  monthlyFixedCost: 20,
  monthlyUnitsProduced: 1000,

  markupConsumerFinal: 3,
  markupReseller: 1.5,
  taxPercentage: 0,
  cardFeePercentage: 0,
  adCostPercentage: 0,
};

export const costConfigStore = createRecordStore<CostConfig>(
  STORAGE_KEYS.costConfig,
  DEFAULT_COST_CONFIG
);
