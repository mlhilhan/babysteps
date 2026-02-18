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
  Modal,
  TextInput,
  Image,
  FlatList,
} from "react-native";


interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "editor" | "viewer";
  joinedDate: Date;
}

interface SharedMemory {
  id: string;
  childName: string;
  description: string;
  imageUrl: string;
  sharedBy: string;
  sharedDate: Date;
  views: number;
}

export default function FamilyAlbumScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const { childId } = useLocalSearchParams();
  const { user } = useAuth();

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      name: "Anne",
      email: "anne@example.com",
      role: "owner",
      joinedDate: new Date(),
    },
    {
      id: "2",
      name: "Baba",
      email: "baba@example.com",
      role: "editor",
      joinedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [sharedMemories, setSharedMemories] = useState<SharedMemory[]>([
    {
      id: "1",
      childName: "Ayşe",
      description: "İlk gülüşü 😊",
      imageUrl: "https://via.placeholder.com/300",
      sharedBy: "Anne",
      sharedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      views: 5,
    },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("viewer");
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      Alert.alert("Hata", "E-posta adresi boş olamaz");
      return;
    }

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      joinedDate: new Date(),
    };

    setFamilyMembers([...familyMembers, newMember]);
    Alert.alert("Başarılı", `${inviteEmail} davet edildi`);
    setInviteEmail("");
    setShowInviteModal(false);
  };

  const handleGenerateShareLink = () => {
    const link = `https://babysteps.app/album/${Math.random().toString(36).substr(2, 9)}`;
    setShareLink(link);
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    Alert.alert("Başarılı", "Link kopyalandı");
  };

  const handleShareViaWhatsApp = async () => {
    if (!shareLink) return;
    Alert.alert("WhatsApp ile Payış", `Linki kopyalayıp WhatsApp'ta paylasın:
${shareLink}`);
  };

  const handleShareViaEmail = () => {
    if (!shareLink) return;
    Alert.alert("E-posta", `Aile albümü linki:\n${shareLink}`);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">👨‍👩‍👧 Aile Albümü</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-surface items-center justify-center"
            >
              <Text className="text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Share Link Section */}
          <View className="bg-primary/10 rounded-lg p-4 border border-primary gap-3">
            <Text className="text-sm font-semibold text-primary">🔗 Güvenli Paylaşım Linki</Text>
            <Text className="text-sm text-foreground">
              Aile üyelerinizle anıları güvenli bir şekilde paylaşın. Linki WhatsApp, e-posta veya SMS ile gönderin.
            </Text>
            <TouchableOpacity
              onPress={handleGenerateShareLink}
              className="bg-primary rounded-lg py-3 items-center"
            >
              <Text className="text-white font-semibold">Paylaşım Linki Oluştur</Text>
            </TouchableOpacity>
          </View>

          {/* Family Members Section */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">Aile Üyeleri</Text>
              <TouchableOpacity
                onPress={() => setShowInviteModal(true)}
                className="bg-primary rounded-lg px-4 py-2"
              >
                <Text className="text-white font-semibold text-sm">+ Davet Et</Text>
              </TouchableOpacity>
            </View>

            {familyMembers.map((member) => (
              <View key={member.id} className="bg-surface rounded-lg p-4 border border-border gap-2">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-foreground">{member.name}</Text>
                    <Text className="text-sm text-muted">{member.email}</Text>
                  </View>
                  <View className="bg-primary/20 rounded-full px-3 py-1">
                    <Text className="text-xs font-semibold text-primary">
                      {member.role === "owner" ? "Sahip" : member.role === "editor" ? "Düzenleyici" : "Görüntüleyici"}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-muted">
                  Katılma: {member.joinedDate.toLocaleDateString("tr-TR")}
                </Text>
              </View>
            ))}
          </View>

          {/* Shared Memories Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Paylaşılan Anılar</Text>

            {sharedMemories.length === 0 ? (
              <View className="bg-surface rounded-lg p-6 items-center gap-2">
                <Text className="text-lg text-muted">Henüz paylaşılan anı yok</Text>
              </View>
            ) : (
              sharedMemories.map((memory) => (
                <View key={memory.id} className="bg-surface rounded-lg overflow-hidden border border-border">
                  <Image source={{ uri: memory.imageUrl }} className="w-full h-48" />
                  <View className="p-4 gap-2">
                    <Text className="text-lg font-semibold text-foreground">{memory.description}</Text>
                    <Text className="text-sm text-muted">
                      {memory.childName} • {memory.sharedBy} tarafından paylaşıldı
                    </Text>
                    <Text className="text-xs text-muted">
                      {memory.sharedDate.toLocaleDateString("tr-TR")} • {memory.views} görüntüleme
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Privacy Settings */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-sm font-semibold text-foreground">🔒 Gizlilik Ayarları</Text>
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-foreground">Albümü herkese açık yap</Text>
                <View className="w-12 h-6 rounded-full bg-surface border border-border items-center justify-end pr-1">
                  <View className="w-5 h-5 rounded-full bg-muted" />
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-foreground">Yorum izni ver</Text>
                <View className="w-12 h-6 rounded-full bg-primary items-center justify-end pr-1">
                  <View className="w-5 h-5 rounded-full bg-white" />
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-foreground">Fotoğraf indirmeye izin ver</Text>
                <View className="w-12 h-6 rounded-full bg-primary items-center justify-end pr-1">
                  <View className="w-5 h-5 rounded-full bg-white" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Invite Modal */}
      <Modal visible={showInviteModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 gap-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-foreground">Aile Üyesi Davet Et</Text>
              <TouchableOpacity onPress={() => setShowInviteModal(false)}>
                <Text className="text-2xl">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">E-posta Adresi</Text>
              <TextInput
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder="ornek@email.com"
                keyboardType="email-address"
                className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">İzin Seviyesi</Text>
              <View className="flex-row gap-2">
                {["editor", "viewer"].map((role) => (
                  <TouchableOpacity
                    key={role}
                    onPress={() => setInviteRole(role as "editor" | "viewer")}
                    className={`flex-1 rounded-lg py-3 items-center ${
                      inviteRole === role ? "bg-primary" : "bg-surface border border-border"
                    }`}
                  >
                    <Text className={`font-semibold ${inviteRole === role ? "text-white" : "text-foreground"}`}>
                      {role === "editor" ? "Düzenleyici" : "Görüntüleyici"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity onPress={handleInviteMember} className="bg-primary rounded-lg py-4 items-center mt-4">
              <Text className="text-white font-semibold text-lg">Davet Gönder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal visible={showShareModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 gap-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-foreground">Paylaşım Linki</Text>
              <TouchableOpacity onPress={() => setShowShareModal(false)}>
                <Text className="text-2xl">✕</Text>
              </TouchableOpacity>
            </View>

            {shareLink && (
              <>
                <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                  <Text className="text-xs text-muted">Paylaşım Linki</Text>
                  <Text className="text-sm text-foreground font-mono break-words">{shareLink}</Text>
                </View>

                <TouchableOpacity onPress={handleCopyLink} className="bg-surface rounded-lg py-4 items-center border border-border">
                  <Text className="text-foreground font-semibold">📋 Linki Kopyala</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleShareViaWhatsApp} className="bg-green-500 rounded-lg py-4 items-center">
                  <Text className="text-white font-semibold">💬 WhatsApp ile Paylaş</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleShareViaEmail} className="bg-blue-500 rounded-lg py-4 items-center">
                  <Text className="text-white font-semibold">📧 E-posta ile Paylaş</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
