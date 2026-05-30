import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl animate-fade-in">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-muted-foreground animate-fade-in">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 animate-fade-in">{actions}</div>}
    </header>
  );
}
