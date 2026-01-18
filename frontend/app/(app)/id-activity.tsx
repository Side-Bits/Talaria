import React from 'react';

import { StyleSheet, View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { ThemedInput } from '@/components/ThemedInput';
import { Header } from '@/components/Header';
import { Floating } from '@/components/Floating';

export default function TabActivity() {
  const { height } = useWindowDimensions(); // TODO: generic parameter

  return (
    <>
      <ThemedView type='left'>
        <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <Header label='New activity' />
          <ThemedView type='left' style={{ width:'100%' }}>
            <ThemedInput type='text' label='Activity name' />
            <ThemedView type='between' style={{ width: '100%' }}>
              <View><ThemedInput type='date' label='Start date' /></View>
              <View><ThemedText>a</ThemedText></View>
              <View><ThemedInput type='date' label='End date' /></View>
            </ThemedView>
            <ThemedInput type='text' label='Location' />
            <ThemedInput type='text' label='Notes' />
            {/* <ThemedView type='left'>
              <Text style={{ marginBottom: 4, fontSize: 12, color: Colors.light.text }}>Participants</Text>
              <ThemedView type='row'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <View style={ styles.perfile } />
                ))}
              </ThemedView>
            </ThemedView> */}
          </ThemedView>
        </ScrollView>
      </ThemedView>
      <Floating />
    </>
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