import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  FiMenu, FiX, FiSearch, FiChevronDown, FiChevronRight,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { branding } from '@/config/branding.config';
import { ProfileDialog } from './ProfileDialog';

interface NavItem {
  title: string;
  href: string;
  adminOnly?: boolean;
}
interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    id: 'overview',
    title: 'Overview',
    items: [{ title: 'Dashboard', href: '/dashboard' }],
  },
  {
    id: 'customer-invoice',
    title: 'Customer & Invoice Management',
    items: [
      { title: 'Customers', href: '/customers' },
      { title: 'Invoices', href: '/invoices' },
    ],
  },
  {
    id: 'product',
    title: 'Product Management',
    items: [
      { title: 'Products', href: '/products' },
      // { title: 'Raw Materials', href: '/materials' },
    ],
  },
  {
    id: 'employee',
    title: 'Employee Management',
    items: [
      { title: 'Users', href: '/users', adminOnly: true },
      // { title: 'Departments', href: '/departments', adminOnly: true },
      // { title: 'Designations', href: '/designations', adminOnly: true },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasFullAccess } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [profileOpen, setProfileOpen] = useState(false);

  const visibleGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (it) => (!it.adminOnly || hasFullAccess) && (!q || it.title.toLowerCase().includes(q)),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [search, hasFullAccess]);

  const toggleGroup = (id: string) => setCollapsed((s) => ({ ...s, [id]: !s[id] }));

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost" size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsOpen(false)} aria-hidden="true" />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-72 transform bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        role="navigation" aria-label="Main navigation"
      >
        <div className="flex h-full flex-col">
          {/* Title */}
          <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-5">
            <img src={branding.logo} alt={branding.primaryBrand} className="h-12 w-12 rounded-md object-contain bg-white p-1 shadow-sm" />
            <div className="min-w-0">
              <h1 className="text-base font-bold text-sidebar-foreground truncate">{branding.primaryBrand}</h1>
              <p className="text-xs text-muted-foreground truncate">{branding.secondaryBrand}</p>
            </div>
          </div>

          {/* Search */}
          <div className="border-b border-sidebar-border p-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Quick navigation..." className="pl-9 h-9"
                aria-label="Search menu"
              />
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-3" role="menubar">
            {visibleGroups.length === 0 && (
              <p className="px-3 py-4 text-sm text-muted-foreground">No menu items.</p>
            )}
            {visibleGroups.map((group) => {
              const isCollapsed = collapsed[group.id] && !search;
              return (
                <div key={group.id} className="mb-3">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  >
                    <span>{group.title}</span>
                    {isCollapsed ? <FiChevronRight className="h-3 w-3" /> : <FiChevronDown className="h-3 w-3" />}
                  </button>
                  {!isCollapsed && (
                    <ul className="mt-1 space-y-0.5">
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                        return (
                          <li key={item.href} role="none">
                            <button
                              onClick={() => handleNavigation(item.href)}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                isActive
                                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                              )}
                              role="menuitem"
                              aria-current={isActive ? 'page' : undefined}
                            >
                              <span className="truncate">{item.title}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Profile (bottom) */}
          <div className="border-t border-sidebar-border p-3">
            <button
              onClick={() => setProfileOpen(true)}
              className="flex w-full items-center gap-3 rounded-md bg-muted/40 p-2.5 text-left transition-colors hover:bg-muted"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {user?.name?.charAt(0) ?? 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </button>
          </div>
        </div>
      </aside>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
