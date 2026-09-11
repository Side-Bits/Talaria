import React, { useEffect } from 'react';

import { StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';
import { Header } from '@/components/Header';
import { ThemedButton } from '@/components/ThemedButton';
import { useSession } from '@/contexts/authContext';
import { Colors } from '@/constants/Colors';
import { inputMode } from '@/scripts/InputScripts';

export function ProfileScreen() {
  const session = useSession();
  const user = session.user;

  useEffect(() => {
    inputMode(String('V'))
  });

  return (
    <ThemedView type='left'>
        <Header code='005' label='Profile' />
        <ThemedView type='left' style={{ width: '100%' }}>
          <ThemedInput type='text' label='Username' value={user?.username} />
          <ThemedInput type='text' label='Name' value={''} />
          <ThemedInput type='text' label='Fist surname' value={''} />
          <ThemedInput type='text' label='Second surname' value={''} />
          <ThemedInput type='email' label='Email' value={user?.email} />
        </ThemedView>
      <ThemedButton title='Log Out' buttonStyle={styles.signout_button} onPress={session.signOut} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  signout_button: {
    backgroundColor: 'red',
    alignItems: 'center',
  }
});
