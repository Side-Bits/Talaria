import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Header';
import { useSession } from '@/contexts/authContext';
import { IconProfile } from '@/components/IconProfile';
import { ThemedText } from '@/components/ThemedText';
import { ThemedLine } from '@/components/ThemedLine';
import { Colors } from '@/constants/Colors';
import { ErrorCard } from '@/components/ErrorCard';
import { useProfile } from '@/hooks/useProfile';
import { globalStyles } from '@/constants/Global';
import { formatDateDDMMYYYY } from '@/scripts/DataScripts';

export function ProfileDetailsScreen() {
  const session = useSession();
  const user = session.user;
  const { state, retry } = useProfile();
  const profileData = state.status === 'success' ? state.data : undefined;
  const letter = user?.username ? user.username.charAt(0).toUpperCase() : ' ';

  const handlePressEditProfile = () => {
    router.push({
      pathname: "/(app)/profile/edit"
    });
  };

  return (
    <ThemedView type='left'>
      <Header
        button_back={true}
        popover={
          {
            edit: {
              icon: 'pencil',
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
      {state.status === 'loading' ? (
        <View style={styles.feedback}>
          <ActivityIndicator color={Colors.light.primary} />
        </View>
      ) : state.status === 'error' ? (
        <ErrorCard
          title="We couldn't load your profile"
          description={state.error.message}
          image={require('../../assets/images/failed.png')}
          onPress={retry}
        />
      ) : (
        <>
          <ThemedView type='list' style={{ width: '100%' }}>
            <ThemedView type='left' margin={32} style={{ alignItems: 'center' }}>
              <IconProfile size={80} letter={letter} />
              <ThemedText type='center' style={{ marginTop: 8 }}>@{user?.username}</ThemedText>
            </ThemedView>
            <ThemedView type='between' style={{ gap: 8, width: 'auto', borderRadius: 8, marginHorizontal: 16 }}>
              <ThemedView type='column'>
                <ThemedText type='subtitle'>{profileData?.numTrips ?? "-"}</ThemedText>
                <ThemedText type='small' textMuted={true}>Trips</ThemedText>
              </ThemedView>
              <ThemedView type='column'>
                <ThemedText type='subtitle'>{profileData?.numCountries ?? '-'}</ThemedText>
                <ThemedText type='small' textMuted={true}>Countries</ThemedText>
              </ThemedView>
              <ThemedView type='column'>
                <ThemedText type='subtitle'>{profileData?.since ? formatDateDDMMYYYY(profileData.since) : "-"}</ThemedText>
                <ThemedText type='small' textMuted={true}>Since</ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedLine type='all' />
            <ThemedView type='list' margin={8} style={globalStyles.simpleContainer}>
              <ThemedView type='between' margin={8}>
                <ThemedText type='small' textMuted={true}>Name</ThemedText>
                <ThemedText type='small'>{profileData?.name}</ThemedText>
              </ThemedView>
              <ThemedView type='between' margin={8}>
                <ThemedText type='small' textMuted={true}>Last names</ThemedText>
                <ThemedText type='small'>{[profileData?.surname1, profileData?.surname2].filter(Boolean).join(' ')}</ThemedText>
              </ThemedView>
              <ThemedView type='between' margin={8}>
                <ThemedText type='small' textMuted={true}>Email</ThemedText>
                <ThemedText type='small'>{profileData?.email}</ThemedText>
              </ThemedView>
              <ThemedView type='between'>
                <ThemedText type='small' textMuted={true}>Birthdate</ThemedText>
                <ThemedText type='small'>{profileData?.birthdate ? formatDateDDMMYYYY(profileData.birthdate) : ''}</ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedLine type='all' />
            <ThemedView type='list' margin={8} style={globalStyles.simpleContainer}>
              <ThemedView type='between'>
                <ThemedText type='small' textMuted={true}>Language</ThemedText>
                <ThemedText type='small'>{profileData?.language}</ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView type='list' margin={16} style={globalStyles.simpleContainer}>
              <ThemedView type='between'>
                <ThemedText type='small' textMuted={true}>Currency</ThemedText>
                <ThemedText type='small'>{profileData?.currency}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
          <View style={{ height: 80, width: "100%" }} />
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  feedback: {
    width: '100%',
    paddingVertical: 16,
  },
});