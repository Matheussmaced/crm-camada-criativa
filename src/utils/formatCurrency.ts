export function formatCurrency(value: number, currency = "BRL", locale = "pt-BR"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    Number.isFinite(value) ? value : 0
  );
}

export function formatPercentage(value: number, locale = "pt-BR"): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format((Number.isFinite(value) ? value : 0) / 100);
}

export function formatNumber(value: number, locale = "pt-BR"): string {
  return new Intl.NumberFormat(locale).format(Number.isFinite(value) ? value : 0);
}
