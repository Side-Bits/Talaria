import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TravelCard } from '@/components/travel_card';
import { Colors } from '@/constants/Colors';
import { Header } from '@/components/Header';
import { getTravels } from '@/services/api/travel';
import { Travel } from '@/types/travel';
import { Tabs } from '@/components/Tabs';

export function TravelsScreen() {
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
    <ThemedView type='left'>
      <Header code="001" label="My Trips" />
      {/* TODO: Create a component */}
      <ThemedView type='center' style={styles.style1}></ThemedView>
      <Tabs
        data={{
          planned: { label: "Planned", onPress: () => console.log('Planed') },
          completed: { label: "Completed", onPress: () => console.log('Completed') },
        }}
        scroll={false}
      />
      <ThemedView type='left' style={{ width: '100%' }}>
        <ThemedView type='between' style={{ marginVertical: 8 }}>
          <ThemedText type="subtitle">On going</ThemedText>
          <ThemedText type="small" style={{ color: Colors.light.textMuted }} onPress={() => console.log('View more')}>View more</ThemedText>
        </ThemedView>
        {data.Going?.map(travel => (
          <TravelCard key={travel.id} travel={travel} mode={mode} />
        ))}
        <ThemedView type='between' style={{ marginVertical: 8 }}>
          <ThemedText type="subtitle">Done</ThemedText>
          <ThemedText type="small" style={{ color: Colors.light.textMuted }} onPress={() => console.log('View more')}>View more</ThemedText>
        </ThemedView>
        {data.Done?.map(travel => (
          <TravelCard key={travel.id} travel={travel} mode={mode} />
        ))}
        <View style={{ height: 115, width:'100%' }}/>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  style1: {
    width: '100%',
    minHeight: 140,
    backgroundColor: Colors.light.onSurface,
    borderRadius: 8,
    marginBottom: 8,
  }
});