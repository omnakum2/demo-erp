import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { users as initialUsers } from '@/data/demoDB';
import { UserType, UserStatus, MANAGER_DESIGNATION } from '@/types/enums';
import type { User } from '@/types/common';
// import { designations as initialDesignations } from '@/data/demoDB';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasFullAccess: boolean;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'vpb_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) { try { return JSON.parse(stored); } catch { return null; } }
    return null;
  });

  const login = useCallback((usernameOrEmail: string, password: string) => {
    const value = usernameOrEmail.trim().toLowerCase();
    const found = initialUsers.find(
      (u) =>
        (u.username.toLowerCase() === value || u.email.toLowerCase() === value) &&
        u.password === password &&
        u.status === UserStatus.ACTIVE
    );
    if (found) {
      setUser(found);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isAdmin = user?.userType === UserType.ADMIN;
//   const designation = user ? initialDesignations.find((d) => d.id === user.designationId) : null;
  const hasFullAccess = isAdmin;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin, hasFullAccess, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
