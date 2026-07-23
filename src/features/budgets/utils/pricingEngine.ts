import type { Budget, CostBreakdown, CostConfig } from "@/types";

type PricingInput = Pick<Budget, "weightGrams" | "quantity" | "printHours">;

function calculateMaterialCost(input: PricingInput, costConfig: CostConfig): number {
  const pricePerGram = costConfig.filamentPricePerKg / 1000;
  const rawCost = input.weightGrams * input.quantity * pricePerGram;
  return rawCost * (1 + costConfig.wastePercentage / 100);
}

function calculateEnergyCost(input: PricingInput, costConfig: CostConfig): number {
  return (costConfig.printerPowerWatts / 1000) * costConfig.kwhPrice * input.printHours;
}

function calculatePackagingCost(input: PricingInput, costConfig: CostConfig): number {
  return (
    (costConfig.packagingFeeValue + costConfig.labelValue) * input.quantity +
    costConfig.internalShippingValue
  );
}

function calculateAmortization(input: PricingInput, costConfig: CostConfig): number {
  const depreciationPerHour = costConfig.printerValue / costConfig.printerLifespanHours;
  return depreciationPerHour * input.printHours;
}

function calculateFixedCostPerUnit(costConfig: CostConfig): number {
  return costConfig.monthlyFixedCost / costConfig.monthlyUnitsProduced;
}

export function calculateBudgetPricing(input: PricingInput, costConfig: CostConfig): CostBreakdown {
  const materialCost = calculateMaterialCost(input, costConfig);
  const energyCost = calculateEnergyCost(input, costConfig);
  const packagingCost = calculatePackagingCost(input, costConfig);

  // Custo total do orçamento: apenas matéria-prima + energia + acessórios/embalagem.
  // Amortização e custo fixo são calculados só como referência e não entram no preço.
  const totalCost = materialCost + energyCost + packagingCost;

  const amortization = calculateAmortization(input, costConfig);
  const fixedCostPerUnit = calculateFixedCostPerUnit(costConfig);

  const consumerFinalPrice = totalCost * costConfig.markupConsumerFinal;
  const resellerPrice = totalCost * costConfig.markupReseller;

  const deductionRate =
    (costConfig.taxPercentage + costConfig.cardFeePercentage + costConfig.adCostPercentage) / 100;

  const grossProfitConsumer = consumerFinalPrice - totalCost;
  const netProfitConsumer = grossProfitConsumer - consumerFinalPrice * deductionRate;

  const grossProfitReseller = resellerPrice - totalCost;
  const netProfitReseller = grossProfitReseller - resellerPrice * deductionRate;

  return {
    materialCost,
    energyCost,
    packagingCost,
    totalCost,
    amortization,
    fixedCostPerUnit,
    consumerFinalPrice,
    resellerPrice,
    grossProfitConsumer,
    netProfitConsumer,
    grossProfitReseller,
    netProfitReseller,
  };
}
