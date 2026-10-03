import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Alert, StyleSheet, Pressable } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedDate } from '@/components/ThemedDate';
import { ThemedInput } from '@/components/ThemedInput';
import { Header } from '@/components/Header';
import { ThemedButton } from '@/components/ThemedButton';
import { DEFAULT_TRAVEL, Travel } from '@/types/travel';
import { createTravel } from '@/services/api/travel';
import { Colors } from '@/constants/Colors';
import { Participants } from '@/components/Participants';

export function TravelEditorScreen() {
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
    <ThemedView type='left'>
      <Header code='004' label={mode === 'C' ? 'New trip' : travel.name} />
      <ThemedView type='left' style={{ width: '100%' }}>
        <Pressable style={ styles.hero }>
          <ThemedView type='center'>
            <ThemedText type='default' style={{ color: Colors.light.textMuted }}>Add front page</ThemedText>
          </ThemedView>
        </Pressable>
        <ThemedInput type='text' label='Name' value={travel.name} onChangeText={text => setTravel({ ...travel, name: text })} />
        <ThemedView type='between' style={{ width: '100%' }}>
          <View><ThemedDate label='Start date' date={true} value={travel.start_date} mode={String(mode)} onChangeText={text => setTravel({ ...travel, start_date: text })} /></View>
          <View><ThemedText type='center'>a</ThemedText></View>
          <View><ThemedDate label='End date' date={true} value={travel.end_date} mode={String(mode)} onChangeText={text => setTravel({ ...travel, end_date: text })} /></View>
        </ThemedView>
        <ThemedInput type='textarea' label='Description' value={travel.description} onChangeText={text => setTravel({ ...travel, description: text })} />
        <ThemedText type="small" muted={true} style={{ marginBottom: 4 }}>People</ThemedText>
        <Participants size={40} />
        <ThemedButton title='Add' onPress={handleTravel} />
      </ThemedView>
      <View style={{ height: 115, width:'100%' }}/>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    minHeight: 100,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
  }
});