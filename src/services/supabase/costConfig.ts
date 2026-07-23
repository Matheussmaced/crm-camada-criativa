import { supabase } from "@/lib/supabase/client";
import type { CostConfig } from "@/types";

interface CostConfigRow {
  filament_price_per_kg: number;
  waste_percentage: number;
  printer_power_watts: number;
  kwh_price: number;
  packaging_fee_value: number;
  label_value: number;
  internal_shipping_value: number;
  printer_value: number;
  printer_lifespan_hours: number;
  monthly_fixed_cost: number;
  monthly_units_produced: number;
  markup_consumer_final: number;
  markup_reseller: number;
  tax_percentage: number;
  card_fee_percentage: number;
  ad_cost_percentage: number;
}

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

function mapRow(row: CostConfigRow): CostConfig {
  return {
    filamentPricePerKg: row.filament_price_per_kg,
    wastePercentage: row.waste_percentage,
    printerPowerWatts: row.printer_power_watts,
    kwhPrice: row.kwh_price,
    packagingFeeValue: row.packaging_fee_value,
    labelValue: row.label_value,
    internalShippingValue: row.internal_shipping_value,
    printerValue: row.printer_value,
    printerLifespanHours: row.printer_lifespan_hours,
    monthlyFixedCost: row.monthly_fixed_cost,
    monthlyUnitsProduced: row.monthly_units_produced,
    markupConsumerFinal: row.markup_consumer_final,
    markupReseller: row.markup_reseller,
    taxPercentage: row.tax_percentage,
    cardFeePercentage: row.card_fee_percentage,
    adCostPercentage: row.ad_cost_percentage,
  };
}

export async function fetchCostConfig(): Promise<CostConfig> {
  const { data, error } = await supabase.from("cost_config").select("*").maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as CostConfigRow) : DEFAULT_COST_CONFIG;
}

export async function upsertCostConfig(
  patch: Partial<CostConfig>,
  current: CostConfig
): Promise<CostConfig> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const next = { ...current, ...patch };
  const { data, error } = await supabase
    .from("cost_config")
    .upsert({
      user_id: user.id,
      filament_price_per_kg: next.filamentPricePerKg,
      waste_percentage: next.wastePercentage,
      printer_power_watts: next.printerPowerWatts,
      kwh_price: next.kwhPrice,
      packaging_fee_value: next.packagingFeeValue,
      label_value: next.labelValue,
      internal_shipping_value: next.internalShippingValue,
      printer_value: next.printerValue,
      printer_lifespan_hours: next.printerLifespanHours,
      monthly_fixed_cost: next.monthlyFixedCost,
      monthly_units_produced: next.monthlyUnitsProduced,
      markup_consumer_final: next.markupConsumerFinal,
      markup_reseller: next.markupReseller,
      tax_percentage: next.taxPercentage,
      card_fee_percentage: next.cardFeePercentage,
      ad_cost_percentage: next.adCostPercentage,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapRow(data as CostConfigRow);
}
