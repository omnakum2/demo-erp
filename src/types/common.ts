import { UserType, UserStatus, EntityStatus, PaymentMethod } from './enums';

export interface AdditionalDetail {
  label: string;
  value: string;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Product ──────────────────────────────────────────────

export interface Product extends BaseEntity {
  deleted: boolean;
  name: string;
  price: number; // Price per kg
  unit: string;
  status: EntityStatus;
  additionalDetails: AdditionalDetail[];
}

// ─── Customer ─────────────────────────────────────────────

export interface Customer extends BaseEntity {
  code: string;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  notes: string;
  status: EntityStatus;
  additionalDetails: AdditionalDetail[];
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  status: UserStatus;
  userType: UserType;
  // departmentIds: string[];
  // designationId: string;
  createdAt: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number; // Quantity in kg
  unitPrice: number; // Price per kg
  unit: string;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;

  customerId: string;

  customerSnapshot: {
    code: string;
    name: string;
    email: string;
    contactNumber: string;
    address: string;
  };

  items: InvoiceItem[];

  paymentMethod: PaymentMethod;

  subtotal: number;
  tax: number;
  total: number;

  notes: string;
  status: EntityStatus;

  createdAt: string;
}

// ─── Analytics ────────────────────────────────────────────

export interface Analytics {
  dailySales: number;
  monthlySales: number;
  totalInvoices: number;
  totalProducts: number;

  recentTransactions: {
    id: string;
    amount: number;
    date: string;
    paymentMethod: string;
  }[];
}

// ─── Table Column ─────────────────────────────────────────

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
  getSearchValue?: (row: T) => string;
}
