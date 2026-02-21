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
  ScrollView,
} from "react-native";

export default function RegisterScreen() {
  const { register } = useAuth({ autoFetch: false });
  const colors = useColors();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı");
      return;
    }
    setSubmitting(true);
    const result = await register(trimmedEmail, password, name.trim() || undefined);
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
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          className="px-6 py-8"
        >
          <View className="gap-6">
            <Text className="text-2xl font-bold text-foreground text-center">Kayıt Ol</Text>
            <Text className="text-muted text-center">Yeni bir BabySteps hesabı oluşturun</Text>

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
              placeholder="Ad (isteğe bağlı)"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
              autoComplete="name"
              editable={!submitting}
            />
            <TextInput
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
              placeholder="Şifre (en az 6 karakter)"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password-new"
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
                <Text className="text-white font-semibold text-base">Kayıt Ol</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center gap-1">
              <Text className="text-muted">Zaten hesabınız var mı?</Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-semibold">Giriş yapın</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
