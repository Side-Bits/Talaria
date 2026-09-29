import React, { useEffect, useState } from "react";
import {StyleSheet, Pressable, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import { Header } from "@/components/Header";
import { getTravelActivities } from "@/services/api/activity";
import { Activity } from "@/types/activity";
import { Tabs } from "@/components/Tabs";
import { HeroActivity } from "./components/HeroActivity";
import { ActivityCard } from "./components/ActivityCard";
import { Participants } from "@/components/Participants";
import { Colors } from "@/constants/Colors";

export function ActivitiesScreen() {
  const { travel_id, name, mode, date, description } = useLocalSearchParams();
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
      <Header code="002" label={String(name)}/>
      <HeroActivity />
      <ThemedView type='between' style={{ marginBottom: 8 }}>
        <ThemedText>{date}</ThemedText>
        <Participants size={25} />
      </ThemedView>
      <ThemedText style={styles.description}>{description}</ThemedText>
      <ThemedText type="underlined">Activities</ThemedText>
      <Tabs
        data={{
          all: { label: "All", onPress: () => console.log('All') },
          d1: { label: "Day 1", onPress: () => console.log('Day 1') },
          d2: { label: "Day 2", onPress: () => console.log('Day 2') }
        }}
        scroll={true}
      />
      <ThemedView type="left" style={{ width: "100%" }}>
        {activity.map((activity) => (
          <ActivityCard activity={activity} mode={String(mode)} />
        ))}
      </ThemedView>
      <View style={{ height: 115, width: "100%" }} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  description: {
    color: Colors.light.textMuted,
    marginBottom: 8
  }
});
