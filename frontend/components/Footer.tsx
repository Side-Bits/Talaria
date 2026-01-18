import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { usePathname } from 'expo-router';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

export function Footer()
{
  const { height, width } = useWindowDimensions(); // TODO: generic parameter
  const pathname = usePathname();
  const title = pathname.startsWith('/travels') ? 'travel' : pathname.startsWith('/activities') ? 'activity' : '';

  return (
    <View style={[ styles.footer, { width: Math.min(500 - 32, width - 32) }]}>
      <ThemedView type='between'>
        <Pressable onPress={() => router.replace('/(app)/travels')}>
          <ThemedView type='middle' style={ styles.box }>
            <Ionicons name="home-outline" size={20} color={Colors.light.text} />
            <ThemedText type='small'>Home</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={() => router.replace('/(app)/id-travel')}>
          <ThemedView type='middle' style={ styles.box }>
            <Ionicons name="add-outline" size={25} color={Colors.light.text} />
            <ThemedText type='small'>Create {title}</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={() => router.replace('/(app)/id-perfile')}>
          <ThemedView type='middle' style={ styles.box }>
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