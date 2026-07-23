"use client";

import { useMemo, useState } from "react";
import { useTransactions } from "@/features/financial/hooks/useTransactions";
import { useBudgets } from "@/features/budgets/hooks/useBudgets";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { calculateFinancialTotals } from "@/features/financial/utils/financialTotals";
import { calculateCashFlowSummary } from "@/features/financial/utils/cashFlow";
import { buildExpensesByCategoryData, buildTopMaterialsData, buildTopPiecesData } from "@/features/dashboard/utils/chartData";
import {
  buildTopCustomers,
  filterBudgetsByRange,
  filterTransactionsByRange,
  type DateRange,
} from "../utils/reportAggregations";

const DEFAULT_RANGE: DateRange = { start: "", end: "" };

export function useReportsData() {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const { customers } = useCustomers();
  const [range, setRange] = useState<DateRange>(DEFAULT_RANGE);

  const data = useMemo(() => {
    const filteredTransactions = filterTransactionsByRange(transactions, range);
    const filteredBudgets = filterBudgetsByRange(budgets, range);

    return {
      filteredTransactions,
      filteredBudgets,
      totals: calculateFinancialTotals(filteredTransactions),
      cashFlow: calculateCashFlowSummary(filteredTransactions),
      costsByCategory: buildExpensesByCategoryData(filteredTransactions),
      topCustomers: buildTopCustomers(customers, filteredBudgets),
      topMaterials: buildTopMaterialsData(filteredBudgets),
      topPieces: buildTopPiecesData(filteredBudgets),
    };
  }, [transactions, budgets, customers, range]);

  return { range, setRange, ...data };
}
