import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { BaseTable } from '@/components/base/BaseTable';
import { BaseDialog } from '@/components/base/BaseDialog';
import { BaseConfirmDialog } from '@/components/base/BaseConfirmDialog';
import { BaseInput } from '@/components/base/BaseInput';
import { BaseSelect } from '@/components/base/BaseSelect';
import { StatusBadge } from '@/components/base/StatusBadge';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { EntityStatus } from '@/types/enums';
import type { Customer, TableColumn } from '@/types/common';
import { toast } from 'sonner';

const EMPTY = { code: '', name: '', email: '', contactNumber: '', address: '', notes: '', status: EntityStatus.ACTIVE };

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
  const { hasFullAccess } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const columns: TableColumn<Customer>[] = [
    { key: 'code', label: 'Customer Code', sortable: true },
    { key: 'name', label: 'Customer Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'contactNumber', label: 'Contact Number' },
    { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
  ];

  const openAdd = () => { setEditing(null); setForm(EMPTY); setIsOpen(true); };
  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({ code: c.code, name: c.name, email: c.email, contactNumber: c.contactNumber, address: c.address, notes: c.notes, status: c.status });
    setIsOpen(true);
  };

  const submit = () => {
    if (!form.code || !form.name || !form.email) { toast.error('Code, name and email are required.'); return; }
    const payload = { ...form, additionalDetails: [] };
    if (editing) { updateCustomer(editing.id, payload); toast.success('Customer updated'); }
    else { addCustomer(payload); toast.success('Customer added'); }
    setIsOpen(false);
  };
  const del = () => { if (delId) { deleteCustomer(delId); toast.success('Deleted'); setIsDelOpen(false); setDelId(null); } };

  return (
    <AppLayout>
      <PageHeader
        title="Customers"
        actions={hasFullAccess ? <Button onClick={openAdd}><FiPlus className="h-4 w-4" /> Add Customer</Button> : undefined}
      />
      <BaseTable data={customers} columns={columns} getRowKey={(r) => r.id} searchPlaceholder="Search customers..."
        actions={(row) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/customers/${row.id}`)} aria-label="View customer"><FiEye className="h-4 w-4" /></Button>
            {hasFullAccess && (
              <>
                <Button variant="ghost" size="icon" onClick={() => openEdit(row)}><FiEdit2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => { setDelId(row.id); setIsDelOpen(true); }}><FiTrash2 className="h-4 w-4" /></Button>
              </>
            )}
          </div>
        )} />
      <BaseDialog open={isOpen} onOpenChange={setIsOpen} title={editing ? 'Edit Customer' : 'Add Customer'} onSubmit={submit} submitLabel={editing ? 'Update' : 'Add'} maxWidth="sm:max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <BaseInput label="Customer Code" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="C-1004" />
          <BaseInput label="Customer Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <BaseInput label="Email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="orders@example.com" />
          <BaseInput label="Contact Number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} placeholder="+91 ..." />
        </div>
        <BaseInput label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <BaseInput label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <BaseSelect label="Status" value={form.status} onValueChange={(v) => setForm({ ...form, status: v as EntityStatus })}
          options={[{ value: EntityStatus.ACTIVE, label: 'Active' }, { value: EntityStatus.INACTIVE, label: 'Inactive' }]} />
      </BaseDialog>
      <BaseConfirmDialog open={isDelOpen} onOpenChange={setIsDelOpen} title="Delete Customer" description="Remove this customer?" onConfirm={del} confirmLabel="Delete" />
    </AppLayout>
  );
}
