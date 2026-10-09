import { ThemedText } from './ThemedText';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

type Props = & {
  button_back: boolean;
  button_menu: boolean;
  label: string;
};

export function Header({
    button_back,
    button_menu,
    label
  }: Props) {
  return (
    <ThemedView type='between' style={styles.header}>
      {button_back ? (
        <Pressable
        onPress={() => router.back()} >
          <Ionicons
            name="chevron-back-outline"
            size={20}
            style={styles.icon}
            color={Colors.light.textMuted} />
        </Pressable>
      ) : (
        <View style={{ width: 33, height: 32 }} />
      )}
      <ThemedText type="title" style={{ width: '100%', textAlign: 'center' }}>{label}</ThemedText>
      {button_menu ? (
        <Ionicons
          name="menu-outline"
          size={20}
          style={styles.icon}
          color={Colors.light.onSurface}
          /*onPress={() => console.log("menu-outline")}*/
        />
      ) : (
        <View style={{ width: 33, height: 32 }} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  icon: {
    paddingVertical: 4,
    paddingHorizontal: 5,
    backgroundColor: Colors.light.onSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  }
});
