"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCostConfig } from "@/features/settings/hooks/useCostConfig";
import { ROUTES } from "@/constants/routes";
import type { Budget } from "@/types";
import { useBudgets } from "../hooks/useBudgets";
import { budgetSchema, type BudgetFormValues } from "../schemas";
import { BudgetClientProjectFields } from "./BudgetClientProjectFields";
import { BudgetMaterialFields } from "./BudgetMaterialFields";
import { BudgetPricingSummary } from "./BudgetPricingSummary";

interface BudgetFormProps {
  budget?: Budget;
}

const DEFAULT_VALUES: BudgetFormValues = {
  customerId: "",
  projectName: "",
  description: "",
  material: "pla",
  color: "",
  quantity: 1,
  weightGrams: 50,
  printHours: 2,
  notes: "",
  deadline: "",
  validityDays: 7,
};

export function BudgetForm({ budget }: BudgetFormProps) {
  const router = useRouter();
  const { costConfig } = useCostConfig();
  const { addBudget, updateBudget } = useBudgets();

  const methods = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: budget
      ? {
          customerId: budget.customerId,
          projectName: budget.projectName,
          description: budget.description ?? "",
          material: budget.material,
          color: budget.color ?? "",
          quantity: budget.quantity,
          weightGrams: budget.weightGrams,
          printHours: budget.printHours,
          notes: budget.notes ?? "",
          deadline: budget.deadline ?? "",
          validityDays: budget.validityDays,
        }
      : DEFAULT_VALUES,
  });

  async function onSubmit(values: BudgetFormValues) {
    try {
      if (budget) {
        await updateBudget(budget.id, values, costConfig);
      } else {
        await addBudget(values, costConfig);
      }
      router.push(ROUTES.budgets);
    } catch {
      // Erro já reportado via toast pela mutation; mantém o usuário na tela para tentar de novo.
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="flex flex-col gap-5 lg:col-span-2">
            <BudgetClientProjectFields />
            <BudgetMaterialFields />
          </div>
          <BudgetPricingSummary />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(ROUTES.budgets)}>
            Cancelar
          </Button>
          <Button type="submit">{budget ? "Salvar alterações" : "Criar orçamento"}</Button>
        </div>
      </form>
    </FormProvider>
  );
}
