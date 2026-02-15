import React, { useState } from 'react';

import { View, Alert, ScrollView, useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { Header } from '@/components/Header';
import { Floating } from '@/components/Floating';
import { ThemedButton } from '@/components/ThemedButton';
import { api } from '@/services/api';
import { DEFAULT_TRAVEL, Travel } from '@/types/travel';

export default function TabTravel() {
  const { height } = useWindowDimensions(); // TODO: generic parameter

  const [travel, setTravel] = useState<Travel>( DEFAULT_TRAVEL );

  const handleTravel = async () => {
    try {
      api.post('travels/create', travel);
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <>
      <ThemedView type='left'>
        <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <Header label='New trip' />
          <ThemedView type='left' style={{ width:'100%' }}>
            <ThemedInput type='text' label='Travel name' value={travel.name} onChangeText={text => setTravel({ ...travel, name: text })} />
            <ThemedView type='between' style={{ width: '100%' }}>
              <View><ThemedInput type='date' label='Start date' value={travel.start_date} onChangeText={text => setTravel({ ...travel, start_date: text })} /></View>
              <View><ThemedText>a</ThemedText></View>
              <View><ThemedInput type='date' label='End date' value={travel.end_date} onChangeText={text => setTravel({ ...travel, end_date: text })} /></View>
            </ThemedView>
            <ThemedButton title='+' onPress={ handleTravel } />
            {/* <ThemedView type='left'>
              <Text style={{ marginBottom: 4, fontSize: 12, color: Colors.light.text }}>Participants</Text>
              <Participants size={40} gap={4} />
            </ThemedView> */}
          </ThemedView>
        </ScrollView>
      </ThemedView>
      <Floating />
    </>
  );
}