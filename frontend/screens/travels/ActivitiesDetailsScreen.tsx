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
import { formatDate } from "@/scripts/DataScripts";
import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { useActivities } from "@/hooks/useActivities";

export function ActivitiesDetailsScreen() {
  const { travel_id, name, date, description, image } = useLocalSearchParams();
  const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;
  const travelImage = Array.isArray(image) ? image[0] : image;
  const [activeTab, setActiveTab] = useState('all');
  const [day, setDay] = useState(0);
  const { state, retry } = useActivities(travelId);
  const activity = state.status === 'success' ? state.data : [];

  const handlePressCreateActivity = () => {
    router.push({
      pathname: "/(app)/travels/[travel_id]/activities/create",
      params: { travel_id: travelId },
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

  const handleTravel = async (action: String) => {
    if (action === 'delete') {
      try {
        await deleteTravel(travelId);
        router.back();
      } catch {
        Alert.alert("Error", "Invalid credentials");
      }
    }
  }

  return (
    <ThemedView type="left" style={{ marginBottom: 64 }}>
      <Header
        button_back={true}
        popover={
          {
            delete: {
              icon: 'trash-outline',
              option: 'Delete trip',
              color: 'red',
              onclick: () => handleTravel('delete'),
            },
          }
        }
        label={String(name)}
      />
      {state.status === 'loading' ? (
        <View style={styles.feedback}>
          <ActivityIndicator color={Colors.light.primary} />
        </View>
      ) : state.status === 'error' ? (
        <View style={styles.errorCard}>
          <ThemedText style={styles.errorTitle} accessibilityRole="alert">
            We couldn&apos;t load the activities
          </ThemedText>
          <ThemedText style={styles.errorMessage} selectable>
            {state.error.message}
          </ThemedText>
          <ThemedButton
            title="Try again"
            onPress={retry}
            variant="outline"
            buttonStyle={styles.retryButton}
            textStyle={styles.retryText}
          />
        </View>
      ) : (
        <>
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
                buttonStyle={{ backgroundColor: Colors.light.primary }}
                textStyle={{ color: Colors.light.onPrimary }}
                onPress={handlePressCreateActivity}
              />
            </ThemedView>
          )}
          <ThemedView type="left">
            {activity.filter((item) => day === 0 || item.day === day).map((item, i, arr) => (
              <React.Fragment key={item.id}>
                {item.start_date.slice(0, 10) !== arr[i - 1]?.start_date.slice(0, 10) && (
                  <ThemedText type="underlined" style={{ marginLeft: 60 }}>{formatDate(item.start_date)}</ThemedText>
                )}
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
  errorCard: {
    width: '100%',
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    gap: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.onSurface,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.light.onSurface,
    textAlign: 'center',
  },
  retryButton: {
    width: 'auto',
    minWidth: 144,
    marginTop: 4,
  },
  retryText: {
    fontWeight: '600',
  },
});
