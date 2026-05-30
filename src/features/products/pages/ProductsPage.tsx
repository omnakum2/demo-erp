import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { BaseTable } from '@/components/base/BaseTable';
import { BaseDialog } from '@/components/base/BaseDialog';
import { BaseConfirmDialog } from '@/components/base/BaseConfirmDialog';
import { BaseInput } from '@/components/base/BaseInput';
import { BaseSelect } from '@/components/base/BaseSelect';
import { StatusBadge } from '@/components/base/StatusBadge';
import { AdditionalDetailsEditor } from '@/components/base/AdditionalDetailsEditor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { EntityStatus } from '@/types/enums';
import { formatCurrency } from '@/config/branding.config';
import type { Product, AdditionalDetail, TableColumn } from '@/types/common';
import { toast } from 'sonner';

const EMPTY = { name: '', code: '', materialId: '', price: '', stock: '', unit: 'pcs', status: EntityStatus.ACTIVE };

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, materials, getMaterialCode } = useData();
  const { hasFullAccess } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<typeof EMPTY & { status: EntityStatus }>(EMPTY);
  const [details, setDetails] = useState<AdditionalDetail[]>([]);

  const activeProducts = products.filter((p) => !p.deleted);

  const columns: TableColumn<Product>[] = [
    { key: 'code', label: 'Product Code', sortable: true },
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'materialId', label: 'Raw Material', sortable: true, render: (r) => getMaterialCode(r.materialId), getSearchValue: (r) => getMaterialCode(r.materialId) },
    { key: 'price', label: 'Price / Unit', sortable: true, render: (r) => <span> {formatCurrency(r.price)} / {r.unit} </span> },
    { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
  ];

  const openAdd = () => { setEditing(null); setFormData(EMPTY); setDetails([]); setIsModalOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setFormData({ name: p.name, code: p.code, materialId: p.materialId, price: String(p.price), stock: String(p.stock), unit: p.unit, status: p.status });
    setDetails(p.additionalDetails ?? []);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code || !formData.materialId || !formData.price) {
      toast.error('Please fill all required fields'); return;
    }
    const payload = {
      name: formData.name, code: formData.code, materialId: formData.materialId,
      price: parseFloat(formData.price), stock: parseInt(formData.stock) || 0,
      unit: formData.unit || 'pcs', status: formData.status,
      additionalDetails: details.filter((d) => d.label.trim()),
    };
    if (editing) { updateProduct(editing.id, payload); toast.success('Product updated'); }
    else { addProduct(payload); toast.success('Product added'); }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) { deleteProduct(deletingId); toast.success('Product deleted'); setIsDeleteOpen(false); setDeletingId(null); }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Products"
        actions={hasFullAccess ? <Button onClick={openAdd}><FiPlus className="h-4 w-4" /> Add Product</Button> : undefined}
      />

      <BaseTable
        data={activeProducts}
        columns={columns}
        getRowKey={(r) => r.id}
        searchPlaceholder="Search products..."
        actions={(row) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/products/${row.id}`)} aria-label="View product"><FiEye className="h-4 w-4" /></Button>
            {hasFullAccess && (
              <>
                <Button variant="ghost" size="icon" onClick={() => openEdit(row)} aria-label="Edit product"><FiEdit2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => { setDeletingId(row.id); setIsDeleteOpen(true); }} aria-label="Delete product"><FiTrash2 className="h-4 w-4" /></Button>
              </>
            )}
          </div>
        )}
      />

      <BaseDialog
        open={isModalOpen} onOpenChange={setIsModalOpen}
        title={editing ? 'Edit Product' : 'Add New Product'}
        onSubmit={handleSubmit}
        submitLabel={editing ? 'Update Product' : 'Add Product'}
        maxWidth="sm:max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <BaseInput label="Product Code" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="VPB-HN-12" />
          <BaseInput label="Product Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder='Brass Hex Nipple 1/2"' />
        </div>
        <BaseSelect
          label="Raw Material" required value={formData.materialId}
          onValueChange={(v) => setFormData({ ...formData, materialId: v })}
          options={materials.filter((m) => m.status === EntityStatus.ACTIVE).map((m) => ({ value: m.id, label: m.code }))}
          placeholder="Select material"
        />
        <div className="grid grid-cols-3 gap-4">
          <BaseInput label="Price (₹)" required type="number" min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" />
          <BaseInput label="Stock" type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="0" />
          <BaseInput label="Unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="pcs / kg" />
        </div>
        <BaseSelect
          label="Status" value={formData.status}
          onValueChange={(v) => setFormData({ ...formData, status: v as EntityStatus })}
          options={[{ value: EntityStatus.ACTIVE, label: 'Active' }, { value: EntityStatus.INACTIVE, label: 'Inactive' }]}
        />
        <AdditionalDetailsEditor value={details} onChange={setDetails} />
      </BaseDialog>

      <BaseConfirmDialog
        open={isDeleteOpen} onOpenChange={setIsDeleteOpen}
        title="Delete Product"
        description="Are you sure? This action cannot be undone."
        onConfirm={handleDelete} confirmLabel="Delete"
      />
    </AppLayout>
  );
}
