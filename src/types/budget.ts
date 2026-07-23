export type BudgetStatus = "rascunho" | "enviado" | "aprovado" | "rejeitado" | "expirado";

export type MaterialType = "pla" | "abs" | "petg" | "tpu" | "nylon" | "outro";

export interface CostBreakdown {
  materialCost: number;
  energyCost: number;
  packagingCost: number;
  totalCost: number;
  amortization: number;
  fixedCostPerUnit: number;
  consumerFinalPrice: number;
  resellerPrice: number;
  grossProfitConsumer: number;
  netProfitConsumer: number;
  grossProfitReseller: number;
  netProfitReseller: number;
}

export interface Budget {
  id: string;
  customerId: string;
  projectName: string;
  description?: string;
  material: MaterialType;
  color?: string;
  quantity: number;
  weightGrams: number;
  printHours: number;
  notes?: string;
  deadline?: string;
  validityDays: number;
  status: BudgetStatus;
  imageAttachmentId?: string;
  selectedPrice?: number;
  costBreakdown?: CostBreakdown;
  createdAt: string;
  updatedAt: string;
}

export type BudgetInput = Omit<
  Budget,
  "id" | "status" | "costBreakdown" | "selectedPrice" | "createdAt" | "updatedAt"
>;
