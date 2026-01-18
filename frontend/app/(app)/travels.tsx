import React, { useEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { StyleSheet, View, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { Footer } from '@/components/Footer';
import { Participants } from '@/components/Participants';

export default function TabTravels() {
  const { width, height } = useWindowDimensions(); // TODO: generic parameter

  type Travel = {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    finished?: boolean;
  };

  const [data, setTravels] = useState<Record<string, Travel[]>>({});

  useEffect(() => {
    fetch('http://localhost:8080/travels?id_user=550e8400-e29b-41d4-a716-446655440000', { method: 'GET' })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => setTravels({
        G: Array.isArray(data.G) ? data.G : [],
        D: Array.isArray(data.D) ? data.D : []
      }))
      .catch(e => console.error('Failed to fetch travels', e));
  }, []);

  return (
    <>
      <ThemedView type='left'>
        <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <ThemedView type='between' style={{ marginBottom: 32, marginTop: 32 }}>
            <ThemedText type="title">My trips</ThemedText>
            <Ionicons name="options-outline" size={20} color={Colors.light.gray} />
          </ThemedView>
          <ThemedView type='left' style={{ width:'100%' }}>
            {/* {Array.from({ length: 3 }).map((_, i) => (
              <ThemedView type='row' style={{ marginBottom: 8 }}>
                <View style={{ width: 120 }}>
                  <ThemedText type="default" style={{ color: Colors.light.text }}>00:00</ThemedText>
                </View>
                <ThemedView type='list' style={{ width: Math.min((400 - 120), width - 136) }}>
                  <ThemedText style={{ color: Colors.light.text, fontWeight: 500 }}>Viaje</ThemedText>
                  <ThemedText style={{ color: Colors.light.gray }}>Descripción</ThemedText>
                </ThemedView>
              </ThemedView>
            ))} */}
            <ThemedView type='between' style={{ marginBottom: 8, marginTop: 16 }}>
              <ThemedText type="subtitle">On going</ThemedText>
              <ThemedText type="default" style={{ color:Colors.light.gray }} onPress={() => console.log('View more')}>View more</ThemedText>
            </ThemedView>
            {data.G?.map(travel => (
              <Pressable key={travel.id} style={ styles.container } onPress={() => router.replace('/(app)/activities')}>
                <ThemedView type='list'>
                  <ThemedText type="default" style={{ fontWeight: 500 }}>{travel.name}</ThemedText>
                  <ThemedText type="default" style={{ color: Colors.light.gray }}>{new Date(travel.start_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', hour12: false })} a {new Date(travel.end_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', hour12: false })}</ThemedText>
                </ThemedView>
              </Pressable>
            ))}
            <ThemedView type='between' style={{ marginBottom: 8, marginTop: 16 }}>
              <ThemedText type="subtitle">Done</ThemedText>
              <ThemedText type="default" style={{ color:Colors.light.gray }} onPress={() => console.log('View more')}>View more</ThemedText>
            </ThemedView>
            {data.D?.map(travel => (
              <Pressable key={travel.id} style={ styles.container } onPress={() => router.replace('/(app)/activities')}>
                <ThemedView type='list'>
                  <ThemedText type="default" style={{ fontWeight: 500 }}>{travel.name}</ThemedText>
                  <ThemedText type="default" style={{ color: Colors.light.gray }}>{new Date(travel.start_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', hour12: false })} a {new Date(travel.end_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', hour12: false })}</ThemedText>
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
  }
});