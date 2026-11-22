import type { ReactNode } from "react";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AppLayout({ footer }: { footer: ReactNode }) {
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
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 500,
          backgroundColor: "#FFF",
        }}
      >
        <View
          style={{
            position: "absolute",
            left: "10%",
            width: "80%",
            height: 10,
            backgroundColor: "#f2ffeb92",
          }}
        />
        {/*<View style={{ position: 'absolute', left: 0, bottom: 50, width: 50, height: 200, backgroundColor: "#e6e6e692" }} />*/}
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "#ffffff00",
          }}
        >
          <BlurView
            intensity={999}
            pointerEvents="none"
            style={StyleSheet.absoluteFill}
          />
          <AppNavigator />
        </View>
      </View>
      {footer}
    </ThemedView>
  );
}

function AppNavigator() {
  return <Slot />;
}
