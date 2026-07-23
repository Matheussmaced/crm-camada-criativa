import type jsPDF from "jspdf";
import type { CompanySettings } from "@/types";

export const PDF_MARGIN = 40;
export const PDF_PAGE_WIDTH = 595;

const LOGO_BOX_SIZE = 56;

interface HeaderParams {
  title: string;
  settings: CompanySettings;
  logoDataUrl?: string;
  subtitle?: string;
}

export function withLastAutoTableY(doc: jsPDF): number {
  const withTable = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  return withTable.lastAutoTable?.finalY ?? 120;
}

function detectImageFormat(dataUrl: string): string {
  const subtype = /^data:image\/(\w+);/.exec(dataUrl)?.[1]?.toLowerCase();
  if (subtype === "jpeg" || subtype === "jpg") return "JPEG";
  if (subtype === "webp") return "WEBP";
  return "PNG";
}

function loadImageSize(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("Failed to load logo image"));
    img.src = dataUrl;
  });
}

// Scales the logo to fit inside a fixed box while keeping its natural aspect ratio,
// instead of stretching it into a fixed width x height square.
async function drawLogo(doc: jsPDF, dataUrl: string, x: number, y: number): Promise<number> {
  try {
    const { width, height } = await loadImageSize(dataUrl);
    const scale = Math.min(LOGO_BOX_SIZE / width, LOGO_BOX_SIZE / height);
    const drawWidth = width * scale;
    const drawHeight = height * scale;
    doc.addImage(dataUrl, detectImageFormat(dataUrl), x, y, drawWidth, drawHeight);
    return drawWidth;
  } catch {
    return 0;
  }
}

export async function addPdfHeader(
  doc: jsPDF,
  { title, settings, logoDataUrl, subtitle }: HeaderParams
): Promise<number> {
  const logoWidth = logoDataUrl ? await drawLogo(doc, logoDataUrl, PDF_MARGIN, 20) : 0;
  const textX = logoWidth > 0 ? PDF_MARGIN + logoWidth + 16 : PDF_MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(24, 24, 27);
  doc.text(settings.name, textX, 44);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(113, 113, 122);
  const contactLine = [settings.phone, settings.email, settings.whatsapp].filter(Boolean).join("  ·  ");
  if (contactLine) doc.text(contactLine, textX, 58);

  let cursorY = 90;
  doc.setDrawColor(228, 228, 231);
  doc.line(PDF_MARGIN, cursorY, PDF_PAGE_WIDTH - PDF_MARGIN, cursorY);
  cursorY += 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(24, 24, 27);
  doc.text(title, PDF_MARGIN, cursorY);
  doc.setFont("helvetica", "normal");

  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(113, 113, 122);
    doc.text(subtitle, PDF_MARGIN, cursorY + 16);
    cursorY += 16;
  }

  return cursorY + 26;
}

export function addPdfFooter(doc: jsPDF, settings: CompanySettings): void {
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(228, 228, 231);
    doc.line(PDF_MARGIN, pageHeight - 50, PDF_PAGE_WIDTH - PDF_MARGIN, pageHeight - 50);
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170);
    doc.text(settings.address || settings.name, PDF_MARGIN, pageHeight - 34);
    doc.text(`Página ${page} de ${pageCount}`, PDF_PAGE_WIDTH - PDF_MARGIN, pageHeight - 34, {
      align: "right",
    });
  }
}
