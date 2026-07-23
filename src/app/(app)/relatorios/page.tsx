import { PageHeader } from "@/components/layout/PageHeader";
import { ReportsView } from "@/features/reports/components/ReportsView";

export default function RelatoriosPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Relatórios" description="Analise receita, custos e desempenho por período." />
      <ReportsView />
    </div>
  );
}
