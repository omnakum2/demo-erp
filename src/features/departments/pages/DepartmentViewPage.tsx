import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/base/StatusBadge';
import { useData } from '@/contexts/DataContext';

export default function DepartmentViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { departments, users } = useData();
  const department = departments.find((d) => d.id === id);
  const employeeCount = users.filter((u) => u.departmentIds.includes(id || '')).length;

  if (!department) {
    return (
      <AppLayout>
        <PageHeader title="Department not found" actions={<Button variant="outline" onClick={() => navigate('/departments')}><FiArrowLeft className="h-4 w-4" /> Back</Button>} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title="Department View"
        actions={<Button variant="outline" onClick={() => navigate('/departments')}><FiArrowLeft className="h-4 w-4" /> Back</Button>} />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 md:p-8">
            <h2 className="mb-6 text-xl font-bold text-foreground">Department Details</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Department Name</div>
                <div className="text-base font-bold text-foreground">{department.name}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Status</div>
                <div><StatusBadge status={department.status} /></div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Total Employees</div>
                <div className="text-base font-medium">{employeeCount}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Created At</div>
                <div className="text-sm text-muted-foreground">{new Date(department.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
