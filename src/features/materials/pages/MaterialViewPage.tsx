import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/base/StatusBadge';
import { useData } from '@/contexts/DataContext';

export default function MaterialViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { materials } = useData();
  const material = materials.find((m) => m.id === id);

  if (!material) {
    return (
      <AppLayout>
        <PageHeader title="Material not found" actions={<Button variant="outline" onClick={() => navigate('/materials')}><FiArrowLeft className="h-4 w-4" /> Back</Button>} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title="Raw Material View"
        actions={<Button variant="outline" onClick={() => navigate('/materials')}><FiArrowLeft className="h-4 w-4" /> Back</Button>} />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 md:p-8">
            <h2 className="mb-6 text-xl font-bold text-foreground">Material Details</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Material Code</div>
                <div className="font-mono text-base font-bold">{material.code}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Status</div>
                <div><StatusBadge status={material.status} /></div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Created At</div>
                <div className="text-base">{new Date(material.createdAt).toLocaleString()}</div>
              </div>
              {material.additionalDetails && material.additionalDetails.length > 0 && (
                <div className="sm:col-span-2 md:col-span-3 mt-4">
                  <div className="text-sm font-semibold text-muted-foreground mb-3">Additional Details</div>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 border rounded-lg p-4 bg-muted/10">
                    {material.additionalDetails.map((detail, idx) => (
                      <div key={idx}>
                        <div className="text-xs font-semibold text-muted-foreground uppercase">{detail.label}</div>
                        <div className="text-base font-medium">{detail.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
