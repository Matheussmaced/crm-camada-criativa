"use client";

import { Eye, MoreVertical, Pencil, Trash2, Users } from "lucide-react";
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
import type { CustomerWithStats } from "@/types";

interface CustomersTableProps {
  customers: CustomerWithStats[];
  onEdit: (customer: CustomerWithStats) => void;
  onDelete: (customer: CustomerWithStats) => void;
  onViewDetails: (customer: CustomerWithStats) => void;
}

export function CustomersTable({ customers, onEdit, onDelete, onViewDetails }: CustomersTableProps) {
  const { pageItems, page, pageCount, setPage } = usePagination(customers, 8);

  if (customers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhum cliente encontrado"
        description="Cadastre seu primeiro cliente para começar a gerar orçamentos."
      />
    );
  }

  return (
    <div>
      <Table>
        <TableHead>
          <tr>
            <TableHeaderCell>Nome</TableHeaderCell>
            <TableHeaderCell>Contato</TableHeaderCell>
            <TableHeaderCell>Cidade</TableHeaderCell>
            <TableHeaderCell>Total gasto</TableHeaderCell>
            <TableHeaderCell>Última compra</TableHeaderCell>
            <TableHeaderCell className="text-right">Ações</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {pageItems.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                {customer.name}
              </TableCell>
              <TableCell>{customer.phone || customer.whatsapp || customer.email || "-"}</TableCell>
              <TableCell>{customer.city || "-"}</TableCell>
              <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
              <TableCell>
                {customer.lastPurchaseDate ? formatDate(customer.lastPurchaseDate) : "-"}
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
                      label: "Ver histórico",
                      icon: <Eye className="h-4 w-4" />,
                      onClick: () => onViewDetails(customer),
                    },
                    {
                      label: "Editar",
                      icon: <Pencil className="h-4 w-4" />,
                      onClick: () => onEdit(customer),
                    },
                    {
                      label: "Excluir",
                      icon: <Trash2 className="h-4 w-4" />,
                      onClick: () => onDelete(customer),
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
