import { isSameMonth } from "date-fns";
import type { Budget, Customer, Transaction } from "@/types";
import { calculateFinancialTotals } from "@/features/financial/utils/financialTotals";

export interface DashboardMetrics {
  monthlyRevenue: number;
  profit: number;
  expenses: number;
  orderCount: number;
  customerCount: number;
  budgetCount: number;
  averageOrderValue: number;
  margin: number;
  totalReceived: number;
  totalPending: number;
}

export function calculateDashboardMetrics(
  transactions: Transaction[],
  budgets: Budget[],
  customers: Customer[],
  referenceDate = new Date()
): DashboardMetrics {
  const monthlyTransactions = transactions.filter((transaction) =>
    isSameMonth(new Date(transaction.date), referenceDate)
  );
  const { revenue, expenses, totalReceived, totalPending } = calculateFinancialTotals(monthlyTransactions);

  const approvedBudgets = budgets.filter((budget) => budget.status === "aprovado");
  const orderCount = approvedBudgets.length;
  const averageOrderValue =
    orderCount > 0
      ? approvedBudgets.reduce(
          (sum, budget) => sum + (budget.selectedPrice ?? budget.costBreakdown?.consumerFinalPrice ?? 0),
          0
        ) / orderCount
      : 0;

  const profit = revenue - expenses;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  return {
    monthlyRevenue: revenue,
    profit,
    expenses,
    orderCount,
    customerCount: customers.length,
    budgetCount: budgets.length,
    averageOrderValue,
    margin,
    totalReceived,
    totalPending,
  };
}
