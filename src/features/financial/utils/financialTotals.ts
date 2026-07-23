import type { Transaction } from "@/types";

export interface FinancialTotals {
  revenue: number;
  expenses: number;
  profit: number;
  totalReceived: number;
  totalPending: number;
}

export function calculateFinancialTotals(transactions: Transaction[]): FinancialTotals {
  const revenue = transactions
    .filter((transaction) => transaction.type === "entrada")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === "saida")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalReceived = transactions
    .filter((transaction) => transaction.type === "entrada" && transaction.status === "pago")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalPending = transactions
    .filter((transaction) => transaction.status === "pendente" || transaction.status === "atrasado")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return { revenue, expenses, profit: revenue - expenses, totalReceived, totalPending };
}
