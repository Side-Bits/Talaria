import { router } from 'expo-router';
import { useSession } from '@/contexts/authContext';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCheckbox } from '@/components/ThemedCheckbox';
import { Colors } from '@/constants/Colors';
import { View } from 'react-native';

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
          <ThemedText type='default' onPress={() => console.log('Forgot password')}>Forgot password?</ThemedText>
        </ThemedView>
        <ThemedButton title='Sign in' onPress={() => {
          signIn();
          // TODO: when sign in successful (async), redirect to the app
          router.replace('/(app)/travels');
        }} />
        <ThemedView type='between' style={{ marginTop: 16, marginBottom: 16 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
          <ThemedText type="default" style={{ color: Colors.light.gray, marginLeft: 16, marginRight: 16 }}>Or</ThemedText>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
        </ThemedView>
        <ThemedButton title='Continue with Google' buttonStyle={{ backgroundColor: '#FAFAFA' }} textStyle={{ color: Colors.light.text }} onPress={() => console.log('Continue with Google')} />
        <ThemedText type="default" style={{ marginTop: 16 }} onPress={() => { router.replace('/(auth)/sign-up');}}>Don’t have an account? Sing up</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

