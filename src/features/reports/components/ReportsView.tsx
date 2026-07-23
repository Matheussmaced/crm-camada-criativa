"use client";

import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { PieChartCard, BarChartCard } from "@/components/charts";
import { formatCurrency, formatNumber } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { TRANSACTION_CATEGORY_LABELS } from "@/constants/financialCategories";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { generateFinancialReportPdf } from "@/features/pdf/utils/generateFinancialReportPdf";
import type { TransactionCategory } from "@/types";
import { useReportsData } from "../hooks/useReportsData";
import { ReportSummaryCards } from "./ReportSummaryCards";
import { TopCustomersTable } from "./TopCustomersTable";

export function ReportsView() {
  const { range, setRange, filteredTransactions, totals, cashFlow, costsByCategory, topCustomers, topMaterials, topPieces } =
    useReportsData();
  const { settings } = useSettings();

  const costsData = costsByCategory.map((item) => ({
    name: TRANSACTION_CATEGORY_LABELS[item.name as TransactionCategory] ?? item.name,
    value: item.value,
  }));

  function handleExportPdf() {
    const periodLabel =
      range.start && range.end
        ? `${formatDate(range.start)} até ${formatDate(range.end)}`
        : "Todo o período";
    generateFinancialReportPdf({ transactions: filteredTransactions, settings, periodLabel });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DateRangePicker value={range} onChange={setRange} />
        <Button variant="outline" onClick={handleExportPdf}>
          <Download className="h-4 w-4" /> Exportar relatório em PDF
        </Button>
      </div>

      <ReportSummaryCards totals={totals} cashFlow={cashFlow} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <PieChartCard title="Custos por categoria" data={costsData} valueFormatter={formatCurrency} />
        <BarChartCard
          title="Materiais mais utilizados"
          description="Peso total em gramas"
          data={topMaterials}
          xKey="name"
          series={[{ key: "value", label: "Gramas" }]}
          layout="vertical"
          valueFormatter={formatNumber}
        />
        <BarChartCard
          title="Peças mais produzidas"
          data={topPieces}
          xKey="name"
          series={[{ key: "value", label: "Quantidade" }]}
          layout="vertical"
          valueFormatter={formatNumber}
        />
        <Card>
          <CardHeader>
            <CardTitle>Clientes que mais compraram</CardTitle>
          </CardHeader>
          <CardContent>
            <TopCustomersTable rows={topCustomers} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
