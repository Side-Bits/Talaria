import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import { Header } from "@/components/Header";
import { Tabs } from "@/components/Tabs";
import { HeroActivity } from "./components/HeroActivity";
import { ActivityCard } from "./components/ActivityCard";
import { Participants } from "@/components/Participants";
import { deleteTravel } from "@/services/api/travel";
import { formatDate, formatTravelDates } from "@/scripts/DataScripts";
import { ErrorCard } from "@/components/ErrorCard";
import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { useActivities } from "@/hooks/useActivities";
import { useTravel } from "@/hooks/useTravel";

export function ActivitiesDetailsScreen() {
  const { travel_id, name } = useLocalSearchParams();
  const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;
  const travelName = Array.isArray(name) ? name[0] : name;
  const [activeTab, setActiveTab] = useState('all');
  const [day, setDay] = useState(0);
  const { state: activitiesState, retry: retryActivities } = useActivities(travelId);
  const { state: travelState, retry: retryTravel } = useTravel(travelId);
  const travel = travelState.status === 'success' ? travelState.data : undefined;
  const travelDate = travel ? formatTravelDates(travel.start_date, travel.end_date) : '';
  const activity = activitiesState.status === 'success' ? activitiesState.data : [];
  const isLoading = activitiesState.status === 'loading' || travelState.status === 'loading';
  const loadError = activitiesState.status === 'error'
    ? activitiesState.error
    : travelState.status === 'error'
      ? travelState.error
      : undefined;

  const retry = () => {
    if (activitiesState.status === 'error') retryActivities();
    if (travelState.status === 'error') retryTravel();
  };

  const handleCreateActivity = () => {
    if (!travelId) return;

    router.push({
      pathname: "/(app)/(editor)/travels/[travel_id]/activities/create",
      params: {
        travel_id: travelId
      },
    });
  };

  const uniqueDays = [...new Set(activity.map((item) => item.day))]
    .filter((day): day is number => Number.isFinite(day))
    .sort((a, b) => a - b);

  const dayTabs = Object.fromEntries(
    uniqueDays.map((day) => [
      `day-${day}`, { label: `Day ${day}`, onPress: () => setDay(day) },
    ]),
  );

  const handleTravel = async () => {
    try {
      await deleteTravel(travelId);
      router.back();
    } catch {
      Alert.alert("Error", "Invalid credentials");
    }
  }

  return (
    <ThemedView type="left" style={{ marginBottom: 64 }}>
      <Header
        button_back={true}
        popover={{
          delete: {
            icon: 'trash-outline',
            option: 'Delete trip',
            color: 'red',
            onclick: () => handleTravel(),
          }
        }}
        label={travelName ?? ' '}
      />
      {isLoading ? (
        <View style={styles.feedback}>
          <ActivityIndicator color={Colors.light.primary} />
        </View>
      ) : loadError ? (
        <ErrorCard
          title="We couldn't load the trip details"
          description={loadError.message}
          image={require('../../assets/images/failed.png')}
          onPress={retry}
        />
      ) : (
        <>
          <HeroActivity image={travel?.image} />
          <ThemedView type='between' style={{ marginBottom: 8 }}>
            <ThemedText>{travelDate}</ThemedText>
            <Participants
              editable={false}
              size={25}
              data={{}}
            />
          </ThemedView>
          <ThemedText textMuted={true} style={styles.description}>
            {travel?.description}
          </ThemedText>
          {activity.length ? (
            uniqueDays.length > 1 && (
              <Tabs
                data={{
                  all: { label: "All", onPress: () => setDay(0) },
                  ...dayTabs,
                }}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                scroll={true}
              />
            )
          ) : (
            <ThemedView type='center' style={styles.feedback}>
              <ThemedText type="subtitle">
                Start your itinerary
              </ThemedText>
              <ThemedText textMuted={true}>
                Add your first activity to start planning your trip
              </ThemedText>
              <ThemedButton
                title="Create an activity"
                width="auto"
                size="sm"
                onPress={handleCreateActivity}
              />
            </ThemedView>
          )}
          <ThemedView type="left">
            {activity.filter((item) => day === 0 || item.day === day).map((item, i, arr) => (
              <React.Fragment key={item.id}>
                {uniqueDays.length > 1 &&
                  item.start_date.slice(0, 10) !== arr[i - 1]?.start_date.slice(0, 10) && (
                    <ThemedText type="underlined" style={{ marginLeft: 60 }}>{formatDate(item.start_date)}</ThemedText>
                  )
                }
                <ActivityCard activity={item} />
              </React.Fragment>
            ))}
          </ThemedView>
          <View style={{ height: 30, width: "100%" }} />
        </>
      )}
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
    gap: 8,
  },
});
