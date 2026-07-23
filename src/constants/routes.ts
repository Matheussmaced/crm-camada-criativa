export const ROUTES = {
  dashboard: "/",
  financial: "/financeiro",
  budgets: "/orcamentos",
  newBudget: "/orcamentos/novo",
  budgetDetail: (id: string) => `/orcamentos/${id}`,
  customers: "/clientes",
  customerDetail: (id: string) => `/clientes/${id}`,
  reports: "/relatorios",
  settings: "/configuracoes",
} as const;
