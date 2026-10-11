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
  const [data, setTravels] = useState<Record<string, Travel[]>>({});
  const [activeTab, setActiveTab] = useState('planned');

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
      <Header
        button_back={false}
        button_menu={true}
        label="My Trips"
      />
      <HeroTravel />
      <Tabs
        data={{
          planned: { label: "Planned" },
          undated: { label: "Undated" },
          completed: { label: "Completed" }
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        scroll={false}
      />
      <ThemedView type='left' style={{ width: '100%' }}>
        {activeTab === 'planned' ? (
          <>
            {data.Going?.map(travel => (
              <TravelCard key={travel.id} travel={travel} />
            ))}
          </>
        ) : activeTab === 'completed' ? (
          <>
            {data.Done?.map(travel => (
              <TravelCard key={travel.id} travel={travel} />
            ))}
          </>
        ) : (
          <></>
        )}
        <View style={{ height: 115, width: '100%' }} />
      </ThemedView>
    </ThemedView>
  );
}
