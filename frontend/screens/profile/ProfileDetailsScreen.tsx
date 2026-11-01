import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Header';
import { ThemedButton } from '@/components/ThemedButton';
import { useSession } from '@/contexts/authContext';
import { IconProfile } from '@/components/IconProfile';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

export function ProfileDetailsScreen() {
  const session = useSession();
  const user = session.user;
  const letter = user?.username ? user.username.charAt(0).toUpperCase() : ' ';

  return (
    <ThemedView type='left'>
      <Header
        button_back={true}
        popover={
          {
            delete: {
              icon: 'log-out-outline',
              option: 'Log Out',
              color: 'red',
              onclick: session.signOut,
            },
          }
        }
        label='Profile'
      />
      <ThemedView type='list' style={{ width: '100%' }}>
        <ThemedView type='left' margin={32} style={{ alignItems: 'center' }}>
          <IconProfile size={80} letter={letter} />
          <ThemedText type='center' style={{ marginTop: 4 }}>@{user?.username}</ThemedText>
        </ThemedView>
        <ThemedView type='between' margin={32} style={{ gap: 8, borderRadius: 8 }}>
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
        <ThemedView type='list' margin={8} style={styles.container}>
          <ThemedView type='between' margin={8}>
            <ThemedText type='small' textMuted={true}>Name</ThemedText>
            <ThemedText type='small'></ThemedText>
          </ThemedView>
          <ThemedView type='between' margin={8}>
            <ThemedText type='small' textMuted={true}>Lasnames</ThemedText>
            <ThemedText type='small'></ThemedText>
          </ThemedView>
          <ThemedView type='between'>
            <ThemedText type='small' textMuted={true}>Email</ThemedText>
            <ThemedText type='small'>{user?.email}</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView type='list' margin={8} style={styles.container}>
          <ThemedView type='between'>
            <ThemedText type='small' textMuted={true}>Birthdate</ThemedText>
            <ThemedText type='small'></ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView type='list' margin={8} style={styles.container}>
          <ThemedView type='between'>
            <ThemedText type='small' textMuted={true}>Language</ThemedText>
            <ThemedText type='small'>Español (ESP)</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView type='list' margin={16} style={styles.container}>
          <ThemedView type='between'>
            <ThemedText type='small' textMuted={true}>Currency</ThemedText>
            <ThemedText type='small'>Euro (EUR)</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
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