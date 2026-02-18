/**
 * Multi-Currency Ödeme Sistemi
 * 15 ülke para birimi desteği
 * 
 * Fiyatlandırma:
 * Plus (Monthly): ₺69 / $4.99
 * Plus (Yearly): ₺599 / $49
 * Pro: ₺119 / $7.99
 */

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // 1 USD = rate
  locale: string;
}

export const currencyByLanguage: Record<string, Currency> = {
  // Türkiye - TRY
  tr: {
    code: "TRY",
    symbol: "₺",
    name: "Türk Lirası",
    rate: 13.8, // 1 USD = 13.8 TRY
    locale: "tr-TR",
  },

  // İngilizce - USD (Base Currency)
  en: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rate: 1,
    locale: "en-US",
  },

  // Arapça - SAR (Suudi Arabistan)
  ar: {
    code: "SAR",
    symbol: "﷼",
    name: "Saudi Riyal",
    rate: 3.75, // 1 USD = 3.75 SAR
    locale: "ar-SA",
  },

  // Almanca - EUR
  de: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.92, // 1 USD = 0.92 EUR
    locale: "de-DE",
  },

  // Fransızca - EUR
  fr: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.92,
    locale: "fr-FR",
  },

  // Portekizce - BRL (Brezilya)
  pt: {
    code: "BRL",
    symbol: "R$",
    name: "Brazilian Real",
    rate: 5.15, // 1 USD = 5.15 BRL
    locale: "pt-BR",
  },

  // İspanyolca - EUR
  es: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.92,
    locale: "es-ES",
  },

  // Çince - CNY
  zh: {
    code: "CNY",
    symbol: "¥",
    name: "Chinese Yuan",
    rate: 7.0, // 1 USD = 7.0 CNY
    locale: "zh-CN",
  },

  // Japonca - JPY
  ja: {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    rate: 106.5, // 1 USD = 106.5 JPY
    locale: "ja-JP",
  },

  // Korece - KRW
  ko: {
    code: "KRW",
    symbol: "₩",
    name: "South Korean Won",
    rate: 1300, // 1 USD = 1300 KRW
    locale: "ko-KR",
  },

  // Rusça - RUB
  ru: {
    code: "RUB",
    symbol: "₽",
    name: "Russian Ruble",
    rate: 97.5, // 1 USD = 97.5 RUB
    locale: "ru-RU",
  },

  // Hindice - INR
  hi: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    rate: 82.5, // 1 USD = 82.5 INR
    locale: "hi-IN",
  },

  // İtalyanca - EUR
  it: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.92,
    locale: "it-IT",
  },

  // Hollandaca - EUR
  nl: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.92,
    locale: "nl-NL",
  },

  // İsveçce - SEK
  sv: {
    code: "SEK",
    symbol: "kr",
    name: "Swedish Krona",
    rate: 10.5, // 1 USD = 10.5 SEK
    locale: "sv-SE",
  },
};

/**
 * Abonelik Paketleri ve Fiyatlandırması
 * 
 * Plus (Monthly): ₺69 / $4.99
 * Plus (Yearly): ₺599 / $49
 * Pro: ₺119 / $7.99
 */
export const subscriptionPrices = {
  // Plus (Monthly)
  plusMonthly: {
    TRY: 69,
    USD: 4.99,
  },
  // Plus (Yearly)
  plusYearly: {
    TRY: 599,
    USD: 49,
  },
  // Pro
  pro: {
    TRY: 119,
    USD: 7.99,
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
 * USD'den belirli bir para birimine dönüştür
 */
export function convertFromUSD(amountInUSD: number, languageCode: string): number {
  const currency = getCurrencyByLanguage(languageCode);
  return amountInUSD * currency.rate;
}

/**
 * Fiyatı yerel para biriminde formatla
 */
export function formatPriceInLocalCurrency(
  priceInUSD: number,
  languageCode: string
): string {
  const currency = getCurrencyByLanguage(languageCode);
  const localPrice = convertFromUSD(priceInUSD, languageCode);

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
 * Abonelik fiyatlarını belirli bir dil için döndür
 */
export function getSubscriptionPrices(languageCode: string) {
  const currency = getCurrencyByLanguage(languageCode);
  
  // Türkçe için TRY fiyatları, diğerleri için USD'den dönüştür
  if (languageCode === "tr") {
    return {
      plusMonthly: `${currency.symbol}${subscriptionPrices.plusMonthly.TRY}`,
      plusYearly: `${currency.symbol}${subscriptionPrices.plusYearly.TRY}`,
      pro: `${currency.symbol}${subscriptionPrices.pro.TRY}`,
    };
  }

  return {
    plusMonthly: formatPriceInLocalCurrency(subscriptionPrices.plusMonthly.USD, languageCode),
    plusYearly: formatPriceInLocalCurrency(subscriptionPrices.plusYearly.USD, languageCode),
    pro: formatPriceInLocalCurrency(subscriptionPrices.pro.USD, languageCode),
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

/**
 * Abonelik paketinin USD fiyatını döndür
 */
export function getSubscriptionPriceInUSD(packageType: "plusMonthly" | "plusYearly" | "pro"): number {
  return subscriptionPrices[packageType].USD;
}

/**
 * Abonelik paketinin TRY fiyatını döndür
 */
export function getSubscriptionPriceInTRY(packageType: "plusMonthly" | "plusYearly" | "pro"): number {
  return subscriptionPrices[packageType].TRY;
}
