import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Google AdMob Service
 * Handles ad display based on subscription level
 */

interface AdConfig {
  bannerAdUnitId: string;
  interstitialAdUnitId: string;
  rewardedAdUnitId: string;
  enabled: boolean;
}

interface AdImpressions {
  totalImpressions: number;
  bannerImpressions: number;
  interstitialImpressions: number;
  rewardedImpressions: number;
  lastImpressionDate: Date;
  totalRevenue: number;
}

// AdMob Ad Unit IDs (Placeholder - Replace with real IDs)
const AD_CONFIG: AdConfig = {
  bannerAdUnitId: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx", // Banner Ad Unit ID
  interstitialAdUnitId: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx", // Interstitial Ad Unit ID
  rewardedAdUnitId: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx", // Rewarded Ad Unit ID
  enabled: true,
};

/**
 * Check if ads should be shown based on subscription
 */
export function shouldShowAds(subscriptionLevel: "free" | "premium" | "premium_plus"): boolean {
  return subscriptionLevel === "free";
}

/**
 * Get banner ad unit ID
 */
export function getBannerAdUnitId(): string {
  return AD_CONFIG.bannerAdUnitId;
}

/**
 * Get interstitial ad unit ID
 */
export function getInterstitialAdUnitId(): string {
  return AD_CONFIG.interstitialAdUnitId;
}

/**
 * Get rewarded ad unit ID
 */
export function getRewardedAdUnitId(): string {
  return AD_CONFIG.rewardedAdUnitId;
}

/**
 * Track ad impression
 */
export async function trackAdImpression(
  type: "banner" | "interstitial" | "rewarded",
  revenue: number = 0
): Promise<void> {
  try {
    const impressions = await getAdImpressions();

    impressions.totalImpressions++;
    impressions.lastImpressionDate = new Date();
    impressions.totalRevenue += revenue;

    if (type === "banner") {
      impressions.bannerImpressions++;
    } else if (type === "interstitial") {
      impressions.interstitialImpressions++;
    } else if (type === "rewarded") {
      impressions.rewardedImpressions++;
    }

    await AsyncStorage.setItem("ad_impressions", JSON.stringify(impressions));
  } catch (error) {
    console.error("Error tracking ad impression:", error);
  }
}

/**
 * Get ad impressions
 */
export async function getAdImpressions(): Promise<AdImpressions> {
  try {
    const impressions = await AsyncStorage.getItem("ad_impressions");
    if (!impressions) {
      return {
        totalImpressions: 0,
        bannerImpressions: 0,
        interstitialImpressions: 0,
        rewardedImpressions: 0,
        lastImpressionDate: new Date(),
        totalRevenue: 0,
      };
    }
    return JSON.parse(impressions);
  } catch (error) {
    console.error("Error getting ad impressions:", error);
    return {
      totalImpressions: 0,
      bannerImpressions: 0,
      interstitialImpressions: 0,
      rewardedImpressions: 0,
      lastImpressionDate: new Date(),
      totalRevenue: 0,
    };
  }
}

/**
 * Handle rewarded ad completion
 * Returns XP bonus for free users
 */
export function getRewardedAdBonus(type: "daily_task" | "achievement" | "community"): number {
  const bonuses = {
    daily_task: 10, // 10 XP bonus
    achievement: 25, // 25 XP bonus
    community: 15, // 15 XP bonus
  };

  return bonuses[type] || 10;
}

/**
 * Check if user should see interstitial ad
 * Show every 5 app opens
 */
export async function shouldShowInterstitialAd(): Promise<boolean> {
  try {
    const appOpens = await AsyncStorage.getItem("app_opens");
    const opens = parseInt(appOpens || "0") + 1;

    await AsyncStorage.setItem("app_opens", opens.toString());

    return opens % 5 === 0;
  } catch (error) {
    console.error("Error checking interstitial ad:", error);
    return false;
  }
}

/**
 * Reset app opens counter
 */
export async function resetAppOpensCounter(): Promise<void> {
  try {
    await AsyncStorage.setItem("app_opens", "0");
  } catch (error) {
    console.error("Error resetting app opens counter:", error);
  }
}

/**
 * Get ad analytics
 */
export async function getAdAnalytics(): Promise<{
  totalImpressions: number;
  totalRevenue: number;
  averageRevenuePerImpression: number;
  lastImpressionDate: Date;
}> {
  try {
    const impressions = await getAdImpressions();

    return {
      totalImpressions: impressions.totalImpressions,
      totalRevenue: impressions.totalRevenue,
      averageRevenuePerImpression:
        impressions.totalImpressions > 0
          ? impressions.totalRevenue / impressions.totalImpressions
          : 0,
      lastImpressionDate: impressions.lastImpressionDate,
    };
  } catch (error) {
    console.error("Error getting ad analytics:", error);
    return {
      totalImpressions: 0,
      totalRevenue: 0,
      averageRevenuePerImpression: 0,
      lastImpressionDate: new Date(),
    };
  }
}

/**
 * Ad placement recommendations
 * Where to show ads in the app
 */
export const AD_PLACEMENTS = {
  DASHBOARD_BOTTOM: "dashboard_bottom", // Bottom of dashboard
  GROWTH_TRACKING_BOTTOM: "growth_tracking_bottom", // Bottom of growth tracking
  VACCINATION_BOTTOM: "vaccination_bottom", // Bottom of vaccination
  NUTRITION_BOTTOM: "nutrition_bottom", // Bottom of nutrition
  SLEEP_BOTTOM: "sleep_bottom", // Bottom of sleep
  HEALTH_BOTTOM: "health_bottom", // Bottom of health
  ACHIEVEMENTS_BOTTOM: "achievements_bottom", // Bottom of achievements
  DAILY_TASKS_BOTTOM: "daily_tasks_bottom", // Bottom of daily tasks
  COMMUNITY_BOTTOM: "community_bottom", // Bottom of community
  SETTINGS_BOTTOM: "settings_bottom", // Bottom of settings
};

/**
 * Native ad formats (for future implementation)
 */
export const NATIVE_AD_TEMPLATES = {
  SMALL: "small", // 200x200
  MEDIUM: "medium", // 300x250
  LARGE: "large", // 320x480
};
