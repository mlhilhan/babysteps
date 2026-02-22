import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import { ONBOARDING_SEEN_KEY } from "@/constants/auth";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCROLL_HINT_HIDE_THRESHOLD = 60;
const BOUNCE_DISTANCE = 6;
const BOUNCE_DURATION = 500;

export default function OnboardingScreen() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const bounceY = useSharedValue(0);

  useEffect(() => {
    bounceY.value = withRepeat(
      withSequence(
        withTiming(BOUNCE_DISTANCE, { duration: BOUNCE_DURATION }),
        withTiming(0, { duration: BOUNCE_DURATION })
      ),
      -1,
      true
    );
  }, [bounceY]);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceY.value }],
  }));

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > SCROLL_HINT_HIDE_THRESHOLD && showScrollHint) setShowScrollHint(false);
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/(tabs)");
      return;
    }
    (async () => {
      try {
        const seen = await AsyncStorage.getItem(ONBOARDING_SEEN_KEY);
        if (seen === "1" || seen === "true") {
          setShowOnboarding(false);
          setCheckingOnboarding(false);
          router.replace("/login");
        } else {
          setShowOnboarding(true);
          setCheckingOnboarding(false);
        }
      } catch {
        setShowOnboarding(true);
        setCheckingOnboarding(false);
      }
    })();
  }, [loading, isAuthenticated, router]);

  const markOnboardingSeen = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, "1");
    } catch {}
  };

  const handleLogin = async () => {
    await markOnboardingSeen();
    router.replace("/login");
  };

  const handleRegister = async () => {
    await markOnboardingSeen();
    router.replace("/register");
  };

  const handleApple = async () => {
    await markOnboardingSeen();
    if (Platform.OS === "web") {
      alert("Apple ile Giriş yakında sunulacak.");
    } else {
      alert("Apple ile Giriş yakında sunulacak.");
    }
  };

  const handleGoogle = async () => {
    await markOnboardingSeen();
    if (Platform.OS === "web") {
      alert("Google ile Giriş yakında sunulacak.");
    } else {
      alert("Google ile Giriş yakında sunulacak.");
    }
  };

  if (loading || checkingOnboarding) {
    return (
      <ScreenContainer
        className="flex items-center justify-center"
        edges={["top", "left", "right", "bottom"]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!showOnboarding) {
    return null;
  }

  return (
    <ScreenContainer className="bg-background" edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View className="flex-1 justify-between p-6 pb-8">
          {/* Hero */}
          <View className="flex-1 justify-center gap-6">
            <View className="items-center gap-4">
              <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
                <Text className="text-5xl">👶</Text>
              </View>
              <Text className="text-4xl font-bold text-foreground text-center">BabySteps</Text>
              <Text className="text-lg text-muted text-center">
                Çocuğunuzun büyüme yolculuğunu takip edin
              </Text>
            </View>

            {/* Özellikler (ikonlu kartlar) */}
            <View className="gap-3">
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

            {/* İlk açılış ipucu (bilgilendirme) */}
            <View className="bg-primary/10 rounded-xl p-4 gap-2 border border-primary/20">
              <Text className="font-semibold text-foreground flex-row items-center gap-2">
                <Text className="text-lg">💡</Text> İlk Adım İpucu
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                Çocuğunuzun uyku düzeni düzenli tutmak, gelişimi için çok önemlidir. Her gün aynı
                saatlerde yatırıp kaldırmaya çalışın.
              </Text>
            </View>
          </View>

          {/* Giriş butonları */}
          <View className="gap-3 mt-8">
            <TouchableOpacity
              onPress={handleLogin}
              className="bg-primary rounded-xl py-4 items-center flex-row justify-center gap-2"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">Giriş Yap</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRegister}
              className="bg-surface border border-border rounded-xl py-4 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-foreground font-semibold text-base">Kayıt Ol</Text>
            </TouchableOpacity>

            {/* Apple / Google (demo) */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleApple}
                className="flex-1 bg-foreground rounded-xl py-3.5 items-center flex-row justify-center gap-2"
                activeOpacity={0.8}
              >
                <Text className="text-lg" style={{ color: "#fff" }}>{"\uD83C\uDF4E"}</Text>
                <Text className="font-semibold text-sm" style={{ color: "#fff" }}>Apple ile Giriş</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGoogle}
                className="flex-1 bg-surface border border-border rounded-xl py-3.5 items-center flex-row justify-center gap-2"
                activeOpacity={0.8}
              >
                <Text className="text-lg text-foreground">G</Text>
                <Text className="font-semibold text-sm text-foreground">Google ile Giriş</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-xs text-muted text-center pt-1">
              Devam ederek, Gizlilik Politikası ve Hizmet Şartlarını kabul etmiş olursunuz
            </Text>
          </View>
        </View>
      </ScrollView>

      {showScrollHint && (
        <View
          className="absolute left-0 right-0 items-center py-3"
          style={{ bottom: insets.bottom + 12 }}
          pointerEvents="none"
        >
          <Animated.View style={bounceStyle} className="items-center gap-1">
            <Text className="text-xs text-muted">Aşağı kaydırın</Text>
            <Text className="text-primary text-xl">↓</Text>
          </Animated.View>
        </View>
      )}
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
  return (
    <View className="flex-row gap-3 bg-surface rounded-xl p-4 border border-border/50">
      <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
        <Text className="text-2xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-foreground">{title}</Text>
        <Text className="text-sm text-muted mt-0.5">{description}</Text>
      </View>
    </View>
  );
}
