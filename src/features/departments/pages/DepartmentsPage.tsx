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
import { EntityStatus } from '@/types/enums';
import type { Department, TableColumn } from '@/types/common';
import { toast } from 'sonner';

const EMPTY = { name: '', status: EntityStatus.ACTIVE };

export default function DepartmentsPage() {
  const navigate = useNavigate();
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const columns: TableColumn<Department>[] = [
    { key: 'name', label: 'Department Name', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
  ];

  const openAdd = () => { setEditing(null); setForm(EMPTY); setIsOpen(true); };
  const openEdit = (d: Department) => { setEditing(d); setForm({ name: d.name, status: d.status }); setIsOpen(true); };
  const submit = () => {
    if (!form.name) { toast.error('Name is required'); return; }
    if (editing) { updateDepartment(editing.id, form); toast.success('Department updated'); }
    else { addDepartment(form); toast.success('Department added'); }
    setIsOpen(false);
  };
  const del = () => { if (delId) { deleteDepartment(delId); toast.success('Deleted'); setIsDelOpen(false); setDelId(null); } };

  return (
    <AppLayout requireFullAccess>
      <PageHeader title="Departments"
        actions={<Button onClick={openAdd}><FiPlus className="h-4 w-4" /> Add Department</Button>} />
      <BaseTable data={departments} columns={columns} getRowKey={(r) => r.id} searchPlaceholder="Search departments..."
        actions={(row) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/departments/${row.id}`)}><FiEye className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => openEdit(row)}><FiEdit2 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => { setDelId(row.id); setIsDelOpen(true); }}><FiTrash2 className="h-4 w-4" /></Button>
          </div>
        )} />
      <BaseDialog open={isOpen} onOpenChange={setIsOpen} title={editing ? 'Edit Department' : 'Add Department'} onSubmit={submit} submitLabel={editing ? 'Update' : 'Add'}>
        <BaseInput label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <BaseSelect label="Status" value={form.status} onValueChange={(v) => setForm({ ...form, status: v as EntityStatus })}
          options={[{ value: EntityStatus.ACTIVE, label: 'Active' }, { value: EntityStatus.INACTIVE, label: 'Inactive' }]} />
      </BaseDialog>
      <BaseConfirmDialog open={isDelOpen} onOpenChange={setIsDelOpen} title="Delete Department" description="Remove this department?" onConfirm={del} confirmLabel="Delete" />
    </AppLayout>
  );
}
