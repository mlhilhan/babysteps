import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/hooks/use-i18n";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

interface NutritionEntry {
  id: number;
  childId: number;
  type: "breastfeeding" | "formula" | "solid_food" | "snack" | "water";
  quantity?: string;
  description?: string;
  notes?: string;
  logDate: string;
}

const FEEDING_TYPES = [
  { label: "👶 Emzirme", value: "breastfeeding" },
  { label: "🍼 Mama", value: "formula" },
  { label: "🥣 Ek Gıda", value: "solid_food" },
  { label: "🍪 Atıştırmalık", value: "snack" },
  { label: "💧 Su", value: "water" },
];

const COMMON_ALLERGENS = [
  "Süt",
  "Yumurta",
  "Yer Fıstığı",
  "Ağaç Fıstığı",
  "Balık",
  "Kabuklu Deniz Ürünleri",
  "Soya",
  "Gluten",
  "Sezam",
];

export default function NutritionLogScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const { childId } = useLocalSearchParams();

  const [feedingType, setFeedingType] = useState<"breastfeeding" | "formula" | "solid_food" | "snack" | "water">(
    "breastfeeding"
  );
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("ml");
  const [notes, setNotes] = useState("");
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch nutrition logs
  const { data: nutritionLogs = [], isLoading, refetch } = trpc.nutrition.list.useQuery(
    { childId: Number(childId) },
    {
      enabled: !!childId,
    }
  );

  const createNutritionMutation = trpc.nutrition.create.useMutation({
    onSuccess: () => {
      Alert.alert(t("common.success"), "Beslenme kaydı başarıyla eklendi!");
      resetForm();
      setShowAddModal(false);
      refetch();
    },
    onError: (error: any) => {
      Alert.alert(t("common.error"), error.message);
    },
  });

  const resetForm = () => {
    setFeedingType("breastfeeding");
    setAmount("");
    setUnit("ml");
    setNotes("");
    setSelectedAllergens([]);
  };

  const handleAddNutrition = async () => {
    if ((feedingType === "formula" || feedingType === "solid_food" || feedingType === "snack") && !amount) {
      Alert.alert(t("common.error"), "Lütfen miktar girin");
      return;
    }

    try {
      await createNutritionMutation.mutateAsync({
        childId: Number(childId),
        type: feedingType,
        description: notes || `${feedingType} feeding`,
        quantity: amount ? `${amount} ${unit}` : undefined,
        notes: selectedAllergens.length > 0 ? `Alerjenler: ${selectedAllergens.join(", ")}` : undefined,
        logDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error adding nutrition:", error);
    }
  };

  const toggleAllergen = (allergen: string) => {
    if (selectedAllergens.includes(allergen)) {
      setSelectedAllergens(selectedAllergens.filter((a) => a !== allergen));
    } else {
      setSelectedAllergens([...selectedAllergens, allergen]);
    }
  };

  // Group by date
  const groupedByDate = nutritionLogs.reduce((acc: any, log: any) => {
    const date = new Date(log.logDate || log.createdAt).toLocaleDateString("tr-TR");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (isLoading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">🍽️ Beslenme Günlüğü</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Add Button */}
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="bg-primary rounded-lg py-4 items-center flex-row justify-center gap-2"
          >
            <Text className="text-white font-semibold text-lg">+ Beslenme Kaydı Ekle</Text>
          </TouchableOpacity>

          {/* Statistics */}
          <View className="flex-row gap-3">
            {[
              {
                icon: "👶",
                label: "Emzirme",
                count: nutritionLogs.filter((l: any) => l.type === "breastfeeding").length,
              },
              {
                icon: "🍼",
                label: "Mama",
                count: nutritionLogs.filter((l: any) => l.type === "formula").length,
              },
              {
                icon: "🥣",
                label: "Ek Gıda",
                count: nutritionLogs.filter((l: any) => l.type === "solid_food").length,
              },
            ].map((stat) => (
              <View key={stat.label} className="flex-1 bg-surface rounded-lg p-3 items-center">
                <Text className="text-2xl mb-1">{stat.icon}</Text>
                <Text className="text-lg font-bold text-foreground">{stat.count}</Text>
                <Text className="text-xs text-muted text-center">{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Nutrition Logs */}
          {nutritionLogs.length === 0 ? (
            <View className="bg-surface rounded-lg p-6 items-center gap-3">
              <Text className="text-4xl">🍽️</Text>
              <Text className="text-lg font-semibold text-foreground text-center">
                Beslenme kaydı bulunmamaktadır
              </Text>
              <Text className="text-sm text-muted text-center">
                Çocuğunuzun beslenme bilgilerini kaydetmeye başlayın
              </Text>
            </View>
          ) : (
            <View className="gap-6">
              {sortedDates.map((date) => (
                <View key={date} className="gap-3">
                  <Text className="text-sm font-semibold text-muted uppercase">{date}</Text>
                  <View className="gap-2">
                    {(groupedByDate[date] || []).map((log: any) => {
                      const feedingLabel = FEEDING_TYPES.find((f) => f.value === log.type)?.label;
                      return (
                        <View key={log.id} className="bg-surface rounded-lg p-4 gap-2">
                          <View className="flex-row items-center justify-between">
                            <Text className="font-semibold text-foreground">{feedingLabel}</Text>
                            <Text className="text-xs text-muted">
                              {new Date(log.logDate || log.createdAt).toLocaleTimeString("tr-TR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                          </View>

                          {log.quantity && (
                            <Text className="text-sm text-muted">
                              Miktar: {log.quantity}
                            </Text>
                          )}

                          {log.description && (
                            <Text className="text-sm text-foreground">{log.description}</Text>
                          )}

                          {log.notes && (
                            <View className="flex-row flex-wrap gap-2 mt-2">
                              {log.notes.includes("Alerjenler") && log.notes.replace("Alerjenler: ", "").split(",").map((allergen: string) => (
                                <View
                                  key={allergen}
                                  className="bg-warning/20 rounded-full px-2 py-1 border border-warning"
                                >
                                  <Text className="text-xs text-warning font-semibold">
                                    ⚠️ {allergen.trim()}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Nutrition Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
      >
        <ScreenContainer className="bg-background">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View className="flex-1 p-4 gap-4">
              {/* Modal Header */}
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-foreground">Beslenme Kaydı Ekle</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="w-10 h-10 rounded-full bg-surface items-center justify-center"
                >
                  <Text className="text-lg">✕</Text>
                </TouchableOpacity>
              </View>

              {/* Feeding Type Selection */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Beslenme Türü</Text>
                <View className="gap-2">
                  {FEEDING_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => setFeedingType(type.value as any)}
                      className={`rounded-lg py-3 px-4 border-2 ${
                        feedingType === type.value
                          ? "bg-primary border-primary"
                          : "bg-surface border-border"
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          feedingType === type.value ? "text-white" : "text-foreground"
                        }`}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Amount Input (for formula and solids) */}
              {(feedingType === "formula" || feedingType === "solid_food" || feedingType === "snack") && (
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">Miktar</Text>
                  <View className="flex-row gap-2">
                    <TextInput
                      placeholder="Miktar"
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="decimal-pad"
                      className="flex-1 bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                      placeholderTextColor={colors.muted}
                    />
                    <View className="bg-surface rounded-lg border border-border overflow-hidden w-20">
                      <Picker
                        selectedValue={unit}
                        onValueChange={setUnit}
                        style={{ color: colors.foreground }}
                      >
                        <Picker.Item label="ml" value="ml" />
                        <Picker.Item label="gr" value="gr" />
                        <Picker.Item label="oz" value="oz" />
                      </Picker>
                    </View>
                  </View>
                </View>
              )}

              {/* Notes */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Notlar</Text>
                <TextInput
                  placeholder="Örn: Çok iştahla yedi, hiç kusma olmadı"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                  placeholderTextColor={colors.muted}
                  textAlignVertical="top"
                />
              </View>

              {/* Allergen Selection */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">⚠️ Alerjen Uyarısı</Text>
                <View className="flex-row flex-wrap gap-2">
                  {COMMON_ALLERGENS.map((allergen) => (
                    <TouchableOpacity
                      key={allergen}
                      onPress={() => toggleAllergen(allergen)}
                      className={`rounded-full px-3 py-2 border ${
                        selectedAllergens.includes(allergen)
                          ? "bg-warning border-warning"
                          : "bg-surface border-border"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          selectedAllergens.includes(allergen)
                            ? "text-white"
                            : "text-foreground"
                        }`}
                      >
                        {allergen}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleAddNutrition}
                disabled={createNutritionMutation.isPending}
                className="bg-primary rounded-lg py-4 items-center mt-auto"
              >
                {createNutritionMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-lg">{t("common.save")}</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}
