import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Header';
import { getTravels } from '@/services/api/travel';
import { Travel } from '@/types/travel';
import { Tabs } from '@/components/Tabs';
import { HeroTravel } from '@/screens/travels/components/HeroTravel';
import { TravelCard } from './components/TravelCard';

export function TravelDetailsScreen() {
  const mode: string = 'V';
  const [data, setTravels] = useState<Record<string, Travel[]>>({});
  const [planned, setPlanned] = useState(1);

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
      <Header code="001" label="My Trips"/>
      <HeroTravel />
      <Tabs
        data={{
          planned: { label: "Planned", onPress: () => setPlanned(1) },
          undated: { label: "Undated", onPress: () => setPlanned(2) },
          completed: { label: "Completed", onPress: () => setPlanned(0) }
        }}
        scroll={false}
      />
      <ThemedView type='left' style={{ width: '100%' }}>
        {planned === 1 ? (
          <>
            {data.Going?.map(travel => (
              <TravelCard key={travel.id} travel={travel} mode={mode} />
            ))}
          </>
        ) : planned === 0 ? (
          <>
            {data.Done?.map(travel => (
              <TravelCard key={travel.id} travel={travel} mode={mode} />
            ))}
          </>
        ) : (
          <></>
        )}
        <View style={{ height: 115, width:'100%' }}/>
      </ThemedView>
    </ThemedView>
  );
}
