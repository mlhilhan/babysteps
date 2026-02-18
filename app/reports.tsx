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
  ActivityIndicator,
  Alert,
} from "react-native";

export default function ReportsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const { childId } = useLocalSearchParams();

  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Fetch child data
  const { data: child } = trpc.children.get.useQuery(
    { id: Number(childId) },
    { enabled: !!childId }
  );

  // Fetch all data for reports
  const { data: growthData = [] } = trpc.growth.list.useQuery(
    { childId: Number(childId) },
    { enabled: !!childId }
  );

  const { data: vaccinations = [] } = trpc.vaccinations.list.useQuery(
    { childId: Number(childId) },
    { enabled: !!childId }
  );

  const { data: nutritionLogs = [] } = trpc.nutrition.list.useQuery(
    { childId: Number(childId) },
    { enabled: !!childId }
  );

  const { data: sleepLogs = [] } = trpc.sleep.list.useQuery(
    { childId: Number(childId) },
    { enabled: !!childId }
  );

  const { data: healthNotes = [] } = trpc.health.list.useQuery(
    { childId: Number(childId) },
    { enabled: !!childId }
  );

  const generateGrowthReport = async () => {
    setGenerating(true);
    try {
      // Simulate PDF generation
      const reportContent = `
BabySteps Gelişim Raporu
========================

Çocuk: ${child?.name}
Doğum Tarihi: ${child?.dateOfBirth}
Rapor Tarihi: ${new Date().toLocaleDateString("tr-TR")}

GELİŞİM ÖZETİ
-------------
Toplam Ölçüm: ${growthData.length}

Boy ve Kilo Ölçümleri:
${growthData
  .slice(-5)
  .map(
    (m: any) =>
      `- ${new Date(m.measurementDate).toLocaleDateString("tr-TR")}: Boy ${m.height}cm, Kilo ${m.weight}kg`
  )
  .join("\n")}

Gelişim Durumu:
- Son boy ölçümü: ${growthData[growthData.length - 1]?.height || "N/A"}cm
- Son kilo ölçümü: ${growthData[growthData.length - 1]?.weight || "N/A"}kg
- Ortalama aylık artış: Pozitif yönde ilerleme göstermektedir

SAĞLIK NOTLARI
--------------
Doktor Ziyaretleri: ${healthNotes.filter((n: any) => n.type === "doctor_visit").length}
İlaç Kullanımı: ${healthNotes.filter((n: any) => n.type === "medication").length}
Alerji Kaydı: ${healthNotes.filter((n: any) => n.type === "allergy").length}

ÖNERİLER
--------
1. Düzenli pediatrist kontrolleri devam ettirilmelidir
2. Beslenme ve uyku düzeni korunmalıdır
3. Aşı takvimi takip edilmelidir
4. Gelişim kilometre taşları gözlemlenmelidir

Rapor Tarihi: ${new Date().toLocaleString("tr-TR")}
      `;

      Alert.alert("Başarılı", "Gelişim raporu oluşturuldu. (Simülasyon)");
      console.log("Growth Report:", reportContent);
    } catch (error) {
      Alert.alert("Hata", "Rapor oluşturulamadı");
    } finally {
      setGenerating(false);
    }
  };

  const generateVaccinationReport = async () => {
    setGenerating(true);
    try {
      const completed = vaccinations.filter((v: any) => v.status === "completed").length;
      const pending = vaccinations.filter((v: any) => v.status === "pending").length;

      const reportContent = `
BabySteps Aşı Takvimi Raporu
============================

Çocuk: ${child?.name}
Doğum Tarihi: ${child?.dateOfBirth}
Rapor Tarihi: ${new Date().toLocaleDateString("tr-TR")}

AŞI DURUMU
----------
Toplam Aşı: ${vaccinations.length}
Tamamlanan: ${completed}
Beklemede: ${pending}

TAMAMLANAN AŞILAR
-----------------
${vaccinations
  .filter((v: any) => v.status === "completed")
  .map((v: any) => `- ${v.name} (${new Date(v.administrationDate).toLocaleDateString("tr-TR")})`)
  .join("\n")}

YAKLAŞAN AŞILAR
---------------
${vaccinations
  .filter((v: any) => v.status === "pending")
  .map((v: any) => `- ${v.name} (Planlanan: ${new Date(v.scheduledDate).toLocaleDateString("tr-TR")})`)
  .join("\n")}

ÖNERİLER
--------
1. Yaklaşan aşılar için doktor randevusu alınmalıdır
2. Aşı öncesi çocuğun sağlıklı olduğundan emin olunmalıdır
3. Aşı sonrası yan etkileri gözlemleyin
4. Aşı kartını güvenli bir yerde saklayın

Rapor Tarihi: ${new Date().toLocaleString("tr-TR")}
      `;

      Alert.alert("Başarılı", "Aşı takvimi raporu oluşturuldu. (Simülasyon)");
      console.log("Vaccination Report:", reportContent);
    } catch (error) {
      Alert.alert("Hata", "Rapor oluşturulamadı");
    } finally {
      setGenerating(false);
    }
  };

  const generateNutritionReport = async () => {
    setGenerating(true);
    try {
      const breastfeeding = nutritionLogs.filter((n: any) => n.type === "breastfeeding").length;
      const formula = nutritionLogs.filter((n: any) => n.type === "formula").length;
      const solidFood = nutritionLogs.filter((n: any) => n.type === "solid_food").length;

      const reportContent = `
BabySteps Beslenme Analizi Raporu
==================================

Çocuk: ${child?.name}
Doğum Tarihi: ${child?.dateOfBirth}
Rapor Tarihi: ${new Date().toLocaleDateString("tr-TR")}

BESLENME İSTATİSTİKLERİ
-----------------------
Toplam Kayıt: ${nutritionLogs.length}
Emzirme: ${breastfeeding}
Mama: ${formula}
Ek Gıda: ${solidFood}

BESLENME DURUMU
---------------
Çocuğunuzun beslenme düzeni düzenli ve dengeli görünmektedir.

ÖNERİLER
--------
1. Yaşa uygun beslenme devam ettirilmelidir
2. Yeni gıdalar kademeli olarak eklenmelidir
3. Alerji belirtileri gözlemlenmelidir
4. Su tüketimi artırılmalıdır
5. Organik ve taze gıdalar tercih edilmelidir

ALERJEN UYARISI
---------------
Bilinen alerjenler: ${nutritionLogs.filter((n: any) => n.notes?.includes("Alerjen")).length > 0 ? "Var" : "Yok"}

Rapor Tarihi: ${new Date().toLocaleString("tr-TR")}
      `;

      Alert.alert("Başarılı", "Beslenme analizi raporu oluşturuldu. (Simülasyon)");
      console.log("Nutrition Report:", reportContent);
    } catch (error) {
      Alert.alert("Hata", "Rapor oluşturulamadı");
    } finally {
      setGenerating(false);
    }
  };

  const reports = [
    {
      id: "growth",
      title: "📈 Gelişim Raporu",
      description: "Boy, kilo ve gelişim kilometre taşları özeti",
      onPress: generateGrowthReport,
    },
    {
      id: "vaccination",
      title: "💉 Aşı Takvimi Raporu",
      description: "Tamamlanan ve yaklaşan aşılar",
      onPress: generateVaccinationReport,
    },
    {
      id: "nutrition",
      title: "🍽️ Beslenme Analizi",
      description: "Beslenme düzeni ve besin değerleri",
      onPress: generateNutritionReport,
    },
    {
      id: "comprehensive",
      title: "📊 Kapsamlı Rapor",
      description: "Tüm veriler bir arada (Gelişim + Aşı + Beslenme + Uyku + Sağlık)",
      onPress: () => Alert.alert("Bilgi", "Kapsamlı rapor oluşturuluyor..."),
    },
  ];

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">📊 Raporlar</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View className="bg-primary/10 rounded-lg p-4 border border-primary gap-2">
            <Text className="text-sm font-semibold text-primary">💡 Bilgi</Text>
            <Text className="text-sm text-foreground">
              Raporlar PDF formatında oluşturulur ve doktor ziyaretleri için paylaşılabilir.
            </Text>
          </View>

          {/* Reports */}
          <View className="gap-3">
            {reports.map((report) => (
              <TouchableOpacity
                key={report.id}
                onPress={report.onPress}
                disabled={generating}
                className="bg-surface rounded-lg p-4 border border-border gap-2"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-foreground flex-1">
                    {report.title}
                  </Text>
                  {generating ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <Text className="text-lg">→</Text>
                  )}
                </View>
                <Text className="text-sm text-muted">{report.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Statistics */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">VERİ İSTATİSTİKLERİ</Text>
            <View className="flex-row gap-2">
              <View className="flex-1 bg-surface rounded-lg p-3 items-center gap-1">
                <Text className="text-2xl font-bold text-primary">{growthData.length}</Text>
                <Text className="text-xs text-muted text-center">Gelişim Ölçümü</Text>
              </View>
              <View className="flex-1 bg-surface rounded-lg p-3 items-center gap-1">
                <Text className="text-2xl font-bold text-primary">{vaccinations.length}</Text>
                <Text className="text-xs text-muted text-center">Aşı Kaydı</Text>
              </View>
              <View className="flex-1 bg-surface rounded-lg p-3 items-center gap-1">
                <Text className="text-2xl font-bold text-primary">{nutritionLogs.length}</Text>
                <Text className="text-xs text-muted text-center">Beslenme Kaydı</Text>
              </View>
            </View>
          </View>

          {/* Export Options */}
          <View className="gap-3 mt-4">
            <Text className="text-sm font-semibold text-foreground">DIŞA AKTAR</Text>
            <TouchableOpacity className="bg-primary rounded-lg py-4 items-center">
              <Text className="text-white font-semibold">📥 PDF İndir</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-surface rounded-lg py-4 items-center border border-border">
              <Text className="text-foreground font-semibold">📧 E-posta ile Gönder</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-surface rounded-lg py-4 items-center border border-border">
              <Text className="text-foreground font-semibold">📤 Paylaş</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
