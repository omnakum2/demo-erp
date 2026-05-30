import { UserType, UserStatus, EntityStatus, PaymentMethod, MANAGER_DESIGNATION } from '@/types/enums';
import type {
  Material, Department, Designation, Product, Customer,
  User, Invoice, Analytics,
} from '@/types/common';
import { branding } from '@/config/branding.config';

const ISO = (d: string) => new Date(d).toISOString();

// ─── Materials (Raw Materials) ─────────────────────────────
export const materials: Material[] = [
  { id: 'mat-001', code: 'BR-IS319', status: EntityStatus.ACTIVE, additionalDetails: [{ label: 'Composition', value: 'Cu 60% / Zn 38% / Pb 2%' }], createdAt: ISO('2025-01-01'), updatedAt: ISO('2025-01-01') },
  { id: 'mat-002', code: 'BR-CW614N', status: EntityStatus.ACTIVE, additionalDetails: [{ label: 'Standard', value: 'EN 12164' }], createdAt: ISO('2025-01-01'), updatedAt: ISO('2025-01-01') },
  { id: 'mat-003', code: 'BR-HPB59', status: EntityStatus.ACTIVE, additionalDetails: [], createdAt: ISO('2025-01-02'), updatedAt: ISO('2025-01-02') },
  { id: 'mat-004', code: 'BR-FORGE', status: EntityStatus.ACTIVE, additionalDetails: [], createdAt: ISO('2025-01-03'), updatedAt: ISO('2025-01-03') },
  { id: 'mat-005', code: 'CU-ETP', status: EntityStatus.ACTIVE, additionalDetails: [{ label: 'Grade', value: 'C11000 / ETP Copper' }], createdAt: ISO('2025-01-04'), updatedAt: ISO('2025-01-04') },
];

// ─── Departments ───────────────────────────────────────────
export const departments: Department[] = [
  { id: 'dep-001', name: 'Admin', status: EntityStatus.ACTIVE, createdAt: ISO('2025-01-01'), updatedAt: ISO('2025-01-01') },
  { id: 'dep-002', name: 'CNC Production', status: EntityStatus.ACTIVE, createdAt: ISO('2025-01-01'), updatedAt: ISO('2025-01-01') },
  { id: 'dep-003', name: 'Forging', status: EntityStatus.ACTIVE, createdAt: ISO('2025-01-01'), updatedAt: ISO('2025-01-01') },
  { id: 'dep-004', name: 'Quality Control', status: EntityStatus.ACTIVE, createdAt: ISO('2025-01-01'), updatedAt: ISO('2025-01-01') },
  { id: 'dep-005', name: 'Dispatch', status: EntityStatus.ACTIVE, createdAt: ISO('2025-01-01'), updatedAt: ISO('2025-01-01') },
];

// ─── Designations ──────────────────────────────────────────
export const designations: Designation[] = [
  { id: 'desg-001', name: MANAGER_DESIGNATION, status: EntityStatus.ACTIVE, createdAt: ISO('2025-01-01'), updatedAt: ISO('2025-01-01') },
  { id: 'desg-002', name: 'Assistant', status: EntityStatus.ACTIVE, createdAt: ISO('2025-01-01'), updatedAt: ISO('2025-01-01') },
  { id: 'desg-003', name: 'Worker', status: EntityStatus.ACTIVE, createdAt: ISO('2025-01-01'), updatedAt: ISO('2025-01-01') },
];

// ─── Products ──────────────────────────────────────────────
export const products: Product[] = [
  // CNC Parts
  { id: 'prod-001', name: 'CNC Turned Bush M8', code: 'VPB-CNC-BM8', materialId: 'mat-001', price: 45, stock: 3200, unit: 'pcs', status: EntityStatus.ACTIVE, deleted: false, additionalDetails: [{ label: 'OD', value: '12 mm' }, { label: 'Length', value: '15 mm' }], createdAt: ISO('2025-01-10'), updatedAt: ISO('2025-01-10') },
  { id: 'prod-002', name: 'CNC Precision Spindle', code: 'VPB-CNC-PS01', materialId: 'mat-002', price: 320, stock: 420, unit: 'pcs', status: EntityStatus.ACTIVE, deleted: false, additionalDetails: [{ label: 'Tolerance', value: '±0.02 mm' }], createdAt: ISO('2025-01-11'), updatedAt: ISO('2025-01-11') },

  // Pipe Fitting Inserts
  { id: 'prod-003', name: 'Brass Elbow Insert 3/4"', code: 'VPB-PFI-EL34', materialId: 'mat-002', price: 142, stock: 950, unit: 'pcs', status: EntityStatus.ACTIVE, deleted: false, additionalDetails: [{ label: 'Angle', value: '90°' }], createdAt: ISO('2025-01-12'), updatedAt: ISO('2025-01-12') },

  // Precision Components
  { id: 'prod-006', name: 'Precision Brass Nozzle', code: 'VPB-PC-NZ01', materialId: 'mat-003', price: 165, stock: 780, unit: 'pcs', status: EntityStatus.ACTIVE, deleted: false, additionalDetails: [{ label: 'Bore', value: '2.5 mm' }, { label: 'Finish', value: 'Chrome Plated' }], createdAt: ISO('2025-01-14'), updatedAt: ISO('2025-01-14') },
  { id: 'prod-007', name: 'Precision Sleeve Bearing', code: 'VPB-PC-SB01', materialId: 'mat-001', price: 92, stock: 1500, unit: 'pcs', status: EntityStatus.ACTIVE, deleted: false, additionalDetails: [{ label: 'ID', value: '10 mm' }, { label: 'OD', value: '14 mm' }], createdAt: ISO('2025-01-14'), updatedAt: ISO('2025-01-14') },

  // Brass Anchors
  { id: 'prod-009', name: 'Brass Drop-In Anchor M8', code: 'VPB-BA-DI8', materialId: 'mat-004', price: 38, stock: 5400, unit: 'pcs', status: EntityStatus.ACTIVE, deleted: false, additionalDetails: [{ label: 'Drill Hole', value: '10 mm' }], createdAt: ISO('2025-01-15'), updatedAt: ISO('2025-01-15') },
  { id: 'prod-010', name: 'Brass Wedge Anchor M10', code: 'VPB-BA-WA10', materialId: 'mat-004', price: 55, stock: 3200, unit: 'pcs', status: EntityStatus.ACTIVE, deleted: false, additionalDetails: [{ label: 'Length', value: '60 mm' }], createdAt: ISO('2025-01-15'), updatedAt: ISO('2025-01-15') },

  // Brass Fasteners
  { id: 'prod-011', name: 'Brass Hex Bolt M6x30', code: 'VPB-BF-HB630', materialId: 'mat-001', price: 12, stock: 12000, unit: 'pcs', status: EntityStatus.ACTIVE, deleted: false, additionalDetails: [{ label: 'Grade', value: 'DIN 933' }], createdAt: ISO('2025-01-16'), updatedAt: ISO('2025-01-16') },
  { id: 'prod-012', name: 'Brass Hex Nut M8', code: 'VPB-BF-HN8', materialId: 'mat-001', price: 8, stock: 15000, unit: 'pcs', status: EntityStatus.ACTIVE, deleted: false, additionalDetails: [], createdAt: ISO('2025-01-16'), updatedAt: ISO('2025-01-16') },

  // Copper Rivets
  { id: 'prod-013', name: 'Copper Solid Rivet 4x12', code: 'VPB-CR-SR412', materialId: 'mat-005', price: 6, stock: 25000, unit: 'pcs', status: EntityStatus.ACTIVE, deleted: false, additionalDetails: [{ label: 'Head Type', value: 'Round' }], createdAt: ISO('2025-01-18'), updatedAt: ISO('2025-01-18') },
];

// ─── Customers ─────────────────────────────────────────────
export const customers: Customer[] = [
  { id: 'cust-001', code: 'C-1001', name: 'Patel Hardware Stores', email: 'orders@patelhardware.in', contactNumber: '+91 98240 11122', address: 'Shop 12, MG Road, Ahmedabad – 380001, Gujarat', notes: 'Bulk buyer, monthly orders.', status: EntityStatus.ACTIVE, additionalDetails: [{ label: 'GSTIN', value: '24ABCDE1234F1Z5' }], createdAt: ISO('2025-01-05'), updatedAt: ISO('2025-01-05') },
  { id: 'cust-002', code: 'C-1002', name: 'Shree Krishna Plumbing Co.', email: 'purchase@shreekrishna.co.in', contactNumber: '+91 99980 33445', address: 'B-14, Industrial Area, Rajkot – 360003, Gujarat', notes: 'Prefers Bank Transfer.', status: EntityStatus.ACTIVE, additionalDetails: [], createdAt: ISO('2025-01-06'), updatedAt: ISO('2025-01-06') },
  { id: 'cust-003', code: 'C-1003', name: 'Mumbai Brass Components Pvt Ltd', email: 'accounts@mumbaibrass.com', contactNumber: '+91 90220 77889', address: 'Plot 88, MIDC Andheri, Mumbai – 400093, Maharashtra', notes: 'B2B exporter.', status: EntityStatus.ACTIVE, additionalDetails: [{ label: 'GSTIN', value: '27AAAPL5678C1Z2' }], createdAt: ISO('2025-01-07'), updatedAt: ISO('2025-01-07') },
];

// ─── Users ─────────────────────────────────────────────────
const PWD = branding.demo.defaultPassword;
export const users: User[] = [
  { id: 'user-001', name: 'Admin User', phone: '+91 90000 00001', email: branding.demo.adminEmail, username: 'admin', password: PWD, status: UserStatus.ACTIVE, userType: UserType.ADMIN, departmentIds: ['dep-001'], designationId: 'desg-001', createdAt: ISO('2025-01-01') },
  { id: 'user-002', name: 'Paresh Parmar', phone: '+91 98250 11111', email: 'paresh@vishnupriyabrass.com', username: 'paresh', password: PWD, status: UserStatus.ACTIVE, userType: UserType.EMPLOYEE, departmentIds: ['dep-001', 'dep-002', 'dep-005'], designationId: 'desg-001', createdAt: ISO('2025-01-02') },
  { id: 'user-003', name: 'Suresh Mehta', phone: '+91 98250 22222', email: 'suresh@vishnupriyabrass.com', username: 'suresh', password: PWD, status: UserStatus.ACTIVE, userType: UserType.EMPLOYEE, departmentIds: ['dep-002'], designationId: 'desg-002', createdAt: ISO('2025-01-03') },
  { id: 'user-004', name: 'Ramesh Joshi', phone: '+91 98250 33333', email: 'ramesh@vishnupriyabrass.com', username: 'ramesh', password: PWD, status: UserStatus.ACTIVE, userType: UserType.EMPLOYEE, departmentIds: ['dep-003'], designationId: 'desg-003', createdAt: ISO('2025-01-04') },
  { id: 'user-005', name: 'Mahesh Bhatt', phone: '+91 98250 44444', email: 'mahesh@vishnupriyabrass.com', username: 'mahesh', password: PWD, status: UserStatus.ACTIVE, userType: UserType.EMPLOYEE, departmentIds: ['dep-004'], designationId: 'desg-002', createdAt: ISO('2025-01-05') },
];

// ─── Invoices ──────────────────────────────────────────────
const cust1 = customers[0];
const cust2 = customers[1];
const cust3 = customers[2];

export const invoices: Invoice[] = [
  {
    id: 'inv-001', invoiceNumber: 'VPB-2025-001', date: '2025-01-15',
    customerId: cust1.id,
    customerSnapshot: { code: cust1.code, name: cust1.name, email: cust1.email, contactNumber: cust1.contactNumber, address: cust1.address },
    items: [
      { productId: 'prod-004', productName: 'Brass Pipe Insert 1/2"', productCode: 'VPB-PFI-12', material: 'BR-IS319', quantity: 100, unitPrice: 85, unit: 'pcs', total: 8500 },
      { productId: 'prod-001', productName: 'CNC Turned Bush M8', productCode: 'VPB-CNC-BM8', material: 'BR-IS319', quantity: 500, unitPrice: 45, unit: 'pcs', total: 22500 },
    ],
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    subtotal: 31000, tax: 5580, total: 36580, notes: '',
    status: EntityStatus.ACTIVE,
    createdAt: ISO('2025-01-15T11:30:00Z'),
  },
  {
    id: 'inv-002', invoiceNumber: 'VPB-2025-002', date: '2025-01-14',
    customerId: cust2.id,
    customerSnapshot: { code: cust2.code, name: cust2.name, email: cust2.email, contactNumber: cust2.contactNumber, address: cust2.address },
    items: [
      { productId: 'prod-009', productName: 'Brass Drop-In Anchor M8', productCode: 'VPB-BA-DI8', material: 'BR-FORGE', quantity: 200, unitPrice: 38, unit: 'pcs', total: 7600 },
      { productId: 'prod-014', productName: 'Copper Solid Rivet 4x12', productCode: 'VPB-CR-SR412', material: 'CU-ETP', quantity: 1000, unitPrice: 6, unit: 'pcs', total: 6000 },
    ],
    paymentMethod: PaymentMethod.UPI,
    subtotal: 13600, tax: 2448, total: 16048, notes: '',
    status: EntityStatus.ACTIVE,
    createdAt: ISO('2025-01-14T15:45:00Z'),
  },
  {
    id: 'inv-003', invoiceNumber: 'VPB-2025-003', date: '2025-01-13',
    customerId: cust3.id,
    customerSnapshot: { code: cust3.code, name: cust3.name, email: cust3.email, contactNumber: cust3.contactNumber, address: cust3.address },
    items: [
      { productId: 'prod-011', productName: 'Brass Hex Bolt M6x30', productCode: 'VPB-BF-HB630', material: 'BR-IS319', quantity: 500, unitPrice: 12, unit: 'pcs', total: 6000 },
      { productId: 'prod-007', productName: 'Precision Brass Nozzle', productCode: 'VPB-PC-NZ01', material: 'BR-HPB59', quantity: 50, unitPrice: 165, unit: 'pcs', total: 8250 },
    ],
    paymentMethod: PaymentMethod.CASH,
    subtotal: 14250, tax: 2565, total: 16815, notes: '',
    status: EntityStatus.ACTIVE,
    createdAt: ISO('2025-01-13T10:20:00Z'),
  },
];

// ─── Analytics ─────────────────────────────────────────────
export const analytics: Analytics = {
  dailySales: 36580,
  monthlySales: 69443,
  totalInvoices: invoices.length,
  totalProducts: products.length,
  recentTransactions: invoices.map((i) => ({
    id: i.invoiceNumber, amount: i.total, date: i.date, paymentMethod: i.paymentMethod,
  })),
};
