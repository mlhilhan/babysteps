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
  BackHandler,
} from "react-native";

export default function LoginScreen() {
  const { login } = useAuth({ autoFetch: false });
  const colors = useColors();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      BackHandler.exitApp();
      return true;
    });
    return () => sub.remove();
  }, []);

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
    setSubmitting(true);
    const result = await login(trimmedEmail, password);
    setSubmitting(false);
    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    router.replace("/(tabs)");
  };

  const handleApple = () => alert("Apple ile Giriş yakında sunulacak.");
  const handleGoogle = () => alert("Google ile Giriş yakında sunulacak.");

  return (
    <ScreenContainer className="flex-1 bg-background" edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-6"
      >
        <View className="gap-6">
          <Text className="text-2xl font-bold text-foreground text-center">Giriş Yap</Text>
          <Text className="text-muted text-center">BabySteps hesabınızla giriş yapın</Text>

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

          <View>
            <TextInput
              className={`bg-surface border rounded-xl px-4 py-3 text-foreground ${passwordError ? "border-error" : "border-border"}`}
              placeholder="Şifre"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={(v) => { setPassword(v); if (passwordError) setPasswordError(null); }}
              secureTextEntry
              autoComplete="password"
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
              <Text className="text-white font-semibold text-base">Giriş Yap</Text>
            )}
          </TouchableOpacity>

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

          <View className="flex-row justify-center gap-1">
            <Text className="text-muted">Hesabınız yok mu?</Text>
            <TouchableOpacity onPress={() => router.replace("/register")}>
              <Text className="text-primary font-semibold">Kayıt olun</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
