import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/base/StatusBadge';
import { useData } from '@/contexts/DataContext';
import { formatCurrency } from '@/config/branding.config';

export default function ProductViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useData();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <AppLayout>
        <PageHeader title="Product not found" actions={<Button variant="outline" onClick={() => navigate('/products')}><FiArrowLeft className="h-4 w-4" /> Back</Button>} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Product View"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/products')}><FiArrowLeft className="h-4 w-4" /> Back</Button>
          </div>
        }
      />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 md:p-8">
            <h2 className="mb-6 text-xl font-bold text-foreground">Main Details</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Product Name</div>
                <div className="font-medium text-base">{product.name}</div>
              </div>
              {/* <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Product Code</div>
                <div className="font-mono text-base">{product.code}</div>
              </div> */}
              {/* <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Raw Material</div>
                <div className="text-base">{getMaterialCode(product.materialId)}</div>
              </div> */}
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Unit Price</div>
                <div className="font-semibold text-base">{formatCurrency(product.price)}</div>
              </div>
              {/* <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Available Stock</div>
                <div><Badge variant={product.stock > 10 ? 'default' : 'destructive'} className="text-sm">{product.stock} {product.unit}</Badge></div>
              </div> */}
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Status</div>
                <div><StatusBadge status={product.status} /></div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Created</div>
                <div className="text-sm">{new Date(product.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Updated</div>
                <div className="text-sm">{new Date(product.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Additional Details Separate Section */}
        {/* <Card>
          <CardContent className="p-6 md:p-8">
            <h2 className="mb-6 text-xl font-bold text-foreground">Additional Details</h2>
            {product.additionalDetails?.length ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {product.additionalDetails.map((d, i) => (
                  <div key={i}>
                    <div className="text-sm font-semibold text-muted-foreground mb-1">{d.label}</div>
                    <div className="font-medium text-base">{d.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No additional details recorded.</p>
            )}
          </CardContent>
        </Card> */}
      </div>
    </AppLayout>
  );
}
