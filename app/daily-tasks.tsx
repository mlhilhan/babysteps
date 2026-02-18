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
} from "react-native";
import {
  getUserProfile,
  completeDailyTask,
  getDailyTaskProgress,
  type UserProfile,
} from "@/lib/gamification";

export default function DailyTasksScreen() {
  const { t } = useTranslation();
  const colors = useColors();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

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

  const handleCompleteTask = async (taskId: string) => {
    if (!profile) return;

    setCompleting(taskId);
    try {
      const updated = await completeDailyTask(1, taskId);
      setProfile(updated);
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setCompleting(null);
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
        <Text className="text-foreground">Görevler yüklenemedi</Text>
      </ScreenContainer>
    );
  }

  const progress = getDailyTaskProgress(profile.dailyTasks);
  const completedToday = profile.dailyTasks.filter((t) => t.completed).length;

  const categoryEmojis = {
    tracking: "📊",
    community: "👥",
    health: "🏥",
    learning: "📚",
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">📋 Günlük Görevler</Text>
            <View className="bg-primary/20 rounded-full px-4 py-2">
              <Text className="text-sm font-semibold text-primary">{completedToday}/{profile.dailyTasks.length}</Text>
            </View>
          </View>

          {/* Progress Card */}
          <View className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 gap-4">
            <View className="flex-row items-center justify-between">
              <View className="gap-1">
                <Text className="text-sm text-white/80">Bugünün İlerlemesi</Text>
                <Text className="text-4xl font-bold text-white">{progress.percentage}%</Text>
              </View>
              <View className="text-4xl">🎯</View>
            </View>

            <View className="bg-white/30 rounded-full h-3 overflow-hidden">
              <View
                className="bg-white h-full rounded-full"
                style={{ width: `${progress.percentage}%` }}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-white">
                {completedToday} / {profile.dailyTasks.length} görev tamamlandı
              </Text>
              <Text className="text-sm font-semibold text-white">+{completedToday * 10} XP</Text>
            </View>
          </View>

          {/* Streak Info */}
          {profile.streak > 0 && (
            <View className="bg-orange-100 border border-orange-300 rounded-lg p-4 flex-row items-center gap-3">
              <Text className="text-3xl">🔥</Text>
              <View className="flex-1">
                <Text className="font-semibold text-orange-900">{profile.streak} Günlük Çizgi!</Text>
                <Text className="text-sm text-orange-800">Devam et, sen yapabilirsin!</Text>
              </View>
            </View>
          )}

          {/* Tasks List */}
          <View className="gap-3">
            {profile.dailyTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => !task.completed && handleCompleteTask(task.id)}
                disabled={task.completed || completing === task.id}
                className={`rounded-lg p-4 border-2 flex-row items-center gap-4 ${
                  task.completed
                    ? "bg-primary/20 border-primary"
                    : "bg-surface border-border active:opacity-80"
                }`}
              >
                {/* Checkbox */}
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    task.completed
                      ? "bg-primary border-primary"
                      : "border-border"
                  }`}
                >
                  {task.completed && <Text className="text-white font-bold">✓</Text>}
                </View>

                {/* Content */}
                <View className="flex-1 gap-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-lg">{task.icon}</Text>
                    <Text className={`font-semibold ${task.completed ? "text-primary line-through" : "text-foreground"}`}>
                      {task.title}
                    </Text>
                  </View>
                  <Text className="text-sm text-muted">{task.description}</Text>
                </View>

                {/* Points */}
                <View className="items-end gap-1">
                  {completing === task.id ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <>
                      <Text className="text-sm font-semibold text-primary">+{task.points} XP</Text>
                      <View className="bg-primary/20 rounded-full px-2 py-1">
                        <Text className="text-xs font-semibold text-primary">
                          {categoryEmojis[task.category as keyof typeof categoryEmojis]}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Motivation */}
          {completedToday === profile.dailyTasks.length ? (
            <View className="bg-green-100 border border-green-300 rounded-lg p-4 items-center gap-2">
              <Text className="text-3xl">🎉</Text>
              <Text className="font-semibold text-green-900">Tüm Görevleri Tamamladın!</Text>
              <Text className="text-sm text-green-800">Harika iş! Yarın yeniden başla.</Text>
            </View>
          ) : (
            <View className="bg-blue-100 border border-blue-300 rounded-lg p-4 items-center gap-2">
              <Text className="text-3xl">💪</Text>
              <Text className="font-semibold text-blue-900">Devam Et!</Text>
              <Text className="text-sm text-blue-800">
                {profile.dailyTasks.length - completedToday} görev daha kaldı
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
