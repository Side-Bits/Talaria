import React, { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { router } from 'expo-router';
import { ThemedCheckbox } from '@/components/ThemedCheckbox';
import { Colors } from '@/constants/Colors';
import { Alert, View } from 'react-native';
import { RegisterCredentials } from '@/types/user';
import { useSession } from '@/contexts/authContext';

export default function SignUp() {
  const { signUp } = useSession()
  const [user, setUser] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    try {
      await signUp(user)
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ThemedView type='center'>
      <ThemedView type='column' style={{ justifyContent: 'center', maxWidth: 400, width: '100%', paddingHorizontal: 16 }}>
        <ThemedText type="title" style={{ marginBottom: 16 }}>Create Account</ThemedText>
        <ThemedInput type='text' label='Username' value={user.username} onChangeText={text => setUser({ ...user, username: text })} />
        <ThemedInput type='email' label='Email' value={user.email} onChangeText={text => setUser({ ...user, email: text })} />
        <ThemedInput type='password' label='Password' value={user.password} onChangeText={text => setUser({ ...user, password: text })} />
        <ThemedInput type='password' label='Confirm password' />
        <ThemedView type='left' style={{ marginBottom: 16 }}>
          <ThemedCheckbox label='I agree with privacy and policy'></ThemedCheckbox>
        </ThemedView>
        <ThemedButton title='Sign up' onPress={handleSignUp} disabled={isSubmitting} />
        <ThemedView type='between' style={{ marginTop: 16, marginBottom: 16 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
          <ThemedText type="default" style={{ color: Colors.light.gray, marginLeft: 16, marginRight: 16 }}>Or</ThemedText>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
        </ThemedView>
        <ThemedButton title='Continue with Google' buttonStyle={{ backgroundColor: '#FAFAFA' }} textStyle={{ color: Colors.light.text }} onPress={() => console.log('Continue with Google')} />
        <ThemedText type="default" style={{ marginTop: 16 }} onPress={() => { router.replace('/(auth)/sign-in'); }}>Already have an account? Log in</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
