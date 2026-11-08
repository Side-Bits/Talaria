import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import { Image } from "react-native";
import { useSession } from '@/contexts/authContext';

export function NotFoundScreen() {
  const { session } = useSession();

  return (
    <ThemedView type='center' style={{ gap: 4 }}>
      <ThemedView type="center" style={{ maxHeight: 200 }}>
        <Image
          source={require("../assets/images/notfound.png")}
          style={{ width: 200, height: 200 }}
        />
      </ThemedView>
      <ThemedText type="title">Lost your way?</ThemedText>
      <ThemedText type="subtitle">No worries! Let's get you back on track</ThemedText>
      <ThemedButton
        title="Back to Home"
        width="auto"
        size="sm"
        buttonStyle={{ backgroundColor: Colors.light.primary, marginTop: 16 }}
        textStyle={{ color: Colors.light.onPrimary }}
        onPress={() => router.replace(session ? "/(app)/travels" : "/(auth)/sign-in")}
      />
    </ThemedView>
  );
}
