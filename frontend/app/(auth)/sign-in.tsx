import { router } from 'expo-router';
import { useSession } from '@/contexts/authContext';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCheckbox } from '@/components/ThemedCheckbox';

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <ThemedView type='center'>
      <ThemedView type='column' style={{ justifyContent: 'center', maxWidth: 400, width:'100%', paddingHorizontal: 16 }}>
        <ThemedText type="title" style={{ marginBottom: 16 }}>Welcome back!</ThemedText>
        <ThemedInput type='email' label='Email' />
        <ThemedInput type='password' label='Password' />
        <ThemedView type='between' style={{ marginBottom: 16 }}>
          <ThemedCheckbox label='Remember me'></ThemedCheckbox>
          <ThemedText type='link' onPress={() => console.log('Forgot password')}>Forgot password?</ThemedText>
        </ThemedView>
        <ThemedButton title='Sing in' onPress={() => {
          signIn();
          // TODO: when sign in successful (async), redirect to the app
          router.replace('/(app)/travels');
        }} />
      </ThemedView>
    </ThemedView>
  );
}

