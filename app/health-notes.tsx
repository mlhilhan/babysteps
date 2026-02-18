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
import DateTimePicker from "@react-native-community/datetimepicker";

interface HealthNote {
  id: number;
  childId: number;
  type: "doctor_visit" | "medication" | "vaccine_side_effect" | "general_observation";
  title: string;
  description?: string;
  noteDate: string;
  createdAt: string;
}

const NOTE_TYPES = [
  { label: "👨‍⚕️ Doĸtor Ziyareti", value: "doctor_visit", icon: "👨‍⚕️" },
  { label: "💊 İlaç", value: "medication", icon: "💊" },
  { label: "🔔 Alerji", value: "allergy", icon: "🔔" },
  { label: "🤒 Hastalık", value: "illness", icon: "🤒" },
  { label: "📝 Genel", value: "general", icon: "📝" },
];

export default function HealthNotesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const { childId } = useLocalSearchParams();

  const [showAddModal, setShowAddModal] = useState(false);
  const [noteType, setNoteType] = useState<"doctor_visit" | "medication" | "allergy" | "illness" | "general">(
    "general"
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [noteDate, setNoteDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch health notes
  const { data: healthNotes = [], isLoading, refetch } = trpc.health.list.useQuery(
    { childId: Number(childId) },
    {
      enabled: !!childId,
    }
  );

  const createHealthNoteMutation = trpc.health.create.useMutation({
    onSuccess: () => {
      Alert.alert(t("common.success"), "Sağlık notu başarıyla eklendi!");
      resetForm();
      setShowAddModal(false);
      refetch();
    },
    onError: (error: any) => {
      Alert.alert(t("common.error"), error.message);
    },
  });

  const resetForm = () => {
    setNoteType("general");
    setTitle("");
    setDescription("");
    setNoteDate(new Date());
  };

  const handleAddNote = async () => {
    if (!title.trim()) {
      Alert.alert(t("common.error"), "Lütfen başlık girin");
      return;
    }

    try {
      await createHealthNoteMutation.mutateAsync({
        childId: Number(childId),
        type: noteType,
        title,
        description: description || undefined,
        noteDate: noteDate.toISOString(),
      });
    } catch (error) {
      console.error("Error adding health note:", error);
    }
  };

  // Group by date
  const groupedByDate = healthNotes.reduce((acc: any, note: any) => {
    const date = new Date(note.noteDate).toLocaleDateString("tr-TR");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(note);
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
            <Text className="text-2xl font-bold text-foreground">🏥 Sağlık Notları</Text>
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
            <Text className="text-white font-semibold text-lg">+ Sağlık Notu Ekle</Text>
          </TouchableOpacity>

          {/* Statistics */}
          <View className="flex-row gap-3">
            {[
              {
                icon: "👨‍⚕️",
                label: "Doktor",
                count: healthNotes.filter((n: any) => n.type === "doctor_visit").length,
              },
              {
                icon: "💊",
                label: "İlaç",
                count: healthNotes.filter((n: any) => n.type === "medication").length,
              },
              {
                icon: "🔔",
                label: "Alerji",
                count: healthNotes.filter((n: any) => n.type === "allergy").length,
              },
            ].map((stat) => (
              <View key={stat.label} className="flex-1 bg-surface rounded-lg p-3 items-center">
                <Text className="text-2xl mb-1">{stat.icon}</Text>
                <Text className="text-lg font-bold text-foreground">{stat.count}</Text>
                <Text className="text-xs text-muted text-center">{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Health Notes */}
          {healthNotes.length === 0 ? (
            <View className="bg-surface rounded-lg p-6 items-center gap-3">
              <Text className="text-4xl">🏥</Text>
              <Text className="text-lg font-semibold text-foreground text-center">
                Sağlık notu bulunmamaktadır
              </Text>
              <Text className="text-sm text-muted text-center">
                Çocuğunuzun sağlık bilgilerini kaydetmeye başlayın
              </Text>
            </View>
          ) : (
            <View className="gap-6">
              {sortedDates.map((date) => (
                <View key={date} className="gap-3">
                  <Text className="text-sm font-semibold text-muted uppercase">{date}</Text>
                  <View className="gap-2">
                    {(groupedByDate[date] || []).map((note: any) => {
                      const noteTypeInfo = NOTE_TYPES.find((t) => t.value === note.type);
                      return (
                        <View key={note.id} className="bg-surface rounded-lg p-4 gap-2">
                          <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2 flex-1">
                              <Text className="text-xl">{noteTypeInfo?.icon}</Text>
                              <Text className="font-semibold text-foreground flex-1">
                                {note.title}
                              </Text>
                            </View>
                            <Text className="text-xs text-muted">
                              {new Date(note.noteDate).toLocaleTimeString("tr-TR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                          </View>

                          {note.description && (
                            <Text className="text-sm text-foreground leading-relaxed">
                              {note.description}
                            </Text>
                          )}

                          <View className="bg-primary/10 rounded px-2 py-1 self-start">
                            <Text className="text-xs text-primary font-semibold">
                              {noteTypeInfo?.label}
                            </Text>
                          </View>
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

      {/* Add Health Note Modal */}
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
                <Text className="text-2xl font-bold text-foreground">Sağlık Notu Ekle</Text>
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

              {/* Note Type Selection */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Not Türü</Text>
                <View className="gap-2">
                  {NOTE_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => setNoteType(type.value as any)}
                      className={`rounded-lg py-3 px-4 border-2 ${
                        noteType === type.value
                          ? "bg-primary border-primary"
                          : "bg-surface border-border"
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          noteType === type.value ? "text-white" : "text-foreground"
                        }`}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Note Date */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Tarih</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="bg-surface rounded-lg px-4 py-3 border border-border"
                >
                  <Text className="text-foreground">
                    {noteDate.toLocaleDateString("tr-TR")}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={noteDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      setShowDatePicker(false);
                      if (date) setNoteDate(date);
                    }}
                  />
                )}
              </View>

              {/* Title */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Başlık</Text>
                <TextInput
                  placeholder="Örn: Rutin kontrol, Antibiyotik başlandı"
                  value={title}
                  onChangeText={setTitle}
                  className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                  placeholderTextColor={colors.muted}
                />
              </View>

              {/* Description */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Açıklama</Text>
                <TextInput
                  placeholder="Detaylı bilgi girin..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                  placeholderTextColor={colors.muted}
                  textAlignVertical="top"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleAddNote}
                disabled={createHealthNoteMutation.isPending}
                className="bg-primary rounded-lg py-4 items-center mt-auto"
              >
                {createHealthNoteMutation.isPending ? (
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
