import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Gamification Service
 * Handles achievements, levels, daily tasks, and rewards system
 */

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "milestone" | "health" | "consistency" | "social" | "special";
  points: number;
  unlocked: boolean;
  unlockedDate?: Date;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

interface UserLevel {
  level: number;
  xp: number;
  xpRequired: number;
  title: string;
  color: string;
  [key: string]: any;
}

interface DailyTask {
  id: string;
  title: string;
  description: string;
  category: "tracking" | "community" | "health" | "learning";
  points: number;
  completed: boolean;
  completedDate?: Date;
  icon: string;
}

interface UserProfile {
  userId: number;
  totalXP: number;
  level: UserLevel;
  achievements: Achievement[];
  dailyTasks: DailyTask[];
  totalPoints: number;
  streak: number;
  lastActivityDate: Date;
}

const ACHIEVEMENTS_DATA: Achievement[] = [
  // Milestone Achievements
  {
    id: "first_child",
    name: "İlk Çocuk",
    description: "İlk çocuk profilini oluştur",
    icon: "👶",
    category: "milestone",
    points: 50,
    unlocked: false,
    rarity: "common",
  },
  {
    id: "first_vaccination",
    name: "İlk Aşı",
    description: "İlk aşıyı kaydet",
    icon: "💉",
    category: "health",
    points: 100,
    unlocked: false,
    rarity: "uncommon",
  },
  {
    id: "first_tooth",
    name: "İlk Diş",
    description: "İlk dişin çıkmasını kaydet",
    icon: "🦷",
    category: "milestone",
    points: 75,
    unlocked: false,
    rarity: "uncommon",
  },
  {
    id: "first_word",
    name: "İlk Kelime",
    description: "İlk kelimeyi kaydet",
    icon: "🗣️",
    category: "milestone",
    points: 75,
    unlocked: false,
    rarity: "uncommon",
  },
  {
    id: "first_steps",
    name: "İlk Adımlar",
    description: "İlk adımları kaydet",
    icon: "👣",
    category: "milestone",
    points: 100,
    unlocked: false,
    rarity: "uncommon",
  },

  // Health Achievements
  {
    id: "vaccination_complete",
    name: "Aşı Takvimi Tamamlandı",
    description: "Tüm aşıları tamamla",
    icon: "💪",
    category: "health",
    points: 250,
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "growth_tracked",
    name: "Büyüme Takip Ustası",
    description: "10 büyüme ölçümü kaydet",
    icon: "📏",
    category: "health",
    points: 150,
    unlocked: false,
    rarity: "uncommon",
  },
  {
    id: "nutrition_logged",
    name: "Beslenme Takip Ustası",
    description: "30 beslenme günlüğü girdisi kaydet",
    icon: "🍽️",
    category: "health",
    points: 150,
    unlocked: false,
    rarity: "uncommon",
  },
  {
    id: "sleep_tracked",
    name: "Uyku Takip Ustası",
    description: "30 uyku günlüğü girdisi kaydet",
    icon: "😴",
    category: "health",
    points: 150,
    unlocked: false,
    rarity: "uncommon",
  },

  // Consistency Achievements
  {
    id: "week_streak",
    name: "Haftalık Çizgi",
    description: "7 gün üst üste günlük görevleri tamamla",
    icon: "🔥",
    category: "consistency",
    points: 200,
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "month_streak",
    name: "Aylık Çizgi",
    description: "30 gün üst üste günlük görevleri tamamla",
    icon: "🔥🔥",
    category: "consistency",
    points: 500,
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "hundred_days",
    name: "Yüz Günlük Yolculuk",
    description: "100 gün üst üste günlük görevleri tamamla",
    icon: "💯",
    category: "consistency",
    points: 1000,
    unlocked: false,
    rarity: "legendary",
  },

  // Social Achievements
  {
    id: "first_share",
    name: "Paylaşan Ebeveyn",
    description: "İlk anıyı aile ile paylaş",
    icon: "📸",
    category: "social",
    points: 100,
    unlocked: false,
    rarity: "uncommon",
  },
  {
    id: "community_active",
    name: "Topluluk Üyesi",
    description: "Topluluğa 5 yazı yaz",
    icon: "👥",
    category: "social",
    points: 150,
    unlocked: false,
    rarity: "uncommon",
  },
  {
    id: "helpful_parent",
    name: "Yardımcı Ebeveyn",
    description: "Topluluğa 10 yazı yaz",
    icon: "🤝",
    category: "social",
    points: 300,
    unlocked: false,
    rarity: "rare",
  },

  // Special Achievements
  {
    id: "first_report",
    name: "Rapor Uzmanı",
    description: "İlk PDF raporunu oluştur",
    icon: "📄",
    category: "special",
    points: 100,
    unlocked: false,
    rarity: "uncommon",
  },
  {
    id: "ai_chat",
    name: "AI Danışmanı",
    description: "AI asistanı ile 5 sohbet yap",
    icon: "🤖",
    category: "special",
    points: 150,
    unlocked: false,
    rarity: "uncommon",
  },
  {
    id: "backup_master",
    name: "Yedekleme Ustası",
    description: "Cloud backup'ı etkinleştir",
    icon: "☁️",
    category: "special",
    points: 100,
    unlocked: false,
    rarity: "uncommon",
  },
];

const DAILY_TASKS_DATA: DailyTask[] = [
  {
    id: "daily_check_in",
    title: "Günlük Check-in",
    description: "Uygulamayı aç ve kontrol et",
    category: "tracking",
    points: 10,
    completed: false,
    icon: "📱",
  },
  {
    id: "log_growth",
    title: "Büyüme Ölçümü",
    description: "Çocuğun boy/kilo ölçümünü kaydet",
    category: "tracking",
    points: 25,
    completed: false,
    icon: "📏",
  },
  {
    id: "log_nutrition",
    title: "Beslenme Kaydı",
    description: "Beslenme günlüğüne giriş yap",
    category: "health",
    points: 20,
    completed: false,
    icon: "🍽️",
  },
  {
    id: "log_sleep",
    title: "Uyku Kaydı",
    description: "Uyku saatlerini kaydet",
    category: "health",
    points: 20,
    completed: false,
    icon: "😴",
  },
  {
    id: "community_post",
    title: "Topluluk Paylaşımı",
    description: "Topluluğa bir yazı yaz",
    category: "community",
    points: 30,
    completed: false,
    icon: "💬",
  },
];

const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, xpRequired: 0, title: "Yeni Ebeveyn", color: "#0A9B8E" },
  { level: 2, xp: 100, xpRequired: 100, title: "Deneyimli Ebeveyn", color: "#1E88E5" },
  { level: 3, xp: 300, xpRequired: 300, title: "Uzman Ebeveyn", color: "#7B1FA2" },
  { level: 4, xp: 600, xpRequired: 600, title: "Usta Ebeveyn", color: "#F57C00" },
  { level: 5, xp: 1000, xpRequired: 1000, title: "Efsanevi Ebeveyn", color: "#FFD700" },
];

/**
 * Initialize gamification for user
 */
export async function initializeGamification(userId: number): Promise<UserProfile> {
  try {
    const existing = await AsyncStorage.getItem(`gamification_${userId}`);
    if (existing) {
      return JSON.parse(existing);
    }

    const profile: UserProfile = {
      userId,
      totalXP: 0,
      level: LEVEL_THRESHOLDS[0],
      achievements: ACHIEVEMENTS_DATA,
      dailyTasks: DAILY_TASKS_DATA,
      totalPoints: 0,
      streak: 0,
      lastActivityDate: new Date(),
    };

    await AsyncStorage.setItem(`gamification_${userId}`, JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.error("Error initializing gamification:", error);
    throw error;
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: number): Promise<UserProfile> {
  try {
    const data = await AsyncStorage.getItem(`gamification_${userId}`);
    if (!data) {
      return initializeGamification(userId);
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

/**
 * Add XP and check for level up
 */
export async function addXP(userId: number, xpAmount: number): Promise<UserProfile> {
  try {
    const profile = await getUserProfile(userId);
    profile.totalXP += xpAmount;

    // Check for level up
    const newLevel = LEVEL_THRESHOLDS.find(
      (t) => profile.totalXP >= t.xpRequired && profile.totalXP < (LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.indexOf(t) + 1]?.xpRequired || Infinity)
    );

    if (newLevel && newLevel.level > profile.level.level) {
      profile.level = newLevel;
    }

    await AsyncStorage.setItem(`gamification_${userId}`, JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.error("Error adding XP:", error);
    throw error;
  }
}

/**
 * Unlock achievement
 */
export async function unlockAchievement(userId: number, achievementId: string): Promise<UserProfile> {
  try {
    const profile = await getUserProfile(userId);
    const achievement = profile.achievements.find((a) => a.id === achievementId);

    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedDate = new Date();
      profile.totalPoints += achievement.points;

      // Add XP
      await addXP(userId, achievement.points);
    }

    await AsyncStorage.setItem(`gamification_${userId}`, JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.error("Error unlocking achievement:", error);
    throw error;
  }
}

/**
 * Complete daily task
 */
export async function completeDailyTask(userId: number, taskId: string): Promise<UserProfile> {
  try {
    const profile = await getUserProfile(userId);
    const task = profile.dailyTasks.find((t) => t.id === taskId);

    if (task && !task.completed) {
      task.completed = true;
      task.completedDate = new Date();
      profile.totalPoints += task.points;

      // Add XP
      await addXP(userId, task.points);

      // Update streak
      const lastActivity = new Date(profile.lastActivityDate);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Same day, no change
      } else if (daysDiff === 1) {
        // Consecutive day
        profile.streak++;
      } else {
        // Streak broken
        profile.streak = 1;
      }

      profile.lastActivityDate = today;
    }

    await AsyncStorage.setItem(`gamification_${userId}`, JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.error("Error completing daily task:", error);
    throw error;
  }
}

/**
 * Reset daily tasks
 */
export async function resetDailyTasks(userId: number): Promise<void> {
  try {
    const profile = await getUserProfile(userId);
    profile.dailyTasks = DAILY_TASKS_DATA.map((task) => ({
      ...task,
      completed: false,
      completedDate: undefined,
    }));

    await AsyncStorage.setItem(`gamification_${userId}`, JSON.stringify(profile));
  } catch (error) {
    console.error("Error resetting daily tasks:", error);
    throw error;
  }
}

/**
 * Get unlocked achievements
 */
export async function getUnlockedAchievements(userId: number): Promise<Achievement[]> {
  try {
    const profile = await getUserProfile(userId);
    return profile.achievements.filter((a) => a.unlocked);
  } catch (error) {
    console.error("Error getting unlocked achievements:", error);
    return [];
  }
}

/**
 * Get achievement progress
 */
export function getAchievementProgress(achievements: Achievement[]): {
  unlocked: number;
  total: number;
  percentage: number;
} {
  const unlocked = achievements.filter((a) => a.unlocked).length;
  const total = achievements.length;
  const percentage = Math.round((unlocked / total) * 100);

  return { unlocked, total, percentage };
}

/**
 * Get daily task progress
 */
export function getDailyTaskProgress(tasks: DailyTask[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const percentage = Math.round((completed / total) * 100);

  return { completed, total, percentage };
}

/**
 * Calculate next level info
 */
export function getNextLevelInfo(currentXP: number): {
  currentLevel: number;
  nextLevel: number;
  xpToNextLevel: number;
  progressPercentage: number;
} {
  const currentLevelData = LEVEL_THRESHOLDS.find(
    (t) => currentXP >= t.xpRequired && currentXP < (LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.indexOf(t) + 1]?.xpRequired || Infinity)
  ) || LEVEL_THRESHOLDS[0];

  const nextLevelIndex = LEVEL_THRESHOLDS.indexOf(currentLevelData) + 1;
  const nextLevelData = LEVEL_THRESHOLDS[nextLevelIndex];

  if (!nextLevelData) {
    return {
      currentLevel: currentLevelData.level,
      nextLevel: currentLevelData.level,
      xpToNextLevel: 0,
      progressPercentage: 100,
    };
  }

  const xpToNextLevel = nextLevelData.xpRequired - currentXP;
  const totalXPForLevel = nextLevelData.xpRequired - currentLevelData.xpRequired;
  const xpEarned = currentXP - currentLevelData.xpRequired;
  const progressPercentage = Math.round((xpEarned / totalXPForLevel) * 100);

  return {
    currentLevel: currentLevelData.level,
    nextLevel: nextLevelData.level,
    xpToNextLevel,
    progressPercentage,
  };
}
