import { Pressable, StyleSheet, View } from "react-native";
import { router, useGlobalSearchParams, usePathname } from "expo-router";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export function Footer() {
  const pathname = usePathname();
  const { travel_id } = useGlobalSearchParams();
  const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;
  const isActivityRoute = /^\/travels\/[^/]+\/activities(?:\/|$)/.test(pathname);
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
    <View style={styles.footer}>
      <ThemedView type="between" style={styles.container}>
        <Pressable onPress={handleHome} style={styles.box}>
          <ThemedView type="center" style={styles.item}>
            <Ionicons
              name="home-outline"
              size={20}
              color={Colors.light.surface}
            />
            <ThemedText type="small" style={{ color: Colors.light.surface }}>Home</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={handleCreate} style={styles.box}>
          <ThemedView type="center" style={styles.item}>
            <Ionicons
              name="add-outline"
              size={25}
              color={Colors.light.surface}
            />
            <ThemedText type="small" style={{ color: Colors.light.surface }}>New {title}</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={handleProfile} style={styles.box}>
          <ThemedView type="center" style={styles.item}>
            <Ionicons
              name="person-outline"
              size={20}
              color={Colors.light.surface}
            />
            <ThemedText type="small" style={{ color: Colors.light.surface }}>Profile</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    width: "100%",
    maxWidth: 450,
    alignItems: "center",
    bottom: 0,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  container: {
    width: "100%",
    maxWidth: 450,
    padding: 4,
    gap: 4,
    borderRadius: 12,
    alignItems: "stretch",
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  box: {
    flex: 1,
    backgroundColor: Colors.light.onSurface,
    borderRadius: 12,
    paddingVertical: 2,
  },
  item: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4
  },
});
