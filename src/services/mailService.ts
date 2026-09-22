/**
 * Reusable mailing service.
 * Sends emails via the external email-gateway using multipart/form-data,
 * which allows direct Blob file attachments without base64 conversion.
 */
import type { Invoice } from '@/types/common';
import { branding } from '@/config/branding.config';
import { getInvoiceFilename } from '@/services/pdfService';
import { toast } from 'sonner';

export interface FileAttachment {
  filename: string;
  blob: Blob;
}

export interface MailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  files?: FileAttachment[];
}

export async function sendMail(
  payload: MailPayload
): Promise<{ success: boolean; message: string }> {
  try {
    const formData = new FormData();
    formData.append('to', payload.to);
    formData.append('subject', payload.subject);
    formData.append('html', payload.html);
    if (payload.text) formData.append('text', payload.text);

    if (payload.files?.length) {
      for (const file of payload.files) {
        formData.append('files', file.blob, file.filename);
      }
    }

    const response = await fetch(
      'https://email-gateway-flax.vercel.app/send-public-email',
      {
        method: 'POST',
        headers: {
          // Do NOT set Content-Type — browser auto-sets multipart/form-data with boundary
          'x-public-key': 'aea5c744ab2adf20a9717bc022d500a1928b1309085c8dfeedc4a51eb36eeaa2',
        },
        body: formData,
      }
    );

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message ?? 'Email sent',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send an invoice email with the PDF blob attached directly — no base64 needed.
 */
export async function sendInvoiceEmail(invoice: Invoice, pdfBlob: Blob): Promise<void> {
  const to = invoice.customerSnapshot.email;
  if (!to) {
    toast.error('Customer email is required to send invoice.');
    return;
  }
  const filename = getInvoiceFilename(invoice);

  const html = `
    <div style="font-family:Arial,sans-serif;color:#222">
      <p>Dear ${invoice.customerSnapshot.name},</p>
      <p>Please find the attached invoice <strong>#${invoice.invoiceNumber}</strong> for your reference.</p>
      <p>Thank you,<br/><strong>${branding.primaryBrand}</strong></p>
    </div>
  `;

  const text = `Dear ${invoice.customerSnapshot.name},\n\nPlease find the attached invoice #${invoice.invoiceNumber} for your reference.\n\nThank you,\n${branding.primaryBrand}`;

  const res = await sendMail({
    to,
    subject: `Invoice from ${branding.primaryBrand} - ${invoice.invoiceNumber}`,
    html,
    text,
    files: [{ filename, blob: pdfBlob }],
  });

  if (res.success) toast.success(`Invoice emailed to ${to} with attachment ${filename}`);
  else toast.error(res.message);
}
