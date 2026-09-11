import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export function Categories() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <ThemedView type='left' style={styles.container}>
        <ThemedText type='left' style={styles.label}>Categories</ThemedText>
        <ThemedView type='row' style={styles.icons}>
            {Array.from({ length: 3 }, (_, index) => (
                <Pressable
                  key={index}
                  style={[styles.icon, activeCategory === index ? styles.active : undefined]}
                  onPress={() => setActiveCategory(index)}
                >
                <Ionicons
                    name="menu-outline"
                    size={25}
                    color={activeCategory === index ? Colors.light.background : Colors.light.onSurface}
                />
                </Pressable>
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
    gap: 4,
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.onSecondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  active: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  label: {
    marginBottom: 4,
    color: Colors.light.textMuted,
  }
});
