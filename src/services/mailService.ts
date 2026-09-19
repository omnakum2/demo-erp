/**
 * Reusable mailing service.
 * Currently a frontend stub — replace `sendInvoiceEmail` body with an Axios/Fetch
 * call to your NestJS + Nodemailer endpoint (e.g. POST /api/mail/invoice).
 * Note for future implementation: Nodemailer is a backend Node.js module and cannot
 * be run directly in the browser. It must be hosted in the backend. 
 */
import type { Invoice } from '@/types/common';
import { branding } from '@/config/branding.config';
import { getInvoiceFilename } from '@/services/pdfService';
import { toast } from 'sonner';

export interface EmailAttachment {
  filename: string;
  content: string;
  encoding?: string;
}

export interface MailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: EmailAttachment[];
}

export async function sendMail(
  payload: MailPayload
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      'https://email-gateway-flax.vercel.app/send-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "x-public-key": 'c5ce7886683b6b4fbe45fa536902fc2fa586eab16f93081b520f124c82bfa937',
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    return {
      success: response.ok,
      message: data.message ?? 'Email sent'
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    };
  }
}

export async function sendInvoiceEmail(invoice: Invoice, pdfBase64: string): Promise<void> {
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
    attachments: [
      {
        filename,
        content: pdfBase64,
        encoding: "base64"
      }
    ]
  });
  
  if (res.success) toast.success(`Invoice emailed to ${to} with attachment ${filename}`);
  else toast.error(res.message);
}
