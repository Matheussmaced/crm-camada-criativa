import { PageHeader } from "@/components/layout/PageHeader";
import { SettingsView } from "@/features/settings/components/SettingsView";

export default function ConfiguracoesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Configurações"
        description="Dados da empresa e parâmetros usados no cálculo de orçamentos."
      />
      <SettingsView />
    </div>
  );
}
