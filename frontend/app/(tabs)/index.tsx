import React from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView type='center'>
      <ThemedText type="title">Welcome!</ThemedText>
    </ThemedView>
  );
}
