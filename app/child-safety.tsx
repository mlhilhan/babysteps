import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useI18n } from "@/hooks/use-i18n";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

interface MedicalInfo {
  bloodType: string;
  allergies: string[];
  chronicDiseases: string[];
  medications: string[];
  doctorName: string;
  doctorPhone: string;
  insuranceNumber?: string;
}

export default function ChildSafetyScreen() {
  const { t } = useI18n();
  const [childId] = useState("child-1");
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "Anne",
      relationship: "Anne",
      phone: "+90 555 123 4567",
      email: "anne@example.com",
    },
    {
      id: "2",
      name: "Baba",
      relationship: "Baba",
      phone: "+90 555 987 6543",
      email: "baba@example.com",
    },
  ]);

  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({
    bloodType: "O+",
    allergies: ["Yer fıstığı", "Süt"],
    chronicDiseases: [],
    medications: ["Vitamin D"],
    doctorName: "Dr. Ahmet Yılmaz",
    doctorPhone: "+90 555 111 2222",
    insuranceNumber: "12345678",
  });

  const [showContactModal, setShowContactModal] = useState(false);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [newContact, setNewContact] = useState<EmergencyContact>({
    id: "",
    name: "",
    relationship: "",
    phone: "",
  });

  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const addEmergencyContact = () => {
    if (!newContact.name || !newContact.phone) {
      Alert.alert("Hata", "Ad ve telefon numarası gereklidir");
      return;
    }

    const contact: EmergencyContact = {
      ...newContact,
      id: Date.now().toString(),
    };

    setEmergencyContacts([...emergencyContacts, contact]);
    setNewContact({ id: "", name: "", relationship: "", phone: "" });
    setShowContactModal(false);
  };

  const deleteContact = (id: string) => {
    Alert.alert("Sil", "Bu kontağı silmek istediğinizden emin misiniz?", [
      { text: "İptal", onPress: () => {} },
      {
        text: "Sil",
        onPress: () => {
          setEmergencyContacts(emergencyContacts.filter((c) => c.id !== id));
        },
      },
    ]);
  };

  const generateQRCode = () => {
    // QR kod verisi: JSON formatında tıbbi bilgiler
    const qrData = {
      childId,
      medicalInfo,
      emergencyContacts,
      timestamp: new Date().toISOString(),
    };
    return JSON.stringify(qrData);
  };

  const shareQRCode = () => {
    Alert.alert(
      "QR Kod Paylaş",
      "QR kod okutarak hızlı tıbbi bilgilere erişebilirsiniz",
      [
        { text: "Kapat", onPress: () => {} },
        {
          text: "Yazdır",
          onPress: () => {
            Alert.alert("Başarılı", "QR kod yazdırma özelliği yakında gelecek");
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <Text className="text-3xl font-bold text-foreground mb-6">
          Çocuk Güvenliği
        </Text>

        {/* Acil Durum Kontakları */}
        <View className="bg-surface rounded-2xl p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-foreground">
              🚨 Acil Durum Kontakları
            </Text>
            <TouchableOpacity
              onPress={() => setShowContactModal(true)}
              className="bg-primary px-3 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">+ Ekle</Text>
            </TouchableOpacity>
          </View>

          {emergencyContacts.length === 0 ? (
            <Text className="text-muted text-center py-4">
              Henüz acil durum kontağı eklenmedi
            </Text>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={emergencyContacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="bg-background rounded-lg p-3 mb-2 flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">
                      {item.name}
                    </Text>
                    <Text className="text-sm text-muted">{item.relationship}</Text>
                    <Text className="text-sm text-primary font-semibold">
                      {item.phone}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => deleteContact(item.id)}
                    className="bg-error px-2 py-1 rounded"
                  >
                    <Text className="text-white text-xs">Sil</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>

        {/* Tıbbi Bilgiler */}
        <View className="bg-surface rounded-2xl p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-foreground">
              🏥 Tıbbi Bilgiler
            </Text>
            <TouchableOpacity
              onPress={() => setShowMedicalModal(true)}
              className="bg-primary px-3 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Düzenle</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-3">
            <View className="bg-background rounded-lg p-3">
              <Text className="text-xs text-muted mb-1">Kan Grubu</Text>
              <Text className="text-lg font-semibold text-foreground">
                {medicalInfo.bloodType}
              </Text>
            </View>

            {medicalInfo.allergies.length > 0 && (
              <View className="bg-background rounded-lg p-3">
                <Text className="text-xs text-muted mb-1">Alerjiler</Text>
                <Text className="text-foreground">
                  {medicalInfo.allergies.join(", ")}
                </Text>
              </View>
            )}

            {medicalInfo.medications.length > 0 && (
              <View className="bg-background rounded-lg p-3">
                <Text className="text-xs text-muted mb-1">İlaçlar</Text>
                <Text className="text-foreground">
                  {medicalInfo.medications.join(", ")}
                </Text>
              </View>
            )}

            <View className="bg-background rounded-lg p-3">
              <Text className="text-xs text-muted mb-1">Doktor</Text>
              <Text className="font-semibold text-foreground">
                {medicalInfo.doctorName}
              </Text>
              <Text className="text-sm text-primary">
                {medicalInfo.doctorPhone}
              </Text>
            </View>
          </View>
        </View>

        {/* QR Kod */}
        <View className="bg-surface rounded-2xl p-4 mb-6">
          <Text className="text-xl font-semibold text-foreground mb-4">
            📱 Hızlı Erişim QR Kodu
          </Text>
          <Text className="text-sm text-muted mb-4">
            Bu QR kodu yazdırın ve çocuğun cüzdanına veya çantasına koyun. Acil
            durumlarda hızlı erişim sağlar.
          </Text>

          <View className="bg-background rounded-lg p-4 items-center mb-4">
            <View className="w-40 h-40 bg-white rounded-lg items-center justify-center border-2 border-primary">
              <Text className="text-center text-xs text-muted px-2">
                QR Kod Burada Görünecek
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={shareQRCode}
            className="bg-primary rounded-lg py-3 items-center"
          >
            <Text className="text-white font-semibold">QR Kodu Paylaş</Text>
          </TouchableOpacity>
        </View>

        {/* Bilgi Kartı */}
        <View className="bg-warning/10 border border-warning rounded-lg p-4 mb-6">
          <Text className="text-sm text-foreground">
            💡 <Text className="font-semibold">İpucu:</Text> Tıbbi bilgilerinizi
            güncel tutun. Acil durumlarda bu bilgiler hayat kurtarabilir.
          </Text>
        </View>
      </ScrollView>

      {/* Acil Durum Kontağı Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowContactModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 pb-8">
            <Text className="text-2xl font-bold text-foreground mb-4">
              Acil Durum Kontağı Ekle
            </Text>

            <TextInput
              placeholder="Ad"
              value={newContact.name}
              onChangeText={(text) =>
                setNewContact({ ...newContact, name: text })
              }
              className="bg-surface border border-border rounded-lg px-4 py-3 mb-3 text-foreground"
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="İlişki (Anne, Baba, vb.)"
              value={newContact.relationship}
              onChangeText={(text) =>
                setNewContact({ ...newContact, relationship: text })
              }
              className="bg-surface border border-border rounded-lg px-4 py-3 mb-3 text-foreground"
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Telefon Numarası"
              value={newContact.phone}
              onChangeText={(text) =>
                setNewContact({ ...newContact, phone: text })
              }
              keyboardType="phone-pad"
              className="bg-surface border border-border rounded-lg px-4 py-3 mb-3 text-foreground"
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="E-posta (İsteğe bağlı)"
              value={newContact.email}
              onChangeText={(text) =>
                setNewContact({ ...newContact, email: text })
              }
              keyboardType="email-address"
              className="bg-surface border border-border rounded-lg px-4 py-3 mb-4 text-foreground"
              placeholderTextColor="#999"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowContactModal(false)}
                className="flex-1 bg-muted rounded-lg py-3 items-center"
              >
                <Text className="text-foreground font-semibold">İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={addEmergencyContact}
                className="flex-1 bg-primary rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Tıbbi Bilgiler Modal */}
      <Modal
        visible={showMedicalModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMedicalModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 pb-8 max-h-3/4">
            <ScrollView>
              <Text className="text-2xl font-bold text-foreground mb-4">
                Tıbbi Bilgileri Düzenle
              </Text>

              <Text className="text-sm font-semibold text-foreground mb-2">
                Kan Grubu
              </Text>
              <TextInput
                placeholder="Kan Grubu (O+, A-, vb.)"
                value={medicalInfo.bloodType}
                onChangeText={(text) =>
                  setMedicalInfo({ ...medicalInfo, bloodType: text })
                }
                className="bg-surface border border-border rounded-lg px-4 py-3 mb-4 text-foreground"
                placeholderTextColor="#999"
              />

              <Text className="text-sm font-semibold text-foreground mb-2">
                Alerjiler (virgülle ayırın)
              </Text>
              <TextInput
                placeholder="Yer fıstığı, Süt, vb."
                value={medicalInfo.allergies.join(", ")}
                onChangeText={(text) =>
                  setMedicalInfo({
                    ...medicalInfo,
                    allergies: text.split(",").map((a) => a.trim()),
                  })
                }
                className="bg-surface border border-border rounded-lg px-4 py-3 mb-4 text-foreground"
                placeholderTextColor="#999"
              />

              <Text className="text-sm font-semibold text-foreground mb-2">
                Doktor Adı
              </Text>
              <TextInput
                placeholder="Doktor Adı"
                value={medicalInfo.doctorName}
                onChangeText={(text) =>
                  setMedicalInfo({ ...medicalInfo, doctorName: text })
                }
                className="bg-surface border border-border rounded-lg px-4 py-3 mb-4 text-foreground"
                placeholderTextColor="#999"
              />

              <Text className="text-sm font-semibold text-foreground mb-2">
                Doktor Telefonu
              </Text>
              <TextInput
                placeholder="Doktor Telefonu"
                value={medicalInfo.doctorPhone}
                onChangeText={(text) =>
                  setMedicalInfo({ ...medicalInfo, doctorPhone: text })
                }
                keyboardType="phone-pad"
                className="bg-surface border border-border rounded-lg px-4 py-3 mb-4 text-foreground"
                placeholderTextColor="#999"
              />

              <View className="flex-row gap-3 mt-6">
                <TouchableOpacity
                  onPress={() => setShowMedicalModal(false)}
                  className="flex-1 bg-muted rounded-lg py-3 items-center"
                >
                  <Text className="text-foreground font-semibold">İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowMedicalModal(false)}
                  className="flex-1 bg-primary rounded-lg py-3 items-center"
                >
                  <Text className="text-white font-semibold">Kaydet</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
