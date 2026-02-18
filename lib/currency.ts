/**
 * Multi-Currency Ödeme Sistemi
 * 15 ülke para birimi desteği
 */

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // 1 TRY = rate
  locale: string;
}

export const currencyByLanguage: Record<string, Currency> = {
  // Türkiye - TRY (Base Currency)
  tr: {
    code: "TRY",
    symbol: "₺",
    name: "Türk Lirası",
    rate: 1,
    locale: "tr-TR",
  },

  // İngilizce - USD
  en: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rate: 0.033, // 1 TRY = 0.033 USD
    locale: "en-US",
  },

  // Arapça - SAR (Suudi Arabistan)
  ar: {
    code: "SAR",
    symbol: "﷼",
    name: "Saudi Riyal",
    rate: 0.125, // 1 TRY = 0.125 SAR
    locale: "ar-SA",
  },

  // Almanca - EUR
  de: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.030, // 1 TRY = 0.030 EUR
    locale: "de-DE",
  },

  // Fransızca - EUR
  fr: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.030,
    locale: "fr-FR",
  },

  // Portekizce - BRL (Brezilya)
  pt: {
    code: "BRL",
    symbol: "R$",
    name: "Brazilian Real",
    rate: 0.17, // 1 TRY = 0.17 BRL
    locale: "pt-BR",
  },

  // İspanyolca - EUR
  es: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.030,
    locale: "es-ES",
  },

  // Çince - CNY
  zh: {
    code: "CNY",
    symbol: "¥",
    name: "Chinese Yuan",
    rate: 0.23, // 1 TRY = 0.23 CNY
    locale: "zh-CN",
  },

  // Japonca - JPY
  ja: {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    rate: 3.5, // 1 TRY = 3.5 JPY
    locale: "ja-JP",
  },

  // Korece - KRW
  ko: {
    code: "KRW",
    symbol: "₩",
    name: "South Korean Won",
    rate: 43, // 1 TRY = 43 KRW
    locale: "ko-KR",
  },

  // Rusça - RUB
  ru: {
    code: "RUB",
    symbol: "₽",
    name: "Russian Ruble",
    rate: 3.2, // 1 TRY = 3.2 RUB
    locale: "ru-RU",
  },

  // Hindice - INR
  hi: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    rate: 2.7, // 1 TRY = 2.7 INR
    locale: "hi-IN",
  },

  // İtalyanca - EUR
  it: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.030,
    locale: "it-IT",
  },

  // Hollandaca - EUR
  nl: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.030,
    locale: "nl-NL",
  },

  // İsveçce - SEK
  sv: {
    code: "SEK",
    symbol: "kr",
    name: "Swedish Krona",
    rate: 0.35, // 1 TRY = 0.35 SEK
    locale: "sv-SE",
  },
};

/**
 * Belirli bir dil için para birimini döndür
 * Eğer dil bulunamazsa USD döndür (default)
 */
export function getCurrencyByLanguage(languageCode: string): Currency {
  return currencyByLanguage[languageCode] || currencyByLanguage["en"];
}

/**
 * TRY'den belirli bir para birimine dönüştür
 */
export function convertFromTRY(amountInTRY: number, languageCode: string): number {
  const currency = getCurrencyByLanguage(languageCode);
  return amountInTRY * currency.rate;
}

/**
 * Fiyatı yerel para biriminde formatla
 */
export function formatPriceInLocalCurrency(
  priceInTRY: number,
  languageCode: string
): string {
  const currency = getCurrencyByLanguage(languageCode);
  const localPrice = convertFromTRY(priceInTRY, languageCode);

  // Para birimini formatla (locale'e göre)
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
    }).format(localPrice);
  } catch {
    // Fallback: basit format
    return `${currency.symbol}${localPrice.toFixed(2)}`;
  }
}

/**
 * Abonelik fiyatlandırması
 */
export const subscriptionPrices = {
  premiumMonthly: 49, // TRY
  premiumYearly: 399, // TRY
  premiumPlus: 99, // TRY
};

/**
 * Abonelik fiyatlarını belirli bir dil için döndür
 */
export function getSubscriptionPrices(languageCode: string) {
  return {
    premiumMonthly: formatPriceInLocalCurrency(
      subscriptionPrices.premiumMonthly,
      languageCode
    ),
    premiumYearly: formatPriceInLocalCurrency(
      subscriptionPrices.premiumYearly,
      languageCode
    ),
    premiumPlus: formatPriceInLocalCurrency(
      subscriptionPrices.premiumPlus,
      languageCode
    ),
  };
}

/**
 * Stripe için para birimi kodu döndür
 */
export function getStripeCurrencyCode(languageCode: string): string {
  const currency = getCurrencyByLanguage(languageCode);
  return currency.code.toLowerCase();
}

/**
 * Apple In-App Purchase için para birimi kodu döndür
 */
export function getAppleIAPCurrencyCode(languageCode: string): string {
  const currency = getCurrencyByLanguage(languageCode);
  return currency.code;
}

/**
 * Google Play Billing için para birimi kodu döndür
 */
export function getGooglePlayCurrencyCode(languageCode: string): string {
  const currency = getCurrencyByLanguage(languageCode);
  return currency.code;
}

/**
 * Tüm desteklenen para birimlerini döndür
 */
export function getAllCurrencies(): Currency[] {
  return Object.values(currencyByLanguage);
}

/**
 * Para birimi bilgisini döndür
 */
export function getCurrencyInfo(languageCode: string) {
  const currency = getCurrencyByLanguage(languageCode);
  return {
    code: currency.code,
    symbol: currency.symbol,
    name: currency.name,
    locale: currency.locale,
  };
}
