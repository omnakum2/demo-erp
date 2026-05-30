import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiEye, FiUser } from 'react-icons/fi';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { BaseTable } from '@/components/base/BaseTable';
import { BaseDialog } from '@/components/base/BaseDialog';
import { BaseInput } from '@/components/base/BaseInput';
import { BaseSelect } from '@/components/base/BaseSelect';
import { StatusBadge } from '@/components/base/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useData } from '@/contexts/DataContext';
import { UserType, UserStatus } from '@/types/enums';
import type { User, TableColumn } from '@/types/common';
import { toast } from 'sonner';

const EMPTY = {
  name: '', phone: '', email: '', username: '', password: '',
  status: UserStatus.ACTIVE, userType: UserType.EMPLOYEE,
  designationId: '', departmentIds: [] as string[],
};

export default function UsersPage() {
  const { users, addUser, updateUser, departments, designations, getDepartmentName, getDesignationName } = useData();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(EMPTY);

  // Hide admins from the listing
  const visibleUsers = users.filter((u) => u.userType !== UserType.ADMIN);

  const columns: TableColumn<User>[] = [
    {
      key: 'name', label: 'User Name', sortable: true,
      render: (row) => <span className="font-medium text-foreground">{row.name}</span>,
    },
    { key: 'userType', label: 'User Type', sortable: true, render: (r) => <span className="capitalize">{r.userType}</span> },
    {
      key: 'designationId', label: 'Designation',
      render: (r) => <Badge variant="outline">{getDesignationName(r.designationId)}</Badge>,
      getSearchValue: (r) => getDesignationName(r.designationId),
    },
    {
      key: 'departmentIds', label: 'Departments',
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.departmentIds.map((id) => <Badge key={id} variant="secondary">{getDepartmentName(id)}</Badge>)}
        </div>
      ),
      getSearchValue: (r) => r.departmentIds.map((id) => getDepartmentName(id)).join(' '),
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  const openAdd = () => { setEditing(null); setForm(EMPTY); setIsOpen(true); };
  const openEdit = (u: User) => {
    setEditing(u);
    setForm({
      name: u.name, phone: u.phone, email: u.email, username: u.username, password: '',
      status: u.status, userType: u.userType,
      designationId: u.designationId, departmentIds: u.departmentIds,
    });
    setIsOpen(true);
  };

  const toggleDepartment = (id: string) => {
    setForm((f) => ({
      ...f,
      departmentIds: f.departmentIds.includes(id)
        ? f.departmentIds.filter((d) => d !== id)
        : [...f.departmentIds, id],
    }));
  };

  const submit = () => {
    if (!form.name || !form.email || !form.username || !form.designationId) {
      toast.error('Please fill required fields'); return;
    }
    if (form.departmentIds.length === 0) { toast.error('Select at least one department'); return; }
    if (!editing && !form.password) { toast.error('Password required for new users'); return; }

    if (editing) {
      const updates: Partial<User> = {
        name: form.name, phone: form.phone, email: form.email, username: form.username,
        status: form.status, userType: form.userType,
        designationId: form.designationId, departmentIds: form.departmentIds,
      };
      if (form.password) updates.password = form.password;
      updateUser(editing.id, updates);
      toast.success('User updated');
    } else {
      addUser(form);
      toast.success('User added');
    }
    setIsOpen(false);
  };

  return (
    <AppLayout requireFullAccess>
      <PageHeader title="Users"
        actions={<Button onClick={openAdd}><FiPlus className="h-4 w-4" /> Add User</Button>} />
      <BaseTable data={visibleUsers} columns={columns} getRowKey={(r) => r.id} searchPlaceholder="Search users..."
        actions={(row) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/users/${row.id}`)}><FiEye className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => openEdit(row)}><FiEdit2 className="h-4 w-4" /></Button>
          </div>
        )} />
      <BaseDialog open={isOpen} onOpenChange={setIsOpen} title={editing ? 'Edit User' : 'Add New User'} onSubmit={submit} submitLabel={editing ? 'Update User' : 'Add User'} maxWidth="sm:max-w-2xl">
        <BaseInput label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <BaseInput label="Email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <BaseInput label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <BaseInput label="Username" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <BaseInput label={editing ? 'Password (leave blank to keep)' : 'Password'} required={!editing} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <BaseSelect label="User Type" value={form.userType} onValueChange={(v) => setForm({ ...form, userType: v as UserType })}
            options={[{ value: UserType.ADMIN, label: 'Admin' }, { value: UserType.EMPLOYEE, label: 'Employee' }]} />
          <BaseSelect label="Status" value={form.status} onValueChange={(v) => setForm({ ...form, status: v as UserStatus })}
            options={[{ value: UserStatus.ACTIVE, label: 'Active' }, { value: UserStatus.INACTIVE, label: 'Inactive' }]} />
        </div>
        <BaseSelect label="Designation" required value={form.designationId} onValueChange={(v) => setForm({ ...form, designationId: v })}
          options={designations.map((d) => ({ value: d.id, label: d.name }))} placeholder="Select designation" />
        <div className="grid gap-2">
          <Label>Departments *</Label>
          <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-3">
            {departments.map((d) => (
              <label key={d.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.departmentIds.includes(d.id)} onCheckedChange={() => toggleDepartment(d.id)} />
                <span>{d.name}</span>
              </label>
            ))}
          </div>
        </div>
      </BaseDialog>
    </AppLayout>
  );
}
