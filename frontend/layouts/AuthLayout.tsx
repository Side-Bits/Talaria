import { Slot } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AuthLayout() {
  // TODO: if first time show onboarding then register
  // else show sign-in
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Slot />
    </View>
  );
}
