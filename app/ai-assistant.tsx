import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/hooks/use-i18n";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIAssistantScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Merhaba! Ben BabySteps AI Asistanıyım. Çocuğunuzun gelişimi, beslenme, uyku ve sağlığı hakkında sorularınızı cevaplayabilirim. Nasıl yardımcı olabilirim?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      // Simulated AI response - In production, this would call your LLM API
      // For now, we'll use a simple mock response
      const mockResponses = [
        "Bu çok iyi bir soru! Çocuğunuzun yaşına ve gelişim aşamasına göre tavsiyeler verebilirim. Lütfen çocuğunuzun yaşını belirtir misiniz?",
        "Beslenme çok önemli bir konudur. Çocuğunuzun yaşına uygun besinler hakkında daha fazla bilgi almak isterseniz, lütfen detayları paylaşın.",
        "Uyku düzeni çocuğun gelişimi için kritik öneme sahiptir. Yaşa uygun uyku süresi hakkında bilgi almak isterseniz, çocuğunuzun yaşını söyleyebilir misiniz?",
        "Sağlık konuları çok önemlidir. Belirttiğiniz durumda, doktorunuzla iletişime geçmenizi tavsiye ederim. Ancak genel bilgiler sağlayabilirim.",
        "Harika bir gözlem! Çocuğunuzun gelişim süreci tamamen normal görünüyor. Devam etmesi için teşvik etmeyi unutmayın.",
      ];

      const randomResponse =
        mockResponses[Math.floor(Math.random() * mockResponses.length)];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 pt-4">
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">🤖</Text>
              <View>
                <Text className="text-lg font-bold text-foreground">
                  {t("ai_assistant.title")}
                </Text>
                <Text className="text-xs text-muted">Ebeveynlik danışmanınız</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4"
            contentContainerStyle={{ paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                className={`mb-4 flex-row ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <View
                  className={`max-w-xs rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-sm leading-relaxed ${
                      message.role === "user"
                        ? "text-white"
                        : "text-foreground"
                    }`}
                  >
                    {message.content}
                  </Text>
                  <Text
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-white/70"
                        : "text-muted"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            ))}

            {loading && (
              <View className="flex-row justify-start mb-4">
                <View className="bg-surface border border-border rounded-lg px-4 py-3">
                  <ActivityIndicator color={colors.primary} />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View className="border-t border-border px-4 py-4 gap-3">
            <View className="flex-row gap-2 items-end">
              <TextInput
                placeholder={t("ai_assistant.ask_question")}
                value={inputText}
                onChangeText={setInputText}
                multiline
                numberOfLines={3}
                maxLength={500}
                className="flex-1 bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                placeholderTextColor={colors.muted}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={loading || !inputText.trim()}
                className={`w-12 h-12 rounded-lg items-center justify-center ${
                  loading || !inputText.trim()
                    ? "bg-muted/30"
                    : "bg-primary"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-xl">📤</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <View className="gap-2">
                <Text className="text-xs text-muted font-semibold">
                  Örnek Sorular:
                </Text>
                <View className="gap-2">
                  {[
                    "6 aylık bebeğim için beslenme önerileri nelerdir?",
                    "Bebeğimin uyku düzeni nasıl olmalı?",
                    "Aşı takvimi hakkında bilgi verir misiniz?",
                  ].map((question, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setInputText(question);
                      }}
                      className="bg-surface rounded-lg px-3 py-2 border border-border"
                    >
                      <Text className="text-xs text-foreground">
                        {question}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
