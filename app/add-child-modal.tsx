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
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";


export default function AddChildModal() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState<"male" | "female">("male");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const { refetch: refetchChildren } = trpc.children.list.useQuery();

  const createChildMutation = trpc.children.create.useMutation({
    onSuccess: () => {
      Alert.alert(t("common.success"), t("add_child.success"));
      refetchChildren();
      setName("");
      setDateOfBirth(new Date());
      setGender("male");
      router.back();
    },
    onError: (error) => {
      Alert.alert(t("common.error"), error.message);
    },
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t("add_child.error"), t("add_child.error_name"));
      return;
    }

    if (!dateOfBirth) {
      Alert.alert(t("add_child.error"), t("add_child.error_dob"));
      return;
    }

    setLoading(true);
    try {
      await createChildMutation.mutateAsync({
        name: name.trim(),
        dateOfBirth: dateOfBirth.toISOString().split("T")[0],
        gender,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">{t("add_child.title")}</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View className="gap-4">
            {/* Name Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">{t("add_child.name")}</Text>
              <TextInput
                placeholder={t("add_child.name_placeholder")}
                value={name}
                onChangeText={setName}
                className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Date of Birth */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">
                {t("add_child.date_of_birth")}
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-surface rounded-lg px-4 py-3 border border-border flex-row items-center justify-between"
              >
                <Text className="text-foreground">
                  {dateOfBirth.toLocaleDateString("tr-TR")}
                </Text>
                <Text className="text-lg">📅</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {/* Gender Selection */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">{t("add_child.gender")}</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setGender("male")}
                  className={`flex-1 rounded-lg py-3 items-center border-2 ${
                    gender === "male"
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      gender === "male" ? "text-white" : "text-foreground"
                    }`}
                  >
                    👦 {t("add_child.male")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setGender("female")}
                  className={`flex-1 rounded-lg py-3 items-center border-2 ${
                    gender === "female"
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      gender === "female" ? "text-white" : "text-foreground"
                    }`}
                  >
                    👧 {t("add_child.female")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View className="gap-3 mt-auto">
            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              className="bg-primary rounded-lg py-4 items-center flex-row justify-center gap-2"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-white font-semibold text-lg">{t("add_child.save")}</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-surface rounded-lg py-4 items-center border border-border"
            >
              <Text className="text-foreground font-semibold">{t("add_child.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
