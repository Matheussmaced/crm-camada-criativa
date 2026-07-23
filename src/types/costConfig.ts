export interface CostConfig {
  filamentPricePerKg: number;
  wastePercentage: number;

  printerPowerWatts: number;
  kwhPrice: number;

  packagingFeeValue: number;
  labelValue: number;
  internalShippingValue: number;

  printerValue: number;
  printerLifespanHours: number;

  monthlyFixedCost: number;
  monthlyUnitsProduced: number;

  markupConsumerFinal: number;
  markupReseller: number;
  taxPercentage: number;
  cardFeePercentage: number;
  adCostPercentage: number;
}
