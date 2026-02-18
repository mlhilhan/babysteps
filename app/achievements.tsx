import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/hooks/use-i18n";
import { ScreenContainer } from "@/components/screen-container";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import {
  getUserProfile,
  getAchievementProgress,
  getNextLevelInfo,
  type UserProfile,
} from "@/lib/gamification";

export default function AchievementsScreen() {
  const { t } = useTranslation();
  const colors = useColors();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile(1); // Assuming userId = 1
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!profile) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <Text className="text-foreground">Profil yüklenemedi</Text>
      </ScreenContainer>
    );
  }

  const progress = getAchievementProgress(profile.achievements);
  const nextLevel = getNextLevelInfo(profile.totalXP);

  const filteredAchievements = profile.achievements.filter((a) => {
    if (filter === "unlocked") return a.unlocked;
    if (filter === "locked") return !a.unlocked;
    return true;
  });

  const rarityColors = {
    common: "#95A5A6",
    uncommon: "#27AE60",
    rare: "#3498DB",
    epic: "#9B59B6",
    legendary: "#F39C12",
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">🏆 Başarılar</Text>
            <View className="bg-primary/20 rounded-full px-4 py-2">
              <Text className="text-sm font-semibold text-primary">{progress.unlocked}/{progress.total}</Text>
            </View>
          </View>

          {/* Level Card */}
          <View className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 gap-4">
            <View className="flex-row items-center justify-between">
              <View className="gap-1">
                <Text className="text-sm text-white/80">Seviye</Text>
                <Text className="text-4xl font-bold text-white">{profile.level.level}</Text>
              </View>
              <View className="text-4xl">{profile.level.level === 1 ? "👶" : profile.level.level === 2 ? "👨‍👩‍👧" : profile.level.level === 3 ? "👑" : "🌟"}</View>
            </View>

            <View className="gap-2">
              <Text className="text-lg font-semibold text-white">{profile.level.title}</Text>
              <View className="bg-white/30 rounded-full h-2 overflow-hidden">
                <View
                  className="bg-white h-full rounded-full"
                  style={{ width: `${nextLevel.progressPercentage}%` }}
                />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-white/80">XP: {profile.totalXP}</Text>
                <Text className="text-xs text-white/80">
                  {nextLevel.xpToNextLevel > 0
                    ? `${nextLevel.xpToNextLevel} XP kaldı`
                    : "Maksimum seviye"}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View className="grid grid-cols-3 gap-3">
            <View className="bg-surface rounded-lg p-4 border border-border items-center gap-2">
              <Text className="text-2xl">⭐</Text>
              <Text className="text-xs text-muted">Rozetler</Text>
              <Text className="text-lg font-bold text-foreground">{progress.unlocked}</Text>
            </View>
            <View className="bg-surface rounded-lg p-4 border border-border items-center gap-2">
              <Text className="text-2xl">🔥</Text>
              <Text className="text-xs text-muted">Çizgi</Text>
              <Text className="text-lg font-bold text-foreground">{profile.streak}</Text>
            </View>
            <View className="bg-surface rounded-lg p-4 border border-border items-center gap-2">
              <Text className="text-2xl">💎</Text>
              <Text className="text-xs text-muted">Puan</Text>
              <Text className="text-lg font-bold text-foreground">{profile.totalPoints}</Text>
            </View>
          </View>

          {/* Filter Tabs */}
          <View className="flex-row gap-2">
            {(["all", "unlocked", "locked"] as const).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                className={`flex-1 py-2 px-3 rounded-lg ${
                  filter === f ? "bg-primary" : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`text-sm font-semibold text-center ${
                    filter === f ? "text-white" : "text-foreground"
                  }`}
                >
                  {f === "all" ? "Tümü" : f === "unlocked" ? "Açıldı" : "Kilitli"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Achievements Grid */}
          <View className="gap-3">
            {filteredAchievements.length === 0 ? (
              <View className="bg-surface rounded-lg p-6 items-center border border-border">
                <Text className="text-muted">Başarı bulunamadı</Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap gap-3">
                {filteredAchievements.map((achievement) => (
                  <View
                    key={achievement.id}
                    className={`flex-1 min-w-[30%] rounded-lg p-4 border-2 items-center gap-2 ${
                      achievement.unlocked
                        ? "bg-surface border-primary/50"
                        : "bg-surface/50 border-border opacity-60"
                    }`}
                  >
                    <Text className="text-3xl">{achievement.icon}</Text>
                    <Text className="text-xs font-semibold text-foreground text-center line-clamp-2">
                      {achievement.name}
                    </Text>
                    <View
                      className="px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${rarityColors[achievement.rarity]}20` }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: rarityColors[achievement.rarity] }}
                      >
                        {achievement.rarity === "common"
                          ? "Yaygın"
                          : achievement.rarity === "uncommon"
                          ? "Nadir"
                          : achievement.rarity === "rare"
                          ? "Çok Nadir"
                          : achievement.rarity === "epic"
                          ? "Efsanevi"
                          : "Legendaris"}
                      </Text>
                    </View>
                    {achievement.unlocked && (
                      <Text className="text-xs text-primary font-semibold">+{achievement.points} XP</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Achievement Details */}
          <View className="bg-primary/10 rounded-lg p-4 border border-primary gap-2">
            <Text className="text-sm font-semibold text-primary">💡 Başarı İpuçları</Text>
            <Text className="text-sm text-foreground">
              Başarıları açarak XP kazanın ve seviye atlatın. Her başarı sizi ebeveynlik yolculuğunuzda ileriye taşır!
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
