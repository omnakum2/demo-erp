import { FiDollarSign, FiTrendingUp, FiFileText, FiPackage, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import { FaWallet } from 'react-icons/fa';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/config/branding.config';

export default function DashboardPage() {
  const { analytics, invoices, products } = useData();
  const { user } = useAuth();

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'Card': return FiCreditCard;
      case 'UPI': return FiSmartphone;
      default: return FaWallet;
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}!`}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Sales" value={formatCurrency(analytics.dailySales)} description="+12% from yesterday" trend="up" />
        <StatCard title="Monthly Sales" value={formatCurrency(analytics.monthlySales)} description="+8% from last month" trend="up" />
        <StatCard title="Total Invoices" value={analytics.totalInvoices} description="This month" trend="neutral" />
        <StatCard title="Products" value={products.filter((p) => !p.deleted).length} description="In inventory" trend="neutral" />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Recent Invoices</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.slice(0, 5).map((invoice) => {
              const PaymentIcon = getPaymentIcon(invoice.paymentMethod);
              return (
                <div key={invoice.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <PaymentIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">{invoice.customerSnapshot.name} • {invoice.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{formatCurrency(invoice.total)}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(invoice.date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
