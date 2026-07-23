"use client";

import { useDashboardData } from "../hooks/useDashboardData";
import { StatsGrid } from "./StatsGrid";
import { RevenueChart } from "./RevenueChart";
import { ExpensesByCategoryChart } from "./ExpensesByCategoryChart";
import { CashFlowChart } from "./CashFlowChart";
import { ProfitVsRevenueChart } from "./ProfitVsRevenueChart";
import { OrdersPerMonthChart } from "./OrdersPerMonthChart";
import { NewCustomersChart } from "./NewCustomersChart";
import { TopMaterialsChart } from "./TopMaterialsChart";
import { TopPiecesChart } from "./TopPiecesChart";

export function DashboardView() {
  const data = useDashboardData();

  return (
    <div className="flex flex-col gap-5">
      <StatsGrid metrics={data.metrics} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RevenueChart data={data.monthlyFinancial} />
        <ProfitVsRevenueChart data={data.monthlyFinancial} />
        <CashFlowChart data={data.cashFlow} />
        <ExpensesByCategoryChart data={data.expensesByCategory} />
        <OrdersPerMonthChart data={data.ordersPerMonth} />
        <NewCustomersChart data={data.newCustomers} />
        <TopMaterialsChart data={data.topMaterials} />
        <TopPiecesChart data={data.topPieces} />
      </div>
    </div>
  );
}
