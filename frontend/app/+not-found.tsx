import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';

import { StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <ThemedView type='right'>
      <ThemedText type="title">Not Found!</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  
});
