// Centralized branding configuration.
// Update this file (and the matching HSL tokens in src/index.css) to rebrand for another client.

import logo from '@/assets/brand-logo-pdf.png';

export interface BrandingConfig {
  appName: string;
  primaryBrand: string;
  secondaryBrand: string;
  logo: string;
  company: {
    name: string;
    address: string[];
    website: { label: string; url: string };
    email: string;
  };
  currency: { code: string; symbol: string; locale: string };
  // HSL color tokens — keep in sync with index.css :root
  theme: {
    primary: string;
    primaryHover: string;
    accent: string;
  };
  invoice: {
    prefix: string;
    taxRate: number;
    taxLabel: string;
    footer: string;
  };
  demo: {
    adminEmail: string;
    defaultPassword: string;
  };
}

export const branding: BrandingConfig = {
  appName: 'Vishnu Priya Brass Products',
  primaryBrand: 'Vishnu Priya',
  secondaryBrand: 'Brass Products',
  logo,
  company: {
    name: 'Vishnu Priya Brass Products',
    address: [
      'Plot No. 10-11, Survey No. 433, Shree Ganesh Industrial Hub,',
      'Lalpur Road, Village: Changa, Jamnagar – 361012 Gujarat (India)',
    ],
    website: { label: 'vishnupriyabrass.com', url: 'https://vishnupriyabrass.com' },
    email: 'sales@vishnupriyabrass.com',
  },
  currency: { code: 'INR', symbol: '₹', locale: 'en-IN' },
  theme: {
    primary: '359 44% 31%',
    primaryHover: '359 44% 25%',
    accent: '40 85% 55%',
  },
  invoice: {
    prefix: 'VPB',
    taxRate: 0.18,
    taxLabel: 'GST (18%)',
    footer: 'This is a computer generated invoice no signature required.',
  },
  demo: {
    adminEmail: 'admin@vishnupriyabrass.com',
    defaultPassword: 'demo@123',
  },
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(branding.currency.locale, {
    style: 'currency',
    currency: branding.currency.code,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
