import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
} from "react-native";

export default function RegisterScreen() {
  const { register } = useAuth({ autoFetch: false });
  const colors = useColors();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      router.replace("/login");
      return true;
    });
    return () => sub.remove();
  }, [router]);

  const clearErrors = () => {
    setEmailError(null);
    setPasswordError(null);
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    clearErrors();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("E-posta girin");
      return;
    }
    if (!password) {
      setPasswordError("Şifre girin");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Şifre en az 6 karakter olmalı");
      return;
    }
    setSubmitting(true);
    const result = await register(trimmedEmail, password, name.trim() || undefined);
    setSubmitting(false);
    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer className="flex-1 bg-background" edges={["top", "left", "right", "bottom"]}>
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

            <View>
              <TextInput
                className={`bg-surface border rounded-xl px-4 py-3 text-foreground ${emailError ? "border-error" : "border-border"}`}
                placeholder="E-posta"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={(v) => { setEmail(v); if (emailError) setEmailError(null); }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!submitting}
              />
              {emailError ? <Text className="text-error text-sm mt-1">{emailError}</Text> : null}
            </View>

            <TextInput
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
              placeholder="Ad (isteğe bağlı)"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
              autoComplete="name"
              editable={!submitting}
            />

            <View>
              <TextInput
                className={`bg-surface border rounded-xl px-4 py-3 text-foreground ${passwordError ? "border-error" : "border-border"}`}
                placeholder="Şifre (en az 6 karakter)"
                placeholderTextColor={colors.muted}
                value={password}
                onChangeText={(v) => { setPassword(v); if (passwordError) setPasswordError(null); }}
                secureTextEntry
                autoComplete="password-new"
                editable={!submitting}
              />
              {passwordError ? <Text className="text-error text-sm mt-1">{passwordError}</Text> : null}
            </View>

            {submitError ? (
              <Text className="text-error text-sm text-center">{submitError}</Text>
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
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text className="text-primary font-semibold">Giriş yapın</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
