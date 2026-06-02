import { createElement } from 'react';
import { pdf } from '@react-pdf/renderer';
import { branding } from '@/config/branding.config';
import type { Invoice } from '@/types/common';
import { InvoicePDFDocument } from '@/features/invoices/components/InvoicePDFDocument';

/**
 * Generate a real PDF (selectable text, clickable links) for an invoice using
 * @react-pdf/renderer. Returns a Blob that plugs into the existing
 * Blob → Base64 → backend attachment pipeline unchanged.
 */
export async function generateInvoicePDFBlob(invoice: Invoice): Promise<Blob> {
  // Cast: our component returns a <Document>, but TS infers Props instead of DocumentProps.
  const blob = await pdf(createElement(InvoicePDFDocument, { invoice }) as any).toBlob();
  // Temporary diagnostics for 413 debugging.
  const kb = (blob.size / 1024).toFixed(1);
  console.info(`[pdfService] Invoice PDF blob: ${kb} KB (~${(blob.size * 4 / 3 / 1024).toFixed(1)} KB base64)`);
  return blob;
}

export function getInvoiceFilename(invoice: Invoice): string {
  const brand = branding.primaryBrand.replace(/\s+/g, '');
  return `${brand}-Invoice-${invoice.invoiceNumber}.pdf`;
}

export async function downloadInvoicePDF(invoice: Invoice): Promise<void> {
  const blob = await generateInvoicePDFBlob(invoice);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = getInvoiceFilename(invoice);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Open the generated PDF in a new tab — replaces the old window.print() flow. */
export async function openInvoicePDFInNewTab(invoice: Invoice): Promise<void> {
  const blob = await generateInvoicePDFBlob(invoice);
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
  // Defer revoke so the new tab has time to load the blob.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
