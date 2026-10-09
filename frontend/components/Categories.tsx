import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";
import { IconCategory } from "./IconCategory";

export function Categories() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <ThemedView type='left' style={styles.container}>
        <ThemedText type="small" muted={true} style={{ marginBottom: 6, width: '100%' }}>Categories</ThemedText>
        <ThemedView type='row' style={styles.icons}>
          {Array.from({ length: 3 }, (_, index) => (
            <IconCategory size={40} />
          ))}
        </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  icons: {
    width: '100%',
    justifyContent: 'flex-start',
    gap: 6,
  }
});
