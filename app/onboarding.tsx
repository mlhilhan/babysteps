import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

export default function OnboardingScreen() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, loading]);

  const handleLogin = async () => {
    try {
      // OAuth login URL - bu URL app.config.ts'deki scheme ile eşleşmelidir
      const scheme = "manus20260218111443"; // app.config.ts'deki schemeFromBundleId
      const redirectUrl = Linking.createURL("/oauth/callback");
      
      const loginUrl = `https://auth.manus.im/oauth/authorize?client_id=babysteps&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=openid%20profile%20email`;
      
      const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUrl);
      
      if (result.type === "success") {
        // OAuth callback tarafından işlenecek
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

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
            <TouchableOpacity
              onPress={handleLogin}
              className="bg-primary rounded-full py-4 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-lg">Giriş Yap / Kaydol</Text>
            </TouchableOpacity>

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
