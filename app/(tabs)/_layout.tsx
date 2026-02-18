import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="../growth-tracking"
        options={{
          title: "Gelişim",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📈</Text>,
          href: { pathname: "/growth-tracking", params: { childId: "1" } },
        }}
      />
      <Tabs.Screen
        name="../vaccination-schedule"
        options={{
          title: "Aşı",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💉</Text>,
          href: { pathname: "/vaccination-schedule", params: { childId: "1" } },
        }}
      />
      <Tabs.Screen
        name="../nutrition-log"
        options={{
          title: "Beslenme",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🍽️</Text>,
          href: { pathname: "/nutrition-log", params: { childId: "1" } },
        }}
      />
      <Tabs.Screen
        name="../sleep-tracking"
        options={{
          title: "Uyku",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>😴</Text>,
          href: { pathname: "/sleep-tracking", params: { childId: "1" } },
        }}
      />
      <Tabs.Screen
        name="../health-notes"
        options={{
          title: "Sağlık",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏥</Text>,
          href: { pathname: "/health-notes", params: { childId: "1" } },
        }}
      />
      <Tabs.Screen
        name="../memory-journal"
        options={{
          title: "Anılar",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📸</Text>,
          href: { pathname: "/memory-journal", params: { childId: "1" } },
        }}
      />
      <Tabs.Screen
        name="../ai-assistant"
        options={{
          title: "AI",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🤖</Text>,
          href: { pathname: "/ai-assistant", params: { childId: "1" } },
        }}
      />
    </Tabs>
  );
}
