"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { MATERIAL_OPTIONS } from "@/constants/materialTypes";
import type { BudgetFormValues } from "../schemas";

export function BudgetMaterialFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BudgetFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Material e produção</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <FormField label="Material">
          <Select {...register("material")} options={MATERIAL_OPTIONS} />
        </FormField>
        <FormField label="Cor">
          <Input {...register("color")} />
        </FormField>
        <FormField label="Quantidade" error={errors.quantity?.message}>
          <Input type="number" step="1" {...register("quantity", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Peso por peça (g)" error={errors.weightGrams?.message}>
          <Input type="number" step="0.1" {...register("weightGrams", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Horas de impressão (total)" error={errors.printHours?.message}>
          <Input type="number" step="0.1" {...register("printHours", { valueAsNumber: true })} />
        </FormField>
      </CardContent>
    </Card>
  );
}
