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
import type { Material, TableColumn } from '@/types/common';
import { toast } from 'sonner';

const EMPTY = { code: '', status: EntityStatus.ACTIVE };

export default function MaterialsPage() {
  const navigate = useNavigate();
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useData();
  const { hasFullAccess } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY);

  const columns: TableColumn<Material>[] = [
    { key: 'code', label: 'Material Code', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
  ];

  const openAdd = () => { setEditing(null); setFormData(EMPTY); setIsModalOpen(true); };
  const openEdit = (m: Material) => {
    setEditing(m);
    setFormData({ code: m.code, status: m.status });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.code) { toast.error('Code is required'); return; }
    const payload = { ...formData, additionalDetails: [] };
    if (editing) { updateMaterial(editing.id, payload); toast.success('Material updated'); }
    else { addMaterial(payload); toast.success('Material added'); }
    setIsModalOpen(false);
  };

  const handleDelete = () => { if (deletingId) { deleteMaterial(deletingId); toast.success('Material deleted'); setIsDeleteOpen(false); setDeletingId(null); } };

  return (
    <AppLayout>
      <PageHeader
        title="Raw Materials"
        actions={hasFullAccess ? <Button onClick={openAdd}><FiPlus className="h-4 w-4" /> Add Material</Button> : undefined}
      />

      <BaseTable
        data={materials}
        columns={columns}
        getRowKey={(r) => r.id}
        searchPlaceholder="Search materials..."
        actions={(row) => hasFullAccess && (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/materials/${row.id}`)}><FiEye className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => openEdit(row)}><FiEdit2 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => { setDeletingId(row.id); setIsDeleteOpen(true); }}><FiTrash2 className="h-4 w-4" /></Button>
          </div>
        )}
      />

      <BaseDialog
        open={isModalOpen} onOpenChange={setIsModalOpen}
        title={editing ? 'Edit Material' : 'Add Material'}
        onSubmit={handleSubmit}
        submitLabel={editing ? 'Update' : 'Add'}
        maxWidth="sm:max-w-md"
      >
        <BaseInput label="Code" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
        <BaseSelect
          label="Status" value={formData.status}
          onValueChange={(v) => setFormData({ ...formData, status: v as EntityStatus })}
          options={[{ value: EntityStatus.ACTIVE, label: 'Active' }, { value: EntityStatus.INACTIVE, label: 'Inactive' }]}
        />
      </BaseDialog>

      <BaseConfirmDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}
        title="Delete Material" description="Remove this material? Existing products may still reference its code."
        onConfirm={handleDelete} confirmLabel="Delete" />
    </AppLayout>
  );
}
