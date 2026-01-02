import React from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { router } from 'expo-router';
import { ThemedCheckbox } from '@/components/ThemedCheckbox';
import { Colors } from '@/constants/Colors';
import { View } from 'react-native';

export default function SignUp() {
  return (
    <ThemedView type='center'>
      <ThemedView type='column' style={{ justifyContent: 'center', maxWidth: 400, width:'100%', paddingHorizontal: 16 }}>
        <ThemedText type="title" style={{ marginBottom: 16 }}>Create Account</ThemedText>
        <ThemedInput type='text' label='Username' />
        <ThemedInput type='email' label='Email' />
        <ThemedInput type='password' label='Password' />
        <ThemedInput type='password' label='Confirm password' />
        <ThemedView type='left' style={{ marginBottom: 16 }}>
          <ThemedCheckbox label='I agree with privacy and policy'></ThemedCheckbox>
        </ThemedView>
        <ThemedButton title='Sign up' onPress={() => {
          router.replace('/(auth)/sign-in');
        }} />
        <ThemedView type='between' style={{ marginTop: 16, marginBottom: 16 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
          <ThemedText type="default" style={{ color: Colors.light.gray, marginLeft: 16, marginRight: 16 }}>Or</ThemedText>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
        </ThemedView>
        <ThemedButton title='Continue with Google' buttonStyle={{ backgroundColor: '#FAFAFA' }} textStyle={{ color: Colors.light.text }} onPress={() => console.log('Continue with Google')} />
        <ThemedText type="default" style={{ marginTop: 16 }} onPress={() => { router.replace('/(auth)/sign-in');}}>Already have an account? Log in</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
