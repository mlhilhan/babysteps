import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * In-App Purchase Service
 * Handles Apple In-App Purchase and Google Play Billing
 */

interface Product {
  productId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  type: "subscription" | "consumable";
  subscriptionPeriod?: "monthly" | "yearly";
}

interface Purchase {
  productId: string;
  purchaseToken: string;
  purchaseDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  platform: "ios" | "android";
}

interface SubscriptionStatus {
  isSubscribed: boolean;
  subscriptionLevel: "free" | "premium" | "premium_plus";
  currentPlan?: string;
  expiryDate?: Date;
  autoRenew: boolean;
  platform: "ios" | "android" | "none";
}

// Product IDs (Placeholder - Replace with real IDs)
export const PRODUCTS: Record<string, Product> = {
  // iOS Product IDs
  PREMIUM_MONTHLY_IOS: {
    productId: "com.babysteps.premium.monthly.ios",
    title: "Premium Aylık",
    description: "Sınırsız özellikler - Aylık",
    price: "₺49.99",
    currency: "TRY",
    type: "subscription",
    subscriptionPeriod: "monthly",
  },
  PREMIUM_YEARLY_IOS: {
    productId: "com.babysteps.premium.yearly.ios",
    title: "Premium Yıllık",
    description: "Sınırsız özellikler - Yıllık (2 ay indirim)",
    price: "₺399.99",
    currency: "TRY",
    type: "subscription",
    subscriptionPeriod: "yearly",
  },
  PREMIUM_PLUS_MONTHLY_IOS: {
    productId: "com.babysteps.premium_plus.monthly.ios",
    title: "Premium Plus Aylık",
    description: "Uzman danışmanlar - Aylık",
    price: "₺99.99",
    currency: "TRY",
    type: "subscription",
    subscriptionPeriod: "monthly",
  },

  // Android Product IDs
  PREMIUM_MONTHLY_ANDROID: {
    productId: "com.babysteps.premium.monthly.android",
    title: "Premium Aylık",
    description: "Sınırsız özellikler - Aylık",
    price: "₺49.99",
    currency: "TRY",
    type: "subscription",
    subscriptionPeriod: "monthly",
  },
  PREMIUM_YEARLY_ANDROID: {
    productId: "com.babysteps.premium.yearly.android",
    title: "Premium Yıllık",
    description: "Sınırsız özellikler - Yıllık (2 ay indirim)",
    price: "₺399.99",
    currency: "TRY",
    type: "subscription",
    subscriptionPeriod: "yearly",
  },
  PREMIUM_PLUS_MONTHLY_ANDROID: {
    productId: "com.babysteps.premium_plus.monthly.android",
    title: "Premium Plus Aylık",
    description: "Uzman danışmanlar - Aylık",
    price: "₺99.99",
    currency: "TRY",
    type: "subscription",
    subscriptionPeriod: "monthly",
  },
};

/**
 * Initialize In-App Purchase
 * Call this on app startup
 */
export async function initializeIAP(): Promise<void> {
  try {
    // This would initialize the IAP library
    // For now, we'll just check for existing purchases
    await checkSubscriptionStatus();
  } catch (error) {
    console.error("Error initializing IAP:", error);
  }
}

/**
 * Get available products
 */
export async function getAvailableProducts(): Promise<Product[]> {
  try {
    // This would fetch products from App Store / Play Store
    // For now, return mock products
    return Object.values(PRODUCTS);
  } catch (error) {
    console.error("Error getting available products:", error);
    return [];
  }
}

/**
 * Purchase product
 */
export async function purchaseProduct(productId: string): Promise<boolean> {
  try {
    // This would handle the actual purchase flow
    // Platform-specific logic for iOS (StoreKit2) and Android (Google Play Billing)

    // Mock purchase
    const purchase: Purchase = {
      productId,
      purchaseToken: `token_${Date.now()}`,
      purchaseDate: new Date(),
      isActive: true,
      platform: "ios", // Would be detected at runtime
    };

    // Set expiry date based on product type
    if (productId.includes("monthly")) {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      purchase.expiryDate = expiryDate;
    } else if (productId.includes("yearly")) {
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      purchase.expiryDate = expiryDate;
    }

    // Save purchase
    await savePurchase(purchase);

    // Update subscription status
    await updateSubscriptionStatus();

    return true;
  } catch (error) {
    console.error("Error purchasing product:", error);
    return false;
  }
}

/**
 * Restore purchases
 */
export async function restorePurchases(): Promise<Purchase[]> {
  try {
    // This would restore purchases from App Store / Play Store
    // For now, return empty array
    return [];
  } catch (error) {
    console.error("Error restoring purchases:", error);
    return [];
  }
}

/**
 * Check subscription status
 */
export async function checkSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    const purchase = await getActivePurchase();

    if (!purchase) {
      return {
        isSubscribed: false,
        subscriptionLevel: "free",
        autoRenew: false,
        platform: "none",
      };
    }

    // Determine subscription level based on product ID
    let subscriptionLevel: "free" | "premium" | "premium_plus" = "free";
    if (purchase.productId.includes("premium_plus")) {
      subscriptionLevel = "premium_plus";
    } else if (purchase.productId.includes("premium")) {
      subscriptionLevel = "premium";
    }

    return {
      isSubscribed: purchase.isActive,
      subscriptionLevel,
      currentPlan: purchase.productId,
      expiryDate: purchase.expiryDate,
      autoRenew: true,
      platform: purchase.platform,
    };
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return {
      isSubscribed: false,
      subscriptionLevel: "free",
      autoRenew: false,
      platform: "none",
    };
  }
}

/**
 * Get active purchase
 */
export async function getActivePurchase(): Promise<Purchase | null> {
  try {
    const purchase = await AsyncStorage.getItem("active_purchase");
    if (!purchase) {
      return null;
    }

    const parsed = JSON.parse(purchase);

    // Check if subscription is still active
    if (parsed.expiryDate) {
      const expiryDate = new Date(parsed.expiryDate);
      if (expiryDate < new Date()) {
        // Subscription expired
        return null;
      }
    }

    return parsed;
  } catch (error) {
    console.error("Error getting active purchase:", error);
    return null;
  }
}

/**
 * Save purchase
 */
async function savePurchase(purchase: Purchase): Promise<void> {
  try {
    await AsyncStorage.setItem("active_purchase", JSON.stringify(purchase));
  } catch (error) {
    console.error("Error saving purchase:", error);
  }
}

/**
 * Update subscription status
 */
async function updateSubscriptionStatus(): Promise<void> {
  try {
    const status = await checkSubscriptionStatus();
    await AsyncStorage.setItem("subscription_status", JSON.stringify(status));
  } catch (error) {
    console.error("Error updating subscription status:", error);
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(): Promise<boolean> {
  try {
    // This would handle cancellation via App Store / Play Store
    await AsyncStorage.removeItem("active_purchase");
    await updateSubscriptionStatus();
    return true;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return false;
  }
}

/**
 * Get subscription details
 */
export async function getSubscriptionDetails(): Promise<{
  planName: string;
  price: string;
  currency: string;
  period: string;
  expiryDate?: Date;
  autoRenew: boolean;
} | null> {
  try {
    const purchase = await getActivePurchase();
    if (!purchase) {
      return null;
    }

    const product = PRODUCTS[purchase.productId];
    if (!product) {
      return null;
    }

    return {
      planName: product.title,
      price: product.price,
      currency: product.currency,
      period: product.subscriptionPeriod || "monthly",
      expiryDate: purchase.expiryDate,
      autoRenew: true,
    };
  } catch (error) {
    console.error("Error getting subscription details:", error);
    return null;
  }
}

/**
 * Handle purchase error
 */
export function handlePurchaseError(error: any): string {
  if (error.code === "E_PURCHASE_CANCELLED") {
    return "Satın alma iptal edildi";
  } else if (error.code === "E_PURCHASE_FAILED") {
    return "Satın alma başarısız oldu";
  } else if (error.code === "E_PURCHASE_INVALID") {
    return "Geçersiz satın alma";
  } else {
    return "Satın alma sırasında bir hata oluştu";
  }
}
