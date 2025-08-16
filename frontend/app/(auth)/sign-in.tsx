import { router } from 'expo-router';

import { useSession } from '@/contexts/authContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <ThemedView type='container'>
      <ThemedView type='column' style={{ justifyContent: 'center' }}>
        <ThemedText type="title" style={{ marginBottom: 16 }}>Welcome back!</ThemedText>
        <ThemedInput type='email' label='Email' />
        <ThemedInput type='password' label='Password' />
        <ThemedButton title='Log in' onPress={() => {
          signIn();
          // TODO: when sign in successful (async), redirect to the app
          router.replace('/(app)');
        }} />
      </ThemedView>
    </ThemedView>
  );
}

