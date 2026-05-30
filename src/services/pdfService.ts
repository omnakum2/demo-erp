import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { branding } from '@/config/branding.config';
import type { Invoice } from '@/types/common';

export async function generateInvoicePDFBlob(elementId: string): Promise<Blob> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Invoice element not found');

  // We set scale to 2 or 3 for sharpness
  const canvas = await html2canvas(element, {
    scale: 1,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.7);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  return pdf.output('blob');
}

export function getInvoiceFilename(invoice: Invoice): string {
  const brand = branding.primaryBrand.replace(/\s+/g, '');
  return `${brand}-Invoice-${invoice.invoiceNumber}.pdf`;
}

export async function downloadInvoicePDF(elementId: string, invoice: Invoice) {
  try {
    const blob = await generateInvoicePDFBlob(elementId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getInvoiceFilename(invoice);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
}
