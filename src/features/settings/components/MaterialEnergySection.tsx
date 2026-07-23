import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import type { CostConfigFormValues } from "../schemas";

export function MaterialEnergySection() {
  const { register } = useFormContext<CostConfigFormValues>();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <FormField label="Preço do filamento (por Kg)">
        <Input type="number" step="0.01" {...register("filamentPricePerKg", { valueAsNumber: true })} />
      </FormField>
      <FormField label="% de falhas (perdas)">
        <Input type="number" step="0.1" {...register("wastePercentage", { valueAsNumber: true })} />
      </FormField>
      <FormField label="Potência da impressora (W)">
        <Input type="number" step="1" {...register("printerPowerWatts", { valueAsNumber: true })} />
      </FormField>
      <FormField label="Valor do kWh">
        <Input type="number" step="0.01" {...register("kwhPrice", { valueAsNumber: true })} />
      </FormField>
    </div>
  );
}
