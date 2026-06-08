import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/base/StatusBadge';
import { useData } from '@/contexts/DataContext';

export default function UserViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users } = useData();
  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <AppLayout requireFullAccess>
        <PageHeader title="User not found" actions={<Button variant="outline" onClick={() => navigate('/users')}><FiArrowLeft className="h-4 w-4" /> Back</Button>} />
      </AppLayout>
    );
  }

  return (
    <AppLayout requireFullAccess>
      <PageHeader title="User View"
        actions={<Button variant="outline" onClick={() => navigate('/users')}><FiArrowLeft className="h-4 w-4" /> Back</Button>} />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 md:p-8">
            <h2 className="mb-6 text-xl font-bold text-foreground">Main Details</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">User Name</div>
                <div className="font-medium text-base">{user.name}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Username</div>
                <div className="text-base">{user.username}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Email</div>
                <div className="text-base">{user.email}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Phone</div>
                <div className="text-base">{user.phone}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">User Type</div>
                <div className="capitalize text-base font-semibold">{user.userType}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Status</div>
                <div><StatusBadge status={user.status} /></div>
              </div>
              {/* <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Designation</div>
                <div className="text-base">{getDesignationName(user.designationId)}</div>
              </div> */}
              {/* <div className="sm:col-span-2">
                <div className="text-sm font-semibold text-muted-foreground mb-1">Departments</div>
                <div className="flex flex-wrap gap-2">
                  {user.departmentIds.map((d) => <Badge key={d} variant="secondary">{getDepartmentName(d)}</Badge>)}
                </div>
              </div> */}
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Created</div>
                <div className="text-sm">{new Date(user.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
