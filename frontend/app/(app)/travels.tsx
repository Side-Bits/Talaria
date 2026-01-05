import React, { useEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { StyleSheet, View, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';

export default function TabTravels() {
  const { height } = useWindowDimensions(); // TODO: generic parameter

  type Travel = {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    finished?: boolean;
  };

  const [travels, setTravels] = useState<Travel[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/travels?id_user=550e8400-e29b-41d4-a716-446655440000', { method: 'GET' })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => Array.isArray(data) ? setTravels(data) : setTravels([]))
      .catch(e => console.error('Failed to fetch travels', e));
  }, []);

  return (
    <ThemedView type='left'>
      <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <ThemedView type='between' style={{ marginBottom: 32, marginTop: 32 }}>
          <ThemedText type="title">Travels</ThemedText>
          <Ionicons name="options-outline" size={20} color={Colors.light.gray} />
        </ThemedView>
        <ThemedView type='left' style={{ width:'100%' }}>
            <ThemedView type='between' style={{ marginBottom: 8 }}>
              <ThemedText type="subtitle">On going</ThemedText>
              <ThemedText type="default" style={{ color:Colors.light.gray }} onPress={() => console.log('View more')}>View more</ThemedText>
            </ThemedView>
            {travels.map((travel) => (
              <Pressable key={travel.id} style={ styles.container } onPress={() => router.replace('/(app)/activities')}>
                <ThemedView type='list'>
                  <ThemedText type="default">{travel.name}</ThemedText>
                  <ThemedText type="default" style={{ color: Colors.light.gray }}>{new Date(travel.start_date).toLocaleDateString()} a {new Date(travel.end_date).toLocaleDateString()}</ThemedText>
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
  }
});