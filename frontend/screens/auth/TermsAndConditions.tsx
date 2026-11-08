import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { AppScreen } from "@/components/AppScreen";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

export function TermsAndConditions() {
  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.action}>
            <Pressable
              onPress={() => router.replace("/(auth)/sign-up")}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back-outline"
                size={20}
                color={Colors.light.onPrimary}
              />
            </Pressable>
          </View>
          <ThemedText type="title" style={styles.title}>Terms and Conditions</ThemedText>
          <View style={styles.action} />
        </View>
      </View>
      <ThemedText type="default" textMuted={true} style={styles.defaultText}>Last updated: November 2026</ThemedText>
      <ThemedText type="default" style={styles.defaultText}>Welcome to Talaria, an itinerary planning application developed by Side Bits. By using Talaria, you agree to the following terms.</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Use of the App</ThemedText>
      <ThemedText type="default" style={styles.defaultText}>Talaria allows users to create, organize, and manage travel itineraries. You agree to use the application responsibly and only for lawful purposes.</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>User Responsibility</ThemedText>
      <ThemedText type="default" style={styles.defaultText}>Users are responsible for the information they add to their itineraries. Talaria does not guarantee the accuracy of travel information, recommendations, or third-party services.</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Intellectual Property</ThemedText>
      <ThemedText type="default" style={styles.defaultText}>The Talaria application, including its design, branding, and content, belongs to Side Bits and may not be copied or used without permission.</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Changes and Availability</ThemedText>
      <ThemedText type="default" style={styles.defaultText}>Side Bits reserves the right to modify, update, or discontinue any part of the application at any time.</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Contact</ThemedText>
      <ThemedText type="default" style={styles.defaultText}>For any questions, contact us at: sidebits.contact@gmail.com</ThemedText>
      <View style={{ height: 115, width: "100%" }} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    zIndex: 1,
  },
  header: {
    width: "100%",
    paddingVertical: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  action: {
    width: 32,
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 32,
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
  },
});