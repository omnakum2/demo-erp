import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  products as initialProducts,
  materials as initialMaterials,
  departments as initialDepartments,
  designations as initialDesignations,
  customers as initialCustomers,
  users as initialUsers,
  invoices as initialInvoices,
  analytics as mockAnalytics,
} from '@/data/demoDB';
import type {
  Product, Material, Department, Designation,
  Customer, User, Invoice, Analytics,
} from '@/types/common';

interface DataContextType {
  products: Product[];
  addProduct: (p: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'deleted'>) => void;
  updateProduct: (id: string, u: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  decrementStock: (productId: string, qty: number) => void;

  materials: Material[];
  addMaterial: (m: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMaterial: (id: string, u: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;

  departments: Department[];
  addDepartment: (d: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDepartment: (id: string, u: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  designations: Designation[];
  addDesignation: (d: Omit<Designation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDesignation: (id: string, u: Partial<Designation>) => void;
  deleteDesignation: (id: string) => void;

  customers: Customer[];
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, u: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  users: User[];
  addUser: (u: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, u: Partial<User>) => void;

  invoices: Invoice[];
  addInvoice: (i: Omit<Invoice, 'id' | 'createdAt'>) => void;

  analytics: Analytics;

  getMaterialCode: (id: string) => string;
  getDepartmentName: (id: string) => string;
  getDesignationName: (id: string) => string;
  getCustomerName: (id: string) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const now = () => new Date().toISOString();

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [designations, setDesignations] = useState<Designation[]>(initialDesignations);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [analytics] = useState<Analytics>(mockAnalytics);

  // Products
  const addProduct: DataContextType['addProduct'] = useCallback((p) => {
    const t = now();
    setProducts((prev) => [{ ...p, id: `prod-${Date.now()}`, createdAt: t, updatedAt: t, deleted: false }, ...prev]);
  }, []);
  const updateProduct: DataContextType['updateProduct'] = useCallback((id, u) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...u, updatedAt: now() } : p)));
  }, []);
  const deleteProduct: DataContextType['deleteProduct'] = useCallback((id) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, deleted: true, updatedAt: now() } : p)));
  }, []);
  const decrementStock: DataContextType['decrementStock'] = useCallback((productId, qty) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, p.stock - qty), updatedAt: now() } : p)));
  }, []);

  // Materials
  const addMaterial: DataContextType['addMaterial'] = useCallback((m) => {
    const t = now();
    setMaterials((prev) => [{ ...m, id: `mat-${Date.now()}`, createdAt: t, updatedAt: t }, ...prev]);
  }, []);
  const updateMaterial: DataContextType['updateMaterial'] = useCallback((id, u) => {
    setMaterials((prev) => prev.map((x) => (x.id === id ? { ...x, ...u, updatedAt: now() } : x)));
  }, []);
  const deleteMaterial: DataContextType['deleteMaterial'] = useCallback((id) => {
    setMaterials((prev) => prev.filter((x) => x.id !== id));
  }, []);

  // Departments
  const addDepartment: DataContextType['addDepartment'] = useCallback((d) => {
    const t = now();
    setDepartments((prev) => [{ ...d, id: `dep-${Date.now()}`, createdAt: t, updatedAt: t }, ...prev]);
  }, []);
  const updateDepartment: DataContextType['updateDepartment'] = useCallback((id, u) => {
    setDepartments((prev) => prev.map((x) => (x.id === id ? { ...x, ...u, updatedAt: now() } : x)));
  }, []);
  const deleteDepartment: DataContextType['deleteDepartment'] = useCallback((id) => {
    setDepartments((prev) => prev.filter((x) => x.id !== id));
  }, []);

  // Designations
  const addDesignation: DataContextType['addDesignation'] = useCallback((d) => {
    const t = now();
    setDesignations((prev) => [{ ...d, id: `desg-${Date.now()}`, createdAt: t, updatedAt: t }, ...prev]);
  }, []);
  const updateDesignation: DataContextType['updateDesignation'] = useCallback((id, u) => {
    setDesignations((prev) => prev.map((x) => (x.id === id ? { ...x, ...u, updatedAt: now() } : x)));
  }, []);
  const deleteDesignation: DataContextType['deleteDesignation'] = useCallback((id) => {
    setDesignations((prev) => prev.filter((x) => x.id !== id));
  }, []);

  // Customers
  const addCustomer: DataContextType['addCustomer'] = useCallback((c) => {
    const t = now();
    setCustomers((prev) => [{ ...c, id: `cust-${Date.now()}`, createdAt: t, updatedAt: t }, ...prev]);
  }, []);
  const updateCustomer: DataContextType['updateCustomer'] = useCallback((id, u) => {
    setCustomers((prev) => prev.map((x) => (x.id === id ? { ...x, ...u, updatedAt: now() } : x)));
  }, []);
  const deleteCustomer: DataContextType['deleteCustomer'] = useCallback((id) => {
    setCustomers((prev) => prev.filter((x) => x.id !== id));
  }, []);

  // Users
  const addUser: DataContextType['addUser'] = useCallback((u) => {
    setUsers((prev) => [{ ...u, id: `user-${Date.now()}`, createdAt: now() }, ...prev]);
  }, []);
  const updateUser: DataContextType['updateUser'] = useCallback((id, u) => {
    setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, ...u } : x)));
  }, []);

  // Invoices
  const addInvoice: DataContextType['addInvoice'] = useCallback((i) => {
    setInvoices((prev) => [{ ...i, id: `inv-${Date.now()}`, createdAt: now() }, ...prev]);
  }, []);

  const getMaterialCode = useCallback((id: string) => materials.find((m) => m.id === id)?.code ?? '—', [materials]);
  const getDepartmentName = useCallback((id: string) => departments.find((d) => d.id === id)?.name ?? '—', [departments]);
  const getDesignationName = useCallback((id: string) => designations.find((d) => d.id === id)?.name ?? '—', [designations]);
  const getCustomerName = useCallback((id: string) => customers.find((c) => c.id === id)?.name ?? '—', [customers]);

  return (
    <DataContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct, decrementStock,
      materials, addMaterial, updateMaterial, deleteMaterial,
      departments, addDepartment, updateDepartment, deleteDepartment,
      designations, addDesignation, updateDesignation, deleteDesignation,
      customers, addCustomer, updateCustomer, deleteCustomer,
      users, addUser, updateUser,
      invoices, addInvoice,
      analytics,
      getMaterialCode, getDepartmentName, getDesignationName, getCustomerName,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
