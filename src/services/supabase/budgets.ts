import { supabase } from "@/lib/supabase/client";
import type { Budget, BudgetInput, CostBreakdown } from "@/types";

interface BudgetRow {
  id: string;
  customer_id: string;
  project_name: string;
  description: string | null;
  material: Budget["material"];
  color: string | null;
  quantity: number;
  weight_grams: number;
  print_hours: number;
  notes: string | null;
  deadline: string | null;
  validity_days: number;
  status: Budget["status"];
  image_attachment_id: string | null;
  selected_price: number | null;
  cost_breakdown: CostBreakdown | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: BudgetRow): Budget {
  return {
    id: row.id,
    customerId: row.customer_id,
    projectName: row.project_name,
    description: row.description ?? undefined,
    material: row.material,
    color: row.color ?? undefined,
    quantity: row.quantity,
    weightGrams: row.weight_grams,
    printHours: row.print_hours,
    notes: row.notes ?? undefined,
    deadline: row.deadline ?? undefined,
    validityDays: row.validity_days,
    status: row.status,
    imageAttachmentId: row.image_attachment_id ?? undefined,
    selectedPrice: row.selected_price ?? undefined,
    costBreakdown: row.cost_breakdown ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toInputRow(input: BudgetInput) {
  return {
    customer_id: input.customerId,
    project_name: input.projectName,
    description: input.description ?? null,
    material: input.material,
    color: input.color ?? null,
    quantity: input.quantity,
    weight_grams: input.weightGrams,
    print_hours: input.printHours,
    notes: input.notes ?? null,
    deadline: input.deadline ?? null,
    validity_days: input.validityDays,
  };
}

export async function fetchBudgets(): Promise<Budget[]> {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as BudgetRow[]).map(mapRow);
}

export async function insertBudget(
  input: BudgetInput,
  costBreakdown: CostBreakdown
): Promise<Budget> {
  const { data, error } = await supabase
    .from("budgets")
    .insert({
      ...toInputRow(input),
      status: "rascunho",
      cost_breakdown: costBreakdown,
      selected_price: costBreakdown.consumerFinalPrice,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapRow(data as BudgetRow);
}

export async function updateBudgetRow(
  id: string,
  input: BudgetInput,
  costBreakdown: CostBreakdown
): Promise<Budget> {
  const { data, error } = await supabase
    .from("budgets")
    .update({
      ...toInputRow(input),
      cost_breakdown: costBreakdown,
      selected_price: costBreakdown.consumerFinalPrice,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return mapRow(data as BudgetRow);
}

export async function updateBudgetStatus(id: string, status: Budget["status"]): Promise<Budget> {
  const { data, error } = await supabase
    .from("budgets")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return mapRow(data as BudgetRow);
}

export async function insertDuplicateBudget(budget: Budget): Promise<Budget> {
  const { data, error } = await supabase
    .from("budgets")
    .insert({
      customer_id: budget.customerId,
      project_name: `${budget.projectName} (cópia)`,
      description: budget.description ?? null,
      material: budget.material,
      color: budget.color ?? null,
      quantity: budget.quantity,
      weight_grams: budget.weightGrams,
      print_hours: budget.printHours,
      notes: budget.notes ?? null,
      deadline: budget.deadline ?? null,
      validity_days: budget.validityDays,
      status: "rascunho",
      image_attachment_id: budget.imageAttachmentId ?? null,
      selected_price: budget.selectedPrice ?? null,
      cost_breakdown: budget.costBreakdown ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapRow(data as BudgetRow);
}

export async function deleteBudget(id: string): Promise<void> {
  const { error } = await supabase.from("budgets").delete().eq("id", id);
  if (error) throw error;
}
