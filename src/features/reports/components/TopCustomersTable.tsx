import { Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/utils/formatCurrency";
import type { TopCustomerRow } from "../utils/reportAggregations";

export function TopCustomersTable({ rows }: { rows: TopCustomerRow[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Sem dados no período"
        description="Nenhum orçamento aprovado foi encontrado para o período selecionado."
      />
    );
  }

  return (
    <Table>
      <TableHead>
        <tr>
          <TableHeaderCell>Cliente</TableHeaderCell>
          <TableHeaderCell>Pedidos</TableHeaderCell>
          <TableHeaderCell>Total gasto</TableHeaderCell>
        </tr>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.customer.id}>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
              {row.customer.name}
            </TableCell>
            <TableCell>{row.orderCount}</TableCell>
            <TableCell>{formatCurrency(row.totalSpent)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
