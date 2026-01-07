import React from 'react';

import { StyleSheet, View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';

export default function TabTravel() {
  const { height } = useWindowDimensions(); // TODO: generic parameter

  return (
    <ThemedView type='left'>
      <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <ThemedView type='list' style={{ marginBottom: 32, marginTop: 32 }}>
          <ThemedText type="title">Nuevo viaje</ThemedText>
        </ThemedView>
        <ThemedView type='left' style={{ width:'100%' }}>
          <ThemedInput type='text' label='Travel name' />
          <ThemedInput type='text' label='Destination' />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  perfile: {
    width: 40,
    height: 40,
    backgroundColor: '#ccc',
    borderRadius: 50,
    marginRight: 4
  }
});