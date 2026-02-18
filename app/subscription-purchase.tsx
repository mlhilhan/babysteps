import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useTranslation } from "react-i18next";
import {
  getSubscriptionProducts,
  getPackageBenefits,
  purchaseWithApplePay,
  purchaseWithGooglePlay,
  type SubscriptionPackage,
} from "@/lib/in-app-purchases";
import { getSubscriptionPrices } from "@/lib/currency";

export default function SubscriptionPurchaseScreen() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Ürünleri yükle
    const prods = getSubscriptionProducts(i18n.language);
    setProducts(prods);
  }, [i18n.language]);

  const handlePurchase = async (packageType: SubscriptionPackage) => {
    setSelectedPackage(packageType);
    setShowConfirmModal(true);
  };

  const confirmPurchase = async () => {
    if (!selectedPackage) return;

    setProcessing(true);
    setShowConfirmModal(false);

    try {
      // Platform'a göre ödeme yap
      let result;
      if (Platform.OS === "ios") {
        result = await purchaseWithApplePay(selectedPackage, i18n.language);
      } else {
        result = await purchaseWithGooglePlay(selectedPackage, i18n.language);
      }

      if (result.success) {
        Alert.alert(
          "Başarılı",
          "Abonelik satın alındı! Teşekkürler.",
          [
            {
              text: "Tamam",
              onPress: () => {
                // Ana ekrana dön
              },
            },
          ]
        );
      } else {
        Alert.alert("Hata", result.error || "Ödeme işlemi başarısız oldu");
      }
    } catch (error) {
      Alert.alert("Hata", "Ödeme işlemi sırasında bir hata oluştu");
    } finally {
      setProcessing(false);
    }
  };

  const prices = getSubscriptionPrices(i18n.language);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <Text className="text-3xl font-bold text-foreground mb-2">
          Premium Abonelik
        </Text>
        <Text className="text-base text-muted mb-6">
          Tüm premium özelliklerine erişin
        </Text>

        {/* Plus (Monthly) */}
        <View className="bg-surface rounded-2xl p-4 mb-4 border-2 border-border">
          <View className="flex-row justify-between items-start mb-3">
            <View>
              <Text className="text-xl font-bold text-foreground">Plus (Aylık)</Text>
              <Text className="text-sm text-muted">Aylık abonelik</Text>
            </View>
            <Text className="text-2xl font-bold text-primary">{prices.plusMonthly}</Text>
          </View>

          <View className="bg-background rounded-lg p-3 mb-4">
            {getPackageBenefits("plusMonthly").map((benefit, index) => (
              <Text key={index} className="text-sm text-foreground mb-2">
                ✓ {benefit}
              </Text>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => handlePurchase("plusMonthly")}
            className="bg-primary rounded-lg py-3 items-center"
          >
            <Text className="text-white font-semibold">Satın Al</Text>
          </TouchableOpacity>
        </View>

        {/* Plus (Yearly) - Önerilen */}
        <View className="bg-primary/10 rounded-2xl p-4 mb-4 border-2 border-primary">
          <View className="flex-row justify-between items-start mb-3">
            <View>
              <Text className="text-xl font-bold text-foreground">Plus (Yıllık)</Text>
              <Text className="text-sm text-success font-semibold">⭐ En İyi Fiyat</Text>
            </View>
            <Text className="text-2xl font-bold text-primary">{prices.plusYearly}</Text>
          </View>

          <View className="bg-background rounded-lg p-3 mb-4">
            {getPackageBenefits("plusYearly").map((benefit, index) => (
              <Text key={index} className="text-sm text-foreground mb-2">
                ✓ {benefit}
              </Text>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => handlePurchase("plusYearly")}
            className="bg-primary rounded-lg py-3 items-center"
          >
            <Text className="text-white font-semibold">Satın Al</Text>
          </TouchableOpacity>
        </View>

        {/* Pro */}
        <View className="bg-surface rounded-2xl p-4 mb-6 border-2 border-border">
          <View className="flex-row justify-between items-start mb-3">
            <View>
              <Text className="text-xl font-bold text-foreground">Pro</Text>
              <Text className="text-sm text-muted">Premium + Uzman Danışmanlar</Text>
            </View>
            <Text className="text-2xl font-bold text-primary">{prices.pro}</Text>
          </View>

          <View className="bg-background rounded-lg p-3 mb-4">
            {getPackageBenefits("pro").map((benefit, index) => (
              <Text key={index} className="text-sm text-foreground mb-2">
                ✓ {benefit}
              </Text>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => handlePurchase("pro")}
            className="bg-primary rounded-lg py-3 items-center"
          >
            <Text className="text-white font-semibold">Satın Al</Text>
          </TouchableOpacity>
        </View>

        {/* Bilgi */}
        <View className="bg-warning/10 border border-warning rounded-lg p-4">
          <Text className="text-xs text-foreground mb-2">
            💳 <Text className="font-semibold">Ödeme Yöntemleri:</Text>
          </Text>
          <Text className="text-xs text-muted mb-2">
            • Apple Pay (iOS cihazlar)
          </Text>
          <Text className="text-xs text-muted mb-2">
            • Google Play Billing (Android cihazlar)
          </Text>
          <Text className="text-xs text-muted">
            • Otomatik yenileme - İstediğiniz zaman iptal edebilirsiniz
          </Text>
        </View>
      </ScrollView>

      {/* Onay Modal */}
      <Modal
        visible={showConfirmModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-background rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-2xl font-bold text-foreground mb-4">
              Satın Almayı Onayla
            </Text>

            {selectedPackage && (
              <>
                <View className="bg-surface rounded-lg p-4 mb-6">
                  <Text className="text-sm text-muted mb-2">Paket:</Text>
                  <Text className="text-lg font-semibold text-foreground mb-4">
                    {selectedPackage === "plusMonthly"
                      ? "Plus (Aylık)"
                      : selectedPackage === "plusYearly"
                      ? "Plus (Yıllık)"
                      : "Pro"}
                  </Text>

                  <Text className="text-sm text-muted mb-2">Fiyat:</Text>
                  <Text className="text-2xl font-bold text-primary mb-4">
                    {selectedPackage === "plusMonthly"
                      ? prices.plusMonthly
                      : selectedPackage === "plusYearly"
                      ? prices.plusYearly
                      : prices.pro}
                  </Text>

                  <Text className="text-xs text-muted">
                    Otomatik yenileme etkindir. İstediğiniz zaman iptal edebilirsiniz.
                  </Text>
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setShowConfirmModal(false)}
                    disabled={processing}
                    className="flex-1 bg-muted rounded-lg py-3 items-center"
                  >
                    <Text className="text-foreground font-semibold">İptal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={confirmPurchase}
                    disabled={processing}
                    className="flex-1 bg-primary rounded-lg py-3 items-center"
                  >
                    {processing ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-semibold">Onayla</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}


