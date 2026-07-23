import { PageHeader } from "@/components/layout/PageHeader";
import { BudgetsView } from "@/features/budgets/components/BudgetsView";

export default function OrcamentosPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orçamentos"
        description="Calcule custos e gere orçamentos profissionais para impressão 3D."
      />
      <BudgetsView />
    </div>
  );
}
