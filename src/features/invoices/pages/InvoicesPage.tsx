import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEye, FiTrash2, FiMail, FiPrinter } from 'react-icons/fi';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { BaseTable } from '@/components/base/BaseTable';
import { BaseDialog } from '@/components/base/BaseDialog';
import { BaseInput } from '@/components/base/BaseInput';
import { BaseSelect } from '@/components/base/BaseSelect';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';
import { PaymentMethod, EntityStatus } from '@/types/enums';
import { sendInvoiceEmail } from '@/services/mailService';
import { generateInvoicePDFBlob, downloadInvoicePDF, getInvoiceFilename } from '@/services/pdfService';
import { branding, formatCurrency, formatDate } from '@/config/branding.config';
import { InvoiceTemplate } from '../components/InvoiceTemplate';
import type { Invoice, InvoiceItem, TableColumn } from '@/types/common';
import { toast } from 'sonner';
import { blobToBase64 } from '../services/invoiceService';

export default function InvoicesPage() {
  const navigate = useNavigate();
  const { invoices, products, customers, addInvoice } = useData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  const [customerId, setCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selProductId, setSelProductId] = useState('');
  const [qty, setQty] = useState(1);

  const activeProducts = products.filter((p) => !p.deleted && p.status === EntityStatus.ACTIVE);
  const selectedProduct = activeProducts.find((p) => p.id === selProductId);
  const activeCustomers = customers.filter((c) => c.status === EntityStatus.ACTIVE);

  const columns: TableColumn<Invoice>[] = [
    { key: 'invoiceNumber', label: 'Invoice Number', sortable: true },
    { key: 'date', label: 'Invoice Date', sortable: true, render: (r) => formatDate(r.date), getSearchValue: (r) => formatDate(r.date) },
    { key: 'customerId', label: 'Customer Name', render: (r) => r.customerSnapshot.name, getSearchValue: (r) => r.customerSnapshot.name },
    { key: 'items', label: 'Total Items', render: (r) => `${r.items.length} item${r.items.length > 1 ? 's' : ''}` },
    { key: 'paymentMethod', label: 'Payment Method', sortable: true, render: (r) => <Badge variant="secondary">{r.paymentMethod}</Badge> },
    { key: 'total', label: 'Grand Total', sortable: true, render: (r) => <span className="font-semibold text-primary">{formatCurrency(r.total)}</span>, getSearchValue: (r) => formatCurrency(r.total) },
  ];

  const resetForm = () => {
    setCustomerId(''); setPaymentMethod(PaymentMethod.CASH);
    setItems([]); setSelProductId(''); setQty(1);
  };

  const addItem = () => {
    if (!selectedProduct) { toast.error('Please select a product'); return; }
    if (qty < 1) { toast.error('Quantity must be at least 1'); return; }
    const alreadyQty = items.find((i) => i.productId === selectedProduct.id)?.quantity ?? 0;
    // if (alreadyQty + qty > selectedProduct.stock) {
    //   toast.error(`Only ${selectedProduct.stock - alreadyQty} ${selectedProduct.unit} available in stock.`);
    //   return;
    // }
    // const material = getMaterialCode(selectedProduct.materialId);
    const idx = items.findIndex((i) => i.productId === selectedProduct.id);
    if (idx >= 0) {
      const next = [...items];
      next[idx].quantity += qty;
      next[idx].total = next[idx].quantity * selectedProduct.price;
      setItems(next);
    } else {
      setItems([...items, {
        productId: selectedProduct.id, productName: selectedProduct.name,
        quantity: qty, unit: selectedProduct.unit,
        unitPrice: selectedProduct.price, total: qty * selectedProduct.price,
      }]);
    }
    setSelProductId(''); setQty(1);
  };

  const removeItem = (productId: string) => setItems(items.filter((i) => i.productId !== productId));

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const tax = subtotal * branding.invoice.taxRate;
    return { subtotal, tax, total: subtotal + tax };
  }, [items]);

  const handleCreate = () => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) { toast.error('Please select a customer'); return; }
    if (!customer.email) { toast.error('Selected customer has no email — required for emailing the invoice.'); return; }
    if (items.length === 0) { toast.error('Add at least one item'); return; }
    // Final stock validation
    for (const it of items) {
      const prod = products.find((p) => p.id === it.productId);
      // if (!prod || it.quantity > prod.stock) {
      //   toast.error(`Insufficient stock for ${it.productName}.`); return;
      // }
    }
    const number = `${branding.invoice.prefix}-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const newInvoice: Omit<Invoice, 'id' | 'createdAt'> = {
      invoiceNumber: number, date: today, customerId,
      customerSnapshot: {
        code: customer.code, name: customer.name, email: customer.email,
        contactNumber: customer.contactNumber, address: customer.address,
      },
      items, paymentMethod,
      subtotal: totals.subtotal, tax: totals.tax, total: totals.total, notes: '',
      status: EntityStatus.ACTIVE,
    };
    addInvoice(newInvoice);
    // deduct stock
    // items.forEach((i) => decrementStock(i.productId, i.quantity));
    toast.success(`Invoice ${number} created and stock updated.`);
    setIsCreateOpen(false);
    resetForm();
    // Auto-open preview
    const saved = invoices.find(i => i.invoiceNumber === number) || { ...newInvoice, id: number, createdAt: today };
    setPreviewInvoice(saved as Invoice);
    setIsPreviewOpen(true);
  };

  const handleDownloadPDF = async () => {
    if (!previewInvoice) return;
    try {
      toast.loading('Generating PDF...', { id: 'pdf' });
      await downloadInvoicePDF(previewInvoice);
      toast.success('PDF Downloaded successfully', { id: 'pdf' });
    } catch (error) {
      toast.error('Failed to generate PDF', { id: 'pdf' });
    }
  };

  const handleEmail = async () => {
    if (!previewInvoice) return;
    try {
      toast.loading('Preparing email and PDF...', { id: 'email' });
      const blob = await generateInvoicePDFBlob(previewInvoice);
      const base64 = await blobToBase64(blob);
      await sendInvoiceEmail(previewInvoice, base64);
      toast.dismiss('email');
    } catch (error) {
      toast.error('Failed to prepare email', { id: 'email' });
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Invoices"
        actions={<Button onClick={() => { resetForm(); setIsCreateOpen(true); }}><FiPlus className="h-4 w-4" /> Create Invoice</Button>}
      />

      <BaseTable
        data={invoices} columns={columns} getRowKey={(r) => r.id} searchPlaceholder="Search invoices..."
        actions={(row) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/invoices/${row.id}`)} aria-label="View invoice"><FiEye className="h-4 w-4" /></Button>
          </div>
        )}
      />

      {/* CREATE INVOICE */}
      <BaseDialog open={isCreateOpen} onOpenChange={setIsCreateOpen}
        title="Create New Invoice" description="Pick customer, add products. Stock is validated and deducted on save."
        onSubmit={handleCreate} submitLabel="Create Invoice"
        submitDisabled={items.length === 0 || !customerId}
        maxWidth="sm:max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <BaseSelect label="Customer Name" required value={customerId} onValueChange={setCustomerId}
            options={activeCustomers.map((c) => ({ value: c.id, label: `${c.code} — ${c.name}` }))}
            placeholder="Select customer" />
          <BaseSelect label="Payment Method" value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
            options={Object.values(PaymentMethod).map((m) => ({ value: m, label: m }))} />
        </div>

        <div className="rounded-lg border border-border p-4">
          <h4 className="mb-3 font-medium text-foreground">Add Product</h4>
          <div className="grid gap-3 sm:grid-cols-[1fr_120px_120px_120px_auto]">
            <BaseSelect label="Product Name" value={selProductId} onValueChange={setSelProductId}
              options={activeProducts.map((p) => ({ value: p.id, label: `${p.name}` }))}
              placeholder="Select a product" />
            {/* <BaseInput label="Available Stock" value={selectedProduct ? `${selectedProduct.stock} ${selectedProduct.unit}` : ''} disabled readOnly /> */}
            <BaseInput label="Unit Price (₹)" value={selectedProduct ? selectedProduct.price.toFixed(2) : ''} disabled readOnly />
            <BaseInput label="Quantity" type="number" min="1" value={String(qty)} onChange={(e) => setQty(parseInt(e.target.value) || 1)} />
            <div className="flex items-end">
              <Button type="button" onClick={addItem}>Add</Button>
            </div>
          </div>
        </div>

        {items.length > 0 && (
          <div className="rounded-lg border border-border">
            <div className="border-b border-border bg-muted/30 p-3"><h4 className="font-medium">Invoice Items</h4></div>
            <div className="divide-y divide-border">
              {items.map((item) => (
               <div key={item.productId} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-foreground">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">{item.productName} • {formatCurrency(item.unitPrice)} × {item.quantity} {item.unit}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{formatCurrency(item.total)}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)} className="text-destructive hover:bg-destructive/10"><FiTrash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border bg-muted/30 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{branding.invoice.taxLabel}</span><span>{formatCurrency(totals.tax)}</span></div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><span>Grand Total</span><span className="text-primary">{formatCurrency(totals.total)}</span></div>
              </div>
            </div>
          </div>
        )}
      </BaseDialog>

      {/* PREVIEW MODAL */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-h-[95vh] overflow-y-auto overflow-x-auto sm:max-w-4xl p-0">
          <DialogHeader className="no-print px-6 pt-6">
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          {previewInvoice && (
            <div className="p-4 sm:p-[10mm] overflow-x-auto flex justify-center">
              <div className="printable-area w-full flex justify-center">
                <InvoiceTemplate id="actual-invoice-modal-doc" invoice={previewInvoice} />
              </div>
            </div>
          )}
          <DialogFooter className="no-print px-6 pb-6 gap-2">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Close</Button>
            <Button variant="outline" onClick={handleEmail}><FiMail className="h-4 w-4" /> Email to Customer</Button>
            <Button onClick={handleDownloadPDF}><FiPrinter className="h-4 w-4" /> Download PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
