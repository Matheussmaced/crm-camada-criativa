"use client";

import { useMemo } from "react";
import { useTransactions } from "@/features/financial/hooks/useTransactions";
import { useBudgets } from "@/features/budgets/hooks/useBudgets";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { calculateDashboardMetrics } from "../utils/dashboardMetrics";
import {
  buildCashFlowSeries,
  buildExpensesByCategoryData,
  buildMonthlyFinancialSeries,
  buildNewCustomersSeries,
  buildOrdersPerMonthSeries,
  buildTopMaterialsData,
  buildTopPiecesData,
} from "../utils/chartData";

export function useDashboardData() {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const { customers } = useCustomers();

  return useMemo(
    () => ({
      metrics: calculateDashboardMetrics(transactions, budgets, customers),
      monthlyFinancial: buildMonthlyFinancialSeries(transactions),
      cashFlow: buildCashFlowSeries(transactions),
      expensesByCategory: buildExpensesByCategoryData(transactions),
      ordersPerMonth: buildOrdersPerMonthSeries(budgets),
      newCustomers: buildNewCustomersSeries(customers),
      topMaterials: buildTopMaterialsData(budgets),
      topPieces: buildTopPiecesData(budgets),
    }),
    [transactions, budgets, customers]
  );
}
