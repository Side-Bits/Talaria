import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export function Footer() {
  const { width } = useWindowDimensions(); // TODO: generic parameter
  const pathname = usePathname();
  const { travel_id } = useLocalSearchParams();
  const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;

  const isActivityRoute = /^\/travels\/[^/]+\/activities(?:\/|$)/.test(pathname);
  const title = isActivityRoute ? 'activity' : 'travel';

  const handleCreate = () => {
    if (isActivityRoute) {
      if (!travelId) return;

      router.push({
        pathname: '/(app)/travels/[travel_id]/activities/[activity_id]',
        params: { travel_id: travelId, activity_id: 'new' },
      });
    } else {
      router.push({ pathname: '/(app)/travels/[travel_id]', params: { travel_id: 'new' } });
    }
  };

  return (
    <View style={[styles.footer, { width: Math.min(500 - 32, width - 32) }]}>
      <ThemedView type='between'>
        <Pressable onPress={() => router.replace('/(app)/travels')}>
          <ThemedView type='middle' style={styles.box}>
            <Ionicons name="home-outline" size={20} color={Colors.light.text} />
            <ThemedText type='small'>Home</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={handleCreate}>
          <ThemedView type='middle' style={styles.box}>
            <Ionicons name="add-outline" size={25} color={Colors.light.text} />
            <ThemedText type='small'>Create {title}</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={() => router.replace('/(app)/id-profile')}>
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
