import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/hooks/use-i18n";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NotificationSettings {
  vaccineReminders: boolean;
  milestoneAlerts: boolean;
  dailyTips: boolean;
  pushNotifications: boolean;
}

export default function SettingsScreen() {
  const { t, i18n, changeLanguage } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const { user, logout } = useAuth();

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      vaccineReminders: true,
      milestoneAlerts: true,
      dailyTips: true,
      pushNotifications: true,
    });

  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem("notificationSettings");
      if (savedSettings) {
        setNotificationSettings(JSON.parse(savedSettings));
      }

      const premiumStatus = await AsyncStorage.getItem("isPremium");
      if (premiumStatus) {
        setIsPremium(JSON.parse(premiumStatus));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem(
        "notificationSettings",
        JSON.stringify(newSettings)
      );
      setNotificationSettings(newSettings);
    } catch (error) {
      Alert.alert(t("common.error"), "Ayarlar kaydedilirken hata oluştu");
    }
  };

  const handleToggleNotification = (key: keyof NotificationSettings) => {
    const newSettings = {
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };
    saveSettings(newSettings);
  };

  const handleChangeLanguage = async (lang: string) => {
    try {
      await changeLanguage(lang);
      Alert.alert(t("common.success"), `Dil ${lang === "tr" ? "Türkçe" : "English"} olarak değiştirildi`);
    } catch (error) {
      Alert.alert(t("common.error"), "Dil değiştirilirken hata oluştu");
    }
  };

  const handleLogout = () => {
    Alert.alert(t("settings.logout"), "Çıkış yapmak istediğinizden emin misiniz?", [
      { text: t("common.cancel"), onPress: () => {} },
      {
        text: t("common.yes"),
        onPress: async () => {
          try {
            await logout();
            router.replace("/onboarding");
          } catch (error) {
            Alert.alert(t("common.error"), "Çıkış yapılırken hata oluştu");
          }
        },
      },
    ]);
  };

  const handleUpgradePremium = () => {
    Alert.alert(
      "🎉 Premium'a Yükselt",
      "Premium üyelikle sınırsız fotoğraf depolama, AI asistanı ve detaylı raporlar elde edin.",
      [
        { text: t("common.cancel"), onPress: () => {} },
        {
          text: "Satın Al (₺49.99/ay)",
          onPress: async () => {
            // Simulated purchase
            setIsPremium(true);
            await AsyncStorage.setItem("isPremium", JSON.stringify(true));
            Alert.alert(
              t("common.success"),
              "Premium üyeliğe hoş geldiniz! Tüm özelliklere erişim sağlandı."
            );
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <Text className="text-2xl font-bold text-foreground">{t("settings.title")}</Text>

          {/* User Profile Section */}
          <View className="bg-surface rounded-lg p-4 gap-4">
            <Text className="text-lg font-semibold text-foreground">👤 {t("settings.profile")}</Text>

            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-foreground">{t("settings.name")}</Text>
                <Text className="text-muted font-semibold">{user?.email?.split("@")[0] || "Kullanıcı"}</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-foreground">{t("settings.email")}</Text>
                <Text className="text-muted text-sm">{user?.email || "—"}</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-foreground">{t("settings.membership")}</Text>
                <View
                  className={`px-3 py-1 rounded-full ${
                    isPremium ? "bg-primary" : "bg-muted/30"
                  }`}
                >
                  <Text className={`text-xs font-semibold ${isPremium ? "text-white" : "text-muted"}`}>
                    {isPremium ? "⭐ Premium" : t("settings.free")}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Language Selection */}
          <View className="bg-surface rounded-lg p-4 gap-4">
            <Text className="text-lg font-semibold text-foreground">🌐 Dil Seçimi</Text>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => handleChangeLanguage("tr")}
                className={`flex-1 rounded-lg py-3 items-center border-2 ${
                  i18n.language === "tr"
                    ? "bg-primary border-primary"
                    : "bg-background border-border"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    i18n.language === "tr" ? "text-white" : "text-foreground"
                  }`}
                >
                  🇹🇷 Türkçe
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleChangeLanguage("en")}
                className={`flex-1 rounded-lg py-3 items-center border-2 ${
                  i18n.language === "en"
                    ? "bg-primary border-primary"
                    : "bg-background border-border"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    i18n.language === "en" ? "text-white" : "text-foreground"
                  }`}
                >
                  🇬🇧 English
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notification Preferences */}
          <View className="bg-surface rounded-lg p-4 gap-4">
            <Text className="text-lg font-semibold text-foreground">🔔 {t("settings.notifications")}</Text>

            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-foreground font-medium">💉 Aşı Hatırlatıcıları</Text>
                  <Text className="text-xs text-muted">Yaklaşan aşılar için bildirim al</Text>
                </View>
                <Switch
                  value={notificationSettings.vaccineReminders}
                  onValueChange={() => handleToggleNotification("vaccineReminders")}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-foreground font-medium">🎉 Gelişim Başarıları</Text>
                  <Text className="text-xs text-muted">Yeni kilometre taşları için bildirim al</Text>
                </View>
                <Switch
                  value={notificationSettings.milestoneAlerts}
                  onValueChange={() => handleToggleNotification("milestoneAlerts")}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-foreground font-medium">💡 Günlük İpuçları</Text>
                  <Text className="text-xs text-muted">Ebeveynlik ipuçları ve tavsiyeleri</Text>
                </View>
                <Switch
                  value={notificationSettings.dailyTips}
                  onValueChange={() => handleToggleNotification("dailyTips")}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-foreground font-medium">📲 Push Bildirimleri</Text>
                  <Text className="text-xs text-muted">Tüm bildirimleri etkinleştir/devre dışı bırak</Text>
                </View>
                <Switch
                  value={notificationSettings.pushNotifications}
                  onValueChange={() => handleToggleNotification("pushNotifications")}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              </View>
            </View>
          </View>

          {/* Premium Section */}
          {!isPremium && (
            <TouchableOpacity
              onPress={handleUpgradePremium}
              className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-4 gap-2"
            >
              <Text className="text-lg font-bold text-white">⭐ {t("settings.premium")}</Text>
              <Text className="text-sm text-white/90">{t("settings.premium_desc")}</Text>
              <View className="mt-2">
                <Text className="text-white font-semibold">{t("settings.upgrade")}</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* About Section */}
          <View className="bg-surface rounded-lg p-4 gap-3">
            <Text className="text-lg font-semibold text-foreground">{t("settings.about")}</Text>

            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-foreground">{t("settings.version")}</Text>
                <Text className="text-muted">1.0.0</Text>
              </View>

              <TouchableOpacity className="py-2">
                <Text className="text-primary font-semibold">{t("settings.privacy_policy")}</Text>
              </TouchableOpacity>

              <TouchableOpacity className="py-2">
                <Text className="text-primary font-semibold">{t("settings.terms_of_service")}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-error/10 rounded-lg py-4 items-center border border-error mb-4"
          >
            <Text className="text-error font-semibold">{t("settings.logout")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
