import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";

export function Tabs() {
  const handleTab = () => {
    router.replace({
      pathname: "/(app)/travels",
      params: { mode: "V" },
    });
  };

  return (
    <View style={styles.tabs}>
        <ThemedView type="between" style={styles.container}>
            <ThemedView type="center">
                <ThemedText type="center" style={styles.text} onPress={handleTab}>
                Planed
                </ThemedText>
            </ThemedView>
            <ThemedView type="center">
                <ThemedText type="center" style={styles.text} onPress={handleTab}>
                Completed
                </ThemedText>
            </ThemedView>
        </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    width: "100%",
    padding: 4,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 8,
  },
  container: {
    gap: 4
  },
  text: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.light.onSurface,
    color: Colors.light.onPrimary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
});
