import React from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';

export default function TabLogin() {
  return (
    <ThemedView type='container'>
      <ThemedView type='column' style={{ justifyContent: 'center' }}>
        <ThemedText type="title" style={{ marginBottom: 16 }}>Welcome back!</ThemedText>
        <ThemedInput type='email' label='Email'></ThemedInput>
        <ThemedInput type='password' label='Password'></ThemedInput>
      </ThemedView>
    </ThemedView>
  );
}
