import { isWithinInterval, parseISO } from "date-fns";
import type { Budget, Customer, Transaction } from "@/types";

export interface DateRange {
  start: string;
  end: string;
}

function inRange(dateStr: string, range: DateRange): boolean {
  if (!range.start || !range.end) return true;
  return isWithinInterval(parseISO(dateStr), {
    start: parseISO(range.start),
    end: parseISO(range.end),
  });
}

export function filterTransactionsByRange(transactions: Transaction[], range: DateRange): Transaction[] {
  return transactions.filter((transaction) => inRange(transaction.date, range));
}

export function filterBudgetsByRange(budgets: Budget[], range: DateRange): Budget[] {
  return budgets.filter((budget) => inRange(budget.createdAt, range));
}

export interface TopCustomerRow {
  customer: Customer;
  totalSpent: number;
  orderCount: number;
}

export function buildTopCustomers(customers: Customer[], budgets: Budget[], limit = 10): TopCustomerRow[] {
  return customers
    .map((customer) => {
      const approved = budgets.filter(
        (budget) => budget.customerId === customer.id && budget.status === "aprovado"
      );
      const totalSpent = approved.reduce(
        (sum, budget) => sum + (budget.selectedPrice ?? budget.costBreakdown?.consumerFinalPrice ?? 0),
        0
      );
      return { customer, totalSpent, orderCount: approved.length };
    })
    .filter((row) => row.orderCount > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
}
