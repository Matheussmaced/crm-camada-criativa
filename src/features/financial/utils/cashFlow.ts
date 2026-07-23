import { endOfWeek, isSameDay, isSameMonth, isSameYear, isWithinInterval, parseISO, startOfWeek } from "date-fns";
import type { Transaction } from "@/types";

export interface CashFlowSummary {
  today: number;
  week: number;
  month: number;
  year: number;
  projected: number;
  realized: number;
}

function signedAmount(transaction: Transaction): number {
  return transaction.type === "entrada" ? transaction.amount : -transaction.amount;
}

export function calculateCashFlowSummary(
  transactions: Transaction[],
  referenceDate = new Date()
): CashFlowSummary {
  const weekInterval = {
    start: startOfWeek(referenceDate, { weekStartsOn: 1 }),
    end: endOfWeek(referenceDate, { weekStartsOn: 1 }),
  };

  const summary: CashFlowSummary = { today: 0, week: 0, month: 0, year: 0, projected: 0, realized: 0 };

  for (const transaction of transactions) {
    const date = parseISO(transaction.date);
    const amount = signedAmount(transaction);

    if (isSameDay(date, referenceDate)) summary.today += amount;
    if (isWithinInterval(date, weekInterval)) summary.week += amount;
    if (isSameMonth(date, referenceDate)) summary.month += amount;
    if (isSameYear(date, referenceDate)) summary.year += amount;

    summary.projected += amount;
    if (transaction.status === "pago") summary.realized += amount;
  }

  return summary;
}
