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
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color: () => string;
    strokeWidth: number;
  }>;
}

export default function GrowthTrackingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const { childId } = useLocalSearchParams();
  const screenWidth = Dimensions.get("window").width;

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [measurementDate, setMeasurementDate] = useState(new Date().toISOString().split("T")[0]);

  // Fetch growth measurements
  const { data: measurements = [], isLoading } = trpc.growth.list.useQuery(
    { childId: Number(childId) },
    {
      enabled: !!childId,
    }
  );

  const createMeasurementMutation = trpc.growth.create.useMutation({
    onSuccess: () => {
      Alert.alert(t("common.success"), "Ölçüm başarıyla eklendi!");
      setHeight("");
      setWeight("");
      setMeasurementDate(new Date().toISOString().split("T")[0]);
    },
    onError: (error) => {
      Alert.alert(t("common.error"), error.message);
    },
  });

  const handleAddMeasurement = async () => {
    if (!height || !weight) {
      Alert.alert(t("common.error"), "Lütfen boy ve kilo değerlerini girin");
      return;
    }

    try {
      await createMeasurementMutation.mutateAsync({
        childId: Number(childId),
        height: parseFloat(height),
        weight: parseFloat(weight),
        measurementDate,
      });
    } catch (error) {
      console.error("Error adding measurement:", error);
    }
  };

  // Prepare chart data
  const chartData = {
    labels: measurements.slice(-7).map((m) => {
      const date = new Date(m.measurementDate);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: measurements.slice(-7).map((m) => Number(m.weight) || 0),
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
  };

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
            <Text className="text-2xl font-bold text-foreground">{t("growth.title")}</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Add Measurement Form */}
          <View className="bg-surface rounded-lg p-4 gap-4">
            <Text className="text-lg font-semibold text-foreground">
              {t("growth.add_measurement")}
            </Text>

            <View className="flex-row gap-3">
              <View className="flex-1 gap-2">
                <Text className="text-sm text-muted">{t("growth.height")} (cm)</Text>
                <TextInput
                  placeholder="cm"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="decimal-pad"
                  className="bg-background rounded-lg px-3 py-2 text-foreground border border-border"
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View className="flex-1 gap-2">
                <Text className="text-sm text-muted">{t("growth.weight")} (kg)</Text>
                <TextInput
                  placeholder="kg"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                  className="bg-background rounded-lg px-3 py-2 text-foreground border border-border"
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleAddMeasurement}
              disabled={createMeasurementMutation.isPending}
              className="bg-primary rounded-lg py-3 items-center"
            >
              {createMeasurementMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">{t("common.save")}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Growth Chart */}
          {measurements.length > 0 && (
            <View className="bg-surface rounded-lg p-4 gap-4">
              <Text className="text-lg font-semibold text-foreground">{t("growth.growth_chart")}</Text>
              <LineChart
                data={chartData}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                  backgroundColor: colors.surface,
                  backgroundGradientFrom: colors.surface,
                  backgroundGradientTo: colors.surface,
                  color: () => colors.primary,
                  labelColor: () => colors.muted,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: colors.primary,
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          )}

          {/* Measurements List */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">{t("growth.measurements")}</Text>
            {measurements.length === 0 ? (
              <View className="bg-surface rounded-lg p-4 items-center">
                <Text className="text-muted">{t("common.loading")}</Text>
              </View>
            ) : (
              measurements
                .slice()
                .reverse()
                .map((m) => (
                  <View key={m.id} className="bg-surface rounded-lg p-4 flex-row justify-between">
                    <View>
                      <Text className="font-semibold text-foreground">
                        {new Date(m.measurementDate).toLocaleDateString("tr-TR")}
                      </Text>
                      <Text className="text-sm text-muted">
                        {m.height} cm • {m.weight} kg
                      </Text>
                    </View>
                    <Text className="text-2xl">📏</Text>
                  </View>
                ))
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
