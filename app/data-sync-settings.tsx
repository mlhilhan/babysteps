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
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import {
  enableCloudBackup,
  disableCloudBackup,
  getSyncStatus,
  createLocalBackup,
  listLocalBackups,
  enableAutoSync,
  disableAutoSync,
} from "@/lib/cloud-sync";

export default function DataSyncSettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();

  const [cloudBackupEnabled, setCloudBackupEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [backupProvider, setBackupProvider] = useState<"firebase" | "supabase" | "custom">("custom");
  const [localBackups, setLocalBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Hiç");

  useEffect(() => {
    loadSyncStatus();
    loadBackups();
  }, []);

  const loadSyncStatus = async () => {
    try {
      const status = await getSyncStatus();
      setCloudBackupEnabled(status.enabled);
      setAutoSyncEnabled(status.autoSync);
      setBackupProvider(status.provider);
      if (status.lastSyncTime > 0) {
        setLastSyncTime(new Date(status.lastSyncTime).toLocaleString("tr-TR"));
      }
    } catch (error) {
      console.error("Error loading sync status:", error);
    }
  };

  const loadBackups = async () => {
    try {
      const backups = await listLocalBackups();
      setLocalBackups(backups);
    } catch (error) {
      console.error("Error loading backups:", error);
    }
  };

  const handleToggleCloudBackup = async (enabled: boolean) => {
    try {
      setLoading(true);
      if (enabled) {
        await enableCloudBackup(backupProvider);
        Alert.alert("Başarılı", "Cloud backup etkinleştirildi");
      } else {
        await disableCloudBackup();
        Alert.alert("Başarılı", "Cloud backup devre dışı bırakıldı");
      }
      setCloudBackupEnabled(enabled);
    } catch (error) {
      Alert.alert("Hata", "İşlem başarısız oldu");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoSync = async (enabled: boolean) => {
    try {
      if (enabled) {
        await enableAutoSync();
      } else {
        await disableAutoSync();
      }
      setAutoSyncEnabled(enabled);
    } catch (error) {
      Alert.alert("Hata", "İşlem başarısız oldu");
    }
  };

  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      await createLocalBackup({
        children: [],
        growthData: [],
        vaccinations: [],
        nutritionLogs: [],
        sleepLogs: [],
        healthNotes: [],
        memoryJournal: [],
      });
      Alert.alert("Başarılı", "Yedekleme oluşturuldu");
      loadBackups();
    } catch (error) {
      Alert.alert("Hata", "Yedekleme oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">☁️ Veri Senkronizasyonu</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Cloud Backup Section */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">☁️ Cloud Backup</Text>
                <Text className="text-sm text-muted">Verilerinizi buluta yedekleyin</Text>
              </View>
              <Switch
                value={cloudBackupEnabled}
                onValueChange={handleToggleCloudBackup}
                disabled={loading}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            {cloudBackupEnabled && (
              <>
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">Backup Sağlayıcısı</Text>
                  <View className="flex-row gap-2">
                    {["firebase", "supabase", "custom"].map((provider) => (
                      <TouchableOpacity
                        key={provider}
                        onPress={() => setBackupProvider(provider as any)}
                        className={`flex-1 rounded-lg py-2 items-center ${
                          backupProvider === provider ? "bg-primary" : "bg-background border border-border"
                        }`}
                      >
                        <Text className={`text-xs font-semibold ${backupProvider === provider ? "text-white" : "text-foreground"}`}>
                          {provider === "firebase" ? "Firebase" : provider === "supabase" ? "Supabase" : "Özel"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">Otomatik Senkronizasyon</Text>
                    <Text className="text-xs text-muted">Veriler otomatik olarak senkronize edilsin</Text>
                  </View>
                  <Switch
                    value={autoSyncEnabled}
                    onValueChange={handleToggleAutoSync}
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>

                <View className="bg-background rounded-lg p-3 gap-1">
                  <Text className="text-xs text-muted">Son Senkronizasyon</Text>
                  <Text className="text-sm font-semibold text-foreground">{lastSyncTime}</Text>
                </View>
              </>
            )}
          </View>

          {/* Local Backup Section */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">💾 Yerel Yedeklemeler</Text>
              <TouchableOpacity
                onPress={handleCreateBackup}
                disabled={loading}
                className="bg-primary rounded-lg px-4 py-2"
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white font-semibold text-sm">+ Yedekle</Text>
                )}
              </TouchableOpacity>
            </View>

            {localBackups.length === 0 ? (
              <View className="bg-surface rounded-lg p-6 items-center gap-2 border border-border">
                <Text className="text-lg text-muted">Henüz yedekleme yok</Text>
              </View>
            ) : (
              localBackups.map((backup) => (
                <View key={backup.id} className="bg-surface rounded-lg p-4 border border-border gap-2">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">
                        {new Date(backup.timestamp).toLocaleDateString("tr-TR")}
                      </Text>
                      <Text className="text-xs text-muted">
                        {(backup.size / 1024).toFixed(2)} KB
                      </Text>
                    </View>
                    <TouchableOpacity className="bg-primary/20 rounded-lg px-3 py-1">
                      <Text className="text-primary text-xs font-semibold">Geri Yükle</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Info Box */}
          <View className="bg-primary/10 rounded-lg p-4 border border-primary gap-2">
            <Text className="text-sm font-semibold text-primary">💡 Bilgi</Text>
            <Text className="text-sm text-foreground">
              Cloud backup etkinleştirildiğinde, tüm verileriniz seçili sağlayıcıya otomatik olarak yedeklenecektir. Yerel yedeklemeler cihazınızda saklanır.
            </Text>
          </View>

          {/* Sync Status */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-sm font-semibold text-foreground">📊 Senkronizasyon Durumu</Text>
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">Cloud Backup</Text>
                <Text className={`text-sm font-semibold ${cloudBackupEnabled ? "text-success" : "text-muted"}`}>
                  {cloudBackupEnabled ? "Etkin" : "Devre Dışı"}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">Otomatik Senkronizasyon</Text>
                <Text className={`text-sm font-semibold ${autoSyncEnabled ? "text-success" : "text-muted"}`}>
                  {autoSyncEnabled ? "Etkin" : "Devre Dışı"}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">Yerel Yedeklemeler</Text>
                <Text className="text-sm font-semibold text-foreground">{localBackups.length}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
