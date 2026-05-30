import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

interface Props { open: boolean; onOpenChange: (o: boolean) => void; }

export function ProfileDialog({ open, onOpenChange }: Props) {
  const { user, logout, isAdmin, hasFullAccess } = useAuth();
  const { getDepartmentName, getDesignationName } = useData();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    onOpenChange(false);
    navigate('/login');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>My Profile</DialogTitle>
          <DialogDescription>Your account information</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 py-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-semibold">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-base font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-y-3 text-sm">
          <dt className="text-muted-foreground">Email</dt>
          <dd className="col-span-2 break-all">{user.email}</dd>
          <dt className="text-muted-foreground">Phone</dt>
          <dd className="col-span-2">{user.phone}</dd>
          <dt className="text-muted-foreground">Designation</dt>
          <dd className="col-span-2">{getDesignationName(user.designationId)}</dd>
          <dt className="text-muted-foreground">Departments</dt>
          <dd className="col-span-2 flex flex-wrap gap-1">
            {user.departmentIds.map((id) => (
              <Badge key={id} variant="secondary">{getDepartmentName(id)}</Badge>
            ))}
          </dd>
          <dt className="text-muted-foreground">Access</dt>
          <dd className="col-span-2">
            <Badge variant={isAdmin ? 'default' : hasFullAccess ? 'default' : 'secondary'}>
              {isAdmin ? 'Administrator' : hasFullAccess ? 'Manager (Full access)' : 'Employee'}
            </Badge>
          </dd>
        </dl>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button variant="destructive" onClick={handleLogout}>
            <FiLogOut className="h-4 w-4" /> Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
