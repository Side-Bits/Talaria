import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { AppScreen } from "@/components/AppScreen";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

export function PrivacyPolicy() {
  return (
    <AppScreen>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/(auth)/sign-up")}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={20} color={Colors.light.onPrimary} />
        </Pressable>
        <ThemedText type="title" style={styles.title}>Privacy Policy</ThemedText>
        <View style={styles.sideSpacer} />
      </View>
      <ThemedText type="default" textMuted={true} style={styles.defaultText}>Last updated: November 2026</ThemedText>
      <ThemedText type="default" style={styles.defaultText}>Talaria, developed by Side Bits, respects your privacy and is committed to protecting your personal information.</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Information We Collect</ThemedText>
      <ThemedText type="default" style={styles.defaultText}>Depending on how you use the app, we may collect basic information such as your name, email address, account details, and travel itineraries.</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>How We Use Your Information</ThemedText>
      <ThemedText type="default" style={styles.defaultText}>We use this information to provide the app's features, manage user accounts, save itineraries, and improve the overall experience.</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Data Sharing</ThemedText>
      <ThemedText type="default" style={styles.defaultText}>We do not sell your personal information. Data may be shared with trusted services when necessary for the application to function.</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Data Security</ThemedText>
      <ThemedText type="default" style={styles.defaultText}>We take reasonable measures to protect your personal information against unauthorized access or misuse.</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Your Rights</ThemedText>
      <ThemedText type="default" style={styles.defaultText}>You may request access, correction, or deletion of your personal information by contacting us.</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Contact</ThemedText>
      <ThemedText type="default" style={styles.defaultText}>For any questions regarding this Privacy Policy, contact us at: sidebits.contact@gmail.com</ThemedText>
      <View style={{ height: 115, width: "100%" }} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 32,
  },
  backButton: {
    width: 32,
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 4,
  },
  defaultText: {
    marginBottom: 16,
  },
  sideSpacer: {
    width: 32,
  },
});
