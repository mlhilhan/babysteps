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
  TextInput,
  Modal,
} from "react-native";
import {
  getNotificationConfig,
  updateNotificationPreferences,
  updateSleepSchedule,
  updateQuietHours,
  toggleAllNotifications,
} from "@/lib/smart-notifications";

export default function AdvancedNotificationSettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();

  const [allNotificationsEnabled, setAllNotificationsEnabled] = useState(true);
  const [bedtime, setBedtime] = useState("21:00");
  const [wakeupTime, setWakeupTime] = useState("08:00");
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("08:00");

  const [categorySettings, setCategorySettings] = useState([
    { id: "vaccination", label: "Aşı Hatırlatıcıları", emoji: "💉", enabled: true },
    { id: "growth", label: "Büyüme Takibi", emoji: "📏", enabled: true },
    { id: "nutrition", label: "Beslenme", emoji: "🍽️", enabled: true },
    { id: "sleep", label: "Uyku", emoji: "😴", enabled: true },
    { id: "health", label: "Sağlık", emoji: "🏥", enabled: true },
    { id: "milestone", label: "Gelişim Kilometre Taşları", emoji: "🎯", enabled: true },
  ]);

  const [showTimeModal, setShowTimeModal] = useState<string | null>(null);
  const [tempTime, setTempTime] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const config = await getNotificationConfig(1); // Assuming childId = 1
      setAllNotificationsEnabled(config.enabled);
      setBedtime(config.sleepSchedule.bedtime);
      setWakeupTime(config.sleepSchedule.wakeupTime);
      setQuietStart(config.quietHours.start);
      setQuietEnd(config.quietHours.end);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleToggleAllNotifications = async (enabled: boolean) => {
    try {
      await toggleAllNotifications(1, enabled);
      setAllNotificationsEnabled(enabled);
    } catch (error) {
      console.error("Error toggling notifications:", error);
    }
  };

  const handleToggleCategory = (categoryId: string) => {
    setCategorySettings(
      categorySettings.map((cat) =>
        cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
      )
    );
  };

  const handleSaveTime = async (field: string, value: string) => {
    try {
      if (field === "bedtime") {
        setBedtime(value);
        await updateSleepSchedule(1, value, wakeupTime);
      } else if (field === "wakeupTime") {
        setWakeupTime(value);
        await updateSleepSchedule(1, bedtime, value);
      } else if (field === "quietStart") {
        setQuietStart(value);
        await updateQuietHours(1, value, quietEnd);
      } else if (field === "quietEnd") {
        setQuietEnd(value);
        await updateQuietHours(1, quietStart, value);
      }
      setShowTimeModal(null);
    } catch (error) {
      console.error("Error saving time:", error);
    }
  };

  const timeFields = [
    { id: "bedtime", label: "Yatış Saati", value: bedtime },
    { id: "wakeupTime", label: "Kalkış Saati", value: wakeupTime },
    { id: "quietStart", label: "Sessiz Saat Başlangıcı", value: quietStart },
    { id: "quietEnd", label: "Sessiz Saat Bitişi", value: quietEnd },
  ];

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">🔔 Bildirim Ayarları</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Master Toggle */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">Tüm Bildirimleri Aç/Kapat</Text>
                <Text className="text-sm text-muted">Tüm bildirim kategorilerini kontrol edin</Text>
              </View>
              <Switch
                value={allNotificationsEnabled}
                onValueChange={handleToggleAllNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>

          {/* Sleep Schedule */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">😴 Uyku Programı</Text>
            {timeFields.slice(0, 2).map((field) => (
              <TouchableOpacity
                key={field.id}
                onPress={() => {
                  setTempTime(field.value);
                  setShowTimeModal(field.id);
                }}
                className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between"
              >
                <Text className="text-sm font-semibold text-foreground">{field.label}</Text>
                <View className="bg-primary/20 rounded-lg px-4 py-2">
                  <Text className="text-primary font-semibold">{field.value}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quiet Hours */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">🤫 Sessiz Saatler</Text>
            <Text className="text-sm text-muted">
              Bu saatlerde bildirimler gönderilmeyecektir
            </Text>
            {timeFields.slice(2).map((field) => (
              <TouchableOpacity
                key={field.id}
                onPress={() => {
                  setTempTime(field.value);
                  setShowTimeModal(field.id);
                }}
                className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between"
              >
                <Text className="text-sm font-semibold text-foreground">{field.label}</Text>
                <View className="bg-primary/20 rounded-lg px-4 py-2">
                  <Text className="text-primary font-semibold">{field.value}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Notification Categories */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">📢 Bildirim Kategorileri</Text>
            {categorySettings.map((category) => (
              <View
                key={category.id}
                className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <Text className="text-2xl">{category.emoji}</Text>
                  <Text className="text-sm font-semibold text-foreground">{category.label}</Text>
                </View>
                <Switch
                  value={category.enabled}
                  onValueChange={() => handleToggleCategory(category.id)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              </View>
            ))}
          </View>

          {/* Info Box */}
          <View className="bg-primary/10 rounded-lg p-4 border border-primary gap-2">
            <Text className="text-sm font-semibold text-primary">💡 Akıllı Bildirimler</Text>
            <Text className="text-sm text-foreground">
              BabySteps, çocuğunuzun uyku saatini ve sessiz saatleri göz önünde bulundurarak bildirimleri akıllıca gönderir. Uyku sırasında bildirim almayacaksınız.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal visible={showTimeModal !== null} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 gap-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-foreground">Saati Seç</Text>
              <TouchableOpacity onPress={() => setShowTimeModal(null)}>
                <Text className="text-2xl">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Saat (HH:MM)</Text>
                <TextInput
                  value={tempTime}
                  onChangeText={setTempTime}
                  placeholder="21:00"
                  keyboardType="default"
                  className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border text-center text-lg"
                  placeholderTextColor={colors.muted}
                />
              </View>

              <TouchableOpacity
                onPress={() => handleSaveTime(showTimeModal || "", tempTime)}
                className="bg-primary rounded-lg py-4 items-center"
              >
                <Text className="text-white font-semibold text-lg">Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
