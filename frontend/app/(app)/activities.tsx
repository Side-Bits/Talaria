import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { StyleSheet, ScrollView, useWindowDimensions, View, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

export default function TabActivities() {
  const { height } = useWindowDimensions(); // TODO: generic parameter

    type Activity = {
      id: string;
      name: string;
      start_date: string;
      end_date: string;
      finished?: boolean;
    };
  
    const [activity, setActivities] = useState<Activity[]>([]);
  
    useEffect(() => {
      fetch('http://localhost:8080/activities?id_travel=c9bf9e57-1685-4c89-bafb-ff5af830be8a', { method: 'GET' })
        .then(res => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then(data => Array.isArray(data) ? setActivities(data) : setActivities([]))
        .catch(e => console.error('Failed to fetch activities', e));
    }, []);

  return (
    <ThemedView type='left'>
      <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <ThemedView type='list' style={{ marginBottom: 32, marginTop: 32 }}>
          <ThemedView type='between'>
            <ThemedText type="title">Viaje a Venecia</ThemedText>
            <Ionicons name="options-outline" size={20} color={Colors.light.gray} />
          </ThemedView>
          <ThemedText type="default" style={{ color: Colors.light.gray }}>Italy</ThemedText>
          <ThemedView type='row' style={{ marginTop: 8 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <View style={[styles.perfile, { width: 20, height: 20 }]} />
            ))}
          </ThemedView>
        </ThemedView>
        <ThemedView type='left' style={{ width:'100%' }}>
          <ThemedView type='between' style={{ marginBottom: 8 }}>
            <ThemedText type="subtitle">Monday</ThemedText>
            <Ionicons name="chevron-down-outline" size={20} color={Colors.light.gray} />
          </ThemedView>
          {activity.map((activity) => (
            <Pressable style={ styles.container } onPress={() => router.replace('/(app)/id-activity')}>
              <ThemedView key={activity.id} type='list'>
                <ThemedText type="default">{activity.name}</ThemedText>
                <ThemedText type="default" style={{ color: Colors.light.gray }}>{new Date(activity.start_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} a {new Date(activity.end_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} </ThemedText>
                <ThemedView type='row' style={{ marginTop: 4 }}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <View style={[styles.perfile, { width: 15, height: 15 }]} />
                  ))}
                </ThemedView>
              </ThemedView>
            </Pressable>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderBlockColor: Colors.light.border,
    backgroundColor: Colors.light.template,
    marginBottom: 8,
  },
  perfile: {
    backgroundColor: '#ccc',
    borderRadius: 50,
    marginRight: 2
  }
});