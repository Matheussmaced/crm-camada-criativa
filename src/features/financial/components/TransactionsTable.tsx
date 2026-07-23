"use client";

import { ArrowUpDown, Copy, MoreVertical, Paperclip, Pencil, Receipt, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Dropdown } from "@/components/ui/Dropdown";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePagination } from "@/hooks/usePagination";
import { useSort } from "@/hooks/useSort";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { TRANSACTION_CATEGORY_LABELS, TRANSACTION_STATUS_LABELS } from "@/constants/financialCategories";
import type { Transaction } from "@/types";

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDuplicate: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const STATUS_VARIANT: Record<Transaction["status"], "success" | "warning" | "danger"> = {
  pago: "success",
  pendente: "warning",
  atrasado: "danger",
};

function SortableHeader({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button className="flex items-center gap-1" onClick={onClick}>
      {label}
      <ArrowUpDown className={`h-3 w-3 ${active ? "text-indigo-500" : "text-zinc-300"}`} />
    </button>
  );
}

export function TransactionsTable({ transactions, onEdit, onDuplicate, onDelete }: TransactionsTableProps) {
  const { sorted, sortKey, toggleSort } = useSort<Transaction>(transactions, "date", (item, key) =>
    key === "amount" ? item.amount : String(item[key])
  );
  const { pageItems, page, pageCount, setPage } = usePagination(sorted, 8);

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="Nenhum lançamento encontrado"
        description="Adicione receitas, despesas ou outros lançamentos financeiros."
      />
    );
  }

  return (
    <div>
      <Table>
        <TableHead>
          <tr>
            <TableHeaderCell>
              <SortableHeader label="Data" active={sortKey === "date"} onClick={() => toggleSort("date")} />
            </TableHeaderCell>
            <TableHeaderCell>
              <SortableHeader
                label="Descrição"
                active={sortKey === "description"}
                onClick={() => toggleSort("description")}
              />
            </TableHeaderCell>
            <TableHeaderCell>Categoria</TableHeaderCell>
            <TableHeaderCell>Tipo</TableHeaderCell>
            <TableHeaderCell>
              <SortableHeader label="Valor" active={sortKey === "amount"} onClick={() => toggleSort("amount")} />
            </TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell className="text-right">Ações</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {pageItems.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                <div className="flex items-center gap-1.5">
                  {transaction.description}
                  {transaction.attachmentId && <Paperclip className="h-3 w-3 text-zinc-400" />}
                </div>
              </TableCell>
              <TableCell>{TRANSACTION_CATEGORY_LABELS[transaction.category]}</TableCell>
              <TableCell>
                <Badge variant={transaction.type === "entrada" ? "success" : "danger"}>
                  {transaction.type === "entrada" ? "Entrada" : "Saída"}
                </Badge>
              </TableCell>
              <TableCell
                className={
                  transaction.type === "entrada"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }
              >
                {transaction.type === "entrada" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[transaction.status]}>
                  {TRANSACTION_STATUS_LABELS[transaction.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Dropdown
                  trigger={
                    <button className="rounded-md p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  }
                  items={[
                    {
                      label: "Editar",
                      icon: <Pencil className="h-4 w-4" />,
                      onClick: () => onEdit(transaction),
                    },
                    {
                      label: "Duplicar",
                      icon: <Copy className="h-4 w-4" />,
                      onClick: () => onDuplicate(transaction),
                    },
                    {
                      label: "Excluir",
                      icon: <Trash2 className="h-4 w-4" />,
                      onClick: () => onDelete(transaction),
                      danger: true,
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
