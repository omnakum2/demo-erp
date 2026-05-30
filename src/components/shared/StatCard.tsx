import type { IconType } from 'react-icons';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: IconType;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('animate-fade-in', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {description && (
              <p
                className={cn('text-xs', {
                  'text-success': trend === 'up',
                  'text-destructive': trend === 'down',
                  'text-muted-foreground': trend === 'neutral' || !trend,
                })}
              >
                {description}
              </p>
            )}
          </div>
          {Icon && (
            <div className="rounded-lg bg-accent p-3">
              <Icon className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
