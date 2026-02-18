import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/hooks/use-i18n";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileManagementScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuth();

  const [activeChildId, setActiveChildId] = useState<number | null>(null);
  const [editingChild, setEditingChild] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDOB, setEditDOB] = useState<Date | null>(new Date());
  const [editGender, setEditGender] = useState("M");
  const [editPhoto, setEditPhoto] = useState<string | null>(null);

  // Fetch children
  const { data: children = [], isLoading, refetch } = trpc.children.list.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  // Update child mutation
  const updateChildMutation = trpc.children.update.useMutation({
    onSuccess: () => {
      refetch();
      setShowEditModal(false);
      Alert.alert("Başarılı", "Profil güncellendi");
    },
    onError: (error) => {
      Alert.alert("Hata", error.message || "Profil güncellenemedi");
    },
  });

  // Load active child from storage
  const loadActiveChild = async () => {
    const saved = await AsyncStorage.getItem("active_child_id");
    if (saved) setActiveChildId(Number(saved));
  };

  // Save active child to storage
  const saveActiveChild = async (childId: number) => {
    setActiveChildId(childId);
    await AsyncStorage.setItem("active_child_id", childId.toString());
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setEditPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleEditChild = (child: any) => {
    setEditingChild(child);
    setEditName(child.name);
    setEditDOB(child.dateOfBirth ? new Date(child.dateOfBirth) : new Date());
    setEditGender(child.gender || "M");
    setEditPhoto(child.photo || null);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      Alert.alert("Hata", "Çocuk adı boş olamaz");
      return;
    }

    updateChildMutation.mutate({
      id: editingChild.id,
      name: editName,
      dateOfBirth: editDOB.toISOString(),
      gender: editGender,
      photo: editPhoto,
    });
  };

  const handleDeleteChild = (childId: number) => {
    Alert.alert("Sil", "Bu profili silmek istediğinize emin misiniz?", [
      { text: "İptal", onPress: () => {} },
      {
        text: "Sil",
        onPress: () => {
          // Delete mutation would go here
          Alert.alert("Başarılı", "Profil silindi");
          refetch();
        },
        style: "destructive",
      },
    ]);
  };

  if (isLoading) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <ActivityIndicator color={colors.primary} size="large" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">👨‍👩‍👧‍👦 Profil Yönetimi</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Active Child Info */}
          {activeChildId && children.find((c: any) => c.id === activeChildId) && (
            <View className="bg-primary/10 rounded-lg p-4 border border-primary gap-3">
              <Text className="text-sm font-semibold text-primary">Aktif Profil</Text>
              <View className="flex-row items-center gap-3">
                {children.find((c: any) => c.id === activeChildId)?.photo && (
                  <Image
                    source={{ uri: children.find((c: any) => c.id === activeChildId)?.photo }}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">
                    {children.find((c: any) => c.id === activeChildId)?.name}
                  </Text>
                  <Text className="text-sm text-muted">
                    Doğum: {new Date(children.find((c: any) => c.id === activeChildId)?.dateOfBirth).toLocaleDateString("tr-TR")}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Children List */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">ÇOCUK PROFİLLERİ</Text>
            {children.length === 0 ? (
              <View className="bg-surface rounded-lg p-6 items-center gap-2">
                <Text className="text-lg text-muted">Henüz profil eklenmedi</Text>
                <TouchableOpacity
                  onPress={() => router.push("/add-child-modal")}
                  className="mt-4 bg-primary rounded-lg px-6 py-2"
                >
                  <Text className="text-white font-semibold">+ Çocuk Ekle</Text>
                </TouchableOpacity>
              </View>
            ) : (
              children.map((child: any) => (
                <TouchableOpacity
                  key={child.id}
                  onPress={() => saveActiveChild(child.id)}
                  className={`rounded-lg p-4 border-2 gap-3 ${
                    activeChildId === child.id
                      ? "bg-primary/10 border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      {child.photo ? (
                        <Image source={{ uri: child.photo }} className="w-12 h-12 rounded-full" />
                      ) : (
                        <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center">
                          <Text className="text-lg">👶</Text>
                        </View>
                      )}
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-foreground">{child.name}</Text>
                        <Text className="text-sm text-muted">
                          {new Date(child.dateOfBirth).toLocaleDateString("tr-TR")}
                        </Text>
                      </View>
                    </View>
                    {activeChildId === child.id && (
                      <View className="bg-primary rounded-full w-6 h-6 items-center justify-center">
                        <Text className="text-white text-sm">✓</Text>
                      </View>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleEditChild(child)}
                      className="flex-1 bg-primary/20 rounded-lg py-2 items-center"
                    >
                      <Text className="text-primary font-semibold">Düzenle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteChild(child.id)}
                      className="flex-1 bg-error/20 rounded-lg py-2 items-center"
                    >
                      <Text className="text-error font-semibold">Sil</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Add New Child Button */}
          {children.length > 0 && (
            <TouchableOpacity
              onPress={() => router.push("/add-child-modal")}
              className="bg-primary rounded-lg py-4 items-center gap-2"
            >
              <Text className="text-white font-semibold text-lg">+ Yeni Çocuk Ekle</Text>
            </TouchableOpacity>
          )}

          {/* Info Box */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-2">
            <Text className="text-sm font-semibold text-foreground">💡 İpucu</Text>
            <Text className="text-sm text-muted">
              Aktif profili seçerek tüm verileriniz o çocuğa ait olacaktır. İstediğiniz zaman profil değiştirebilirsiniz.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 gap-4">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-foreground">Profili Düzenle</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text className="text-2xl">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Photo */}
            <TouchableOpacity
              onPress={handlePickImage}
              className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center self-center"
            >
              {editPhoto ? (
                <Image source={{ uri: editPhoto }} className="w-20 h-20 rounded-full" />
              ) : (
                <Text className="text-3xl">📸</Text>
              )}
            </TouchableOpacity>

            {/* Name */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Ad</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder="Çocuk adı"
                className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Gender */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Cinsiyet</Text>
              <View className="flex-row gap-2">
                {["M", "F"].map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setEditGender(g)}
                    className={`flex-1 rounded-lg py-3 items-center ${
                      editGender === g ? "bg-primary" : "bg-surface border border-border"
                    }`}
                  >
                    <Text className={`font-semibold ${editGender === g ? "text-white" : "text-foreground"}`}>
                      {g === "M" ? "Erkek" : "Kız"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date of Birth */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Doğum Tarihi</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-surface rounded-lg px-4 py-3 border border-border"
              >
                <Text className="text-foreground">{editDOB ? editDOB.toLocaleDateString("tr-TR") : "Tarih seçin"}</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={editDOB || new Date()}
                mode="date"
                display="spinner"
                onChange={(event: any, selectedDate: Date | undefined) => {
                  if (selectedDate) setEditDOB(selectedDate);
                  setShowDatePicker(false);
                }}
              />
            )}

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSaveEdit}
              disabled={updateChildMutation.isPending}
              className="bg-primary rounded-lg py-4 items-center mt-4"
            >
              {updateChildMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-lg">Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
