import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter, Link } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function LoginScreen() {
  const { login } = useAuth({ autoFetch: false });
  const colors = useColors();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("E-posta girin");
      return;
    }
    if (!password) {
      setError("Şifre girin");
      return;
    }
    setSubmitting(true);
    const result = await login(trimmedEmail, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-6"
      >
        <View className="gap-6">
          <Text className="text-2xl font-bold text-foreground text-center">Giriş Yap</Text>
          <Text className="text-muted text-center">BabySteps hesabınızla giriş yapın</Text>

          <TextInput
            className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
            placeholder="E-posta"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!submitting}
          />
          <TextInput
            className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
            placeholder="Şifre"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            editable={!submitting}
          />

          {error ? (
            <Text className="text-error text-sm text-center">{error}</Text>
          ) : null}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            className="bg-primary rounded-xl py-4 items-center"
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">Giriş Yap</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center gap-1">
            <Text className="text-muted">Hesabınız yok mu?</Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-semibold">Kayıt olun</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
