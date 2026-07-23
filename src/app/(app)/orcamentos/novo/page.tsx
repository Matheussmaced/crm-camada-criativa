import { PageHeader } from "@/components/layout/PageHeader";
import { BudgetForm } from "@/features/budgets/components/BudgetForm";

export default function NovoOrcamentoPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Novo orçamento" description="Preencha os dados para calcular o preço automaticamente." />
      <BudgetForm />
    </div>
  );
}
