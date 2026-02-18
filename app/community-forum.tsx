import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/hooks/use-i18n";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";

interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  category: "tips" | "questions" | "experiences" | "resources";
  likes: number;
  replies: number;
  timestamp: Date;
  isAnonymous: boolean;
}

interface ForumReply {
  id: string;
  author: string;
  content: string;
  likes: number;
  timestamp: Date;
  isAnonymous: boolean;
}

export default function CommunityForumScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuth();

  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: "1",
      author: "Ayşe",
      title: "İlk dişin çıktığında ne yapmalı?",
      content: "Bebeğimin ilk dişi çıkıyor. Ağrıyı hafifletmek için ne yapabilirim?",
      category: "questions",
      likes: 12,
      replies: 8,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isAnonymous: false,
    },
    {
      id: "2",
      author: "Anonim",
      title: "Uyku rutini oluşturma ipuçları",
      content: "Sağlıklı uyku rutini oluşturmak için denediğim yöntemler...",
      category: "tips",
      likes: 45,
      replies: 15,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isAnonymous: true,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<"all" | "tips" | "questions" | "experiences" | "resources">("all");
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "all", label: "Tümü", emoji: "📌" },
    { id: "tips", label: "İpuçları", emoji: "💡" },
    { id: "questions", label: "Sorular", emoji: "❓" },
    { id: "experiences", label: "Deneyimler", emoji: "📖" },
    { id: "resources", label: "Kaynaklar", emoji: "📚" },
  ];

  const filteredPosts = selectedCategory === "all" ? posts : posts.filter((p) => p.category === selectedCategory);

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert("Başlık ve içerik boş olamaz");
      return;
    }

    const newPost: ForumPost = {
      id: Date.now().toString(),
      author: isAnonymous ? "Anonim" : user?.email?.split("@")[0] || "Kullanıcı",
      title: newPostTitle,
      content: newPostContent,
      category: "questions",
      likes: 0,
      replies: 0,
      timestamp: new Date(),
      isAnonymous,
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setIsAnonymous(false);
    setShowNewPostModal(false);
  };

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">👥 Ebeveyn Topluluğu</Text>
            <TouchableOpacity
              onPress={() => setShowNewPostModal(true)}
              className="bg-primary rounded-lg px-4 py-2"
            >
              <Text className="text-white font-semibold text-sm">+ Yazı Yaz</Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id as any)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === cat.id ? "bg-primary" : "bg-surface border border-border"
                }`}
              >
                <Text className={`font-semibold text-sm ${selectedCategory === cat.id ? "text-white" : "text-foreground"}`}>
                  {cat.emoji} {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <View className="bg-surface rounded-lg p-6 items-center gap-2 border border-border">
              <Text className="text-lg text-muted">Bu kategoride yazı yok</Text>
            </View>
          ) : (
            filteredPosts.map((post) => (
              <TouchableOpacity
                key={post.id}
                onPress={() => router.push(`/forum/${post.id}`)}
                className="bg-surface rounded-lg p-4 border border-border gap-3 active:opacity-80"
              >
                {/* Post Header */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-sm font-semibold text-foreground">
                        {post.isAnonymous ? "👤 Anonim" : post.author}
                      </Text>
                      <Text className="text-xs text-muted">
                        {post.timestamp.toLocaleDateString("tr-TR")}
                      </Text>
                    </View>
                    <Text className="text-lg font-semibold text-foreground">{post.title}</Text>
                  </View>
                  <View className="bg-primary/20 rounded-full px-3 py-1">
                    <Text className="text-xs font-semibold text-primary">
                      {categories.find((c) => c.id === post.category)?.emoji}
                    </Text>
                  </View>
                </View>

                {/* Post Content Preview */}
                <Text className="text-sm text-muted line-clamp-2">{post.content}</Text>

                {/* Post Footer */}
                <View className="flex-row items-center justify-between pt-2 border-t border-border">
                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity
                      onPress={() => handleLikePost(post.id)}
                      className="flex-row items-center gap-1"
                    >
                      <Text className="text-lg">👍</Text>
                      <Text className="text-sm text-muted">{post.likes}</Text>
                    </TouchableOpacity>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-lg">💬</Text>
                      <Text className="text-sm text-muted">{post.replies}</Text>
                    </View>
                  </View>
                  <Text className="text-xs text-muted">Devamını Oku →</Text>
                </View>
              </TouchableOpacity>
            ))
          )}

          {/* Community Guidelines */}
          <View className="bg-primary/10 rounded-lg p-4 border border-primary gap-2 mt-4">
            <Text className="text-sm font-semibold text-primary">📋 Topluluk Kuralları</Text>
            <Text className="text-xs text-foreground">
              • Saygılı ve yapıcı iletişim kurun{"\n"}
              • Kişisel bilgi paylaşmayın{"\n"}
              • Tıbbi tavsiye yerine deneyim paylaşın{"\n"}
              • Anonim yazı yazma seçeneğini kullanın
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* New Post Modal */}
      <Modal visible={showNewPostModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 gap-4 max-h-4/5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-foreground">Yeni Yazı</Text>
              <TouchableOpacity onPress={() => setShowNewPostModal(false)}>
                <Text className="text-2xl">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-4">
                {/* Title Input */}
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">Başlık</Text>
                  <TextInput
                    value={newPostTitle}
                    onChangeText={setNewPostTitle}
                    placeholder="Yazı başlığını girin"
                    className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                    placeholderTextColor={colors.muted}
                  />
                </View>

                {/* Content Input */}
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">İçerik</Text>
                  <TextInput
                    value={newPostContent}
                    onChangeText={setNewPostContent}
                    placeholder="Yazı içeriğini girin"
                    multiline
                    numberOfLines={6}
                    className="bg-surface rounded-lg px-4 py-3 text-foreground border border-border"
                    placeholderTextColor={colors.muted}
                    textAlignVertical="top"
                  />
                </View>

                {/* Anonymous Toggle */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-foreground">Anonim Yaz</Text>
                  <View className={`w-12 h-6 rounded-full ${isAnonymous ? "bg-primary" : "bg-surface border border-border"} items-center justify-end pr-1`}>
                    <View className={`w-5 h-5 rounded-full ${isAnonymous ? "bg-white" : "bg-muted"}`} />
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleCreatePost}
                  disabled={loading}
                  className="bg-primary rounded-lg py-4 items-center mt-4"
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-semibold text-lg">Yazıyı Yayınla</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
