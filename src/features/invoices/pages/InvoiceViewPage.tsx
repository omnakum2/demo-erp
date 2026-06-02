import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPrinter, FiMail } from 'react-icons/fi';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/base/StatusBadge';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatDate } from '@/config/branding.config';
import { sendInvoiceEmail } from '@/services/mailService';
import { generateInvoicePDFBlob, downloadInvoicePDF, getInvoiceFilename } from '@/services/pdfService';
import { InvoiceTemplate } from '../components/InvoiceTemplate';
import { toast } from 'sonner';
import { blobToBase64 } from '../services/invoiceService';

export default function InvoiceViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices } = useData();
  const invoice = invoices.find((i) => i.id === id);

  if (!invoice) {
    return (
      <AppLayout>
        <PageHeader title="Invoice not found" actions={<Button variant="outline" onClick={() => navigate('/invoices')}><FiArrowLeft className="h-4 w-4" /> Back</Button>} />
      </AppLayout>
    );
  }

  const handleDownloadPDF = async () => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf' });
      await downloadInvoicePDF(invoice);
      toast.success('PDF Downloaded successfully', { id: 'pdf' });
    } catch (error) {
      toast.error('Failed to generate PDF', { id: 'pdf' });
    }
  };

  const handleEmail = async () => {
    try {
      toast.loading('Preparing email and PDF...', { id: 'email' });
      const blob = await generateInvoicePDFBlob(invoice);
      const base64 = await blobToBase64(blob);
      await sendInvoiceEmail(invoice, base64);
      toast.dismiss('email');
    } catch (error) {
      toast.error('Failed to prepare email', { id: 'email' });
    }
  };

  return (
    <AppLayout>
      <PageHeader title={`Invoice ${invoice.invoiceNumber}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/invoices')}><FiArrowLeft className="h-4 w-4" /> Back</Button>
            <Button variant="outline" onClick={handleEmail}><FiMail className="h-4 w-4" /> Email</Button>
            <Button onClick={handleDownloadPDF}><FiPrinter className="h-4 w-4" /> Download PDF</Button>
          </div>
        } />
      
      <div className="space-y-6">
        <Card className="no-print">
          <CardContent className="p-6 md:p-8">
            <h2 className="mb-6 text-xl font-bold text-foreground">Invoice Overview</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Invoice Number</div>
                <div className="font-mono text-base font-bold">{invoice.invoiceNumber}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Date</div>
                <div className="text-base">{formatDate(invoice.date)}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Payment Method</div>
                <div><Badge variant="secondary">{invoice.paymentMethod}</Badge></div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Status</div>
                <div><StatusBadge status={invoice.status} /></div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm font-semibold text-muted-foreground mb-1">Customer</div>
                <div className="text-base font-medium">{invoice.customerSnapshot.name} ({invoice.customerSnapshot.code})</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Items Count</div>
                <div className="text-base">{invoice.items.length} products</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Total Amount</div>
                <div className="text-lg font-bold text-primary">{formatCurrency(invoice.total)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg border bg-white shadow-sm overflow-hidden overflow-x-auto p-4 sm:p-8 flex justify-center">
          <div className="printable-area w-full flex justify-center">
            <InvoiceTemplate id="actual-invoice-doc" invoice={invoice} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
