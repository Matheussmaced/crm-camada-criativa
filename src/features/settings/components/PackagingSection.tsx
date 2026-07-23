import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import type { CostConfigFormValues } from "../schemas";

export function PackagingSection() {
  const { register } = useFormContext<CostConfigFormValues>();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <FormField label="Valor da embalagem">
        <Input type="number" step="0.01" {...register("packagingFeeValue", { valueAsNumber: true })} />
      </FormField>
      <FormField label="Valor da etiqueta">
        <Input type="number" step="0.01" {...register("labelValue", { valueAsNumber: true })} />
      </FormField>
      <FormField label="Envio interno">
        <Input type="number" step="0.01" {...register("internalShippingValue", { valueAsNumber: true })} />
      </FormField>
    </div>
  );
}
