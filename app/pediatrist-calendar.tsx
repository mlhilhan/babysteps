import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/hooks/use-i18n";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetime-picker";

interface DoctorVisit {
  id: string;
  date: Date;
  type: "checkup" | "vaccination" | "dental" | "specialist";
  doctor: string;
  clinic: string;
  notes: string;
  completed: boolean;
}

export default function PediatristCalendarScreen() {
  const { t } = useTranslation();
  const colors = useColors();

  const [visits, setVisits] = useState<DoctorVisit[]>([
    {
      id: "1",
      date: new Date(2026, 2, 15),
      type: "checkup",
      doctor: "Dr. Ahmet Yılmaz",
      clinic: "Çocuk Sağlığı Merkezi",
      notes: "Aylık kontrol",
      completed: false,
    },
    {
      id: "2",
      date: new Date(2026, 3, 10),
      type: "vaccination",
      doctor: "Dr. Fatma Kaya",
      clinic: "Aşı Merkezi",
      notes: "Aşı takvimi",
      completed: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newVisit, setNewVisit] = useState<Partial<DoctorVisit>>({
    type: "checkup",
    completed: false,
  });

  const handleAddVisit = () => {
    if (!newVisit.date || !newVisit.doctor || !newVisit.clinic) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurunuz");
      return;
    }

    const visit: DoctorVisit = {
      id: `visit_${Date.now()}`,
      date: newVisit.date,
      type: (newVisit.type as any) || "checkup",
      doctor: newVisit.doctor || "",
      clinic: newVisit.clinic || "",
      notes: newVisit.notes || "",
      completed: false,
    };

    setVisits([...visits, visit]);
    setShowModal(false);
    setNewVisit({ type: "checkup", completed: false });
  };

  const handleCompleteVisit = (id: string) => {
    setVisits(
      visits.map((v) => (v.id === id ? { ...v, completed: true } : v))
    );
  };

  const handleDeleteVisit = (id: string) => {
    setVisits(visits.filter((v) => v.id !== id));
  };

  const upcomingVisits = visits
    .filter((v) => v.date > new Date() && !v.completed)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const completedVisits = visits.filter((v) => v.completed);

  const visitTypeEmojis = {
    checkup: "🏥",
    vaccination: "💉",
    dental: "🦷",
    specialist: "👨‍⚕️",
  };

  const visitTypeLabels = {
    checkup: "Genel Kontrol",
    vaccination: "Aşı",
    dental: "Diş",
    specialist: "Uzman",
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">🏥 Pediatrist Takvimi</Text>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              className="bg-primary rounded-full w-12 h-12 items-center justify-center"
            >
              <Text className="text-white text-2xl">+</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="grid grid-cols-3 gap-3">
            <View className="bg-surface rounded-lg p-4 border border-border items-center gap-2">
              <Text className="text-2xl">📅</Text>
              <Text className="text-xs text-muted">Yaklaşan</Text>
              <Text className="text-lg font-bold text-foreground">{upcomingVisits.length}</Text>
            </View>
            <View className="bg-surface rounded-lg p-4 border border-border items-center gap-2">
              <Text className="text-2xl">✅</Text>
              <Text className="text-xs text-muted">Tamamlanan</Text>
              <Text className="text-lg font-bold text-foreground">{completedVisits.length}</Text>
            </View>
            <View className="bg-surface rounded-lg p-4 border border-border items-center gap-2">
              <Text className="text-2xl">📊</Text>
              <Text className="text-xs text-muted">Toplam</Text>
              <Text className="text-lg font-bold text-foreground">{visits.length}</Text>
            </View>
          </View>

          {/* Upcoming Visits */}
          {upcomingVisits.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">📅 Yaklaşan Ziyaretler</Text>
              {upcomingVisits.map((visit) => (
                <View
                  key={visit.id}
                  className="bg-surface rounded-lg p-4 border-2 border-primary gap-3"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-2xl">
                        {visitTypeEmojis[visit.type as keyof typeof visitTypeEmojis]}
                      </Text>
                      <View className="gap-1">
                        <Text className="font-semibold text-foreground">
                          {visitTypeLabels[visit.type as keyof typeof visitTypeLabels]}
                        </Text>
                        <Text className="text-xs text-muted">
                          {visit.date.toLocaleDateString("tr-TR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleCompleteVisit(visit.id)}
                      className="bg-primary/20 rounded-full px-3 py-1"
                    >
                      <Text className="text-xs font-semibold text-primary">Tamamla</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="gap-2 border-t border-border pt-3">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm text-muted">👨‍⚕️</Text>
                      <Text className="text-sm text-foreground">{visit.doctor}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm text-muted">📍</Text>
                      <Text className="text-sm text-foreground">{visit.clinic}</Text>
                    </View>
                    {visit.notes && (
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm text-muted">📝</Text>
                        <Text className="text-sm text-foreground">{visit.notes}</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDeleteVisit(visit.id)}
                    className="bg-error/20 rounded-lg py-2 items-center"
                  >
                    <Text className="text-sm font-semibold text-error">Sil</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Completed Visits */}
          {completedVisits.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">✅ Tamamlanan Ziyaretler</Text>
              {completedVisits.map((visit) => (
                <View
                  key={visit.id}
                  className="bg-surface/50 rounded-lg p-4 border border-border opacity-60 gap-2"
                >
                  <View className="flex-row items-center gap-2">
                    <Text className="text-lg">
                      {visitTypeEmojis[visit.type as keyof typeof visitTypeEmojis]}
                    </Text>
                    <Text className="font-semibold text-foreground line-through">
                      {visitTypeLabels[visit.type as keyof typeof visitTypeLabels]}
                    </Text>
                    <Text className="text-xs text-muted">
                      {visit.date.toLocaleDateString("tr-TR")}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Empty State */}
          {visits.length === 0 && (
            <View className="bg-surface rounded-lg p-6 items-center border border-border gap-2">
              <Text className="text-3xl">📅</Text>
              <Text className="text-foreground font-semibold">Ziyaret Bulunmuyor</Text>
              <Text className="text-sm text-muted">Yeni bir ziyaret eklemek için + butonuna tıklayın</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Visit Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 gap-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-foreground">Yeni Ziyaret Ekle</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text className="text-2xl">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Visit Type */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Ziyaret Türü</Text>
              <View className="flex-row gap-2">
                {(["checkup", "vaccination", "dental", "specialist"] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setNewVisit({ ...newVisit, type })}
                    className={`flex-1 py-2 px-3 rounded-lg ${
                      newVisit.type === type ? "bg-primary" : "bg-surface border border-border"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold text-center ${
                        newVisit.type === type ? "text-white" : "text-foreground"
                      }`}
                    >
                      {visitTypeLabels[type]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Tarih</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-surface border border-border rounded-lg p-3"
              >
                <Text className="text-foreground">
                  {newVisit.date
                    ? newVisit.date.toLocaleDateString("tr-TR")
                    : "Tarih seçiniz"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={newVisit.date || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setNewVisit({ ...newVisit, date: selectedDate });
                    }
                    setShowDatePicker(false);
                  }}
                />
              )}
            </View>

            {/* Doctor */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Doktor Adı</Text>
              <TextInput
                placeholder="Dr. Adı Soyadı"
                placeholderTextColor={colors.muted}
                value={newVisit.doctor || ""}
                onChangeText={(text) => setNewVisit({ ...newVisit, doctor: text })}
                className="bg-surface border border-border rounded-lg p-3 text-foreground"
              />
            </View>

            {/* Clinic */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Klinik/Hastane</Text>
              <TextInput
                placeholder="Klinik Adı"
                placeholderTextColor={colors.muted}
                value={newVisit.clinic || ""}
                onChangeText={(text) => setNewVisit({ ...newVisit, clinic: text })}
                className="bg-surface border border-border rounded-lg p-3 text-foreground"
              />
            </View>

            {/* Notes */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Notlar</Text>
              <TextInput
                placeholder="Örn: Aylık kontrol, aşı takvimi vb."
                placeholderTextColor={colors.muted}
                value={newVisit.notes || ""}
                onChangeText={(text) => setNewVisit({ ...newVisit, notes: text })}
                className="bg-surface border border-border rounded-lg p-3 text-foreground"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3 pt-4">
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="flex-1 bg-surface border border-border rounded-lg py-3"
              >
                <Text className="text-center font-semibold text-foreground">İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddVisit}
                className="flex-1 bg-primary rounded-lg py-3"
              >
                <Text className="text-center font-semibold text-white">Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
