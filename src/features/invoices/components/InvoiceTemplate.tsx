import { branding, formatDate } from '@/config/branding.config';
import type { Invoice } from '@/types/common';

interface Props {
  invoice: Invoice;
  id?: string;
}

export function InvoiceTemplate({ invoice, id }: Props) {
  const c = invoice.customerSnapshot;

  return (
    <div id={id || 'invoice-template'} className="invoice-container text-[12px] font-sans text-black flex flex-col mx-auto border border-black bg-white"
      style={{
        width: '100%',
        maxWidth: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box'
      }}>
      {/* Header */}
      <div className="p-[5mm] flex justify-between gap-4">
        <div className="leading-relaxed">
          <div className="text-[18px] font-bold text-[#712c2d] mb-[2mm]">{branding.primaryBrand}</div>
          <div className="whitespace-pre-line leading-relaxed text-[11px]">
            {branding.company.address.join('\n')}
          </div>
          {/* <div className="mt-2 text-[11px]"><strong>Email:</strong> {branding.company.email}</div>
          <div className="text-[11px]"><strong>Website:</strong> <a href={branding.company.website.url} className="text-black underline">{branding.company.website.label}</a></div> */}
        </div>
        <div className="flex items-center">
          <img src={branding.logo} alt={branding.primaryBrand} className="h-32 w-32 object-contain" />
        </div>
      </div>
      
      <div className="border-t border-black"></div>

      {/* Details Grid */}
      <div className="flex border-b border-black">
        <div className="flex-1 p-[4mm] border-r border-black">
          <div className="text-[14px] font-bold text-[#712c2d] mb-[2mm]">Invoice Details</div>
          <div className="leading-relaxed space-y-1">
            <div><strong>Invoice No:</strong> {invoice.invoiceNumber}</div>
            <div><strong>Date:</strong> {formatDate(invoice.date)}</div>
            <div><strong>Payment Method:</strong> {invoice.paymentMethod}</div>
          </div>
        </div>
        <div className="flex-1 p-[4mm]">
          <div className="text-[14px] font-bold text-[#712c2d] mb-[2mm]">To:</div>
          <div className="leading-relaxed space-y-1">
            <div className="font-bold">{c.name}</div>
            <div className="whitespace-pre-line">{c.address}</div>
            <div><strong>Email:</strong> {c.email}</div>
          </div>
        </div>
      </div>

      {/* Items Section Header */}
      <div className="px-[4mm] py-[2mm] bg-muted/20">
        <div className="text-[14px] font-bold text-[#712c2d]">Items</div>
      </div>

      <table className="w-full border-collapse" style={{ borderSpacing: 0, borderTop: '1px solid black' }}>
        <thead>
          <tr className="bg-[#f2f2f2]">
            <th className="border border-black border-l-0 p-2 text-center font-bold">Sr. No.</th>
            {/* <th className="border border-black p-2 text-center font-bold">Product Code</th> */}
            <th className="border border-black p-2 text-center font-bold">Product Name</th>
            {/* <th className="border border-black p-2 text-center font-bold">Raw Material</th> */}
            <th className="border border-black p-2 text-center font-bold">Qty</th>
            <th className="border border-black p-2 text-center font-bold text-right">INR / Unit</th>
            <th className="border border-black border-r-0 p-2 text-center font-bold text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((it, idx) => (
            <tr key={it.productId}>
              <td className="border border-black border-l-0 p-2 text-center">{idx + 1}</td>
              {/* <td className="border border-black p-2 text-center">{it.productCode}</td> */}
              <td className="border border-black p-2 text-center">{it.productName}</td>
              {/* <td className="border border-black p-2 text-center">{it.material}</td> */}
              <td className="border border-black p-2 text-center">{it.quantity} {it.unit}</td>
              <td className="border border-black p-2 text-right">{Number(it.unitPrice).toFixed(2)}</td>
              <td className="border border-black border-r-0 p-2 text-right">{Number(it.total).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} className="border border-black border-l-0 p-2 font-bold text-right">Subtotal</td>
            <td className="border border-black border-r-0 p-2 text-right">{Number(invoice.subtotal).toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={4} className="border border-black border-l-0 p-2 font-bold text-right">{branding.invoice.taxLabel}</td>
            <td className="border border-black border-r-0 p-2 text-right">{Number(invoice.tax).toFixed(2)}</td>
          </tr>
          <tr className="bg-[#f2f2f2]">
            <td colSpan={4} className="border border-black border-l-0 p-2 font-bold text-right text-[14px]">Grand Total</td>
            <td className="border border-black border-r-0 p-2 text-right text-[14px] font-bold text-[#712c2d]">{Number(invoice.total).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* FOOTER */}
      <footer className="mt-auto p-[5mm] text-center text-[10px] text-gray-500 border-t border-black">
        {branding.invoice.footer}
      </footer>
    </div>
  );
}
