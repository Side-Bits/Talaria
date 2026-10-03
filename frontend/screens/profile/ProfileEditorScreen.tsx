import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';
import { Header } from '@/components/Header';
import { ThemedButton } from '@/components/ThemedButton';
import { useSession } from '@/contexts/authContext';

export function ProfileEditorScreen() {
  const session = useSession();
  const user = session.user;

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
      <ThemedButton title='Return' buttonStyle={styles.signout_button} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  signout_button: {
    backgroundColor: '#CCC',
    alignItems: 'center',
  }
});
