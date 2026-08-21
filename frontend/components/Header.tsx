import { ThemedText } from './ThemedText';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

type Props = & {
  code: string;
  label: string;
};

export function Header({ code, label }: Props) {
  return (
    <ThemedView type='between' style={styles.header}>
      {(code == "002" || code == "003" || code == "004" || code == "005") && (
        <Pressable onPress={() => router.back()} >
          <Ionicons name="arrow-back-outline" size={20} color={Colors.light.onSurface} />
        </Pressable>
      )}
      <ThemedText type="title">{label}</ThemedText>
      {(code == "ZZZ") ?
        <Ionicons name="menu-outline" size={20} color={Colors.light.onSurface} onPress={() => console.log('menu-outline')} />
      : <View/>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 32,
    alignItems: 'center',
  }
});
