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
  appName: 'Shree Ram Vegetable Traders',
  primaryBrand: 'Shree Ram',
  secondaryBrand: 'Vegetable Traders',
  logo,
  company: {
    name: 'Shree Ram Vegetable Traders',
    address: [
      'Market Yard, Okha-Jamnagar Highway, Harshadpur',
      'JKV Nagar 3, Khambhalia, Gujarat 361305',
    ],
    website: { label: '', url: '' },
    email: '',
  },
  currency: { code: 'INR', symbol: '₹', locale: 'en-IN' },
  theme: {
    primary: '135 65% 35%',
    primaryHover: '135 65% 28%',
    accent: '38 95% 55%',
  },
  invoice: {
    prefix: 'SRVT',
    taxRate: 0.18,
    taxLabel: 'GST (18%)',
    footer: 'This is a computer generated invoice no signature required.',
  },
  demo: {
    adminEmail: 'admin@traders.com',
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
