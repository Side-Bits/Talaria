import React, { useState } from 'react';

import { View, ScrollView, useWindowDimensions, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { Header } from '@/components/Header';
import { ThemedButton } from '@/components/ThemedButton';
import { api } from '@/services/api';
import { Activity, DEFAULT_ACTIVITY } from '@/types/activity';
import { useLocalSearchParams } from 'expo-router';

export function ActivityDetailsScreen() {
  const { height } = useWindowDimensions(); // TODO: generic parameter
  const { travel_id } = useLocalSearchParams();
  const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;

  const [activity, setActivity] = useState<Activity>(DEFAULT_ACTIVITY);

  const handleActivity = async () => {
    if (!travelId) {
      Alert.alert('Error', 'Missing travel ID');
      return;
    }

    try {
      await api.post(`api/travels/${travelId}/activities/create`, activity);
    } catch {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <>
      <ThemedView type='left'>
        <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <Header label='New activity' />
          <ThemedView type='left' style={{ width: '100%' }}>
            <ThemedInput type='text' label='Activity name' value={activity.name} onChangeText={text => setActivity({ ...activity, name: text })} />
            <ThemedView type='between' style={{ width: '100%' }}>
              <View><ThemedInput type='date' label='Start date' value={activity.start_date} onChangeText={text => setActivity({ ...activity, start_date: text })} /></View>
              <View><ThemedText>a</ThemedText></View>
              <View><ThemedInput type='date' label='End date' value={activity.end_date} onChangeText={text => setActivity({ ...activity, end_date: text })} /></View>
            </ThemedView>
            <ThemedInput type='text' label='Location' value={activity.location} onChangeText={text => setActivity({ ...activity, location: text })} />
            <ThemedInput type='text' label='Notes' value={activity.description} onChangeText={text => setActivity({ ...activity, description: text })} />
            {/*<ThemedInput type='text' label='Price' value={activity.price} onChangeText={text => setActivity({ ...activity, name: text })} />*/}
            {/*<Participants size={32} gap={4}/>*/}
            <ThemedButton title='+' onPress={handleActivity} />
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </>
  );
}
