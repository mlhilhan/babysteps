import { useAppAlert } from "@/contexts/app-alert-context";
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
  ActivityIndicator,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPPORTED_LANGUAGES = [
  "tr", "en", "ar", "de", "es", "fr", "hi", "it", "ja", "ko", "nl", "pt", "ru", "sv", "zh",
] as const;

const LANGUAGE_FLAGS: Record<string, string> = {
  tr: "🇹🇷",
  en: "🇬🇧",
  ar: "🇸🇦",
  de: "🇩🇪",
  es: "🇪🇸",
  fr: "🇫🇷",
  hi: "🇮🇳",
  it: "🇮🇹",
  ja: "🇯🇵",
  ko: "🇰🇷",
  nl: "🇳🇱",
  pt: "🇵🇹",
  ru: "🇷🇺",
  sv: "🇸🇪",
  zh: "🇨🇳",
};

interface NotificationSettings {
  vaccineReminders: boolean;
  milestoneAlerts: boolean;
  dailyTips: boolean;
  pushNotifications: boolean;
}

export default function SettingsScreen() {
  const { showAlert } = useAppAlert();
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
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => i18n.language?.startsWith(l)) ?? "tr";

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
      showAlert({ title: t("common.error"), message: t("settings.save_settings_error") });
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
    setLanguageModalVisible(false);
    try {
      await changeLanguage(lang);
    } catch (error) {
      showAlert({ title: t("common.error"), message: t("settings.language_change_error") });
    }
  };

  const handleLogout = () => {
    showAlert({
      title: t("settings.logout"),
      message: t("settings.logout_confirm_message"),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.yes"),
          onPress: async () => {
            try {
              await logout();
              router.replace("/onboarding");
            } catch (error) {
              showAlert({ title: t("common.error"), message: t("settings.logout_error") });
            }
          },
        },
      ],
    });
  };

  const handleUpgradePremium = () => {
    showAlert({
      title: `🎉 ${t("settings.premium_modal_title")}`,
      message: t("settings.premium_modal_message"),
      buttons: [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.premium_buy_button"),
          onPress: async () => {
            setIsPremium(true);
            await AsyncStorage.setItem("isPremium", JSON.stringify(true));
            showAlert({
              title: t("common.success"),
              message: t("settings.premium_success_message"),
            });
          },
        },
      ],
    });
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
            <Text className="text-lg font-semibold text-foreground">🌐 {t("settings.language_label")}</Text>
            <TouchableOpacity
              onPress={() => setLanguageModalVisible(true)}
              activeOpacity={0.7}
              className="flex-row items-center justify-between rounded-lg py-3.5 px-4 bg-background/80"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">{LANGUAGE_FLAGS[currentLanguage] ?? "🌐"}</Text>
                <Text className="text-base font-medium text-foreground">
                  {t(`settings.languages.${currentLanguage}`)}
                </Text>
              </View>
              <Text className="text-muted text-lg">›</Text>
            </TouchableOpacity>

            <Modal
              visible={languageModalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setLanguageModalVisible(false)}
            >
              <Pressable
                className="flex-1 bg-black/50 justify-end"
                onPress={() => setLanguageModalVisible(false)}
              >
                <Pressable
                  onPress={(e) => e.stopPropagation()}
                  style={{ backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "70%" }}
                >
                  <View className="p-4 border-b border-border">
                    <Text className="text-lg font-semibold text-foreground text-center">
                      {t("settings.language_label")}
                    </Text>
                  </View>
                  <FlatList
                    data={[...SUPPORTED_LANGUAGES]}
                    keyExtractor={(code) => code}
                    renderItem={({ item: code }) => (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleChangeLanguage(code)}
                        className="flex-row items-center gap-4 py-4 px-4 border-b border-border/50"
                        style={{
                          backgroundColor: code === currentLanguage ? `${colors.primary}12` : "transparent",
                        }}
                      >
                        <Text className="text-2xl">{LANGUAGE_FLAGS[code] ?? "🌐"}</Text>
                        <Text
                          className="flex-1 text-base font-medium"
                          style={{ color: colors.foreground }}
                        >
                          {t(`settings.languages.${code}`)}
                        </Text>
                        {code === currentLanguage && (
                          <Text className="text-primary font-semibold">✓</Text>
                        )}
                      </TouchableOpacity>
                    )}
                  />
                </Pressable>
              </Pressable>
            </Modal>
          </View>

          {/* Notification Preferences */}
          <View className="bg-surface rounded-lg p-4 gap-4">
            <Text className="text-lg font-semibold text-foreground">🔔 {t("settings.notifications")}</Text>

            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-foreground font-medium">💉 {t("settings.notif_vaccine_reminders")}</Text>
                  <Text className="text-xs text-muted">{t("settings.notif_vaccine_reminders_desc")}</Text>
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
                  <Text className="text-foreground font-medium">🎉 {t("settings.notif_milestone_alerts")}</Text>
                  <Text className="text-xs text-muted">{t("settings.notif_milestone_alerts_desc")}</Text>
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
                  <Text className="text-foreground font-medium">💡 {t("settings.notif_daily_tips")}</Text>
                  <Text className="text-xs text-muted">{t("settings.notif_daily_tips_desc")}</Text>
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
                  <Text className="text-foreground font-medium">📲 {t("settings.notif_push")}</Text>
                  <Text className="text-xs text-muted">{t("settings.notif_push_desc")}</Text>
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
