import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import type { FooterActionOptions } from "@/contexts/footerActionsContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedButton } from "./ThemedButton";
import { ThemedView } from "./ThemedView";

export function FooterActions({
  title,
  onPress,
  disabled,
  loading,
  id,
}: FooterActionOptions) {
  return (
    <ThemedView type="gap" style={styles.footer}>
      <ThemedButton
        style={styles.back}
        iconOnly
        onPress={() => router.back()}
        leadingIcon={() => (
          <Ionicons
            name="close-outline"
            size={20}
            color={Colors.light.onSurface}
          />
        )}
      />
      <ThemedButton
        title={title}
        id={id}
        width="auto"
        style={styles.container}
        onPress={onPress}
        disabled={disabled}
        loading={loading}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    width: "100%",
    maxWidth: 450,
    alignItems: "center",
    bottom: 0,
    gap: 8,
    paddingBottom: 32,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    maxWidth: 450,
    height: 55,
    padding: 6,
    gap: 6,
    borderRadius: 24,
    alignItems: "stretch",
    backgroundColor: Colors.light.primary,
  },
  back: {
    width: 55,
    height: 55,
    padding: 6,
    gap: 6,
    borderRadius: 50,
    alignItems: "stretch",
    backgroundColor: Colors.light.navigationBackground,
  },
});
