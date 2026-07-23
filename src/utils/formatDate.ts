import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

function toDate(date: string | Date): Date {
  return typeof date === "string" ? parseISO(date) : date;
}

export function formatDate(date: string | Date, pattern = "dd/MM/yyyy"): string {
  const parsed = toDate(date);
  return isValid(parsed) ? format(parsed, pattern, { locale: ptBR }) : "-";
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, "dd/MM/yyyy HH:mm");
}

export function formatRelativeToNow(date: string | Date): string {
  const parsed = toDate(date);
  if (!isValid(parsed)) return "-";
  return formatDistanceToNow(parsed, { addSuffix: true, locale: ptBR });
}

export function nowIso(): string {
  return new Date().toISOString();
}
