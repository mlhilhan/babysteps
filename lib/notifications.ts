import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Expo Go'da push bildirimleri SDK 53+ kaldırıldı; development build gerekir
const isExpoGo = Constants.appOwnership === "expo";

let Notifications: typeof import("expo-notifications") | null = null;
if (!isExpoGo) {
  try {
    Notifications = require("expo-notifications");
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      } as any),
    });
  } catch (e) {
    console.warn("[notifications] Expo Go veya build kısıtı:", e);
    Notifications = null;
  }
}

export async function registerForPushNotificationsAsync() {
  if (isExpoGo || !Notifications) {
    return;
  }
  if (!Device.isDevice) {
    console.log("Must use physical device for push notifications");
    return;
  }

  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }

    // Get push token
    const projectId = "babysteps"; // Expo project ID
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const pushToken = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    console.log("Push token:", pushToken.data);
    return pushToken.data;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
  }
}

/**
 * Aşı hatırlatıcısı bildirimi gönder
 */
export async function scheduleVaccinationReminder(
  vaccineName: string,
  daysFromNow: number
) {
  if (!Notifications) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💉 Aşı Hatırlatıcısı",
        body: `${vaccineName} aşısının zamanı geldi. Doktor randevunuzu alınız.`,
        data: {
          type: "vaccination",
          vaccineName,
        },
      },
      trigger: {
        seconds: daysFromNow * 24 * 60 * 60,
      } as any,
    });
  } catch (error) {
    console.error("Error scheduling vaccination reminder:", error);
  }
}

/**
 * Gelişim milestone bildirimi gönder
 */
export async function sendMilestoneNotification(
  milestoneName: string,
  description: string
) {
  if (!Notifications) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎉 Gelişim Başarısı!",
        body: `${milestoneName}: ${description}`,
        data: {
          type: "milestone",
          milestoneName,
        },
      },
      trigger: {
        seconds: 1, // Hemen gönder
      } as any,
    });
  } catch (error) {
    console.error("Error sending milestone notification:", error);
  }
}

/**
 * Günlük hatırlatıcı bildirimi gönder
 */
export async function scheduleDailyReminder(
  title: string,
  body: string,
  hour: number = 9,
  minute: number = 0
) {
  if (!Notifications) return;
  try {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    // Eğer belirtilen saat geçtiyse, yarın için planla
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const secondsUntilNotification = Math.floor(
      (scheduledTime.getTime() - now.getTime()) / 1000
    );

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          type: "reminder",
        },
      },
      trigger: {
        seconds: secondsUntilNotification,
        repeats: true, // Günlük tekrarla
      } as any,
    });
  } catch (error) {
    console.error("Error scheduling daily reminder:", error);
  }
}

/**
 * Tüm bildirimleri iptal et
 */
export async function cancelAllNotifications() {
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Error canceling notifications:", error);
  }
}

/**
 * Belirli bir bildirimi iptal et
 */
export async function cancelNotification(notificationId: string) {
  if (!Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Error canceling notification:", error);
  }
}
