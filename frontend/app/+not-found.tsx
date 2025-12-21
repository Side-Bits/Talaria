import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';

export default function NotFoundScreen() {
  return (
    <ThemedView type='center'>
      <ThemedText type="title">Not Found!</ThemedText>
    </ThemedView>
  );
}
