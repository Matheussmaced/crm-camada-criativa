import { PageHeader } from "@/components/layout/PageHeader";
import { CustomersView } from "@/features/customers/components/CustomersView";

export default function ClientesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Clientes" description="Gerencie o cadastro e o histórico de compras dos seus clientes." />
      <CustomersView />
    </div>
  );
}
