import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import type { CostConfigFormValues } from "../schemas";

export function MachineSection() {
  const { register } = useFormContext<CostConfigFormValues>();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <FormField label="Valor da impressora">
        <Input type="number" step="0.01" {...register("printerValue", { valueAsNumber: true })} />
      </FormField>
      <FormField label="Vida útil (horas)">
        <Input type="number" step="1" {...register("printerLifespanHours", { valueAsNumber: true })} />
      </FormField>
      <FormField label="Custo fixo mensal">
        <Input type="number" step="0.01" {...register("monthlyFixedCost", { valueAsNumber: true })} />
      </FormField>
      <FormField label="Unidades produzidas / mês">
        <Input type="number" step="1" {...register("monthlyUnitsProduced", { valueAsNumber: true })} />
      </FormField>
    </div>
  );
}
