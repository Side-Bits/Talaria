import React, { useEffect,  useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/services/api';
import { StyleSheet, ScrollView, useWindowDimensions, View, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Footer } from '@/components/Footer';
import { Participants } from '@/components/Participants';
import { useLocalSearchParams } from 'expo-router';

export default function TabActivities() {
  const { height } = useWindowDimensions(); // TODO: generic parameter
  const { id_travel } = useLocalSearchParams();

  type Activity = {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    finished?: boolean;
  };
  
  const [activity, setActivities] = useState<Activity[]>([]);
  
  useEffect(() => {
    api.get<{A?: Activity[];}>('api/activities?id_travel=' + id_travel)
    .then(data => Array.isArray(data) ? setActivities(data) : setActivities([]))
    .catch(e => console.error('Failed to fetch activities', e));
  }, []);

  return (
    <>
      <ThemedView type='left'>
        <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <ThemedView type='list' style={{ marginBottom: 32, marginTop: 32 }}>
            <ThemedView type='between'>
              <ThemedText type="title">Viaje a Venecia</ThemedText>
              {/*<Ionicons name="options-outline" size={20} color={Colors.light.gray} />*/}
            </ThemedView>
            {/* <ThemedText type="default" style={{ color: Colors.light.gray, marginBottom: 8 }}>Italy</ThemedText>
            <Participants size={16} gap={2}/> */}
          </ThemedView>
          <ThemedView type='left' style={{ width:'100%' }}>
            <ThemedView type='between' style={{ marginBottom: 8 }}>
              <ThemedText type="subtitle">Monday</ThemedText>
              <Ionicons name="chevron-down-outline" size={20} color={Colors.light.gray} />
            </ThemedView>
            {activity.map((activity) => (
              <Pressable style={ styles.container } onPress={() => router.replace('/(app)/id-activity')}>
                <ThemedView key={activity.id} type='list'>
                  <ThemedText type="default" style={{ fontWeight: 500 }}>{activity.name}</ThemedText>
                  <ThemedText type="default" style={{ color: Colors.light.gray }}>{new Date(activity.start_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} a {new Date(activity.end_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} </ThemedText>
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
    width:'100%',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    // backgroundColor: Colors.light.template,
    marginBottom: 8,
  },
  perfile: {
    backgroundColor: '#ccc',
    borderRadius: 50,
    marginRight: 2
  }
});