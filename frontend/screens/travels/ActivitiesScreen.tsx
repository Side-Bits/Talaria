import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/services/api';
import { StyleSheet, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import { Footer } from '@/components/Footer';
import { formatActivityDates } from "@/scripts/DataScripts"

export function ActivitiesScreen() {
  const { height } = useWindowDimensions(); // TODO: generic parameter
  const { travel_id } = useLocalSearchParams();
  const { name } = useLocalSearchParams();
  const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;

  type Activity = {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    finished?: boolean;
  };

  const [activity, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!travelId) return;

    api.get<{ A?: Activity[]; }>(`api/travels/${travelId}/activities`)
      .then(data => Array.isArray(data) ? setActivities(data) : setActivities([]))
      .catch(e => console.error('Failed to fetch activities', e));
  }, [travelId]);

  return (
    <>
      <ThemedView type='left'>
        <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <ThemedView type='list' style={{ marginBottom: 32, marginTop: 32 }}>
            <ThemedView type='between'>
              <Pressable onPress={() => router.back()} ><Ionicons name="arrow-back-outline" size={20} color={Colors.light.text} /></Pressable>
              <ThemedText type="title">{ name }</ThemedText>
              <ThemedText type="title"></ThemedText>
              {/*<Ionicons name="options-outline" size={20} color={Colors.light.gray} />*/}
            </ThemedView>
            {/* <ThemedText type="default" style={{ color: Colors.light.gray, marginBottom: 8 }}>Italy</ThemedText>
            <Participants size={16} gap={2}/> */}
          </ThemedView>
          <ThemedView type='left' style={{ width: '100%' }}>
            <ThemedView type='between' style={{ marginBottom: 8 }}>
              <ThemedText type="subtitle">Activities</ThemedText>
              {/* <Ionicons name="chevron-down-outline" size={20} color={Colors.light.gray} /> */}
            </ThemedView>
            {activity.map((activity) => (
              <Pressable key={activity.id} style={styles.container} onPress={() => router.push({ pathname: '/(app)/travels/[travel_id]/activities/[activity_id]', params: { travel_id: travelId, activity_id: String(activity.id) } })}>
                <ThemedView type='list'>
                  <ThemedText type="default" style={{ fontWeight: 500 }}>{activity.name}</ThemedText>
                  <ThemedText type="default" style={{ color: Colors.light.gray }}>{ formatActivityDates(activity.start_date, activity.end_date) }</ThemedText>
                  {/* <Participants size={16} gap={2}/> */}
                </ThemedView>
              </Pressable>
            ))}
          </ThemedView>
        </ScrollView>
      </ThemedView>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.template,
    marginBottom: 8,
  },
  perfile: {
    backgroundColor: '#ccc',
    borderRadius: 50,
    marginRight: 2
  }
});
