import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const QUICK_ACCESS_ITEMS: { icon: string; label: string; path: string }[] = [
  { icon: "📊", label: "Gelişim", path: "/growth-tracking" },
  { icon: "💉", label: "Aşılar", path: "/vaccination-schedule" },
  { icon: "🍽️", label: "Beslenme", path: "/nutrition-log" },
  { icon: "😴", label: "Uyku", path: "/sleep-tracking" },
  { icon: "🏥", label: "Sağlık", path: "/health-notes" },
  { icon: "📸", label: "Anılar", path: "/memory-journal" },
  { icon: "🤖", label: "AI Asistan", path: "/ai-assistant" },
  { icon: "📋", label: "Raporlar", path: "/reports" },
  { icon: "🛡️", label: "Çocuk Güvenliği", path: "/child-safety" },
  { icon: "💬", label: "Topluluk", path: "/community-forum" },
  { icon: "✅", label: "Günlük Görevler", path: "/daily-tasks" },
  { icon: "📅", label: "Pediatrist", path: "/pediatrist-calendar" },
  { icon: "🖼️", label: "Aile Albümü", path: "/family-album" },
  { icon: "👤", label: "Profil", path: "/profile-management" },
  { icon: "🏆", label: "Başarılar", path: "/achievements" },
  { icon: "📖", label: "Tarifler", path: "/nutrition-recipes" },
  { icon: "⭐", label: "Premium", path: "/subscription-purchase" },
  { icon: "☁️", label: "Yedekleme", path: "/data-sync-settings" },
  { icon: "🔔", label: "Bildirimler", path: "/advanced-notification-settings" },
];

export default function HomeScreen() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  // Fetch children
  const { data: children = [], isLoading: childrenLoading, refetch } = trpc.children.list.useQuery(
    undefined,
    {
      enabled: isAuthenticated && !loading,
    }
  );

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/onboarding");
    }
  }, [isAuthenticated, loading]);

  const handleAddChild = () => {
    router.push("/profile-management");
  };

  const handleChildPress = (childId: number) => {
    setSelectedChildId(childId);
    router.push({ pathname: "/growth-tracking", params: { childId: String(childId) } });
  };

  if (loading || childrenLoading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-muted">Hoş geldiniz</Text>
              <Text className="text-2xl font-bold text-foreground">
                {user?.name || "Ebeveyn"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/settings")}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View className="flex-row gap-3">
            <QuickStatCard icon="👶" label="Çocuk" value={children.length.toString()} />
            <QuickStatCard icon="📈" label="Takip" value="Aktif" />
            <QuickStatCard icon="💉" label="Aşı" value="Güncel" />
          </View>

          {/* Children Section */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">Çocuklarım</Text>
              <TouchableOpacity
                onPress={handleAddChild}
                className="px-3 py-1 rounded-full bg-primary"
              >
                <Text className="text-white text-sm font-semibold">+ Ekle</Text>
              </TouchableOpacity>
            </View>

            {children.length === 0 ? (
              <EmptyStateCard onAddChild={handleAddChild} />
            ) : (
              <FlatList
                data={children}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <ChildCard
                    child={item}
                    onPress={() => handleChildPress(item.id)}
                  />
                )}
                ItemSeparatorComponent={() => <View className="h-3" />}
              />
            )}
          </View>

          {/* Quick Actions */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">Hızlı Erişim</Text>
            <View className="flex-row flex-wrap gap-2">
              {QUICK_ACCESS_ITEMS.map((item) => (
                <QuickActionButton
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  onPress={() => router.push(item.path)}
                />
              ))}
            </View>
          </View>

        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function QuickStatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 bg-surface rounded-lg p-3 items-center gap-1">
      <Text className="text-2xl">{icon}</Text>
      <Text className="text-xs text-muted">{label}</Text>
      <Text className="text-sm font-semibold text-foreground">{value}</Text>
    </View>
  );
}

function ChildCard({
  child,
  onPress,
}: {
  child: any;
  onPress: () => void;
}) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-surface rounded-lg p-4 flex-row items-center gap-4"
    >
      {child.photoUrl ? (
        <Image
          source={{ uri: child.photoUrl }}
          className="w-16 h-16 rounded-full"
        />
      ) : (
        <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center">
          <Text className="text-3xl">👶</Text>
        </View>
      )}

      <View className="flex-1">
        <Text className="text-lg font-semibold text-foreground">{child.name}</Text>
        <Text className="text-sm text-muted">
          {calculateAge(new Date(child.dateOfBirth))} yaşında
        </Text>
      </View>

      <Text className="text-xl">→</Text>
    </TouchableOpacity>
  );
}

function EmptyStateCard({ onAddChild }: { onAddChild: () => void }) {
  return (
    <View className="bg-surface rounded-lg p-6 items-center gap-4">
      <Text className="text-4xl">👶</Text>
      <Text className="text-lg font-semibold text-foreground text-center">
        Henüz çocuk profili yok
      </Text>
      <Text className="text-sm text-muted text-center">
        İlk çocuğunuzu ekleyerek başlayın
      </Text>
      <TouchableOpacity
        onPress={onAddChild}
        className="bg-primary rounded-full px-6 py-2"
      >
        <Text className="text-white font-semibold">Çocuk Ekle</Text>
      </TouchableOpacity>
    </View>
  );
}

const QUICK_ACCESS_BUTTON_WIDTH = "31%"; // ~3 per row with gap

function QuickActionButton({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-surface rounded-lg p-3 items-center gap-2"
      style={{ width: QUICK_ACCESS_BUTTON_WIDTH }}
    >
      <Text className="text-2xl">{icon}</Text>
      <Text className="text-xs text-foreground font-semibold text-center" numberOfLines={2}>{label}</Text>
    </TouchableOpacity>
  );
}

function calculateAge(birthDate: Date): string {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age === 0) {
    const months = Math.floor(
      (today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    return `${months} ay`;
  }

  return `${age} yaş`;
}
