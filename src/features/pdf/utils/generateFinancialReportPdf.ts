import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { CompanySettings, Transaction } from "@/types";
import { TRANSACTION_CATEGORY_LABELS, TRANSACTION_STATUS_LABELS } from "@/constants/financialCategories";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { downloadBlob } from "@/utils/download";
import { readAttachmentAsDataUrl } from "@/services/storage/attachmentStorage";
import { addPdfFooter, addPdfHeader, PDF_MARGIN, PDF_PAGE_WIDTH } from "./pdfTheme";

interface GenerateFinancialReportPdfParams {
  transactions: Transaction[];
  settings: CompanySettings;
  periodLabel: string;
}

export async function generateFinancialReportPdf({
  transactions,
  settings,
  periodLabel,
}: GenerateFinancialReportPdfParams) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const logoDataUrl = settings.logoAttachmentId
    ? await readAttachmentAsDataUrl(settings.logoAttachmentId)
    : undefined;

  const summaryY = await addPdfHeader(doc, {
    title: "Relatório financeiro",
    subtitle: periodLabel,
    settings,
    logoDataUrl,
  });

  const totalRevenue = transactions
    .filter((transaction) => transaction.type === "entrada")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "saida")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const profit = totalRevenue - totalExpenses;

  const cardWidth = (PDF_PAGE_WIDTH - PDF_MARGIN * 2 - 16) / 3;
  const cards: { label: string; value: number; color: [number, number, number] }[] = [
    { label: "Receitas", value: totalRevenue, color: [16, 185, 129] },
    { label: "Despesas", value: totalExpenses, color: [239, 68, 68] },
    { label: "Lucro", value: profit, color: [79, 70, 229] },
  ];

  cards.forEach((card, index) => {
    const x = PDF_MARGIN + index * (cardWidth + 8);
    doc.setFillColor(card.color[0], card.color[1], card.color[2]);
    doc.roundedRect(x, summaryY, cardWidth, 56, 6, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(card.label, x + 12, summaryY + 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(formatCurrency(card.value), x + 12, summaryY + 40);
    doc.setFont("helvetica", "normal");
  });

  autoTable(doc, {
    startY: summaryY + 76,
    head: [["Data", "Descrição", "Categoria", "Tipo", "Status", "Valor"]],
    body: transactions.map((transaction) => [
      formatDate(transaction.date),
      transaction.description,
      TRANSACTION_CATEGORY_LABELS[transaction.category],
      transaction.type === "entrada" ? "Entrada" : "Saída",
      TRANSACTION_STATUS_LABELS[transaction.status],
      formatCurrency(transaction.amount),
    ]),
    theme: "striped",
    headStyles: { fillColor: [39, 39, 42] },
    styles: { fontSize: 8 },
    margin: { left: PDF_MARGIN, right: PDF_MARGIN },
  });

  addPdfFooter(doc, settings);

  downloadBlob(doc.output("blob"), `relatorio-financeiro-${Date.now()}.pdf`);
}
