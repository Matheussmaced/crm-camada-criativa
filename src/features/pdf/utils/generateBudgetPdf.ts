import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Budget, CompanySettings, Customer } from "@/types";
import { MATERIAL_LABELS } from "@/constants/materialTypes";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { downloadBlob } from "@/utils/download";
import { readAttachmentAsDataUrl } from "@/services/storage/attachmentStorage";
import { addPdfFooter, addPdfHeader, PDF_MARGIN, withLastAutoTableY } from "./pdfTheme";

interface GenerateBudgetPdfParams {
  budget: Budget;
  customer: Customer;
  settings: CompanySettings;
}

export async function generateBudgetPdf({ budget, customer, settings }: GenerateBudgetPdfParams) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const logoDataUrl = settings.logoAttachmentId
    ? await readAttachmentAsDataUrl(settings.logoAttachmentId)
    : undefined;

  let cursorY = await addPdfHeader(doc, { title: "Orçamento", settings, logoDataUrl });

  doc.setFontSize(11);
  doc.setTextColor(40, 40, 46);
  doc.text(`Cliente: ${customer.name}`, PDF_MARGIN, cursorY);
  cursorY += 16;
  if (customer.phone) {
    doc.text(`Telefone: ${customer.phone}`, PDF_MARGIN, cursorY);
    cursorY += 16;
  }
  if (customer.email) {
    doc.text(`E-mail: ${customer.email}`, PDF_MARGIN, cursorY);
    cursorY += 16;
  }

  cursorY += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(budget.projectName, PDF_MARGIN, cursorY);
  doc.setFont("helvetica", "normal");
  cursorY += 18;

  if (budget.description) {
    doc.setFontSize(10);
    doc.setTextColor(82, 82, 91);
    const lines = doc.splitTextToSize(budget.description, 515);
    doc.text(lines, PDF_MARGIN, cursorY);
    cursorY += lines.length * 13 + 12;
  }

  autoTable(doc, {
    startY: cursorY,
    head: [["Item", "Detalhes"]],
    body: [
      ["Material", MATERIAL_LABELS[budget.material]],
      ...(budget.color ? [["Cor", budget.color]] : []),
      ["Quantidade", String(budget.quantity)],
      ["Prazo de entrega", budget.deadline ? formatDate(budget.deadline) : "A combinar"],
      ["Validade do orçamento", `${budget.validityDays} dias`],
    ],
    theme: "grid",
    headStyles: { fillColor: [79, 70, 229] },
    styles: { fontSize: 10 },
    margin: { left: PDF_MARGIN, right: PDF_MARGIN },
  });

  const finalY = withLastAutoTableY(doc) + 24;
  const priceLabel = "Valor total do orçamento";
  const priceValue = formatCurrency(budget.selectedPrice ?? budget.costBreakdown?.consumerFinalPrice ?? 0);

  doc.setFillColor(79, 70, 229);
  doc.roundedRect(PDF_MARGIN, finalY, 515, 50, 6, 6, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(priceLabel, PDF_MARGIN + 16, finalY + 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(priceValue, PDF_MARGIN + 16, finalY + 40);
  doc.setFont("helvetica", "normal");

  let notesY = finalY + 74;
  if (budget.notes) {
    doc.setTextColor(60, 60, 67);
    doc.setFontSize(10);
    doc.text("Observações:", PDF_MARGIN, notesY);
    notesY += 14;
    const lines = doc.splitTextToSize(budget.notes, 515);
    doc.text(lines, PDF_MARGIN, notesY);
  }

  addPdfFooter(doc, settings);

  downloadBlob(
    doc.output("blob"),
    `orcamento-${budget.projectName.replace(/\s+/g, "-").toLowerCase()}.pdf`
  );
}
