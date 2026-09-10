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
          <Ionicons name="chevron-back-outline" size={20} color={Colors.light.textMuted} />
        </Pressable>
      )}
      <ThemedText type="title">{label}</ThemedText>
      {/*code === "ZZZ" ? (
        <Ionicons
          name="menu-outline"
          size={20}
          color={Colors.light.onSurface}
          onPress={() => console.log("menu-outline")}
        />
      ) :*/ code === "001" ? (
        <Ionicons
          name="menu-outline"
          size={20}
          style={styles.icon}
          color={Colors.light.onSurface}
          onPress={() => console.log("menu-outline")}
        />
      ) : (
        <View />
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
