import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export function Footer() {
  const pathname = usePathname();
  const { travel_id } = useLocalSearchParams();
  const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;
  const isActivityRoute = /^\/travels\/[^/]+\/activities(?:\/|$)/.test(
    pathname,
  );
  const title = isActivityRoute ? "activity" : "trip";

  const handleHome = () => {
    router.replace({
      pathname: "/(app)/travels",
      params: { mode: "V" },
    });
  };

  const handleCreate = () => {
    if (isActivityRoute) {
      if (!travelId) return;

      router.push({
        pathname: "/(app)/travels/[travel_id]/activities/[activity_id]",
        params: {
          travel_id: travelId,
          activity_id: "new",
          mode: "C",
        },
      });
    } else {
      router.push({
        pathname: "/(app)/travels/[travel_id]",
        params: {
          travel_id: "new",
          mode: "C",
        },
      });
    }
  };

  const handleProfile = () => {
    router.replace({
      pathname: "/(app)/id-profile",
      params: { mode: "V" },
    });
  };

  return (
    <View style={styles.container}>
      <ThemedView type="between" style={styles.footer}>
        <Pressable onPress={handleHome}>
          <ThemedView type="middle" style={styles.box}>
            <Ionicons
              name="home-outline"
              size={20}
              color={Colors.light.onSurface}
            />
            <ThemedText type="small">Home</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={handleCreate}>
          <ThemedView type="middle" style={styles.box}>
            <Ionicons
              name="add-outline"
              size={25}
              color={Colors.light.onSurface}
            />
            <ThemedText type="small">New {title}</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={handleProfile}>
          <ThemedView type="middle" style={styles.box}>
            <Ionicons
              name="person-outline"
              size={20}
              color={Colors.light.onSurface}
            />
            <ThemedText type="small">Profile</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    bottom: 0,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  footer: {
    maxWidth: 400,
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  box: {
    padding: 4,
  },
});
