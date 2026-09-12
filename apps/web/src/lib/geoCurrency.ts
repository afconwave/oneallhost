'use client';

import { useState, useEffect } from 'react';

export interface PaymentRailMethod {
  id: string;
  name: string;
  type: 'mobile_money' | 'card' | 'bank' | 'crypto';
  logoType: string;
  badgeText?: string;
  instructions?: string;
}

export interface GeoCurrencyConfig {
  countryCode: string;
  countryName: string;
  currencyCode: string;
  currencySymbol: string;
  currencyName: string;
  exchangeRate: number; // Rate per 1 USD
  isAfricanRail: boolean;
  paymentMethods: PaymentRailMethod[];
}

export const GEO_CURRENCY_REGISTRY: Record<string, GeoCurrencyConfig> = {
  CM: {
    countryCode: 'CM',
    countryName: 'Cameroon',
    currencyCode: 'XAF',
    currencySymbol: 'FCFA',
    currencyName: 'Central African CFA Franc',
    exchangeRate: 615.5,
    isAfricanRail: true,
    paymentMethods: [
      { id: 'mtn_cm', name: 'MTN MoMo', type: 'mobile_money', logoType: 'mtn', badgeText: 'INSTANT' },
      { id: 'orange_cm', name: 'Orange Money', type: 'mobile_money', logoType: 'orange', badgeText: 'INSTANT' },
      { id: 'express_cm', name: 'Express Union', type: 'mobile_money', logoType: 'express' },
      { id: 'card_cm', name: 'Visa / Mastercard', type: 'card', logoType: 'card' },
      { id: 'crypto_cm', name: 'Tether USDT', type: 'crypto', logoType: 'crypto' },
    ],
  },
  CI: {
    countryCode: 'CI',
    countryName: 'Côte d’Ivoire',
    currencyCode: 'XOF',
    currencySymbol: 'CFA',
    currencyName: 'West African CFA Franc',
    exchangeRate: 615.5,
    isAfricanRail: true,
    paymentMethods: [
      { id: 'orange_ci', name: 'Orange Money', type: 'mobile_money', logoType: 'orange', badgeText: 'POPULAR' },
      { id: 'wave_ci', name: 'Wave Mobile Money', type: 'mobile_money', logoType: 'wave', badgeText: '0% FEE' },
      { id: 'mtn_ci', name: 'MTN MoMo', type: 'mobile_money', logoType: 'mtn' },
      { id: 'moov_ci', name: 'Moov Money', type: 'mobile_money', logoType: 'moov' },
      { id: 'card_ci', name: 'Visa / Mastercard', type: 'card', logoType: 'card' },
    ],
  },
  SN: {
    countryCode: 'SN',
    countryName: 'Senegal',
    currencyCode: 'XOF',
    currencySymbol: 'CFA',
    currencyName: 'West African CFA Franc',
    exchangeRate: 615.5,
    isAfricanRail: true,
    paymentMethods: [
      { id: 'wave_sn', name: 'Wave Mobile Money', type: 'mobile_money', logoType: 'wave', badgeText: '0% FEE' },
      { id: 'orange_sn', name: 'Orange Money', type: 'mobile_money', logoType: 'orange' },
      { id: 'free_sn', name: 'Free Money', type: 'mobile_money', logoType: 'moov' },
      { id: 'card_sn', name: 'Visa / Mastercard', type: 'card', logoType: 'card' },
    ],
  },
  NG: {
    countryCode: 'NG',
    countryName: 'Nigeria',
    currencyCode: 'NGN',
    currencySymbol: '₦',
    currencyName: 'Nigerian Naira',
    exchangeRate: 1600.0,
    isAfricanRail: true,
    paymentMethods: [
      { id: 'bank_ng', name: 'Instant Bank Transfer', type: 'bank', logoType: 'bank', badgeText: 'INSTANT' },
      { id: 'paystack_ng', name: 'Paystack Card & Transfer', type: 'card', logoType: 'card' },
      { id: 'opay_ng', name: 'OPay / PalmPay', type: 'mobile_money', logoType: 'mtn' },
      { id: 'crypto_ng', name: 'Tether USDT', type: 'crypto', logoType: 'crypto' },
    ],
  },
  GH: {
    countryCode: 'GH',
    countryName: 'Ghana',
    currencyCode: 'GHS',
    currencySymbol: 'GH₵',
    currencyName: 'Ghanaian Cedi',
    exchangeRate: 15.5,
    isAfricanRail: true,
    paymentMethods: [
      { id: 'mtn_gh', name: 'MTN Mobile Money', type: 'mobile_money', logoType: 'mtn', badgeText: 'POPULAR' },
      { id: 'vodafone_gh', name: 'Telecel / Vodafone Cash', type: 'mobile_money', logoType: 'vodafone' },
      { id: 'airteltigo_gh', name: 'AT Money (AirtelTigo)', type: 'mobile_money', logoType: 'airtel' },
      { id: 'card_gh', name: 'Visa / Mastercard', type: 'card', logoType: 'card' },
    ],
  },
  KE: {
    countryCode: 'KE',
    countryName: 'Kenya',
    currencyCode: 'KES',
    currencySymbol: 'KSh',
    currencyName: 'Kenyan Shilling',
    exchangeRate: 129.0,
    isAfricanRail: true,
    paymentMethods: [
      { id: 'mpesa_ke', name: 'Safaricom M-Pesa', type: 'mobile_money', logoType: 'mpesa', badgeText: 'POPULAR' },
      { id: 'airtel_ke', name: 'Airtel Money', type: 'mobile_money', logoType: 'airtel' },
      { id: 'card_ke', name: 'Visa / Mastercard', type: 'card', logoType: 'card' },
    ],
  },
  RW: {
    countryCode: 'RW',
    countryName: 'Rwanda',
    currencyCode: 'RWF',
    currencySymbol: 'FRw',
    currencyName: 'Rwandan Franc',
    exchangeRate: 1350.0,
    isAfricanRail: true,
    paymentMethods: [
      { id: 'mtn_rw', name: 'MTN MoMo', type: 'mobile_money', logoType: 'mtn', badgeText: 'POPULAR' },
      { id: 'airtel_rw', name: 'Airtel Money', type: 'mobile_money', logoType: 'airtel' },
      { id: 'card_rw', name: 'Visa / Mastercard', type: 'card', logoType: 'card' },
    ],
  },
  CD: {
    countryCode: 'CD',
    countryName: 'DR Congo',
    currencyCode: 'CDF',
    currencySymbol: 'FC',
    currencyName: 'Congolese Franc',
    exchangeRate: 2800.0,
    isAfricanRail: true,
    paymentMethods: [
      { id: 'vodacom_cd', name: 'Vodacom M-Pesa', type: 'mobile_money', logoType: 'mpesa' },
      { id: 'airtel_cd', name: 'Airtel Money', type: 'mobile_money', logoType: 'airtel' },
      { id: 'orange_cd', name: 'Orange Money', type: 'mobile_money', logoType: 'orange' },
      { id: 'card_cd', name: 'Visa / Mastercard', type: 'card', logoType: 'card' },
    ],
  },
  GA: {
    countryCode: 'GA',
    countryName: 'Gabon',
    currencyCode: 'XAF',
    currencySymbol: 'FCFA',
    currencyName: 'Central African CFA Franc',
    exchangeRate: 615.5,
    isAfricanRail: true,
    paymentMethods: [
      { id: 'airtel_ga', name: 'Airtel Money', type: 'mobile_money', logoType: 'airtel', badgeText: 'POPULAR' },
      { id: 'moov_ga', name: 'Moov Money', type: 'mobile_money', logoType: 'moov' },
      { id: 'card_ga', name: 'Visa / Mastercard', type: 'card', logoType: 'card' },
    ],
  },
  BJ: {
    countryCode: 'BJ',
    countryName: 'Benin',
    currencyCode: 'XOF',
    currencySymbol: 'CFA',
    currencyName: 'West African CFA Franc',
    exchangeRate: 615.5,
    isAfricanRail: true,
    paymentMethods: [
      { id: 'mtn_bj', name: 'MTN MoMo', type: 'mobile_money', logoType: 'mtn' },
      { id: 'moov_bj', name: 'Moov Money', type: 'mobile_money', logoType: 'moov' },
      { id: 'card_bj', name: 'Visa / Mastercard', type: 'card', logoType: 'card' },
    ],
  },
  BF: {
    countryCode: 'BF',
    countryName: 'Burkina Faso',
    currencyCode: 'XOF',
    currencySymbol: 'CFA',
    currencyName: 'West African CFA Franc',
    exchangeRate: 615.5,
    isAfricanRail: true,
    paymentMethods: [
      { id: 'orange_bf', name: 'Orange Money', type: 'mobile_money', logoType: 'orange' },
      { id: 'moov_bf', name: 'Moov Money', type: 'mobile_money', logoType: 'moov' },
      { id: 'card_bf', name: 'Visa / Mastercard', type: 'card', logoType: 'card' },
    ],
  },
  GLOBAL: {
    countryCode: 'US',
    countryName: 'International (Global)',
    currencyCode: 'USD',
    currencySymbol: '$',
    currencyName: 'US Dollar',
    exchangeRate: 1.0,
    isAfricanRail: false,
    paymentMethods: [
      { id: 'card_global', name: 'Credit & Debit Card', type: 'card', logoType: 'card', badgeText: 'VISA / MC / AMEX' },
      { id: 'apple_global', name: 'Apple Pay / Google Pay', type: 'card', logoType: 'apple_pay' },
      { id: 'crypto_global', name: 'Tether USDT (TRC-20 / ERC-20)', type: 'crypto', logoType: 'crypto', badgeText: 'USDT' },
    ],
  },
};

/**
 * Synchronous multi-level client detection:
 * 1. Saved user preference in localStorage
 * 2. Navigator languages (e.g. 'fr-CM', 'en-NG', 'fr-CI', 'en-GH')
 * 3. Browser TimeZone
 */
export function detectUserGeoCurrency(): GeoCurrencyConfig {
  if (typeof window === 'undefined') {
    return GEO_CURRENCY_REGISTRY.CM;
  }

  // 1. Saved preference
  try {
    const saved = localStorage.getItem('onh_user_country');
    if (saved && GEO_CURRENCY_REGISTRY[saved]) {
      return GEO_CURRENCY_REGISTRY[saved];
    }
  } catch {
    // ignore
  }

  // 2. Navigator locale detection (checks 'fr-CM', 'en-CM', 'en-NG', 'fr-CI', etc.)
  try {
    const langs = navigator.languages || [navigator.language];
    for (const lang of langs) {
      if (!lang) continue;
      const upper = lang.toUpperCase();
      if (upper.includes('CM') || upper.includes('CAMEROON')) return GEO_CURRENCY_REGISTRY.CM;
      if (upper.includes('CI') || upper.includes('IVORY')) return GEO_CURRENCY_REGISTRY.CI;
      if (upper.includes('SN') || upper.includes('SENEGAL')) return GEO_CURRENCY_REGISTRY.SN;
      if (upper.includes('NG') || upper.includes('NIGERIA')) return GEO_CURRENCY_REGISTRY.NG;
      if (upper.includes('GH') || upper.includes('GHANA')) return GEO_CURRENCY_REGISTRY.GH;
      if (upper.includes('KE') || upper.includes('KENYA')) return GEO_CURRENCY_REGISTRY.KE;
      if (upper.includes('RW') || upper.includes('RWANDA')) return GEO_CURRENCY_REGISTRY.RW;
      if (upper.includes('CD') || upper.includes('CONGO')) return GEO_CURRENCY_REGISTRY.CD;
      if (upper.includes('GA') || upper.includes('GABON')) return GEO_CURRENCY_REGISTRY.GA;
      if (upper.includes('BJ') || upper.includes('BENIN')) return GEO_CURRENCY_REGISTRY.BJ;
      if (upper.includes('BF') || upper.includes('BURKINA')) return GEO_CURRENCY_REGISTRY.BF;
    }
  } catch {
    // ignore
  }

  // 3. Timezone detection
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Douala') || tz.includes('Yaounde')) return GEO_CURRENCY_REGISTRY.CM;
    if (tz.includes('Abidjan')) return GEO_CURRENCY_REGISTRY.CI;
    if (tz.includes('Dakar')) return GEO_CURRENCY_REGISTRY.SN;
    if (tz.includes('Lagos')) return GEO_CURRENCY_REGISTRY.NG;
    if (tz.includes('Accra')) return GEO_CURRENCY_REGISTRY.GH;
    if (tz.includes('Nairobi')) return GEO_CURRENCY_REGISTRY.KE;
    if (tz.includes('Kigali')) return GEO_CURRENCY_REGISTRY.RW;
    if (tz.includes('Kinshasa') || tz.includes('Lubumbashi')) return GEO_CURRENCY_REGISTRY.CD;
    if (tz.includes('Libreville')) return GEO_CURRENCY_REGISTRY.GA;
    if (tz.includes('Porto-Novo') || tz.includes('Cotonou')) return GEO_CURRENCY_REGISTRY.BJ;
    if (tz.includes('Ouagadougou')) return GEO_CURRENCY_REGISTRY.BF;
    if (tz.includes('Niamey') || tz.includes('Bamako') || tz.includes('Lome')) return GEO_CURRENCY_REGISTRY.CI;
    if (tz.includes('Dar_es_Salaam') || tz.includes('Kampala')) return GEO_CURRENCY_REGISTRY.KE;
    if (tz.includes('Africa') || tz.includes('Brazzaville') || tz.includes('Ndjamena') || tz.includes('Bangui') || tz.includes('Malabo')) {
      return GEO_CURRENCY_REGISTRY.CM;
    }
  } catch {
    // ignore
  }

  // 4. Default: Cameroon / CEMAC (XAF)
  return GEO_CURRENCY_REGISTRY.CM;
}

/**
 * Dispatches a global event when currency or country is changed
 */
export function setUserCountry(countryCode: string) {
  if (typeof window === 'undefined') return;
  const config = GEO_CURRENCY_REGISTRY[countryCode] || GEO_CURRENCY_REGISTRY.GLOBAL;
  try {
    localStorage.setItem('onh_user_country', countryCode);
    localStorage.setItem('onh_user_currency', config.currencyCode);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent('onh_currency_change', { detail: config }));
}

/**
 * Asynchronous live IP-based geolocation lookup with local cache
 */
export async function fetchLiveIpGeo(): Promise<GeoCurrencyConfig | null> {
  if (typeof window === 'undefined') return null;

  try {
    // Check if already fetched this session
    const cached = sessionStorage.getItem('onh_ip_country');
    if (cached && GEO_CURRENCY_REGISTRY[cached]) {
      return GEO_CURRENCY_REGISTRY[cached];
    }

    // Try fast reliable IP geolocation services
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://api.country.is/', {
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeout);

    if (res && res.ok) {
      const data = await res.json();
      const country = data?.country?.toUpperCase();
      if (country && GEO_CURRENCY_REGISTRY[country]) {
        sessionStorage.setItem('onh_ip_country', country);
        return GEO_CURRENCY_REGISTRY[country];
      }
    }
  } catch {
    // fallback gracefully
  }
  return null;
}

/**
 * Reactive React Hook for automatic currency updates across components
 */
export function useGeoCurrency() {
  const [geoConfig, setGeoConfig] = useState<GeoCurrencyConfig>(() => detectUserGeoCurrency());

  useEffect(() => {
    // 1. Initial sync from synchronous detection
    const initial = detectUserGeoCurrency();
    setGeoConfig(initial);

    // 2. Fetch live IP geolocation in background if not manually chosen
    const hasManualChoice = typeof window !== 'undefined' && localStorage.getItem('onh_user_country');
    if (!hasManualChoice) {
      fetchLiveIpGeo().then((ipGeo) => {
        if (ipGeo) {
          setGeoConfig(ipGeo);
          setUserCountry(ipGeo.countryCode);
        }
      });
    }

    // 3. Listen to global currency change events
    const handleCurrencyChange = (e: Event) => {
      const customEvent = e as CustomEvent<GeoCurrencyConfig>;
      if (customEvent.detail) {
        setGeoConfig(customEvent.detail);
      }
    };

    window.addEventListener('onh_currency_change', handleCurrencyChange);
    return () => window.removeEventListener('onh_currency_change', handleCurrencyChange);
  }, []);

  return {
    geoConfig,
    setCountry: (code: string) => setUserCountry(code),
  };
}

/**
 * Format a USD price into the target currency
 */
export function formatLocalPrice(
  usdAmount: number,
  currencyCode: string = 'USD',
  registry: Record<string, GeoCurrencyConfig> = GEO_CURRENCY_REGISTRY
): string {
  if (currencyCode === 'USD') {
    return `$${usdAmount.toFixed(2)}`;
  }

  const matchingConfig = Object.values(registry).find((c) => c.currencyCode === currencyCode);
  if (!matchingConfig) {
    return `$${usdAmount.toFixed(2)}`;
  }

  const converted = Math.round(usdAmount * matchingConfig.exchangeRate);
  return `${converted.toLocaleString()} ${matchingConfig.currencyCode}`;
}
