import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter, Link } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";

export default function OnboardingScreen() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-between p-6">
          {/* Hero Section */}
          <View className="flex-1 justify-center gap-8">
            {/* App Logo & Title */}
            <View className="items-center gap-4">
              <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
                <Text className="text-5xl">👶</Text>
              </View>
              <Text className="text-4xl font-bold text-foreground text-center">BabySteps</Text>
              <Text className="text-lg text-muted text-center">
                Çocuğunuzun büyüme yolculuğunu takip edin
              </Text>
            </View>

            {/* Features */}
            <View className="gap-4">
              <FeatureItem
                icon="📈"
                title="Gelişim Takibi"
                description="Boy, kilo ve gelişim kilometre taşlarını izleyin"
              />
              <FeatureItem
                icon="💉"
                title="Aşı Takvimi"
                description="Bakanlık onaylı aşı planını takip edin"
              />
              <FeatureItem
                icon="📸"
                title="Anı Defteri"
                description="Özel anları fotoğraf ve videolarla kaydedin"
              />
              <FeatureItem
                icon="🤖"
                title="AI Asistanı"
                description="Ebeveynlik sorularınıza yapay zeka destekli cevaplar alın"
              />
            </View>
          </View>

          {/* CTA Buttons */}
          <View className="gap-3">
            <Link href="/login" asChild>
              <TouchableOpacity
                className="bg-primary rounded-full py-4 items-center"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-lg">Giriş Yap</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/register" asChild>
              <TouchableOpacity
                className="bg-surface border border-border rounded-full py-4 items-center"
                activeOpacity={0.8}
              >
                <Text className="text-foreground font-semibold text-lg">Kayıt Ol</Text>
              </TouchableOpacity>
            </Link>

            <Text className="text-xs text-muted text-center">
              Devam ederek, Gizlilik Politikası ve Hizmet Şartlarını kabul etmiş olursunuz
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  const colors = useColors();

  return (
    <View className="flex-row gap-3 bg-surface rounded-lg p-4">
      <Text className="text-3xl">{icon}</Text>
      <View className="flex-1">
        <Text className="font-semibold text-foreground">{title}</Text>
        <Text className="text-sm text-muted mt-1">{description}</Text>
      </View>
    </View>
  );
}
