"use client";

import { useMemo, useState } from "react";
import { isWithinInterval, parseISO } from "date-fns";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useDebounce } from "@/hooks/useDebounce";
import { useConfirm } from "@/hooks/useConfirm";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { generateFinancialReportPdf } from "@/features/pdf/utils/generateFinancialReportPdf";
import { formatDate } from "@/utils/formatDate";
import { useTransactions } from "../hooks/useTransactions";
import { calculateCashFlowSummary } from "../utils/cashFlow";
import { CashFlowSummaryCards } from "./CashFlowSummaryCards";
import { TransactionFilters, type TransactionFiltersState } from "./TransactionFilters";
import { TransactionsTable } from "./TransactionsTable";
import { TransactionFormModal } from "./TransactionFormModal";
import type { Transaction } from "@/types";

const EMPTY_FILTERS: TransactionFiltersState = {
  search: "",
  category: "",
  status: "",
  dateRange: { start: "", end: "" },
};

export function FinancialView() {
  const { transactions, addTransaction, updateTransaction, duplicateTransaction, removeTransaction } =
    useTransactions();
  const { settings } = useSettings();
  const modal = useDisclosure();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<Transaction | undefined>();
  const [filters, setFilters] = useState<TransactionFiltersState>(EMPTY_FILTERS);
  const debouncedSearch = useDebounce(filters.search, 250);

  const cashFlowSummary = useMemo(() => calculateCashFlowSummary(transactions), [transactions]);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return transactions.filter((transaction) => {
      if (filters.category && transaction.category !== filters.category) return false;
      if (filters.status && transaction.status !== filters.status) return false;
      if (term && !transaction.description.toLowerCase().includes(term)) return false;
      if (filters.dateRange.start && filters.dateRange.end) {
        const date = parseISO(transaction.date);
        const inRange = isWithinInterval(date, {
          start: parseISO(filters.dateRange.start),
          end: parseISO(filters.dateRange.end),
        });
        if (!inRange) return false;
      }
      return true;
    });
  }, [transactions, filters, debouncedSearch]);

  async function handleDelete(transaction: Transaction) {
    const confirmed = await confirm({
      title: "Excluir lançamento",
      description: `Deseja excluir "${transaction.description}"?`,
      variant: "danger",
      confirmLabel: "Excluir",
    });
    if (confirmed) removeTransaction(transaction.id);
  }

  function handleExportPdf() {
    const periodLabel =
      filters.dateRange.start && filters.dateRange.end
        ? `${formatDate(filters.dateRange.start)} até ${formatDate(filters.dateRange.end)}`
        : "Todos os lançamentos";
    generateFinancialReportPdf({ transactions: filtered, settings, periodLabel });
  }

  return (
    <div className="flex flex-col gap-5">
      <CashFlowSummaryCards summary={cashFlowSummary} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TransactionFilters value={filters} onChange={setFilters} />
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={handleExportPdf}>
            <Download className="h-4 w-4" /> Exportar PDF
          </Button>
          <Button
            onClick={() => {
              setEditing(undefined);
              modal.open();
            }}
          >
            <Plus className="h-4 w-4" /> Novo lançamento
          </Button>
        </div>
      </div>

      <TransactionsTable
        transactions={filtered}
        onEdit={(transaction) => {
          setEditing(transaction);
          modal.open();
        }}
        onDuplicate={duplicateTransaction}
        onDelete={handleDelete}
      />

      <TransactionFormModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        transaction={editing}
        onSubmit={(values, attachment) =>
          editing ? updateTransaction(editing.id, values, attachment) : addTransaction(values, attachment)
        }
      />
    </div>
  );
}
