import { PageHeader } from "@/components/layout/PageHeader";
import { BudgetEditView } from "@/features/budgets/components/BudgetEditView";

export default async function EditarOrcamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Editar orçamento" description="Ajuste os dados e recalcule o preço automaticamente." />
      <BudgetEditView id={id} />
    </div>
  );
}
