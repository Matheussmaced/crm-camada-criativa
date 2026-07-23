import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardView } from "@/features/dashboard/components/DashboardView";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Visão geral do desempenho da sua empresa de impressão 3D." />
      <DashboardView />
    </div>
  );
}
