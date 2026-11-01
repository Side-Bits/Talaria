import { ThemedText } from './ThemedText';
import { Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { ThemedView } from './ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Popover, type PopoverItem } from './Popover';

type Props = {
  button_back: boolean;
  popover?: Record<string, PopoverItem>;
  label: string;
};

export function Header({
  button_back,
  popover,
  label
}: Props) {
  const haveOptions = popover && Object.keys(popover).length > 0;
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <View style={styles.container}>
      <ThemedView type='between' style={styles.header}>
        <View style={styles.action}>
          {button_back && (
            <Pressable onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                size={20}
                style={styles.icon}
                color={Colors.light.textMuted}
              />
            </Pressable>
          )}
        </View>
        <ThemedText type="title" style={styles.title}>{label}</ThemedText>
        <View style={styles.action}>
          {haveOptions && (
            <Pressable
              onPress={() => setOpenMenu(isOpen => !isOpen)}
              accessibilityRole="button"
              accessibilityState={{ expanded: openMenu }}
            >
              <Ionicons
                name={openMenu ? 'close-outline' : 'menu-outline'}
                size={20}
                style={styles.icon}
                color={Colors.light.onSurface}
              />
            </Pressable>
          )}
        </View>
      </ThemedView>
      {haveOptions && openMenu && popover && <Popover data={popover} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  header: {
    width: '100%',
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
  title: {
    flex: 1,
    textAlign: 'center'
  },
  action: {
    width: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
