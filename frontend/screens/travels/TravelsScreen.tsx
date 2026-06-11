import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import { api } from '@/services/api';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Footer } from '@/components/Footer';
import { TravelCard } from '@/components/travel_card';

export function TravelsScreen() {
  const { height } = useWindowDimensions(); // TODO: generic parameter

  type Travel = {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    finished?: boolean;
  };

  const [data, setTravels] = useState<Record<string, Travel[]>>({});

  useEffect(() => {
    api.get<{ G?: Travel[]; D?: Travel[] }>('api/travels')
      .then((data) => setTravels({
        Going: Array.isArray(data?.G) ? data.G : [],
        Done: Array.isArray(data?.D) ? data.D : []
      }))
      .catch(e => console.error('Failed to fetch travels', e));
  }, []);

  return (
    <>
      <ThemedView type='left'>
        <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <ThemedView type='between' style={{ marginBottom: 32, marginTop: 32 }}>
            <ThemedText type="title">My trips</ThemedText>
            {/*<Ionicons name="options-outline" size={20} color={Colors.light.gray} />*/}
          </ThemedView>
          <ThemedView type='left' style={{ width: '100%' }}>
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
              {/*<ThemedText type="default" style={{ color:Colors.light.gray }} onPress={() => console.log('View more')}>View more</ThemedText>*/}
            </ThemedView>
            {data.Going?.map(travel => (
              <TravelCard key={travel.id} travel={travel} />
            ))}
            <ThemedView type='between' style={{ marginBottom: 8, marginTop: 16 }}>
              <ThemedText type="subtitle">Done</ThemedText>
              {/*<ThemedText type="default" style={{ color:Colors.light.gray }} onPress={() => console.log('View more')}>View more</ThemedText>*/}
            </ThemedView>
            {data.Done?.map(travel => (
              <TravelCard key={travel.id} travel={travel} />
            ))}
          </ThemedView>
        </ScrollView>
      </ThemedView>
      <Footer />
    </>
  );
}
