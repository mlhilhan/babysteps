import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  const handleLogout = async () => {
    await logout();
    router.replace("/onboarding");
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">Ayarlar</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* User Profile */}
          <View className="bg-surface rounded-lg p-4 gap-3">
            <Text className="text-lg font-semibold text-foreground">Profil</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-muted">Ad</Text>
                <Text className="text-foreground font-semibold">{user?.name || "—"}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted">E-posta</Text>
                <Text className="text-foreground font-semibold">{user?.email || "—"}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted">Üyelik</Text>
                <Text className="text-foreground font-semibold">Ücretsiz</Text>
              </View>
            </View>
          </View>

          {/* Preferences */}
          <View className="bg-surface rounded-lg p-4 gap-3">
            <Text className="text-lg font-semibold text-foreground">Tercihler</Text>
            <SettingItem
              label="Koyu Mod"
              value={isDarkMode}
              onToggle={() => setIsDarkMode(!isDarkMode)}
            />
            <SettingItem label="Bildirimler" value={true} onToggle={() => {}} />
            <SettingItem label="Yedekleme" value={false} onToggle={() => {}} />
          </View>

          {/* About */}
          <View className="bg-surface rounded-lg p-4 gap-3">
            <Text className="text-lg font-semibold text-foreground">Hakkında</Text>
            <TouchableOpacity className="py-3 border-b border-border">
              <Text className="text-foreground">Sürüm 1.0.0</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-3 border-b border-border">
              <Text className="text-primary">Gizlilik Politikası</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-3">
              <Text className="text-primary">Hizmet Şartları</Text>
            </TouchableOpacity>
          </View>

          {/* Premium */}
          <View className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 gap-3">
            <Text className="text-lg font-semibold text-foreground">Premium'a Yükselt</Text>
            <Text className="text-sm text-muted">
              Sınırsız fotoğraf depolama, AI asistanı ve PDF raporlama özelliklerini açın.
            </Text>
            <TouchableOpacity className="bg-primary rounded-lg py-3 items-center">
              <Text className="text-white font-semibold">Premium'a Yükselt</Text>
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-error/10 rounded-lg py-3 items-center border border-error"
          >
            <Text className="text-error font-semibold">Çıkış Yap</Text>
          </TouchableOpacity>

          <View className="h-4" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function SettingItem({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onToggle}
      className="flex-row items-center justify-between py-3 border-b border-border"
    >
      <Text className="text-foreground">{label}</Text>
      <View
        className={`w-12 h-7 rounded-full flex items-center justify-center ${
          value ? "bg-primary" : "bg-border"
        }`}
      >
        <View
          className={`w-6 h-6 rounded-full bg-white transform ${
            value ? "translate-x-2" : "-translate-x-2"
          }`}
        />
      </View>
    </TouchableOpacity>
  );
}
