import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Smart Notification Service
 * Handles intelligent notifications based on child's schedule, preferences, and context
 */

interface NotificationPreference {
  category: "vaccination" | "growth" | "nutrition" | "sleep" | "health" | "milestone" | "reminder";
  enabled: boolean;
  time?: string; // HH:MM format
  daysOfWeek?: number[]; // 0-6, 0=Sunday
  frequency: "daily" | "weekly" | "monthly" | "once";
}

interface SmartNotificationConfig {
  childId: number;
  sleepSchedule: {
    bedtime: string; // HH:MM
    wakeupTime: string; // HH:MM
  };
  preferences: NotificationPreference[];
  quietHours: {
    start: string; // HH:MM
    end: string; // HH:MM
  };
  enabled: boolean;
}

const DEFAULT_CONFIG: SmartNotificationConfig = {
  childId: 0,
  sleepSchedule: {
    bedtime: "21:00",
    wakeupTime: "08:00",
  },
  preferences: [
    {
      category: "vaccination",
      enabled: true,
      time: "10:00",
      frequency: "once",
    },
    {
      category: "growth",
      enabled: true,
      time: "09:00",
      daysOfWeek: [1], // Monday
      frequency: "weekly",
    },
    {
      category: "nutrition",
      enabled: true,
      frequency: "daily",
    },
    {
      category: "sleep",
      enabled: true,
      frequency: "daily",
    },
    {
      category: "health",
      enabled: true,
      frequency: "daily",
    },
    {
      category: "milestone",
      enabled: true,
      frequency: "monthly",
    },
  ],
  quietHours: {
    start: "22:00",
    end: "08:00",
  },
  enabled: true,
};

/**
 * Initialize smart notifications
 */
export async function initializeSmartNotifications(childId: number): Promise<void> {
  try {
    const config = await AsyncStorage.getItem(`notification_config_${childId}`);
    if (!config) {
      const defaultConfig = { ...DEFAULT_CONFIG, childId };
      await AsyncStorage.setItem(
        `notification_config_${childId}`,
        JSON.stringify(defaultConfig)
      );
    }
  } catch (error) {
    console.error("Error initializing smart notifications:", error);
  }
}

/**
 * Check if current time is within quiet hours
 */
function isQuietHours(config: SmartNotificationConfig): boolean {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const [startHour, startMin] = config.quietHours.start.split(":").map(Number);
  const [endHour, endMin] = config.quietHours.end.split(":").map(Number);
  const [currentHour, currentMin] = currentTime.split(":").map(Number);

  const startTotalMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;
  const currentTotalMin = currentHour * 60 + currentMin;

  if (startTotalMin > endTotalMin) {
    // Quiet hours span midnight
    return currentTotalMin >= startTotalMin || currentTotalMin < endTotalMin;
  } else {
    return currentTotalMin >= startTotalMin && currentTotalMin < endTotalMin;
  }
}

/**
 * Check if child is likely sleeping
 */
function isChildSleeping(config: SmartNotificationConfig): boolean {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const [bedHour, bedMin] = config.sleepSchedule.bedtime.split(":").map(Number);
  const [wakeHour, wakeMin] = config.sleepSchedule.wakeupTime.split(":").map(Number);
  const [currentHour, currentMin] = currentTime.split(":").map(Number);

  const bedTotalMin = bedHour * 60 + bedMin;
  const wakeTotalMin = wakeHour * 60 + wakeMin;
  const currentTotalMin = currentHour * 60 + currentMin;

  if (bedTotalMin > wakeTotalMin) {
    // Sleep spans midnight
    return currentTotalMin >= bedTotalMin || currentTotalMin < wakeTotalMin;
  } else {
    return currentTotalMin >= bedTotalMin && currentTotalMin < wakeTotalMin;
  }
}

/**
 * Send smart notification
 */
export async function sendSmartNotification(
  childId: number,
  category: NotificationPreference["category"],
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<boolean> {
  try {
    const config = await AsyncStorage.getItem(`notification_config_${childId}`);
    if (!config) return false;

    const notificationConfig: SmartNotificationConfig = JSON.parse(config);

    // Check if notifications are enabled
    if (!notificationConfig.enabled) return false;

    // Check if category is enabled
    const preference = notificationConfig.preferences.find((p) => p.category === category);
    if (!preference || !preference.enabled) return false;

    // Check quiet hours
    if (isQuietHours(notificationConfig)) {
      console.log("Notification suppressed: quiet hours active");
      return false;
    }

    // Check if child is sleeping
    if (isChildSleeping(notificationConfig)) {
      console.log("Notification suppressed: child is sleeping");
      return false;
    }

    // Send notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: "default",
        badge: 1,
      },
      trigger: null, // Send immediately
    });

    return true;
  } catch (error) {
    console.error("Error sending smart notification:", error);
    return false;
  }
}

/**
 * Schedule recurring notification
 */
export async function scheduleRecurringNotification(
  childId: number,
  category: NotificationPreference["category"],
  title: string,
  body: string,
  time: string,
  daysOfWeek?: number[]
): Promise<string | null> {
  try {
    const [hour, minute] = time.split(":").map(Number);

    let notificationId: string | null = null;

    if (daysOfWeek && daysOfWeek.length > 0) {
      // Weekly notifications
      for (const dayOfWeek of daysOfWeek) {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: { category, childId },
          },
          trigger: {
            type: "weekly",
            weekday: dayOfWeek,
            hour,
            minute,
          } as any,
        });
        notificationId = id;
      }
    } else {
      // Daily notification
      notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { category, childId },
        },
        trigger: {
          type: "daily",
          hour,
          minute,
        } as any,
      });
    }

    return notificationId;
  } catch (error) {
    console.error("Error scheduling recurring notification:", error);
    return null;
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  childId: number,
  preferences: NotificationPreference[]
): Promise<void> {
  try {
    const config = await AsyncStorage.getItem(`notification_config_${childId}`);
    const notificationConfig: SmartNotificationConfig = config
      ? JSON.parse(config)
      : { ...DEFAULT_CONFIG, childId };

    notificationConfig.preferences = preferences;
    await AsyncStorage.setItem(
      `notification_config_${childId}`,
      JSON.stringify(notificationConfig)
    );
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    throw error;
  }
}

/**
 * Update sleep schedule
 */
export async function updateSleepSchedule(
  childId: number,
  bedtime: string,
  wakeupTime: string
): Promise<void> {
  try {
    const config = await AsyncStorage.getItem(`notification_config_${childId}`);
    const notificationConfig: SmartNotificationConfig = config
      ? JSON.parse(config)
      : { ...DEFAULT_CONFIG, childId };

    notificationConfig.sleepSchedule = { bedtime, wakeupTime };
    await AsyncStorage.setItem(
      `notification_config_${childId}`,
      JSON.stringify(notificationConfig)
    );
  } catch (error) {
    console.error("Error updating sleep schedule:", error);
    throw error;
  }
}

/**
 * Update quiet hours
 */
export async function updateQuietHours(
  childId: number,
  start: string,
  end: string
): Promise<void> {
  try {
    const config = await AsyncStorage.getItem(`notification_config_${childId}`);
    const notificationConfig: SmartNotificationConfig = config
      ? JSON.parse(config)
      : { ...DEFAULT_CONFIG, childId };

    notificationConfig.quietHours = { start, end };
    await AsyncStorage.setItem(
      `notification_config_${childId}`,
      JSON.stringify(notificationConfig)
    );
  } catch (error) {
    console.error("Error updating quiet hours:", error);
    throw error;
  }
}

/**
 * Get notification configuration
 */
export async function getNotificationConfig(childId: number): Promise<SmartNotificationConfig> {
  try {
    const config = await AsyncStorage.getItem(`notification_config_${childId}`);
    return config ? JSON.parse(config) : { ...DEFAULT_CONFIG, childId };
  } catch (error) {
    console.error("Error getting notification config:", error);
    return { ...DEFAULT_CONFIG, childId };
  }
}

/**
 * Enable/disable all notifications
 */
export async function toggleAllNotifications(childId: number, enabled: boolean): Promise<void> {
  try {
    const config = await AsyncStorage.getItem(`notification_config_${childId}`);
    const notificationConfig: SmartNotificationConfig = config
      ? JSON.parse(config)
      : { ...DEFAULT_CONFIG, childId };

    notificationConfig.enabled = enabled;
    await AsyncStorage.setItem(
      `notification_config_${childId}`,
      JSON.stringify(notificationConfig)
    );
  } catch (error) {
    console.error("Error toggling notifications:", error);
    throw error;
  }
}
