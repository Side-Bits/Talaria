import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export function Footer() {
  const { width } = useWindowDimensions(); // TODO: generic parameter
  const pathname = usePathname();
  const { id_travel } = useLocalSearchParams();
  const travelId = Array.isArray(id_travel) ? id_travel[0] : id_travel;

  const isActivityRoute = pathname.startsWith('/travels/activity');
  const title = isActivityRoute ? 'activity' : 'travel';

  return (
    <View style={[styles.footer, { width: Math.min(500 - 32, width - 32) }]}>
      <ThemedView type='between'>
        <Pressable onPress={() => router.replace('/(app)/travels')}>
          <ThemedView type='middle' style={styles.box}>
            <Ionicons name="home-outline" size={20} color={Colors.light.text} />
            <ThemedText type='small'>Home</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={() => router.replace(isActivityRoute
          ? { pathname: '/(app)/travels/activity/[activity_id]', params: { id_travel: travelId ?? '', activity_id: 'new' } }
          : { pathname: '/(app)/travels/[travel_id]', params: { travel_id: 'new' } }
        )}>
          <ThemedView type='middle' style={styles.box}>
            <Ionicons name="add-outline" size={25} color={Colors.light.text} />
            <ThemedText type='small'>Create {title}</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={() => router.replace('/(app)/id-perfile')}>
          <ThemedView type='middle' style={styles.box}>
            <Ionicons name="person-outline" size={20} color={Colors.light.text} />
            <ThemedText type='small'>Perfile</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 64,
    backgroundColor: Colors.light.footer,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  box: {
    padding: 4,
  }
});
