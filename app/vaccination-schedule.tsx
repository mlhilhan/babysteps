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
} from "react-native";

// Türkiye'nin resmi aşı takvimi
const DEFAULT_VACCINATION_SCHEDULE = [
  { name: "BCG", age: "Doğum", month: 0 },
  { name: "Hepatit B", age: "Doğum", month: 0 },
  { name: "Rotavirus 1", age: "2 ay", month: 2 },
  { name: "Penta 1", age: "2 ay", month: 2 },
  { name: "PCV 1", age: "2 ay", month: 2 },
  { name: "Rotavirus 2", age: "4 ay", month: 4 },
  { name: "Penta 2", age: "4 ay", month: 4 },
  { name: "PCV 2", age: "4 ay", month: 4 },
  { name: "Rotavirus 3", age: "6 ay", month: 6 },
  { name: "Penta 3", age: "6 ay", month: 6 },
  { name: "PCV 3", age: "6 ay", month: 6 },
  { name: "KPA", age: "12 ay", month: 12 },
  { name: "MMR", age: "12 ay", month: 12 },
  { name: "Hepatit A", age: "12 ay", month: 12 },
  { name: "Penta Booster", age: "18 ay", month: 18 },
  { name: "PCV Booster", age: "18 ay", month: 18 },
  { name: "KPA Booster", age: "18 ay", month: 18 },
];

export default function VaccinationScheduleScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const { childId } = useLocalSearchParams();

  const [vaccineName, setVaccineName] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);

  // Fetch vaccinations
  const { data: vaccinations = [], isLoading, refetch } = trpc.vaccinations.list.useQuery(
    { childId: Number(childId) },
    {
      enabled: !!childId,
    }
  );

  const createVaccinationMutation = trpc.vaccinations.create.useMutation({
    onSuccess: () => {
      Alert.alert(t("common.success"), "Aşı başarıyla eklendi!");
      setVaccineName("");
      setDueDate(new Date().toISOString().split("T")[0]);
      refetch();
    },
    onError: (error: any) => {
      Alert.alert(t("common.error"), error.message);
    },
  });

  const updateVaccinationMutation = trpc.vaccinations.update.useMutation({
    onSuccess: () => {
      Alert.alert(t("common.success"), "Aşı durumu güncellendi!");
      refetch();
    },
    onError: (error: any) => {
      Alert.alert(t("common.error"), error.message);
    },
  });

  const handleAddVaccination = async () => {
    if (!vaccineName) {
      Alert.alert(t("common.error"), "Lütfen aşı adını girin");
      return;
    }

    try {
      await createVaccinationMutation.mutateAsync({
        childId: Number(childId),
        vaccineName,
        scheduledDate: dueDate,
        recommendedAgeMonths: 0,
      });
    } catch (error) {
      console.error("Error adding vaccination:", error);
    }
  };

  const handleMarkCompleted = async (vaccinationId: number) => {
    try {
      await updateVaccinationMutation.mutateAsync({
        id: vaccinationId,
        administered: true,
        administeredDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error updating vaccination:", error);
    }
  };

  const upcomingVaccinations = vaccinations.filter((v: any) => !v.administered);
  const completedVaccinations = vaccinations.filter((v: any) => v.administered);

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
            <Text className="text-2xl font-bold text-foreground">{t("vaccination.title")}</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Add Vaccination Form */}
          <View className="bg-surface rounded-lg p-4 gap-4">
            <Text className="text-lg font-semibold text-foreground">{t("vaccination.add_vaccination")}</Text>

            <View className="gap-2">
              <Text className="text-sm text-muted">{t("vaccination.vaccine_name")}</Text>
              <TextInput
                placeholder="Aşı adı (örn: BCG, Penta)"
                value={vaccineName}
                onChangeText={setVaccineName}
                className="bg-background rounded-lg px-3 py-2 text-foreground border border-border"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm text-muted">{t("vaccination.due_date")}</Text>
              <TextInput
                placeholder="YYYY-MM-DD"
                value={dueDate}
                onChangeText={setDueDate}
                className="bg-background rounded-lg px-3 py-2 text-foreground border border-border"
                placeholderTextColor={colors.muted}
              />
            </View>

            <TouchableOpacity
              onPress={handleAddVaccination}
              disabled={createVaccinationMutation.isPending}
              className="bg-primary rounded-lg py-3 items-center"
            >
              {createVaccinationMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">{t("common.save")}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Upcoming Vaccinations */}
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-semibold text-foreground">{t("vaccination.upcoming")}</Text>
              <View className="bg-warning rounded-full px-2 py-1">
                <Text className="text-xs font-semibold text-white">{upcomingVaccinations.length}</Text>
              </View>
            </View>

            {upcomingVaccinations.length === 0 ? (
              <View className="bg-surface rounded-lg p-4 items-center">
                <Text className="text-muted">{t("vaccination.no_upcoming")}</Text>
              </View>
            ) : (
              upcomingVaccinations.map((v: any) => (
                <View key={v.id} className="bg-surface rounded-lg p-4 gap-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">{v.vaccineName}</Text>
                      <Text className="text-sm text-muted">
                        {v.scheduledDate ? new Date(v.scheduledDate).toLocaleDateString("tr-TR") : "Tarih belirtilmedi"}
                      </Text>
                    </View>
                    <View className="bg-warning rounded-full w-8 h-8 items-center justify-center">
                      <Text className="text-white text-sm">!</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleMarkCompleted(v.id)}
                    className="bg-success/20 rounded-lg py-2 items-center border border-success"
                  >
                    <Text className="text-success font-semibold text-sm">
                      {t("vaccination.mark_completed")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Completed Vaccinations */}
          {completedVaccinations.length > 0 && (
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-semibold text-foreground">
                  {t("vaccination.completed_vaccinations")}
                </Text>
                <View className="bg-success rounded-full px-2 py-1">
                  <Text className="text-xs font-semibold text-white">{completedVaccinations.length}</Text>
                </View>
              </View>

              {completedVaccinations.map((v: any) => (
                <View key={v.id} className="bg-success/10 rounded-lg p-4 border border-success flex-row items-center justify-between">
                  <View>
                    <Text className="font-semibold text-foreground">{v.vaccineName}</Text>
                    <Text className="text-sm text-muted">
                      {v.administeredDate ? new Date(v.administeredDate).toLocaleDateString("tr-TR") : "Tarih belirtilmedi"}
                    </Text>
                  </View>
                  <Text className="text-2xl">✓</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
