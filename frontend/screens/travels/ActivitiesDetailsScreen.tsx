import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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

export function ActivitiesDetailsScreen() {
  const { travel_id, name, date, description, image } = useLocalSearchParams();
  const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;
  const travelImage = Array.isArray(image) ? image[0] : image;
  const [activity, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!travelId) return;
    getTravelActivities(travelId)
      .then((data) =>
        Array.isArray(data) ? setActivities(data) : setActivities([]),
      )
      .catch((e) => console.error("Failed to fetch activities", e));
  }, [travelId]);

  const handlePressCreateActivity = () => {
    router.push({
      pathname: "/(app)/travels/[travel_id]/activities/create",
      params: { travel_id: travelId },
    });
  };

  return (
    <ThemedView type="left" style={{ marginBottom: 64 }}>
      <Header
        button_back={true}
        button_menu={true}
        label={String(name)}
      />
      <HeroActivity image={travelImage} />
      <ThemedView type='between' style={{ marginBottom: 8 }}>
        <ThemedText>{date}</ThemedText>
        <Participants
          editable={false}
          size={25}
          data={{}}
        />
      </ThemedView>
      <ThemedText textMuted={true} style={styles.description}>{description}</ThemedText>
      {activity.length ? (
        <>
          <ThemedText type="underlined">Activities</ThemedText>
          <Tabs
            data={{
              all: { label: "All" },
              d1: { label: "Day 1" },
              d2: { label: "Day 2" }
            }}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            scroll={true}
          />
        </>
      ) : (
        <ThemedView type='center' style={styles.feedback}>
          <ThemedText type="subtitle">
            Start your itinerary
          </ThemedText>
          <ThemedText textMuted={true}>
            Add your first activity to start planning your trip
          </ThemedText>
          <ThemedText
            type='link'
            onPress={handlePressCreateActivity}
          >
            Create an activity
          </ThemedText>
        </ThemedView>
      )}
      <ThemedView type="left" style={{ width: "100%" }}>
        {activity.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </ThemedView>
      <View style={{ height: 115, width: "100%" }} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 16
  },
  feedback: {
    width: '100%',
    paddingVertical: 16,
    gap: 4,
  },
});
