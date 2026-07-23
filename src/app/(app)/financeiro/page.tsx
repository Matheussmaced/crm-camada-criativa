import { PageHeader } from "@/components/layout/PageHeader";
import { FinancialView } from "@/features/financial/components/FinancialView";

export default function FinanceiroPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Financeiro"
        description="Controle receitas, despesas e o fluxo de caixa da sua empresa."
      />
      <FinancialView />
    </div>
  );
}
