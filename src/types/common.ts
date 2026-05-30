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

export interface Material extends BaseEntity {
  code: string;
  status: EntityStatus;
  additionalDetails: AdditionalDetail[];
}

export interface Department extends BaseEntity {
  name: string;
  status: EntityStatus;
}

export interface Designation extends BaseEntity {
  name: string;
  status: EntityStatus;
}

export interface Product extends BaseEntity {
  deleted: boolean;
  name: string;
  code: string;
  materialId: string;
  price: number;
  stock: number;
  unit: string;
  status: EntityStatus;
  additionalDetails: AdditionalDetail[];
}

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
  departmentIds: string[];
  designationId: string;
  createdAt: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  productCode: string;
  material: string;
  quantity: number;
  unitPrice: number;
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

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
  getSearchValue?: (row: T) => string;
}
