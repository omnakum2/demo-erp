import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AdditionalDetail } from '@/types/common';

interface Props {
  value: AdditionalDetail[];
  onChange: (next: AdditionalDetail[]) => void;
  label?: string;
}

/**
 * Dynamic key/value editor. Stores its output as JSON-serialisable
 * AdditionalDetail[]. Reused across Products, Materials, Customers, etc.
 */
export function AdditionalDetailsEditor({ value, onChange, label = 'Additional Details' }: Props) {
  const [rows, setRows] = useState<AdditionalDetail[]>(value.length ? value : []);

  const update = (next: AdditionalDetail[]) => {
    setRows(next);
    onChange(next);
  };

  const addRow = () => update([...rows, { label: '', value: '' }]);
  const removeRow = (idx: number) => update(rows.filter((_, i) => i !== idx));
  const editRow = (idx: number, key: 'label' | 'value', v: string) =>
    update(rows.map((r, i) => (i === idx ? { ...r, [key]: v } : r)));

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <FiPlus className="h-4 w-4" /> Add More
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">No additional details. Click "Add More" to add a custom field.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <Input placeholder="Label (e.g. Finish)" value={row.label} onChange={(e) => editRow(idx, 'label', e.target.value)} />
              <Input placeholder="Value (e.g. Polished)" value={row.value} onChange={(e) => editRow(idx, 'value', e.target.value)} />
              <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeRow(idx)} aria-label="Remove row">
                <FiTrash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
