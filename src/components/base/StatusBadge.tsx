import { Badge } from '@/components/ui/badge';
import { EntityStatus } from '@/types/enums';

export function StatusBadge({ status }: { status: EntityStatus | string }) {
  const norm = status.toLowerCase();
  if (norm === 'active') return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-500 text-white">Active</span>;
  if (norm === 'pending') return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-500 text-white">Pending</span>;
  
  return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-500 text-white capitalize">{status}</span>;
}
