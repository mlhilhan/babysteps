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
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const EXAMPLE_QUESTIONS = [
  "6 aylık bebeğim için hangi ek gıdalarla başlamalıyım?",
  "Çocuğumun uyku düzeni nasıl düzeltebilirim?",
  "Teşerme nedir ve nasıl tedavi edilir?",
  "Aşılar ne zaman yapılmalıdır?",
];

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
    loadChatHistory();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem("ai_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const saveChatHistory = async (msgs: Message[]) => {
    try {
      await AsyncStorage.setItem("ai_chat_history", JSON.stringify(msgs));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

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
      // Simulate LLM API call - in production, this would call your backend
      const response = await generateAIResponse(inputText);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);
      saveChatHistory(updatedMessages);
    } catch (error) {
      Alert.alert("Hata", "AI Asistanı şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = async (question: string): Promise<string> => {
    // Simulated AI responses based on keywords
    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes("ek gıda") ||
      lowerQuestion.includes("beslenme") ||
      lowerQuestion.includes("mama")
    ) {
      return `Çocuğunuzun ek gıdaya başlama yaşı 6 aydır. Başlangıçta tek bileşenli gıdalarla (pirinç, muz, elma) başlayın. Her yeni gıdayı 3-5 gün aralıklarla ekleyin ve alerjik reaksyon olup olmadığını gözlemleyin. Tuz ve şeker eklemeden hazırlanan ev yapımı gıdalar en iyisidir.`;
    } else if (lowerQuestion.includes("uyku")) {
      return `Yaşa göre önerilen uyku saatleri:
- 0-3 ay: 16-17 saat
- 4-11 ay: 12-15 saat
- 1-2 yaş: 11-14 saat
- 3-5 yaş: 10-13 saat

Düzenli uyku saati, karanlık oda ve sakin ortam uyku kalitesini artırır. Gece uyku öncesi sakinleştirici rutinler (masaj, şarkı) yardımcı olabilir.`;
    } else if (lowerQuestion.includes("aşı")) {
      return `Türkiye'de resmi aşı takvimi:
- Doğum: BCG, Hepatit B
- 2 ay: DPT, Polio, Pnömokok
- 4 ay: DPT, Polio, Pnömokok
- 6 ay: DPT, Polio, Pnömokok, Hepatit B
- 12-15 ay: KKK, Suçiçeği
- 18 ay: DPT, Polio booster

Aşılar çocuğunuzu ciddi hastalıklardan korur. Yan etkileri genellikle hafif ve geçicidir.`;
    } else if (lowerQuestion.includes("hastalık") || lowerQuestion.includes("ateş")) {
      return `Çocuğunuzun ateşi varsa:
1. Vücut ısısını ölçün (38°C üzeri ateştir)
2. Hafif giydir ve ortamı serinlet
3. Bol su ve sıvı içir
4. Doktor tavsiyesi olmadan antibiyotik vermeyin
5. 38.5°C üzerinde doktora başvur

Ateş genellikle vücudun enfeksiyonla savaştığının işaretidir ve kötü değildir.`;
    } else if (lowerQuestion.includes("gelişim") || lowerQuestion.includes("motor")) {
      return `Yaşa göre gelişim kilometre taşları:
- 3 ay: Başını kontrol etmeye başlar
- 6 ay: Oturmaya başlar
- 9 ay: Emeklemeye başlar
- 12 ay: Ayağa kalkıp adım atmaya başlar
- 18 ay: Koşmaya başlar
- 2 yaş: Dili gelişir, basit cümleler kurar

Her çocuk kendi hızında gelişir. Endişe varsa pediatrisyona danışın.`;
    } else if (lowerQuestion.includes("dil") || lowerQuestion.includes("konuşma")) {
      return `Dil gelişimi:
- 6 ay: Sesler çıkarmaya başlar
- 9 ay: "Baba", "Mama" gibi sesler
- 12 ay: İlk kelimeler
- 18 ay: 10-50 kelime
- 2 yaş: 50+ kelime, basit cümleler

Çocuğunuzla konuşun, kitap okuyun ve müzik dinletin. Ekran süresi sınırlayın.`;
    } else {
      return `Sorunuz hakkında genel bilgi: Çocuğunuzun sağlığı ve gelişimi konusunda endişeleriniz varsa, her zaman pediatrisyona danışmanız önerilir. BabySteps uygulaması tıbbi tavsiye yerine geçmez. Acil durumlarda 112'yi arayın.`;
    }
  };

  const handleExampleQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <ScreenContainer className="bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 gap-4 p-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">🤖 AI Asistanı</Text>
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
            className="flex-1 gap-3"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          >
            {messages.length === 1 ? (
              <View className="flex-1 justify-center gap-4">
                <View className="bg-surface rounded-lg p-6 gap-3">
                  <Text className="text-lg font-semibold text-foreground text-center">
                    Örnek Sorular
                  </Text>
                  <Text className="text-sm text-muted text-center">
                    Aşağıdaki sorulardan birine tıklayın veya kendi sorunuzu yazın
                  </Text>
                </View>

                {EXAMPLE_QUESTIONS.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleExampleQuestion(question)}
                    className="bg-primary/10 rounded-lg p-4 border border-primary"
                  >
                    <Text className="text-sm text-primary">{question}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              messages.map((message) => (
                <View
                  key={message.id}
                  className={`flex-row ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <View
                    className={`max-w-xs rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary"
                        : "bg-surface border border-border"
                    }`}
                  >
                    <Text
                      className={`text-sm leading-relaxed ${
                        message.role === "user" ? "text-white" : "text-foreground"
                      }`}
                    >
                      {message.content}
                    </Text>
                    <Text
                      className={`text-xs mt-1 ${
                        message.role === "user" ? "text-white/70" : "text-muted"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              ))
            )}

            {loading && (
              <View className="flex-row justify-start">
                <View className="bg-surface rounded-lg p-3 gap-2">
                  <ActivityIndicator color={colors.primary} />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View className="flex-row gap-2 items-end">
            <TextInput
              placeholder="Sorunuzu yazın..."
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
              disabled={!inputText.trim() || loading}
              className={`w-12 h-12 rounded-lg items-center justify-center ${
                inputText.trim() && !loading ? "bg-primary" : "bg-primary/50"
              }`}
            >
              <Text className="text-xl">➤</Text>
            </TouchableOpacity>
          </View>

          {/* Clear History Button */}
          <TouchableOpacity
            onPress={() => {
              setMessages([
                {
                  id: "1",
                  role: "assistant",
                  content:
                    "Merhaba! Ben BabySteps AI Asistanıyım. Çocuğunuzun gelişimi, beslenme, uyku ve sağlığı hakkında sorularınızı cevaplayabilirim. Nasıl yardımcı olabilirim?",
                  timestamp: new Date(),
                },
              ]);
              AsyncStorage.removeItem("ai_chat_history");
            }}
            className="bg-surface rounded-lg py-2 px-4 items-center border border-border"
          >
            <Text className="text-sm text-muted">Sohbeti Temizle</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
