import React from 'react';

import { StyleSheet, View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { Header } from '@/components/Header';
import { Floating } from '@/components/Floating';
import { Colors } from '@/constants/Colors';
import { Participants } from '@/components/Participants';

export default function TabTravel() {
  const { height } = useWindowDimensions(); // TODO: generic parameter

  return (
    <>
      <ThemedView type='left'>
        <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <Header label='New trip' />
          <ThemedView type='left' style={{ width:'100%' }}>
            <ThemedInput type='text' label='Travel name' />
            <ThemedView type='between' style={{ width: '100%' }}>
              <View><ThemedInput type='date' label='Start date' /></View>
              <View><ThemedText>a</ThemedText></View>
              <View><ThemedInput type='date' label='End date' /></View>
            </ThemedView>
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