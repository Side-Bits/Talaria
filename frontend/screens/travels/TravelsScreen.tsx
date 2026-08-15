import React, { useEffect, useState } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Footer } from '@/components/Footer';
import { TravelCard } from '@/components/travel_card';
import { Colors } from '@/constants/Colors';
import { Header } from '@/components/Header';
import { getTravels } from '@/services/api/travel';
import { Travel } from '@/types/travel';

export function TravelsScreen() {
  const { height } = useWindowDimensions(); // TODO: generic parameter

  const mode: string = 'V';

  const [data, setTravels] = useState<Record<string, Travel[]>>({});

  useEffect(() => {
    getTravels()
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
          <Header code="001" label="My Trips" />
          <ThemedView type='left' style={{ width: '100%' }}>
            <ThemedView type='between' style={{ marginBottom: 8 }}>
              <ThemedText type="subtitle">On going</ThemedText>
              <ThemedText type="small" style={{ color: Colors.light.gray }} onPress={() => console.log('View more')}>View more</ThemedText>
            </ThemedView>
            {data.Going?.map(travel => (
              <TravelCard key={travel.id} travel={travel} mode={mode} />
            ))}
            <ThemedView type='between' style={{ marginBottom: 8, marginTop: 8 }}>
              <ThemedText type="subtitle">Done</ThemedText>
              <ThemedText type="small" style={{ color: Colors.light.gray }} onPress={() => console.log('View more')}>View more</ThemedText>
            </ThemedView>
            {data.Done?.map(travel => (
              <TravelCard key={travel.id} travel={travel} mode={mode} />
            ))}
          </ThemedView>
        </ScrollView>
      </ThemedView>
      <Footer />
    </>
  );
}
