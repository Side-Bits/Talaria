import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Alert, ScrollView, useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedDate } from '@/components/ThemedDate';
import { ThemedInput } from '@/components/ThemedInput';
import { Header } from '@/components/Header';
import { ThemedButton } from '@/components/ThemedButton';
import { DEFAULT_TRAVEL, Travel } from '@/types/travel';
import { createTravel } from '@/services/api/travel';

export function TravelDetailsScreen() {
  const { height } = useWindowDimensions(); // TODO: generic parameter

  const { mode } = useLocalSearchParams();
  const [travel, setTravel] = useState<Travel>(DEFAULT_TRAVEL);

  const handleTravel = async () => {
    try {
      await createTravel (travel)
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <>
      <ThemedView type='left'>
        <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <Header code='004' label={mode === 'C' ? 'New trip' : travel.name} />
          <ThemedView type='left' style={{ width: '100%' }}>
            <ThemedInput type='text' label='Travel name' value={travel.name} onChangeText={text => setTravel({ ...travel, name: text })} />
            <ThemedView type='between' style={{ width: '100%' }}>
              <View><ThemedDate label='Start date' date={true} value={travel.start_date} mode={String(mode)} onChangeText={text => setTravel({ ...travel, start_date: text })} /></View>
              <View style={{ width: 40 }}><ThemedText type='center'>a</ThemedText></View>
              <View><ThemedDate label='End date' date={true} value={travel.end_date} mode={String(mode)} onChangeText={text => setTravel({ ...travel, end_date: text })} /></View>
            </ThemedView>
            <ThemedButton title='Add' style={{ marginTop: 8 }} onPress={handleTravel} />
            {/* <ThemedView type='left'>
              <Text style={{ marginBottom: 4, fontSize: 12, color: Colors.light.onSurface }}>Participants</Text>
              <Participants size={40} gap={4} />
            </ThemedView> */}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </>
  );
}
