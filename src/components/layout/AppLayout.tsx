import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from './AppSidebar';

interface AppLayoutProps {
  children: ReactNode;
  requireFullAccess?: boolean;
}

export function AppLayout({ children, requireFullAccess = false }: AppLayoutProps) {
  const { isAuthenticated, hasFullAccess } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireFullAccess && !hasFullAccess) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <AppSidebar />
      <main id="main-content" className="min-h-screen transition-all duration-300 md:ml-72" tabIndex={-1}>
        <div className="w-full p-6 pt-20 md:pt-6">{children}</div>
      </main>
    </div>
  );
}
