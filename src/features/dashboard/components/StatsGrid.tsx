import {
  Calculator,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Package,
  Percent,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { formatCurrency, formatPercentage } from "@/utils/formatCurrency";
import type { DashboardMetrics } from "../utils/dashboardMetrics";

export function StatsGrid({ metrics }: { metrics: DashboardMetrics }) {
  const items = [
    { label: "Faturamento do mês", value: formatCurrency(metrics.monthlyRevenue), icon: DollarSign },
    { label: "Lucro", value: formatCurrency(metrics.profit), icon: TrendingUp },
    { label: "Despesas", value: formatCurrency(metrics.expenses), icon: TrendingDown },
    { label: "Pedidos", value: String(metrics.orderCount), icon: Package },
    { label: "Clientes", value: String(metrics.customerCount), icon: Users },
    { label: "Orçamentos gerados", value: String(metrics.budgetCount), icon: FileText },
    { label: "Valor médio por pedido", value: formatCurrency(metrics.averageOrderValue), icon: Calculator },
    { label: "Margem", value: formatPercentage(metrics.margin), icon: Percent },
    { label: "Total recebido", value: formatCurrency(metrics.totalReceived), icon: CheckCircle2 },
    { label: "Total pendente", value: formatCurrency(metrics.totalPending), icon: Clock },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <StatCard key={item.label} label={item.label} value={item.value} icon={item.icon} />
      ))}
    </div>
  );
}
