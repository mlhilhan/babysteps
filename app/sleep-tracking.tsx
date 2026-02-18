import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/hooks/use-i18n";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface SleepEntry {
  id: number;
  childId: number;
  sleepDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  quality: "poor" | "fair" | "good";
  nightWakeups: number;
  notes?: string;
  createdAt: string;
}

const SLEEP_QUALITY = [
  { label: "😴 Kötü", value: "poor", color: "bg-error" },
  { label: "😐 Orta", value: "fair", color: "bg-warning" },
  { label: "😊 İyi", value: "good", color: "bg-success" },
];

export default function SleepTrackingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const { childId } = useLocalSearchParams();

  const [showAddModal, setShowAddModal] = useState(false);
  const [sleepDate, setSleepDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date(Date.now() - 8 * 60 * 60 * 1000)); // 8 hours ago
  const [endTime, setEndTime] = useState(new Date());
  const [quality, setQuality] = useState<"poor" | "fair" | "good">("good");
  const [nightWakeups, setNightWakeups] = useState("0");
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Fetch sleep logs
  const { data: sleepLogs = [], isLoading, refetch } = trpc.sleep.list.useQuery(
    { childId: Number(childId) },
    {
      enabled: !!childId,
    }
  );

  const createSleepMutation = trpc.sleep.create.useMutation({
    onSuccess: () => {
      Alert.alert(t("common.success"), "Uyku kaydı başarıyla eklendi!");
      resetForm();
      setShowAddModal(false);
      refetch();
    },
    onError: (error: any) => {
      Alert.alert(t("common.error"), error.message);
    },
  });

  const resetForm = () => {
    setSleepDate(new Date());
    setStartTime(new Date(Date.now() - 8 * 60 * 60 * 1000));
    setEndTime(new Date());
    setQuality("good");
    setNightWakeups("0");
    setNotes("");
  };

  const calculateDuration = () => {
    const diff = endTime.getTime() - startTime.getTime();
    return Math.round(diff / (1000 * 60)); // minutes
  };

  const handleAddSleep = async () => {
    if (startTime >= endTime) {
      Alert.alert(t("common.error"), "Başlangıç saati bitiş saatinden önce olmalıdır");
      return;
    }

    try {
      const duration = calculateDuration();
      await createSleepMutation.mutateAsync({
        childId: Number(childId),
        sleepDate: sleepDate.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        quality,
        notes: notes ? `Gece uyanışları: ${nightWakeups}\n${notes}` : `Gece uyanışları: ${nightWakeups}`,
      });
    } catch (error) {
      console.error("Error adding sleep:", error);
    }
  };

  const getAverageSleepDuration = () => {
    if (sleepLogs.length === 0) return 0;
    const total = sleepLogs.reduce((sum: number, log: any) => sum + (log.duration || 0), 0);
    return Math.round(total / sleepLogs.length);
  };

  const getWeeklyData = () => {
    const last7Days = sleepLogs.slice(0, 7);
    return last7Days.map((log: any) => ({
      date: new Date(log.sleepDate).toLocaleDateString("tr-TR", { weekday: "short" }),
      duration: log.duration,
      quality: log.quality,
    }));
  };

  if (isLoading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const avgDuration = getAverageSleepDuration();
  const weeklyData = getWeeklyData();

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">😴 Uyku Takibi</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Add Button */}
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="bg-primary rounded-lg py-4 items-center flex-row justify-center gap-2"
          >
            <Text className="text-white font-semibold text-lg">+ Uyku Kaydı Ekle</Text>
          </TouchableOpacity>

          {/* Statistics */}
          <View className="gap-3">
            <View className="bg-surface rounded-lg p-4 gap-2">
              <Text className="text-sm font-semibold text-muted">Ortalama Uyku Süresi</Text>
              <Text className="text-3xl font-bold text-primary">
                {Math.floor(avgDuration / 60)}h {avgDuration % 60}m
              </Text>
              <Text className="text-xs text-muted">Son {sleepLogs.length} kayıttan</Text>
            </View>

            <View className="bg-surface rounded-lg p-4 gap-2">
              <Text className="text-sm font-semibold text-muted">Toplam Uyku Kaydı</Text>
              <Text className="text-3xl font-bold text-primary">{sleepLogs.length}</Text>
            </View>
          </View>

          {/* Weekly Sleep Chart */}
          {weeklyData.length > 0 && (
            <View className="bg-surface rounded-lg p-4 gap-3">
              <Text className="text-sm font-semibold text-foreground">Haftalık Uyku Süresi</Text>
              <View className="flex-row items-end gap-2 h-32">
                {weeklyData.map((day: any, index: number) => {
                  const maxDuration = 12 * 60; // 12 hours
                  const height = (day.duration / maxDuration) * 100;
                  return (
                    <View key={index} className="flex-1 items-center gap-1">
                      <View
                        className={`w-full rounded-t-lg ${
                          day.quality === "good"
                            ? "bg-success"
                            : day.quality === "fair"
                            ? "bg-warning"
                            : "bg-error"
                        }`}
                        style={{ height: `${Math.max(height, 10)}%` }}
                      />
                      <Text className="text-xs text-muted">{day.date}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Sleep Logs */}
          {sleepLogs.length === 0 ? (
            <View className="bg-surface rounded-lg p-6 items-center gap-3">
              <Text className="text-4xl">😴</Text>
              <Text className="text-lg font-semibold text-foreground text-center">
                Uyku kaydı bulunmamaktadır
              </Text>
              <Text className="text-sm text-muted text-center">
                Çocuğunuzun uyku bilgilerini kaydetmeye başlayın
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">Uyku Geçmişi</Text>
              {sleepLogs.map((log: any) => {
                const sleepQualityLabel = SLEEP_QUALITY.find((q) => q.value === log.quality)?.label;
                const hours = Math.floor(log.duration / 60);
                const minutes = log.duration % 60;
                return (
                  <View key={log.id} className="bg-surface rounded-lg p-4 gap-2">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-semibold text-foreground">
                        {new Date(log.sleepDate).toLocaleDateString("tr-TR")}
                      </Text>
                      <View
                        className={`px-3 py-1 rounded-full ${
                          SLEEP_QUALITY.find((q) => q.value === log.quality)?.color
                        }`}
                      >
                        <Text className="text-xs font-semibold text-white">
                          {sleepQualityLabel}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between text-sm">
                      <Text className="text-muted">
                        ⏰ {new Date(log.startTime).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - {new Date(log.endTime).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                      <Text className="text-primary font-semibold">
                        {hours}h {minutes}m
                      </Text>
                    </View>

                    {log.notes && log.notes.includes("Gece uyanışları") && (
                      <Text className="text-sm text-warning">
                        🌙 {log.notes.split("\n")[0]}
                      </Text>
                    )}

                    {log.notes && !log.notes.includes("Gece uyanışları") && (
                      <Text className="text-sm text-foreground">{log.notes}</Text>
                    )}
                    {log.notes && log.notes.includes("\n") && (
                      <Text className="text-sm text-foreground">
                        {log.notes.split("\n").slice(1).join("\n")}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Sleep Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
      >
        <ScreenContainer className="bg-background">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View className="flex-1 p-4 gap-4">
              {/* Modal Header */}
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-foreground">Uyku Kaydı Ekle</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="w-10 h-10 rounded-full bg-surface items-center justify-center"
                >
                  <Text className="text-lg">✕</Text>
                </TouchableOpacity>
              </View>

              {/* Sleep Date */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Uyku Tarihi</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="bg-surface rounded-lg px-4 py-3 border border-border"
                >
                  <Text className="text-foreground">
                    {sleepDate.toLocaleDateString("tr-TR")}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={sleepDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      setShowDatePicker(false);
                      if (date) setSleepDate(date);
                    }}
                  />
                )}
              </View>

              {/* Start Time */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Başlangıç Saati</Text>
                <TouchableOpacity
                  onPress={() => setShowStartTimePicker(true)}
                  className="bg-surface rounded-lg px-4 py-3 border border-border"
                >
                  <Text className="text-foreground">
                    {startTime.toLocaleTimeString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>
                {showStartTimePicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={(event, date) => {
                      setShowStartTimePicker(false);
                      if (date) setStartTime(date);
                    }}
                  />
                )}
              </View>

              {/* End Time */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Bitiş Saati</Text>
                <TouchableOpacity
                  onPress={() => setShowEndTimePicker(true)}
                  className="bg-surface rounded-lg px-4 py-3 border border-border"
                >
                  <Text className="text-foreground">
                    {endTime.toLocaleTimeString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>
                {showEndTimePicker && (
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={(event, date) => {
                      setShowEndTimePicker(false);
                      if (date) setEndTime(date);
                    }}
                  />
                )}
              </View>

              {/* Duration Display */}
              <View className="bg-primary/10 rounded-lg px-4 py-3 border border-primary">
                <Text className="text-sm text-muted">Uyku Süresi</Text>
                <Text className="text-2xl font-bold text-primary">
                  {Math.floor(calculateDuration() / 60)}h {calculateDuration() % 60}m
                </Text>
              </View>

              {/* Sleep Quality */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Uyku Kalitesi</Text>
                <View className="gap-2">
                  {SLEEP_QUALITY.map((q) => (
                    <TouchableOpacity
                      key={q.value}
                      onPress={() => setQuality(q.value as any)}
                      className={`rounded-lg py-3 px-4 border-2 ${
                        quality === q.value
                          ? `${q.color} border-${q.color}`
                          : "bg-surface border-border"
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          quality === q.value ? "text-white" : "text-foreground"
                        }`}
                      >
                        {q.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Night Wakeups */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Gece Uyanışları</Text>
                <TextInput
                  placeholder="0"
                  value={nightWakeups}
                  onChangeText={setNightWakeups}
                  keyboardType="number-pad"
                  className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                  placeholderTextColor={colors.muted}
                />
              </View>

              {/* Notes */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Notlar</Text>
                <TextInput
                  placeholder="Örn: Uyku sırasında çok huzursuz görünüyordu"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                  placeholderTextColor={colors.muted}
                  textAlignVertical="top"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleAddSleep}
                disabled={createSleepMutation.isPending}
                className="bg-primary rounded-lg py-4 items-center mt-auto"
              >
                {createSleepMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-lg">{t("common.save")}</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}
