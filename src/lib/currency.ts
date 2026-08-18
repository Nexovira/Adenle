import { CurrencyCode, CurrencyInfo } from '../types';

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬', rateToUSD: 1600, region: 'Nigeria' },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rateToUSD: 1.0, region: 'United States' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rateToUSD: 0.78, region: 'United Kingdom' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rateToUSD: 0.92, region: 'European Union' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', rateToUSD: 1.36, region: 'Canada' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', rateToUSD: 1.52, region: 'Australia' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', flag: '🇬🇭', rateToUSD: 15.5, region: 'Ghana' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪', rateToUSD: 129.0, region: 'Kenya' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦', rateToUSD: 18.2, region: 'South Africa' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪', rateToUSD: 3.67, region: 'United Arab Emirates' },
];

export function getCurrencyInfo(code: CurrencyCode): CurrencyInfo {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code) || SUPPORTED_CURRENCIES[0];
}

export function convertFromUSD(amountInUSD: number, targetCurrency: CurrencyCode): number {
  const currency = getCurrencyInfo(targetCurrency);
  return Math.round(amountInUSD * currency.rateToUSD);
}

export function formatCurrency(
  amountInUSD: number,
  currencyCode: CurrencyCode = 'NGN'
): string {
  const info = getCurrencyInfo(currencyCode);
  const converted = convertFromUSD(amountInUSD, currencyCode);

  if (currencyCode === 'NGN') {
    return `${info.symbol}${converted.toLocaleString('en-NG')}`;
  }
  if (currencyCode === 'USD') {
    return `$${converted.toLocaleString('en-US')}`;
  }
  if (currencyCode === 'EUR') {
    return `${info.symbol}${converted.toLocaleString('de-DE')}`;
  }
  if (currencyCode === 'GBP') {
    return `${info.symbol}${converted.toLocaleString('en-GB')}`;
  }
  return `${info.symbol}${converted.toLocaleString()}`;
}

export function formatNativeCurrency(
  amount: number,
  currencyCode: CurrencyCode = 'NGN'
): string {
  const info = getCurrencyInfo(currencyCode);
  const rounded = Math.round(amount * 100) / 100;

  if (currencyCode === 'NGN') {
    return `${info.symbol}${rounded.toLocaleString('en-NG')}`;
  }
  if (currencyCode === 'USD') {
    return `$${rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (currencyCode === 'EUR') {
    return `${info.symbol}${rounded.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (currencyCode === 'GBP') {
    return `${info.symbol}${rounded.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${info.symbol}${rounded.toLocaleString()}`;
}

export function convertDirectly(
  amount: number,
  fromCode: CurrencyCode,
  toCode: CurrencyCode
): { convertedAmount: number; rate: number } {
  if (fromCode === toCode) {
    return { convertedAmount: amount, rate: 1.0 };
  }
  const fromInfo = getCurrencyInfo(fromCode);
  const toInfo = getCurrencyInfo(toCode);

  // Convert to USD base first
  const amountInUSD = amount / (fromInfo.rateToUSD || 1);
  const convertedAmount = Math.round((amountInUSD * (toInfo.rateToUSD || 1)) * 100) / 100;
  const rate = Math.round(((toInfo.rateToUSD || 1) / (fromInfo.rateToUSD || 1)) * 10000) / 10000;

  return { convertedAmount, rate };
}
