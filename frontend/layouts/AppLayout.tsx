import { Footer } from "@/components/Footer";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Slot } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AppLayout() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      type="middle"
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: Colors.light.background,
      }}
    >
      <View style={{ flex: 1, width: "100%", maxWidth: 500 }}>
        <AppNavigator />
      </View>
      <Footer />
    </ThemedView>
  );
}

function AppNavigator() {
  return <Slot />;
}
