import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router, useGlobalSearchParams, usePathname } from "expo-router";
import { ThemedView } from "./ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export function Footer() {
  const pathname = usePathname();
  const { travel_id, travel_name, name, mode } = useGlobalSearchParams();
  const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;
  const routeTravelName = Array.isArray(travel_name) ? travel_name[0] : travel_name;
  const routeName = Array.isArray(name) ? name[0] : name;
  const travelName = routeTravelName || routeName || "Trip";
  const currentMode = Array.isArray(mode) ? mode[0] : mode;
  const isActivityRoute = /^\/travels\/[^/]+\/activities(?:\/|$)/.test(pathname);
  const isInsideTrip = Boolean(travelId && travelId !== "new");
  const title = isActivityRoute ? "activity" : "trip";

  type FooterTab = "home" | "trip" | "create" | "profile" | null;

  const getRouteTab = (): FooterTab => {
    if (currentMode === "C") return "create";
    if (isInsideTrip) return "trip";
    if (pathname === "/id-profile") return "profile";
    return "home";
  };

  const [activeTab, setActiveTab] = useState<FooterTab>(getRouteTab);

  useEffect(() => {
    setActiveTab(getRouteTab());
  }, [pathname, currentMode]);

  const isHomeActive = activeTab === "home";
  const isTripActive = activeTab === "trip";
  const isCreateActive = activeTab === "create";
  const isProfileActive = activeTab === "profile";

  const handleHome = () => {
    setActiveTab("home");
    router.replace({
      pathname: "/(app)/travels",
      params: {
        mode: "V"
      },
    });
  };

  const handleTrip = () => {
    if (!travelId) return;
    setActiveTab("trip");
    router.replace({
      pathname: "/(app)/travels/[travel_id]/activities",
      params: {
        travel_id: travelId,
        name: travelName,
        mode: "V"
      },
    });
  };

  const handleCreate = () => {
    if (isActivityRoute) {
      if (!travelId) return;
      setActiveTab("create");
      router.push({
        pathname: "/(app)/travels/[travel_id]/activities/[activity_id]",
        params: {
          travel_id: travelId,
          activity_id: "new",
          mode: "C",
        },
      });
    } else {
      setActiveTab("create");
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
    setActiveTab("profile");
    router.replace({
      pathname: "/(app)/id-profile",
      params: { mode: "V" },
    });
  };

  return (
    <View style={styles.footer}>
      <ThemedView type="between" style={styles.container}>
        <Pressable
          onPress={handleHome}
          style={[
            styles.box,
            isHomeActive ? styles.active : styles.inactive,
          ]}
        >
          <ThemedView type="center" style={styles.item}>
            <Ionicons
              name="home-outline"
              size={20}
              color={isHomeActive ? Colors.light.surface : Colors.light.textMuted}
            />
          </ThemedView>
        </Pressable>
        {isInsideTrip && (
          <Pressable
            onPress={handleTrip}
            style={[
              styles.box,
              isTripActive ? styles.active : styles.inactive,
            ]}
          >
            <ThemedView type="center" style={styles.item}>
              <Ionicons
                name="navigate-outline"
                size={25}
                color={isTripActive ? Colors.light.surface : Colors.light.textMuted}
              />
            </ThemedView>
          </Pressable>
        )}
        <Pressable
          onPress={handleCreate}
          style={[
            styles.box,
            isCreateActive ? styles.active : styles.inactive,
          ]}
        >
          <ThemedView type="center" style={styles.item}>
            <Ionicons
              name="add-outline"
              size={25}
              color={isCreateActive ? Colors.light.surface : Colors.light.textMuted}
            />
          </ThemedView>
        </Pressable>
        <Pressable
          onPress={handleProfile}
          style={[
            styles.box,
            isProfileActive ? styles.active : styles.inactive,
          ]}
        >
          <ThemedView type="center" style={styles.item}>
            <Ionicons
              name="person-outline"
              size={20}
              color={isProfileActive ? Colors.light.surface : Colors.light.textMuted}
            />
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
    padding: 6,
    gap: 6,
    borderRadius: 8,
    alignItems: "stretch",
    backgroundColor: "#F5F5F7",
  },
  box: {
    flex: 1,
    borderRadius: 8,
  },
  inactive: {
    backgroundColor: 'transparent',
  },
  active: {
    backgroundColor: Colors.light.onBackground,
  },
  item: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    height: "100%",
    padding: 8,
  },
});
