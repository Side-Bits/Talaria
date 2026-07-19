import { ThemedText } from './ThemedText';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

type Props = & {
  label: string;
};

export function Header({ label }: Props) {
  return (
    <ThemedView type='between' style={styles.header}>
      <Pressable onPress={() => router.back()} >
        <Ionicons name="arrow-back-outline" size={20} color={Colors.light.text} />
      </Pressable>
      <ThemedText type="title">{label}</ThemedText>
      {/*<Ionicons name="options-outline" size={20} color={Colors.light.text} onPress={() => console.log('options-outline')} /> */}
      <ThemedText type="title"></ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 32,
    alignItems: 'center',
  }
});
