import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/hooks/use-i18n";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  shareAchievementToSocial,
  generateShareMessage,
  generateAchievementCertificate,
  addToShareHistory,
} from "@/lib/social-sharing";

export default function ShareAchievementScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();

  const [sharing, setSharing] = useState<string | null>(null);

  // Achievement data from params
  const achievement = {
    achievementName: (params.name as string) || "Başarı",
    achievementIcon: (params.icon as string) || "🏆",
    achievementDescription: (params.description as string) || "Bir başarı açtın!",
    childName: (params.childName as string) || "Çocuğum",
    unlockedDate: new Date(),
    level: parseInt((params.level as string) || "1"),
    totalXP: parseInt((params.totalXP as string) || "0"),
  };

  const handleShare = async (platform: "instagram" | "whatsapp" | "email" | "generic") => {
    setSharing(platform);
    try {
      const success = await shareAchievementToSocial(achievement, platform);
      if (success) {
        await addToShareHistory(achievement);
        Alert.alert("Başarı", `${platform} ile paylaşıldı!`);
      } else {
        Alert.alert("Hata", "Paylaşım başarısız oldu");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Hata", "Paylaşım sırasında bir hata oluştu");
    } finally {
      setSharing(null);
    }
  };

  const shareMessage = generateShareMessage(achievement, "whatsapp");
  const certificate = generateAchievementCertificate(achievement);

  const platforms = [
    { id: "whatsapp", name: "WhatsApp", emoji: "💚", color: "#25D366" },
    { id: "instagram", name: "Instagram", emoji: "📷", color: "#E1306C" },
    { id: "email", name: "E-posta", emoji: "📧", color: "#EA4335" },
    { id: "generic", name: "Diğer", emoji: "📤", color: colors.primary },
  ];

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">📤 Başarıyı Paylaş</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Achievement Preview */}
          <View className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 items-center gap-4">
            <Text className="text-5xl">{achievement.achievementIcon}</Text>
            <View className="items-center gap-2">
              <Text className="text-2xl font-bold text-white">{achievement.achievementName}</Text>
              <Text className="text-sm text-white/80">{achievement.childName}</Text>
            </View>
            <View className="bg-white/20 rounded-lg px-4 py-2">
              <Text className="text-white text-sm">{achievement.achievementDescription}</Text>
            </View>
            <View className="flex-row gap-4 pt-2">
              <View className="items-center">
                <Text className="text-xs text-white/80">Seviye</Text>
                <Text className="text-lg font-bold text-white">{achievement.level}</Text>
              </View>
              <View className="w-px bg-white/30" />
              <View className="items-center">
                <Text className="text-xs text-white/80">XP</Text>
                <Text className="text-lg font-bold text-white">+{achievement.totalXP}</Text>
              </View>
            </View>
          </View>

          {/* Share Message Preview */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-2">
            <Text className="text-sm font-semibold text-foreground">Paylaşım Metni</Text>
            <Text className="text-sm text-muted leading-relaxed">{shareMessage}</Text>
          </View>

          {/* Share Platforms */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Nerede Paylaşmak İstersiniz?</Text>
            {platforms.map((platform) => (
              <TouchableOpacity
                key={platform.id}
                onPress={() => handleShare(platform.id as any)}
                disabled={sharing !== null}
                className="bg-surface rounded-lg p-4 border-2 border-border flex-row items-center justify-between active:opacity-80"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <Text className="text-2xl">{platform.emoji}</Text>
                  <Text className="font-semibold text-foreground">{platform.name}</Text>
                </View>
                {sharing === platform.id ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text className="text-lg">→</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Certificate Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">📜 Sertifika</Text>
            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <View className="bg-primary/10 rounded-lg p-3 border border-primary">
                <Text className="text-xs text-primary font-semibold mb-2">SERTİFİKA ÖNİZLEMESİ</Text>
                <Text className="text-xs text-foreground font-mono leading-relaxed">
                  {certificate.split("\n").slice(0, 8).join("\n")}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleShare("email")}
                disabled={sharing !== null}
                className="bg-primary rounded-lg py-3 items-center"
              >
                {sharing === "email" ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-semibold">📧 Sertifikayı E-posta ile Gönder</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Tips */}
          <View className="bg-blue-100 border border-blue-300 rounded-lg p-4 gap-2">
            <Text className="text-sm font-semibold text-blue-900">💡 İpuçları</Text>
            <Text className="text-sm text-blue-800">
              • Başarılarınızı paylaşarak diğer ebeveynleri motive edin{"\n"}
              • Sertifikayı doktor ziyaretlerinde gösterin{"\n"}
              • Aile üyeleriyle başarıları kutlayın
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
