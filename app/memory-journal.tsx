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
  FlatList,
  Image,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

interface Memory {
  id: number;
  childId: number;
  title: string;
  description?: string | null;
  mediaUrl?: string | null;
  mediaType?: "text" | "photo" | "video";
  journalDate: string | Date;
  createdAt: string | Date;
}

export default function MemoryJournalScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const { childId } = useLocalSearchParams();

  const [note, setNote] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch memories
  const { data: memories = [], isLoading, refetch } = trpc.journal.list.useQuery(
    { childId: Number(childId) },
    {
      enabled: !!childId,
    }
  );

  const createMemoryMutation = trpc.journal.create.useMutation({
    onSuccess: () => {
      Alert.alert(t("common.success"), "Anı başarıyla eklendi!");
      setNote("");
      setSelectedImage(null);
      setShowAddModal(false);
      refetch();
    },
    onError: (error: any) => {
      Alert.alert(t("common.error"), error.message);
    },
  });

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(t("common.error"), "Fotoğraf seçilirken hata oluştu");
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(t("common.error"), "Fotoğraf çekilirken hata oluştu");
    }
  };

  const handleAddMemory = async () => {
    if (!note && !selectedImage) {
      Alert.alert(t("common.error"), "Lütfen not veya fotoğraf ekleyin");
      return;
    }

    try {
      // Eğer fotoğraf varsa base64'e dönüştür
      let photoBase64: string | undefined;
      if (selectedImage) {
        const fileInfo = await FileSystem.getInfoAsync(selectedImage);
        if (fileInfo.exists) {
          const base64 = await FileSystem.readAsStringAsync(selectedImage, {
            encoding: 'base64' as any,
          });
          photoBase64 = base64;
        }
      }

      await createMemoryMutation.mutateAsync({
        childId: Number(childId),
        title: "Anı",
        description: note || undefined,
        mediaUrl: photoBase64 ? `data:image/jpeg;base64,${photoBase64}` : undefined,
        mediaType: selectedImage ? "photo" : "text",
        journalDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error adding memory:", error);
      Alert.alert(t("common.error"), "Anı eklenirken hata oluştu");
    }
  };

  // Tarihe göre gruplandır
  const groupedMemories = memories.reduce((acc: Record<string, Memory[]>, memory: Memory) => {
    const journalDate = new Date(memory.journalDate || memory.createdAt);
    const date = journalDate.toLocaleDateString("tr-TR");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(memory);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedMemories).sort(
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
            <Text className="text-2xl font-bold text-foreground">{t("journal.title")}</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Add Memory Button */}
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="bg-primary rounded-lg py-4 items-center flex-row justify-center gap-2"
          >
            <Text className="text-white font-semibold text-lg">+ {t("journal.add_memory")}</Text>
          </TouchableOpacity>

          {/* Memories by Date */}
          {memories.length === 0 ? (
            <View className="bg-surface rounded-lg p-6 items-center gap-3">
              <Text className="text-4xl">📸</Text>
              <Text className="text-lg font-semibold text-foreground text-center">
                {t("journal.no_memories")}
              </Text>
              <Text className="text-sm text-muted text-center">
                Çocuğunuzun özel anlarını fotoğraf ve notlarla kaydedin
              </Text>
            </View>
          ) : (
            <View className="gap-6">
              {sortedDates.map((date) => (
                <View key={date} className="gap-3">
                  <Text className="text-sm font-semibold text-muted uppercase">{date}</Text>
                  <View className="gap-3">
                    {(groupedMemories[date] || []).map((memory: Memory) => (
                      <TouchableOpacity
                        key={memory.id}
                        onPress={() => {
                          setSelectedMemory(memory);
                          setShowDetailModal(true);
                        }}
                        className="bg-surface rounded-lg overflow-hidden"
                      >
                        {memory.mediaUrl ? (
                          <Image
                            source={{ uri: memory.mediaUrl }}
                            className="w-full h-48 bg-border"
                          />
                        ) : (
                          <View className="w-full h-48 bg-border items-center justify-center">
                            <Text className="text-4xl">📝</Text>
                          </View>
                        )}
                        {memory.description && (
                          <View className="p-3">
                            <Text className="text-foreground text-sm leading-relaxed" numberOfLines={2}>
                              {memory.description}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Memory Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowAddModal(false)}
      >
        <ScreenContainer className="bg-background">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View className="flex-1 p-4 gap-4">
              {/* Modal Header */}
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-foreground">{t("journal.add_memory")}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddModal(false);
                    setSelectedImage(null);
                    setNote("");
                  }}
                  className="w-10 h-10 rounded-full bg-surface items-center justify-center"
                >
                  <Text className="text-lg">✕</Text>
                </TouchableOpacity>
              </View>

              {/* Image Preview or Picker */}
              {selectedImage ? (
                <View className="gap-2">
                  <Image source={{ uri: selectedImage }} className="w-full h-64 rounded-lg" />
                  <TouchableOpacity
                    onPress={() => setSelectedImage(null)}
                    className="bg-error/20 rounded-lg py-2 items-center border border-error"
                  >
                    <Text className="text-error font-semibold">{t("common.delete")}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="gap-2">
                  <TouchableOpacity
                    onPress={handlePickImage}
                    className="bg-surface rounded-lg py-6 items-center border-2 border-dashed border-primary"
                  >
                    <Text className="text-3xl mb-2">🖼️</Text>
                    <Text className="text-foreground font-semibold">Galeriden Seç</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleTakePhoto}
                    className="bg-surface rounded-lg py-6 items-center border-2 border-dashed border-primary"
                  >
                    <Text className="text-3xl mb-2">📷</Text>
                    <Text className="text-foreground font-semibold">Fotoğraf Çek</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Note Input */}
              <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">Not</Text>
                <TextInput
                  placeholder="Bu anı hakkında bir not yazın..."
                  value={note}
                  onChangeText={setNote}
                  multiline
                  numberOfLines={4}
                  className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                  placeholderTextColor={colors.muted}
                  textAlignVertical="top"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleAddMemory}
                disabled={createMemoryMutation.isPending}
                className="bg-primary rounded-lg py-4 items-center mt-auto"
              >
                {createMemoryMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-lg">{t("common.save")}</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ScreenContainer>
      </Modal>

      {/* Memory Detail Modal */}
      <Modal
        visible={showDetailModal && !!selectedMemory}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View className="flex-1 bg-black/80 items-center justify-center p-4">
          <View className="bg-surface rounded-lg overflow-hidden w-full max-w-sm">
              {selectedMemory?.mediaUrl && (
                <Image
                  source={{ uri: selectedMemory.mediaUrl }}
                  className="w-full h-64"
                />
              )}
              <View className="p-4 gap-3">
                {selectedMemory?.description && (
                  <Text className="text-foreground leading-relaxed">
                    {selectedMemory.description}
                  </Text>
                )}
                <Text className="text-xs text-muted">
                  {new Date(selectedMemory?.journalDate || selectedMemory?.createdAt || "").toLocaleString("tr-TR")}
                </Text>
              <TouchableOpacity
                onPress={() => setShowDetailModal(false)}
                className="bg-primary rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">{t("common.close")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
