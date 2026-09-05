import { Footer } from "@/components/Footer";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { ScrollView, useWindowDimensions } from "react-native";

export function AppLayout() {
  const { height } = useWindowDimensions();

  return (
    <ThemedView
      type="middle"
      style={{ position: "relative", backgroundColor: Colors.light.background }}
    >
      <ScrollView
        style={{ maxWidth: 500, width: "100%", height: height, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <AppNavigator />
      </ScrollView>
      <Footer />
    </ThemedView>
  );
}

function AppNavigator() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.light.background },
      }}
    />
  );
}
