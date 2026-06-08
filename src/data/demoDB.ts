import { UserType, UserStatus, EntityStatus, PaymentMethod, MANAGER_DESIGNATION } from '@/types/enums';
import type {
  Product, Customer,
  User, Invoice, Analytics,
} from '@/types/common';
import { branding } from '@/config/branding.config';

const ISO = (d: string) => new Date(d).toISOString();

// ─── Products ──────────────────────────────────────────────
export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Potato',
    price: 25,
    unit: 'kg',
    status: EntityStatus.ACTIVE,
    deleted: false,
    additionalDetails: [{ label: 'Grade', value: 'A' }],
    createdAt: ISO('2025-01-01'),
    updatedAt: ISO('2025-01-01'),
  },
  {
    id: 'prod-002',
    name: 'Onion',
    price: 30,
    unit: 'kg',
    status: EntityStatus.ACTIVE,
    deleted: false,
    additionalDetails: [{ label: 'Grade', value: 'A' }],
    createdAt: ISO('2025-01-01'),
    updatedAt: ISO('2025-01-01'),
  },
  {
    id: 'prod-003',
    name: 'Tomato',
    price: 22,
    unit: 'kg',
    status: EntityStatus.ACTIVE,
    deleted: false,
    additionalDetails: [{ label: 'Grade', value: 'Fresh' }],
    createdAt: ISO('2025-01-01'),
    updatedAt: ISO('2025-01-01'),
  },
  {
    id: 'prod-004',
    name: 'Cabbage',
    price: 18,
    unit: 'kg',
    status: EntityStatus.ACTIVE,
    deleted: false,
    additionalDetails: [],
    createdAt: ISO('2025-01-01'),
    updatedAt: ISO('2025-01-01'),
  },
  {
    id: 'prod-005',
    name: 'Green Chilli',
    price: 60,
    unit: 'kg',
    status: EntityStatus.ACTIVE,
    deleted: false,
    additionalDetails: [],
    createdAt: ISO('2025-01-01'),
    updatedAt: ISO('2025-01-01'),
  },
  {
    id: 'prod-006',
    name: 'Brinjal',
    price: 28,
    unit: 'kg',
    status: EntityStatus.ACTIVE,
    deleted: false,
    additionalDetails: [],
    createdAt: ISO('2025-01-01'),
    updatedAt: ISO('2025-01-01'),
  },
];

// ─── Customers ─────────────────────────────────────────────
export const customers: Customer[] = [
  {
    id: 'cust-001',
    code: 'C001',
    name: 'Shree Ram Vegetables',
    email: 'shreeram@gmail.com',
    contactNumber: '+91 9876543210',
    address: 'Jamnagar Market, Gujarat',
    notes: 'Daily retailer',
    status: EntityStatus.ACTIVE,
    additionalDetails: [],
    createdAt: ISO('2025-01-01'),
    updatedAt: ISO('2025-01-01'),
  },
  {
    id: 'cust-002',
    code: 'C002',
    name: 'Hotel Krishna',
    email: 'purchase@hotelkrishna.com',
    contactNumber: '+91 9876543220',
    address: 'Rajkot Highway, Gujarat',
    notes: 'Bulk hotel orders',
    status: EntityStatus.ACTIVE,
    additionalDetails: [],
    createdAt: ISO('2025-01-02'),
    updatedAt: ISO('2025-01-02'),
  },
  {
    id: 'cust-003',
    code: 'C003',
    name: 'Fresh Basket Mart',
    email: 'freshbasket@gmail.com',
    contactNumber: '+91 9876543230',
    address: 'Kalavad Road, Rajkot',
    notes: 'Weekly bulk purchase',
    status: EntityStatus.ACTIVE,
    additionalDetails: [],
    createdAt: ISO('2025-01-03'),
    updatedAt: ISO('2025-01-03'),
  },
];

// ─── Users ─────────────────────────────────────────────────
const PWD = branding.demo.defaultPassword;
export const users: User[] = [
  { id: 'user-001', name: 'Admin User', phone: '+91 90000 00001', email: branding.demo.adminEmail, username: 'admin', password: PWD, status: UserStatus.ACTIVE, userType: UserType.ADMIN, createdAt: ISO('2025-01-01') },
  { id: 'user-002', name: 'Paresh Parmar', phone: '+91 98250 11111', email: 'paresh@vishnupriyabrass.com', username: 'paresh', password: PWD, status: UserStatus.ACTIVE, userType: UserType.EMPLOYEE, createdAt: ISO('2025-01-02') },
  { id: 'user-003', name: 'Suresh Mehta', phone: '+91 98250 22222', email: 'suresh@vishnupriyabrass.com', username: 'suresh', password: PWD, status: UserStatus.ACTIVE, userType: UserType.EMPLOYEE, createdAt: ISO('2025-01-03') },
  { id: 'user-004', name: 'Ramesh Joshi', phone: '+91 98250 33333', email: 'ramesh@vishnupriyabrass.com', username: 'ramesh', password: PWD, status: UserStatus.ACTIVE, userType: UserType.EMPLOYEE, createdAt: ISO('2025-01-04') },
  { id: 'user-005', name: 'Mahesh Bhatt', phone: '+91 98250 44444', email: 'mahesh@vishnupriyabrass.com', username: 'mahesh', password: PWD, status: UserStatus.ACTIVE, userType: UserType.EMPLOYEE, createdAt: ISO('2025-01-05') },
];

// ─── Invoices ──────────────────────────────────────────────
const cust1 = customers[0];
const cust2 = customers[1];
const cust3 = customers[2];

export const invoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'MYS-2025-001',
    date: '2025-01-15',
    customerId: cust1.id,
    customerSnapshot: {
      code: cust1.code,
      name: cust1.name,
      email: cust1.email,
      contactNumber: cust1.contactNumber,
      address: cust1.address,
    },
    items: [
      {
        productId: 'prod-001',
        productName: 'Potato',
        quantity: 200,
        unitPrice: 25,
        unit: 'kg',
        total: 5000,
      },
      {
        productId: 'prod-002',
        productName: 'Onion',
        quantity: 150,
        unitPrice: 30,
        unit: 'kg',
        total: 4500,
      },
    ],
    paymentMethod: PaymentMethod.CASH,
    subtotal: 9500,
    tax: 0,
    total: 9500,
    notes: '',
    status: EntityStatus.ACTIVE,
    createdAt: ISO('2025-01-15'),
  },
  {
    id: 'inv-002',
    invoiceNumber: 'MYS-2025-002',
    date: '2025-01-16',
    customerId: cust2.id,
    customerSnapshot: {
      code: cust2.code,
      name: cust2.name,
      email: cust2.email,
      contactNumber: cust2.contactNumber,
      address: cust2.address,
    },
    items: [
      {
        productId: 'prod-003',
        productName: 'Tomato',
        quantity: 120,
        unitPrice: 22,
        unit: 'kg',
        total: 2640,
      },
      {
        productId: 'prod-005',
        productName: 'Green Chilli',
        quantity: 25,
        unitPrice: 60,
        unit: 'kg',
        total: 1500,
      },
    ],
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    subtotal: 4140,
    tax: 0,
    total: 4140,
    notes: 'Hotel supply',
    status: EntityStatus.ACTIVE,
    createdAt: ISO('2025-01-16'),
  },
  {
    id: 'inv-003',
    invoiceNumber: 'MYS-2025-003',
    date: '2025-01-17',
    customerId: cust3.id,
    customerSnapshot: {
      code: cust3.code,
      name: cust3.name,
      email: cust3.email,
      contactNumber: cust3.contactNumber,
      address: cust3.address,
    },
    items: [
      {
        productId: 'prod-004',
        productName: 'Cabbage',
        quantity: 100,
        unitPrice: 18,
        unit: 'kg',
        total: 1800,
      },
      {
        productId: 'prod-006',
        productName: 'Brinjal',
        quantity: 80,
        unitPrice: 28,
        unit: 'kg',
        total: 2240,
      },
    ],
    paymentMethod: PaymentMethod.UPI,
    subtotal: 4040,
    tax: 0,
    total: 4040,
    notes: '',
    status: EntityStatus.ACTIVE,
    createdAt: ISO('2025-01-17'),
  },
];

// ─── Analytics ─────────────────────────────────────────────
export const analytics: Analytics = {
  dailySales: 4040,
  monthlySales: 17680,
  totalInvoices: invoices.length,
  totalProducts: products.length,
  recentTransactions: invoices.map((invoice) => ({
    id: invoice.invoiceNumber,
    amount: invoice.total,
    date: invoice.date,
    paymentMethod: invoice.paymentMethod,
  })),
};