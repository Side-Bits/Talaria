import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Pressable,
  View,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { Footer } from "@/components/Footer";
import { formatActivityDates } from "@/scripts/DataScripts";
import { Header } from "@/components/Header";
import { getTravelActivities } from "@/services/api/activity";
import { Activity } from "@/types/activity";
import { Tabs } from "@/components/Tabs";

export function ActivitiesScreen() {
  const { travel_id, name, mode } = useLocalSearchParams();
  const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;
  const [activity, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!travelId) return;

    getTravelActivities(travelId)
      .then((data) =>
        Array.isArray(data) ? setActivities(data) : setActivities([]),
      )
      .catch((e) => console.error("Failed to fetch activities", e));
  }, [travelId]);

  return (
    <ThemedView type="left" style={{ marginBottom: 64 }}>
      <Header code="002" label={String(name)} />
      {/*<ThemedText type="default" style={{ color: Colors.light.textMuted, marginBottom: 8 }}>Italy</ThemedText>
      <Participants size={16} gap={2}/>*/}
      <Tabs
        data={{
          all: { label: "All", onPress: () => console.log('All') },
          d1: { label: "Day 1", onPress: () => console.log('Day 1') },
          d2: { label: "Day 2", onPress: () => console.log('Day 2') }
        }}
        scroll={true}
      />
      <ThemedView type="left" style={{ width: "100%" }}>
        <ThemedView type="between" style={{ marginVertical: 8 }}>
          <ThemedText type="subtitle">Activities</ThemedText>
          {/* <Ionicons name="chevron-down-outline" size={20} color={Colors.light.textMuted} /> */}
        </ThemedView>
        {activity.map((activity) => (
          <Pressable
            key={activity.id}
            style={styles.container}
            onPress={() =>
              router.push({
                pathname: "/(app)/travels/[travel_id]/activities/[activity_id]",
                params: {
                  travel_id: travelId,
                  activity_id: String(activity.id),
                  mode: mode,
                },
              })
            }
          >
            <ThemedView type="list">
              <ThemedText type="default" style={{ fontWeight: 500 }}>
                {activity.name}
              </ThemedText>
              <ThemedText
                type="default"
                style={{ color: Colors.light.textMuted }}
              >
                {formatActivityDates(activity.start_date, activity.end_date)}
              </ThemedText>
              {/* <Participants size={16} gap={2}/> */}
            </ThemedView>
          </Pressable>
        ))}
      </ThemedView>
      <View style={{ height: 115, width: "100%" }} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    marginBottom: 8,
  },
  perfile: {
    backgroundColor: "#ccc",
    borderRadius: 50,
    marginRight: 2,
  },
});
