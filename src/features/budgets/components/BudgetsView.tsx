"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { useDebounce } from "@/hooks/useDebounce";
import { useConfirm } from "@/hooks/useConfirm";
import { BUDGET_STATUS_OPTIONS } from "@/constants/budgetStatus";
import { ROUTES } from "@/constants/routes";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useBudgets } from "../hooks/useBudgets";
import { useApproveBudget } from "../hooks/useApproveBudget";
import { useGenerateBudgetPdf } from "../hooks/useGenerateBudgetPdf";
import { BudgetsTable } from "./BudgetsTable";
import type { Budget } from "@/types";

export function BudgetsView() {
  const { budgets, duplicateBudget, removeBudget } = useBudgets();
  const { customers } = useCustomers();
  const { generate, generatingId } = useGenerateBudgetPdf();
  const { approveBudget } = useApproveBudget();
  const confirm = useConfirm();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  const customersById = useMemo(
    () => Object.fromEntries(customers.map((customer) => [customer.id, customer.name])),
    [customers]
  );

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return budgets
      .filter((budget) => !statusFilter || budget.status === statusFilter)
      .filter((budget) => {
        if (!term) return true;
        const customerName = customersById[budget.customerId]?.toLowerCase() ?? "";
        return budget.projectName.toLowerCase().includes(term) || customerName.includes(term);
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [budgets, statusFilter, debouncedSearch, customersById]);

  async function handleDelete(budget: Budget) {
    const confirmed = await confirm({
      title: "Excluir orçamento",
      description: `Tem certeza que deseja excluir "${budget.projectName}"?`,
      variant: "danger",
      confirmLabel: "Excluir",
    });
    if (confirmed) removeBudget(budget.id);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="max-w-sm flex-1">
            <SearchInput
              placeholder="Buscar por projeto ou cliente..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="w-48">
            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              options={BUDGET_STATUS_OPTIONS}
              placeholder="Todos os status"
            />
          </div>
        </div>
        <Link href={ROUTES.newBudget} className={buttonVariants({ className: "shrink-0" })}>
          <Plus className="h-4 w-4" /> Novo orçamento
        </Link>
      </div>

      <BudgetsTable
        budgets={filtered}
        customersById={customersById}
        onApprove={approveBudget}
        onDuplicate={duplicateBudget}
        onDelete={handleDelete}
        onGeneratePdf={generate}
        generatingId={generatingId}
      />
    </div>
  );
}
