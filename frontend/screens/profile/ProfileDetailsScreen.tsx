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

  return (
    <ThemedView type='left'>
      <Header code='005' label='Profile' />
      <ThemedView type='list' style={{ width: '100%' }}>
        <ThemedView type='left' margin={32} style={{ alignItems: 'center' }}>
          <IconProfile size={80} />
          <ThemedText type='center' style={{ marginTop: 4 }}>@{user?.username}</ThemedText>
        </ThemedView>
        <ThemedView type='between' margin={16} style={{ gap: 8, borderRadius: 8 }}>
          <ThemedView type='column' style={ styles.container }>
            <ThemedText type='small'  style={{ color: Colors.light.textMuted }}>Trips</ThemedText>
            <ThemedText type='title'>0</ThemedText>
          </ThemedView>
          <ThemedView type='column' style={ styles.container }>
            <ThemedText type='small' style={{ color: Colors.light.textMuted }}>Countries</ThemedText>
            <ThemedText type='title'>0</ThemedText>
          </ThemedView>
          <ThemedView type='column' style={ styles.container }>
            <ThemedText type='small' style={{ color: Colors.light.textMuted }}>Since</ThemedText>
            <ThemedText type='title'>0</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView type='list' margin={8} style={styles.container}>
          <ThemedView type='between' margin={8}>
            <ThemedText type='small' style={{ color: Colors.light.textMuted }}>Name</ThemedText>
            <ThemedText type='small'></ThemedText>
          </ThemedView>
          <ThemedView type='between' margin={8}>
            <ThemedText type='small' style={{ color: Colors.light.textMuted }}>Lasnames</ThemedText>
            <ThemedText type='small'></ThemedText>
          </ThemedView>
          <ThemedView type='between'>
            <ThemedText type='small' style={{ color: Colors.light.textMuted }}>Email</ThemedText>
            <ThemedText type='small'>{user?.email}</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView type='list' margin={8} style={styles.container}>
          <ThemedView type='between'>
            <ThemedText type='small' style={{ color: Colors.light.textMuted }}>Birthdate</ThemedText>
            <ThemedText type='small'></ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView type='list' margin={8} style={styles.container}>
          <ThemedView type='between'>
            <ThemedText type='small' style={{ color: Colors.light.textMuted }}>Language</ThemedText>
            <ThemedText type='small'>Español (ESP)</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView type='list' margin={16} style={styles.container}>
          <ThemedView type='between'>
            <ThemedText type='small' style={{ color: Colors.light.textMuted }}>Currency</ThemedText>
            <ThemedText type='small'>Euro (EUR)</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <ThemedButton title='Log Out' buttonStyle={styles.signout_button} onPress={session.signOut} />
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
    backgroundColor: '#FBFBFB',
    borderRadius: 4
  }
});