import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Header';
import { useSession } from '@/contexts/authContext';
import { IconProfile } from '@/components/IconProfile';
import { ThemedText } from '@/components/ThemedText';
import { ThemedLine } from '@/components/ThemedLine';
import { useEffect, useState } from 'react';
import { getProfile } from '@/services/api/profile';
import { Profile } from '@/types/profile';
import { formatDate } from '@/scripts/DataScripts';

export function ProfileDetailsScreen() {
  const session = useSession();
  const user = session.user;
  const [profile, setProfile] = useState<Profile | undefined>();
  const letter = user?.username ? user.username.charAt(0).toUpperCase() : ' ';

  const handlePressEditProfile = () => {
    router.push({
      pathname: "/(app)/profile/edit"
    });
  };

  useEffect(() => {
    if (user) {
      getProfile()
        .then(data => {
          setProfile(data);
        })
        .catch(e => {
          console.error(e);
          Alert.alert('Error', 'Failed to fetch profile');
        });
    }
  }, [user]);

  return (
    <ThemedView type='left'>
      <Header
        button_back={true}
        popover={
          {
            edit: {
              icon: 'chevron-forward',
              option: 'Edit profile',
              color: '#000',
              onclick: handlePressEditProfile,
            },
            delete: {
              icon: 'log-out-outline',
              option: 'Log Out',
              color: 'red',
              onclick: async () => {
                await session.signOut();
                router.replace('/(auth)/sign-in');
              },
            }
          }
        }
        label='Profile'
      />
      <ThemedView type='list' style={{ width: '100%' }}>
        <ThemedView type='left' margin={32} style={{ alignItems: 'center' }}>
          <IconProfile size={80} letter={letter} />
          <ThemedText type='center' style={{ marginTop: 8 }}>@{user?.username}</ThemedText>
        </ThemedView>
        <ThemedView type='between' style={{ gap: 8, borderRadius: 8 }}>
          <ThemedView type='column'>
            <ThemedText type='title'>0</ThemedText>
            <ThemedText type='small' textMuted={true}>Trips</ThemedText>
          </ThemedView>
          <ThemedView type='column'>
            <ThemedText type='title'>0</ThemedText>
            <ThemedText type='small' textMuted={true}>Countries</ThemedText>
          </ThemedView>
          <ThemedView type='column'>
            <ThemedText type='title'>0</ThemedText>
            <ThemedText type='small' textMuted={true}>Since</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedLine type='all' />
        <ThemedView type='list' margin={8} style={styles.container}>
          <ThemedView type='between' margin={8}>
            <ThemedText type='small' textMuted={true}>Name</ThemedText>
            <ThemedText type='small'>{profile?.name}</ThemedText>
          </ThemedView>
          <ThemedView type='between' margin={8}>
            <ThemedText type='small' textMuted={true}>Last names</ThemedText>
            <ThemedText type='small'>{[profile?.surname1, profile?.surname2].filter(Boolean).join(' ')}</ThemedText>
          </ThemedView>
          <ThemedView type='between' margin={8}>
            <ThemedText type='small' textMuted={true}>Email</ThemedText>
            <ThemedText type='small'>{profile?.email}</ThemedText>
          </ThemedView>
          <ThemedView type='between'>
            <ThemedText type='small' textMuted={true}>Birthdate</ThemedText>
            <ThemedText type='small'>{profile?.birthdate ? profile.birthdate.slice(0, 10) : ''}</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedLine type='all' />
        <ThemedView type='list' margin={8} style={styles.container}>
          <ThemedView type='between'>
            <ThemedText type='small' textMuted={true}>Language</ThemedText>
            <ThemedText type='small'>{profile?.language}</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView type='list' margin={16} style={styles.container}>
          <ThemedView type='between'>
            <ThemedText type='small' textMuted={true}>Currency</ThemedText>
            <ThemedText type='small'>{profile?.currency}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <View style={{ height: 80, width: "100%" }} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  signout_button: {
    backgroundColor: '#FF8F8F',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    padding: 8,
    backgroundColor: '#FCFCFC',
    borderRadius: 4
  }
});