import { format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Budget, Customer, Transaction } from "@/types";
import { MATERIAL_LABELS } from "@/constants/materialTypes";

function lastNMonths(months: number, referenceDate = new Date()): Date[] {
  return Array.from({ length: months }, (_, index) => startOfMonth(subMonths(referenceDate, months - 1 - index)));
}

function monthKey(date: Date | string): string {
  return format(typeof date === "string" ? new Date(date) : date, "yyyy-MM");
}

function monthLabel(date: Date): string {
  return format(date, "MMM/yy", { locale: ptBR });
}

export interface MonthlyFinancialPoint {
  [key: string]: string | number;
  month: string;
  receita: number;
  despesa: number;
  lucro: number;
}

export function buildMonthlyFinancialSeries(transactions: Transaction[], months = 6): MonthlyFinancialPoint[] {
  return lastNMonths(months).map((monthStart) => {
    const key = monthKey(monthStart);
    const monthTransactions = transactions.filter((transaction) => monthKey(transaction.date) === key);
    const receita = monthTransactions
      .filter((transaction) => transaction.type === "entrada")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const despesa = monthTransactions
      .filter((transaction) => transaction.type === "saida")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    return { month: monthLabel(monthStart), receita, despesa, lucro: receita - despesa };
  });
}

export interface CashFlowPoint {
  [key: string]: string | number;
  month: string;
  saldo: number;
}

export function buildCashFlowSeries(transactions: Transaction[], months = 6): CashFlowPoint[] {
  const monthsRange = lastNMonths(months);
  const firstMonthKey = monthKey(monthsRange[0]);

  const priorBalance = transactions
    .filter((transaction) => monthKey(transaction.date) < firstMonthKey)
    .reduce((sum, transaction) => sum + (transaction.type === "entrada" ? transaction.amount : -transaction.amount), 0);

  let runningBalance = priorBalance;

  return monthsRange.map((monthStart) => {
    const key = monthKey(monthStart);
    const monthDelta = transactions
      .filter((transaction) => monthKey(transaction.date) === key)
      .reduce((sum, transaction) => sum + (transaction.type === "entrada" ? transaction.amount : -transaction.amount), 0);
    runningBalance += monthDelta;
    return { month: monthLabel(monthStart), saldo: runningBalance };
  });
}

export interface NamedValue {
  [key: string]: string | number;
  name: string;
  value: number;
}

export function buildExpensesByCategoryData(transactions: Transaction[]): NamedValue[] {
  const totals = new Map<string, number>();
  transactions
    .filter((transaction) => transaction.type === "saida")
    .forEach((transaction) => {
      totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount);
    });
  return Array.from(totals.entries()).map(([name, value]) => ({ name, value }));
}

export interface MonthlyCountPoint {
  [key: string]: string | number;
  month: string;
  total: number;
}

export function buildOrdersPerMonthSeries(budgets: Budget[], months = 6): MonthlyCountPoint[] {
  const approved = budgets.filter((budget) => budget.status === "aprovado");
  return lastNMonths(months).map((monthStart) => {
    const key = monthKey(monthStart);
    const total = approved.filter((budget) => monthKey(budget.updatedAt) === key).length;
    return { month: monthLabel(monthStart), total };
  });
}

export function buildNewCustomersSeries(customers: Customer[], months = 6): MonthlyCountPoint[] {
  return lastNMonths(months).map((monthStart) => {
    const key = monthKey(monthStart);
    const total = customers.filter((customer) => monthKey(customer.createdAt) === key).length;
    return { month: monthLabel(monthStart), total };
  });
}

export function buildTopMaterialsData(budgets: Budget[], limit = 5): NamedValue[] {
  const totals = new Map<string, number>();
  budgets.forEach((budget) => {
    const label = MATERIAL_LABELS[budget.material];
    totals.set(label, (totals.get(label) ?? 0) + budget.weightGrams * budget.quantity);
  });
  return Array.from(totals.entries())
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function buildTopPiecesData(budgets: Budget[], limit = 5): NamedValue[] {
  const totals = new Map<string, number>();
  budgets.forEach((budget) => {
    totals.set(budget.projectName, (totals.get(budget.projectName) ?? 0) + budget.quantity);
  });
  return Array.from(totals.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}
