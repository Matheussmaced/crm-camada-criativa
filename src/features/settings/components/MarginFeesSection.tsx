import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import type { CostConfigFormValues } from "../schemas";

export function MarginFeesSection() {
  const { register } = useFormContext<CostConfigFormValues>();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <FormField label="Markup preço consumidor final">
        <Input type="number" step="0.1" {...register("markupConsumerFinal", { valueAsNumber: true })} />
      </FormField>
      <FormField label="Markup preço lojista">
        <Input type="number" step="0.1" {...register("markupReseller", { valueAsNumber: true })} />
      </FormField>
      <FormField label="Imposto (%)">
        <Input type="number" step="0.1" {...register("taxPercentage", { valueAsNumber: true })} />
      </FormField>
      <FormField label="Taxa de cartão (%)">
        <Input type="number" step="0.1" {...register("cardFeePercentage", { valueAsNumber: true })} />
      </FormField>
      <FormField label="Custo de anúncio (%)">
        <Input type="number" step="0.1" {...register("adCostPercentage", { valueAsNumber: true })} />
      </FormField>
    </div>
  );
}
