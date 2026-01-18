import React from 'react';

import { StyleSheet, View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { Header } from '@/components/Header';
import { Floating } from '@/components/Floating';

export default function TabPerfile() {
  const { height } = useWindowDimensions(); // TODO: generic parameter

  return (
    <>
      <ThemedView type='left'>
        <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <Header label='Perfile' />
          <ThemedView type='left' style={{ width:'100%' }}>
            <ThemedInput type='text' label='Username' />
            <ThemedInput type='text' label='Name' />
            <ThemedInput type='text' label='Fist surname' />
            <ThemedInput type='text' label='Second surname' />
            <ThemedInput type='email' label='Email' />
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