"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Copy, Download, FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { Dropdown } from "@/components/ui/Dropdown";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePagination } from "@/hooks/usePagination";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { MATERIAL_LABELS } from "@/constants/materialTypes";
import { ROUTES } from "@/constants/routes";
import { BudgetStatusBadge } from "./BudgetStatusBadge";
import type { Budget } from "@/types";

interface BudgetsTableProps {
  budgets: Budget[];
  customersById: Record<string, string>;
  onApprove: (budget: Budget) => void;
  onDuplicate: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
  onGeneratePdf: (budget: Budget) => void;
  generatingId: string | null;
}

export function BudgetsTable({
  budgets,
  customersById,
  onApprove,
  onDuplicate,
  onDelete,
  onGeneratePdf,
  generatingId,
}: BudgetsTableProps) {
  const router = useRouter();
  const { pageItems, page, pageCount, setPage } = usePagination(budgets, 8);

  if (budgets.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Nenhum orçamento encontrado"
        description="Crie seu primeiro orçamento para um cliente."
      />
    );
  }

  return (
    <div>
      <Table>
        <TableHead>
          <tr>
            <TableHeaderCell>Projeto</TableHeaderCell>
            <TableHeaderCell>Cliente</TableHeaderCell>
            <TableHeaderCell>Material</TableHeaderCell>
            <TableHeaderCell>Preço</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Criado em</TableHeaderCell>
            <TableHeaderCell className="text-right">Ações</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {pageItems.map((budget) => (
            <TableRow key={budget.id}>
              <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                {budget.projectName}
              </TableCell>
              <TableCell>{customersById[budget.customerId] ?? "-"}</TableCell>
              <TableCell>{MATERIAL_LABELS[budget.material]}</TableCell>
              <TableCell>
                {formatCurrency(budget.selectedPrice ?? budget.costBreakdown?.consumerFinalPrice ?? 0)}
              </TableCell>
              <TableCell>
                <BudgetStatusBadge status={budget.status} />
              </TableCell>
              <TableCell>{formatDate(budget.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Dropdown
                  trigger={
                    <button className="rounded-md p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  }
                  items={[
                    ...(budget.status !== "aprovado"
                      ? [
                          {
                            label: "Aprovar orçamento",
                            icon: <CheckCircle2 className="h-4 w-4" />,
                            onClick: () => onApprove(budget),
                          },
                        ]
                      : []),
                    {
                      label: "Editar",
                      icon: <Pencil className="h-4 w-4" />,
                      onClick: () => router.push(ROUTES.budgetDetail(budget.id)),
                    },
                    {
                      label: generatingId === budget.id ? "Gerando PDF..." : "Gerar PDF",
                      icon: <Download className="h-4 w-4" />,
                      onClick: () => onGeneratePdf(budget),
                    },
                    {
                      label: "Duplicar",
                      icon: <Copy className="h-4 w-4" />,
                      onClick: () => onDuplicate(budget),
                    },
                    {
                      label: "Excluir",
                      icon: <Trash2 className="h-4 w-4" />,
                      onClick: () => onDelete(budget),
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
