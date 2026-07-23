import { z } from "zod";

export const companySettingsSchema = z.object({
  name: z.string().min(1, "Informe o nome da empresa"),
  phone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  primaryColor: z.string().min(1),
  currency: z.string().min(1),
  language: z.string().min(1),
});

export type CompanySettingsFormValues = z.infer<typeof companySettingsSchema>;

const numberField = (min = 0, max = Number.MAX_SAFE_INTEGER) =>
  z.number({ error: "Informe um número válido" }).min(min).max(max);

export const costConfigSchema = z.object({
  filamentPricePerKg: numberField(),
  wastePercentage: numberField(0, 100),
  printerPowerWatts: numberField(),
  kwhPrice: numberField(),
  packagingFeeValue: numberField(),
  labelValue: numberField(),
  internalShippingValue: numberField(),
  printerValue: numberField(),
  printerLifespanHours: numberField(1),
  monthlyFixedCost: numberField(),
  monthlyUnitsProduced: numberField(1),
  markupConsumerFinal: numberField(0),
  markupReseller: numberField(0),
  taxPercentage: numberField(0, 100),
  cardFeePercentage: numberField(0, 100),
  adCostPercentage: numberField(0, 100),
});

export type CostConfigFormValues = z.infer<typeof costConfigSchema>;
