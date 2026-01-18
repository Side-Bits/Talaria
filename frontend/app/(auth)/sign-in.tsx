import { router } from 'expo-router';
import { useSession } from '@/contexts/authContext';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedCheckbox } from '@/components/ThemedCheckbox';
import { Colors } from '@/constants/Colors';
import { Alert, View } from 'react-native';
import { useState } from 'react';
import { LoginCredentials } from '@/types/user';

export default function SignIn() {
  const { signIn } = useSession();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    identifier: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      await signIn(credentials);
      // Navigation handled automatically by auth routing
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView type='center'>
      <ThemedView type='column' style={{ justifyContent: 'center', maxWidth: 400, width:'100%', paddingHorizontal: 16 }}>
        <ThemedText type="title" style={{ marginBottom: 16, fontWeight: 'bold' }}>Welcome back!</ThemedText>
        <ThemedInput type='email' label='Email' value={credentials.identifier} onChangeText={text => setCredentials({ ...credentials, identifier: text })} />
        <ThemedInput type='password' label='Password' value={credentials.password} onChangeText={text => setCredentials({ ...credentials, password: text })} />
        <ThemedView type='between' style={{ marginBottom: 16 }}>
          <ThemedCheckbox label='Remember me'></ThemedCheckbox>
          <ThemedText type='default' onPress={() => console.log('Forgot password')}>Forgot password?</ThemedText>
        </ThemedView>
        <ThemedButton title='Sign in' onPress={handleLogin} disabled={isSubmitting} />
        <ThemedView type='between' style={{ marginTop: 16, marginBottom: 16 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
          <ThemedText type="default" style={{ color: Colors.light.gray, marginLeft: 16, marginRight: 16 }}>Or</ThemedText>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
        </ThemedView>
        <ThemedButton title='Continue with Google' buttonStyle={{ backgroundColor: '#FAFAFA' }} textStyle={{ color: Colors.light.text }} onPress={() => console.log('Continue with Google')} />
        <ThemedText type="default" style={{ marginTop: 16 }} onPress={() => { router.replace('/(auth)/sign-up'); }}>Don’t have an account? Sing up</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

