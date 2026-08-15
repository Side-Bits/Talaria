import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import { Footer } from '@/components/Footer';
import { formatActivityDates } from "@/scripts/DataScripts"
import { Header } from '@/components/Header';
import { getTravelActivities } from '@/services/api/activity';
import { Activity } from '@/types/activity';

export function ActivitiesScreen() {
  const { height } = useWindowDimensions(); // TODO: generic parameter
  const { travel_id, name, mode } = useLocalSearchParams();
  const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;

  const [activity, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!travelId) return;

    getTravelActivities(travelId)
      .then(data => Array.isArray(data) ? setActivities(data) : setActivities([]))
      .catch(e => console.error('Failed to fetch activities', e));
  }, [travelId]);

  return (
    <>
      <ThemedView type='left'>
        <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <Header code="002" label={String(name)} />
          {/* <ThemedText type="default" style={{ color: Colors.light.gray, marginBottom: 8 }}>Italy</ThemedText>
          <Participants size={16} gap={2}/> */}
          <ThemedView type='left' style={{ width: '100%' }}>
            <ThemedView type='between' style={{ marginBottom: 8 }}>
              <ThemedText type="subtitle">Activities</ThemedText>
              {/* <Ionicons name="chevron-down-outline" size={20} color={Colors.light.gray} /> */}
            </ThemedView>
            {activity.map((activity) => (
              <Pressable key={activity.id} style={styles.container} onPress={() => router.push({
                pathname: '/(app)/travels/[travel_id]/activities/[activity_id]',
                params: { travel_id: travelId, activity_id: String(activity.id), mode: mode }
              }
              )}>
                <ThemedView type='list'>
                  <ThemedText type="default" style={{ fontWeight: 500 }}>{activity.name}</ThemedText>
                  <ThemedText type="default" style={{ color: Colors.light.gray }}>{formatActivityDates(activity.start_date, activity.end_date)}</ThemedText>
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
