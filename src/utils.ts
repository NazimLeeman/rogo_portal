import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currencyDisplay: 'symbol',
    currency: 'BDT',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace('BDT', '৳');
}
