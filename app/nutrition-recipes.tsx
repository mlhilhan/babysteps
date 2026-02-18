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
  FlatList,
} from "react-native";

interface Recipe {
  id: string;
  name: string;
  ageRange: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  allergies: string[];
  difficulty: "easy" | "medium" | "hard";
}

export default function NutritionRecipesScreen() {
  const { t } = useTranslation();
  const colors = useColors();

  const [selectedAgeRange, setSelectedAgeRange] = useState("6-12 ay");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);

  const recipes: Recipe[] = [
    {
      id: "1",
      name: "Sebze Püresi",
      ageRange: "6-12 ay",
      ingredients: ["Havuç 100g", "Patates 100g", "Su 200ml", "Tuz az"],
      instructions: [
        "Sebzeleri yıkayıp soyunuz",
        "Küçük parçalara kesiniz",
        "Suya koyup 20 dakika pişiriniz",
        "Blenderden geçiriniz",
        "Soğutup serviniz",
      ],
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      nutrition: {
        calories: 45,
        protein: "1g",
        carbs: "10g",
        fat: "0.2g",
      },
      allergies: [],
      difficulty: "easy",
    },
    {
      id: "2",
      name: "Tavuk Göğsü Püresi",
      ageRange: "8-12 ay",
      ingredients: ["Tavuk göğsü 100g", "Süt 100ml", "Tuz az", "Yağ 1 çay kaşığı"],
      instructions: [
        "Tavuk göğsünü haşlayıp küçük parçalara kesiniz",
        "Blenderden geçiriniz",
        "Süt ve yağ ekleyiniz",
        "Karıştırıp serviniz",
      ],
      prepTime: 5,
      cookTime: 15,
      servings: 3,
      nutrition: {
        calories: 120,
        protein: "15g",
        carbs: "2g",
        fat: "5g",
      },
      allergies: ["Gluten"],
      difficulty: "easy",
    },
    {
      id: "3",
      name: "Elma Kompotası",
      ageRange: "6-12 ay",
      ingredients: ["Elma 200g", "Su 300ml", "Tarçın 1 çubuk (isteğe bağlı)"],
      instructions: [
        "Elmaları yıkayıp soyunuz",
        "Çekirdeklerini çıkarıp küçük parçalara kesiniz",
        "Suya koyup 15 dakika pişiriniz",
        "Blenderden geçiriniz",
        "Soğutup serviniz",
      ],
      prepTime: 10,
      cookTime: 15,
      servings: 5,
      nutrition: {
        calories: 52,
        protein: "0.3g",
        carbs: "13g",
        fat: "0.2g",
      },
      allergies: [],
      difficulty: "easy",
    },
    {
      id: "4",
      name: "Yoğurtlu Meyve Karışımı",
      ageRange: "12+ ay",
      ingredients: ["Yoğurt 150ml", "Çilek 100g", "Muz 1 adet", "Bal 1 çay kaşığı"],
      instructions: [
        "Çilekleri yıkayıp küçük parçalara kesiniz",
        "Muzu dilimleyiniz",
        "Yoğurta ekleyiniz",
        "Balı karıştırıp serviniz",
      ],
      prepTime: 5,
      cookTime: 0,
      servings: 2,
      nutrition: {
        calories: 150,
        protein: "5g",
        carbs: "28g",
        fat: "2g",
      },
      allergies: [],
      difficulty: "easy",
    },
    {
      id: "5",
      name: "Pirinç Lapası",
      ageRange: "6-12 ay",
      ingredients: ["Pirinç 50g", "Su 250ml", "Tuz az", "Yağ 1 çay kaşığı"],
      instructions: [
        "Pirinci yıkayıp süzünüz",
        "Suya koyup kaynatıp ateşi kısınız",
        "20 dakika pişiriniz",
        "Blenderden geçiriniz",
        "Yağ ekleyip serviniz",
      ],
      prepTime: 5,
      cookTime: 25,
      servings: 4,
      nutrition: {
        calories: 130,
        protein: "2g",
        carbs: "28g",
        fat: "1g",
      },
      allergies: [],
      difficulty: "easy",
    },
  ];

  const filteredRecipes = recipes.filter((r) => r.ageRange === selectedAgeRange);

  const ageRanges = ["6-12 ay", "12-18 ay", "18+ ay"];

  const difficultyEmojis = {
    easy: "🟢",
    medium: "🟡",
    hard: "🔴",
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">👨‍🍳 Beslenme Reçetleri</Text>
          </View>

          {/* Age Range Filter */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Yaş Aralığı Seçiniz</Text>
            <View className="flex-row gap-2">
              {ageRanges.map((range) => (
                <TouchableOpacity
                  key={range}
                  onPress={() => setSelectedAgeRange(range)}
                  className={`flex-1 py-2 px-3 rounded-lg ${
                    selectedAgeRange === range
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold text-center ${
                      selectedAgeRange === range ? "text-white" : "text-foreground"
                    }`}
                  >
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recipes List */}
          <View className="gap-3">
            {filteredRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                onPress={() => {
                  setSelectedRecipe(recipe);
                  setShowRecipeDetail(true);
                }}
                className="bg-surface rounded-lg p-4 border border-border gap-3 active:opacity-80"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-foreground flex-1">{recipe.name}</Text>
                  <Text className="text-lg">{difficultyEmojis[recipe.difficulty]}</Text>
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-row items-center gap-1">
                    <Text className="text-sm text-muted">⏱️</Text>
                    <Text className="text-xs text-muted">{recipe.prepTime + recipe.cookTime} dk</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Text className="text-sm text-muted">🍽️</Text>
                    <Text className="text-xs text-muted">{recipe.servings} porsiyon</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Text className="text-sm text-muted">🔥</Text>
                    <Text className="text-xs text-muted">{recipe.nutrition.calories} kcal</Text>
                  </View>
                </View>

                {recipe.allergies.length > 0 && (
                  <View className="bg-error/10 rounded-lg px-3 py-1">
                    <Text className="text-xs text-error">
                      ⚠️ {recipe.allergies.join(", ")}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Tips */}
          <View className="bg-blue-100 border border-blue-300 rounded-lg p-4 gap-2">
            <Text className="text-sm font-semibold text-blue-900">💡 Beslenme İpuçları</Text>
            <Text className="text-sm text-blue-800">
              • Reçeteleri çocuğunuzun yaşına uygun seçiniz{"\n"}
              • Yeni besinleri teker teker deneyin{"\n"}
              • Alerji belirtileri için dikkatli olunuz{"\n"}
              • Organik ürünleri tercih ediniz
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Recipe Detail Modal */}
      <Modal visible={showRecipeDetail} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl max-h-[90%]">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="p-6 gap-4">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-2xl font-bold text-foreground flex-1">
                    {selectedRecipe?.name}
                  </Text>
                  <TouchableOpacity onPress={() => setShowRecipeDetail(false)}>
                    <Text className="text-2xl">✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Quick Info */}
                <View className="flex-row gap-3">
                  <View className="flex-1 bg-surface rounded-lg p-3 items-center gap-1 border border-border">
                    <Text className="text-sm text-muted">Hazırlık</Text>
                    <Text className="font-semibold text-foreground">
                      {selectedRecipe?.prepTime} dk
                    </Text>
                  </View>
                  <View className="flex-1 bg-surface rounded-lg p-3 items-center gap-1 border border-border">
                    <Text className="text-sm text-muted">Pişirme</Text>
                    <Text className="font-semibold text-foreground">
                      {selectedRecipe?.cookTime} dk
                    </Text>
                  </View>
                  <View className="flex-1 bg-surface rounded-lg p-3 items-center gap-1 border border-border">
                    <Text className="text-sm text-muted">Porsiyon</Text>
                    <Text className="font-semibold text-foreground">
                      {selectedRecipe?.servings}
                    </Text>
                  </View>
                </View>

                {/* Nutrition */}
                <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                  <Text className="font-semibold text-foreground mb-2">Besin Değerleri</Text>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Kalori</Text>
                    <Text className="font-semibold text-foreground">
                      {selectedRecipe?.nutrition.calories} kcal
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Protein</Text>
                    <Text className="font-semibold text-foreground">
                      {selectedRecipe?.nutrition.protein}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Karbonhidrat</Text>
                    <Text className="font-semibold text-foreground">
                      {selectedRecipe?.nutrition.carbs}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Yağ</Text>
                    <Text className="font-semibold text-foreground">
                      {selectedRecipe?.nutrition.fat}
                    </Text>
                  </View>
                </View>

                {/* Ingredients */}
                <View className="gap-2">
                  <Text className="font-semibold text-foreground">Malzemeler</Text>
                  {selectedRecipe?.ingredients.map((ingredient, index) => (
                    <View key={index} className="flex-row items-center gap-2">
                      <Text className="text-primary">•</Text>
                      <Text className="text-sm text-foreground">{ingredient}</Text>
                    </View>
                  ))}
                </View>

                {/* Instructions */}
                <View className="gap-2">
                  <Text className="font-semibold text-foreground">Yapılış</Text>
                  {selectedRecipe?.instructions.map((instruction, index) => (
                    <View key={index} className="flex-row gap-3">
                      <View className="bg-primary rounded-full w-6 h-6 items-center justify-center">
                        <Text className="text-white text-xs font-bold">{index + 1}</Text>
                      </View>
                      <Text className="flex-1 text-sm text-foreground pt-0.5">
                        {instruction}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Allergies */}
                {(selectedRecipe?.allergies.length ?? 0) > 0 && (
                  <View className="bg-error/10 rounded-lg p-4 border border-error gap-2">
                    <Text className="font-semibold text-error">⚠️ Alerjen Uyarısı</Text>
                    <Text className="text-sm text-error">
                      Bu reçete şunları içerebilir: {selectedRecipe?.allergies.join(", ")}
                    </Text>
                  </View>
                )}

                {/* Close Button */}
                <TouchableOpacity
                  onPress={() => setShowRecipeDetail(false)}
                  className="bg-primary rounded-lg py-3 mt-4"
                >
                  <Text className="text-center font-semibold text-white">Kapat</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
