import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/base/StatusBadge';
import { useData } from '@/contexts/DataContext';

export default function CustomerViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers } = useData();
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <AppLayout>
        <PageHeader title="Customer not found" actions={<Button variant="outline" onClick={() => navigate('/customers')}><FiArrowLeft className="h-4 w-4" /> Back</Button>} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Customer View"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/customers')}><FiArrowLeft className="h-4 w-4" /> Back</Button>
          </div>
        }
      />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 md:p-8">
            <h2 className="mb-6 text-xl font-bold text-foreground">Main Details</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Customer Code</div>
                <div className="font-mono text-base">{customer.code}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Customer Name</div>
                <div className="font-medium text-base">{customer.name}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Email</div>
                <div className="text-base">{customer.email}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Contact Number</div>
                <div className="text-base">{customer.contactNumber}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-sm font-semibold text-muted-foreground mb-1">Address</div>
                <div className="text-base whitespace-pre-line leading-relaxed">{customer.address}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Status</div>
                <div><StatusBadge status={customer.status} /></div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-sm font-semibold text-muted-foreground mb-1">Notes</div>
                <div className="text-base">{customer.notes || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Created</div>
                <div className="text-sm">{new Date(customer.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Updated</div>
                <div className="text-sm">{new Date(customer.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
