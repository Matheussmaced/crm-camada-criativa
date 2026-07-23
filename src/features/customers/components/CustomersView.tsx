"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useDebounce } from "@/hooks/useDebounce";
import { useConfirm } from "@/hooks/useConfirm";
import { useCustomers } from "../hooks/useCustomers";
import { useCustomersWithStats } from "../hooks/useCustomersWithStats";
import { CustomersTable } from "./CustomersTable";
import { CustomerFormModal } from "./CustomerFormModal";
import { CustomerDetailsDrawer } from "./CustomerDetailsDrawer";
import type { Customer, CustomerWithStats } from "@/types";

export function CustomersView() {
  const { customers, addCustomer, updateCustomer, removeCustomer } = useCustomers();
  const customersWithStats = useCustomersWithStats(customers);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);
  const modal = useDisclosure();
  const [editing, setEditing] = useState<Customer | undefined>();
  const [viewing, setViewing] = useState<CustomerWithStats | null>(null);
  const confirm = useConfirm();

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return customersWithStats;
    return customersWithStats.filter((customer) =>
      [customer.name, customer.email, customer.phone, customer.city]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term))
    );
  }, [customersWithStats, debouncedSearch]);

  async function handleDelete(customer: CustomerWithStats) {
    const confirmed = await confirm({
      title: "Excluir cliente",
      description: `Tem certeza que deseja excluir "${customer.name}"? Essa ação não pode ser desfeita.`,
      variant: "danger",
      confirmLabel: "Excluir",
    });
    if (confirmed) removeCustomer(customer.id);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-sm flex-1">
          <SearchInput
            placeholder="Buscar cliente..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setEditing(undefined);
            modal.open();
          }}
        >
          <Plus className="h-4 w-4" /> Novo cliente
        </Button>
      </div>

      <CustomersTable
        customers={filtered}
        onEdit={(customer) => {
          setEditing(customer);
          modal.open();
        }}
        onDelete={handleDelete}
        onViewDetails={setViewing}
      />

      <CustomerFormModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        customer={editing}
        onSubmit={(values) => (editing ? updateCustomer(editing.id, values) : addCustomer(values))}
      />

      <CustomerDetailsDrawer customer={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
