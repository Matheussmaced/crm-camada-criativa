"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { SaveStatusLabel } from "@/components/ui/SaveStatusLabel";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useCostConfig } from "../hooks/useCostConfig";
import { costConfigSchema, type CostConfigFormValues } from "../schemas";
import { MaterialEnergySection } from "./MaterialEnergySection";
import { MachineSection } from "./MachineSection";
import { PackagingSection } from "./PackagingSection";
import { MarginFeesSection } from "./MarginFeesSection";

const SECTIONS = [
  { title: "Material e energia", description: "Filamento, falhas de impressão e consumo elétrico", Component: MaterialEnergySection },
  { title: "Embalagem e envio", description: "Custos de acabamento por unidade", Component: PackagingSection },
  {
    title: "Máquina e custo fixo (referência)",
    description: "Amortização e custo fixo mensal — não entram no custo total do orçamento, servem só de referência",
    Component: MachineSection,
  },
  { title: "Precificação", description: "Markups e descontos sobre o lucro", Component: MarginFeesSection },
];

export function CostConfigForm() {
  const { costConfig, updateCostConfig } = useCostConfig();

  const methods = useForm<CostConfigFormValues>({
    resolver: zodResolver(costConfigSchema),
    defaultValues: costConfig,
  });

  const values = methods.watch();
  const status = useAutoSave(values, (next) => {
    const result = costConfigSchema.safeParse(next);
    if (result.success) return updateCostConfig(result.data);
  });

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-5">
        {SECTIONS.map(({ title, description, Component }, index) => (
          <Card key={title}>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
              {index === 0 && <SaveStatusLabel status={status} />}
            </CardHeader>
            <CardContent>
              <Component />
            </CardContent>
          </Card>
        ))}
      </form>
    </FormProvider>
  );
}
