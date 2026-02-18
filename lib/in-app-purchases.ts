/**
 * Apple Pay ve Google Play Billing Entegrasyonu
 * Multi-Currency Ödeme Sistemi
 */

import { subscriptionPrices, getCurrencyByLanguage } from "./currency";

export type SubscriptionPackage = "plusMonthly" | "plusYearly" | "pro";

export interface SubscriptionProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: "monthly" | "yearly" | "lifetime";
}

export interface PurchaseResult {
  success: boolean;
  transactionId?: string;
  packageType?: SubscriptionPackage;
  error?: string;
}

export interface SubscriptionStatus {
  isActive: boolean;
  packageType?: SubscriptionPackage;
  expiryDate?: Date;
  autoRenew: boolean;
  transactionId?: string;
}

/**
 * Apple Pay ve Google Play Billing için ürün ID'lerini döndür
 */
export const productIds = {
  // Plus (Monthly)
  plusMonthly: {
    apple: "com.babysteps.plus.monthly",
    google: "plus_monthly",
  },
  // Plus (Yearly)
  plusYearly: {
    apple: "com.babysteps.plus.yearly",
    google: "plus_yearly",
  },
  // Pro
  pro: {
    apple: "com.babysteps.pro",
    google: "pro",
  },
};

/**
 * Abonelik ürünlerini döndür (15 ülke para birimi ile)
 */
export function getSubscriptionProducts(languageCode: string): SubscriptionProduct[] {
  const currency = getCurrencyByLanguage(languageCode);
  const isUSD = currency.code === "USD";

  return [
    {
      id: productIds.plusMonthly.apple,
      name: "Plus (Monthly)",
      description: "Aylık Plus aboneliği - Sınırsız fotoğraf, AI asistanı, gelişmiş raporlar",
      price: isUSD ? subscriptionPrices.plusMonthly.USD : subscriptionPrices.plusMonthly.TRY,
      currency: currency.code,
      type: "monthly",
    },
    {
      id: productIds.plusYearly.apple,
      name: "Plus (Yearly)",
      description: "Yıllık Plus aboneliği - 2 ay indirim ile",
      price: isUSD ? subscriptionPrices.plusYearly.USD : subscriptionPrices.plusYearly.TRY,
      currency: currency.code,
      type: "yearly",
    },
    {
      id: productIds.pro.apple,
      name: "Pro",
      description: "Pro aboneliği - Uzman danışmanlar, video konsültasyon, özel raporlar",
      price: isUSD ? subscriptionPrices.pro.USD : subscriptionPrices.pro.TRY,
      currency: currency.code,
      type: "lifetime",
    },
  ];
}

/**
 * Apple Pay ile ödeme yap
 */
export async function purchaseWithApplePay(
  packageType: SubscriptionPackage,
  languageCode: string
): Promise<PurchaseResult> {
  try {
    // Apple Pay entegrasyonu (react-native-iap kullanılacak)
    // Bu, gerçek implementasyonda SKPaymentQueue kullanılır
    
    const productId = productIds[packageType].apple;
    const currency = getCurrencyByLanguage(languageCode);
    
    // Simülasyon: Başarılı ödeme
    return {
      success: true,
      transactionId: `apple_${Date.now()}`,
      packageType,
    };
  } catch (error) {
    return {
      success: false,
      error: `Apple Pay hatası: ${error}`,
    };
  }
}

/**
 * Google Play Billing ile ödeme yap
 */
export async function purchaseWithGooglePlay(
  packageType: SubscriptionPackage,
  languageCode: string
): Promise<PurchaseResult> {
  try {
    // Google Play Billing entegrasyonu (react-native-iap kullanılacak)
    // Bu, gerçek implementasyonda BillingClient kullanılır
    
    const productId = productIds[packageType].google;
    const currency = getCurrencyByLanguage(languageCode);
    
    // Simülasyon: Başarılı ödeme
    return {
      success: true,
      transactionId: `google_${Date.now()}`,
      packageType,
    };
  } catch (error) {
    return {
      success: false,
      error: `Google Play Billing hatası: ${error}`,
    };
  }
}

/**
 * Abonelik durumunu kontrol et
 */
export async function checkSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  try {
    // Backend'den abonelik durumunu al
    // Bu, gerçek implementasyonda API çağrısı yapılır
    
    return {
      isActive: false,
      autoRenew: false,
    };
  } catch (error) {
    return {
      isActive: false,
      autoRenew: false,
    };
  }
}

/**
 * Aboneliği iptal et
 */
export async function cancelSubscription(userId: string): Promise<boolean> {
  try {
    // Backend'de aboneliği iptal et
    // Bu, gerçek implementasyonda API çağrısı yapılır
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Aboneliği yenile
 */
export async function renewSubscription(userId: string): Promise<boolean> {
  try {
    // Backend'de aboneliği yenile
    // Bu, gerçek implementasyonda API çağrısı yapılır
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Ödeme geçmişini al
 */
export async function getPaymentHistory(userId: string) {
  try {
    // Backend'den ödeme geçmişini al
    // Bu, gerçek implementasyonda API çağrısı yapılır
    
    return [];
  } catch (error) {
    return [];
  }
}

/**
 * Ödeme yöntemini güncelle
 */
export async function updatePaymentMethod(userId: string, paymentMethodId: string): Promise<boolean> {
  try {
    // Backend'de ödeme yöntemini güncelle
    // Bu, gerçek implementasyonda API çağrısı yapılır
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Geri ödeme talep et
 */
export async function requestRefund(transactionId: string, reason: string): Promise<boolean> {
  try {
    // Backend'de geri ödeme talep et
    // Bu, gerçek implementasyonda API çağrısı yapılır
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Abonelik paketinin açıklamasını döndür
 */
export function getPackageDescription(packageType: SubscriptionPackage): string {
  const descriptions: Record<SubscriptionPackage, string> = {
    plusMonthly: "Aylık Plus Aboneliği - Sınırsız fotoğraf, AI asistanı, gelişmiş raporlar",
    plusYearly: "Yıllık Plus Aboneliği - 2 ay indirim ile Plus özelliklerinin tamamı",
    pro: "Pro Aboneliği - Uzman danışmanlar, video konsültasyon, özel raporlar ve premium destek",
  };
  return descriptions[packageType];
}

/**
 * Abonelik paketinin avantajlarını döndür
 */
export function getPackageBenefits(packageType: SubscriptionPackage): string[] {
  const benefits: Record<SubscriptionPackage, string[]> = {
    plusMonthly: [
      "Sınırsız fotoğraf yükleme",
      "AI asistanı (sınırsız sorular)",
      "Gelişmiş PDF raporları",
      "Cloud backup",
      "Aile paylaşımı",
      "Reklamsız deneyim",
    ],
    plusYearly: [
      "Sınırsız fotoğraf yükleme",
      "AI asistanı (sınırsız sorular)",
      "Gelişmiş PDF raporları",
      "Cloud backup",
      "Aile paylaşımı",
      "Reklamsız deneyim",
      "2 ay indirim",
    ],
    pro: [
      "Plus'ın tüm özellikleri",
      "Uzman danışmanlar (Pediatrist, Beslenme, Gelişim)",
      "Video konsültasyon",
      "Özel raporlar",
      "Öncelikli destek",
      "Özel içerik ve rehberler",
    ],
  };
  return benefits[packageType];
}
