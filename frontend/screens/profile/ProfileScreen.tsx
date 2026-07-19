import React from 'react';

import { StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';
import { Header } from '@/components/Header';
import { ThemedButton } from '@/components/ThemedButton';
import { useSession } from '@/contexts/authContext';
import { Colors } from '@/constants/Colors';

export function ProfileScreen() {
  const { height } = useWindowDimensions(); // TODO: generic parameter
  const session = useSession();
  
  const user = session.user;

  return (
    <>
      <ThemedView type='left'>
        <ScrollView style={{ width: '100%', maxHeight: height }} contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <Header label='Profile' />
          <ThemedView type='left' style={{ width: '100%' }}>
            <ThemedInput type='text' label='Username' value={user?.username} />
            <ThemedInput type='text' label='Name' value={''} />
            <ThemedInput type='text' label='Fist surname' value={''} />
            <ThemedInput type='text' label='Second surname' value={''} />
            <ThemedInput type='email' label='Email' value={user?.email} />
          </ThemedView>
        </ScrollView>
        <ThemedButton title='Log Out' buttonStyle={styles.signout_button} onPress={session.signOut} />
      </ThemedView>
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
  },

  signout_button: {
    backgroundColor: Colors.light.signout,
    alignItems: 'center',
  }
});
