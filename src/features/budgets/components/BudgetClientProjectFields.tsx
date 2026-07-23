"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import type { BudgetFormValues } from "../schemas";

export function BudgetClientProjectFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BudgetFormValues>();
  const { customers } = useCustomers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cliente e projeto</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <FormField label="Cliente" error={errors.customerId?.message} className="sm:col-span-2">
          <Select
            {...register("customerId")}
            placeholder="Selecione um cliente"
            options={customers.map((customer) => ({ value: customer.id, label: customer.name }))}
          />
        </FormField>
        <FormField label="Nome do projeto" error={errors.projectName?.message} className="sm:col-span-2">
          <Input {...register("projectName")} />
        </FormField>
        <FormField label="Descrição" className="sm:col-span-2">
          <Textarea {...register("description")} />
        </FormField>
        <FormField label="Prazo de entrega">
          <Input type="date" {...register("deadline")} />
        </FormField>
        <FormField label="Validade (dias)" error={errors.validityDays?.message}>
          <Input type="number" step="1" {...register("validityDays", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Observações" className="sm:col-span-2">
          <Textarea {...register("notes")} />
        </FormField>
      </CardContent>
    </Card>
  );
}
