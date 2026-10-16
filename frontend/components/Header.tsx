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
        <Pressable onPress={() => router.back()} style={styles.side}>
          <Ionicons
            name="chevron-back-outline"
            size={20}
            style={styles.icon}
          />
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}
      <ThemedText
        type="title"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.label}
      >
        {label}
      </ThemedText>
      {button_menu ? (
        <Pressable style={styles.side}>
          <Ionicons
            name="menu-outline"
            size={20}
            style={styles.icon}
          />
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  side: {
    width: 33,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
  },
  icon: {
    paddingVertical: 4,
    paddingHorizontal: 5,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    color: Colors.light.onBackground,
    borderColor: Colors.light.border,
  }
});
