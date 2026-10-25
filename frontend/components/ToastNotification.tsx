import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import type { Toast, ToastVariant } from '@/domain/toast';

interface ToastNotificationProps {
  toast: Toast;
  onDismiss: () => void;
}

const icons = {
  success: 'checkmark-circle-outline',
  error: 'close-circle-outline',
  warning: 'warning-outline',
  info: 'information-circle-outline',
} as const satisfies Record<ToastVariant, keyof typeof Ionicons.glyphMap>;

export function ToastNotification({ toast, onDismiss }: ToastNotificationProps) {
  const color = Colors.light[toast.variant];

  return (
    <View style={styles.container}>
      <Ionicons name={icons[toast.variant]} size={24} color={color} />
      <View
        style={styles.content}
      >
        {toast.title ? <Text style={styles.title}>{toast.title}</Text> : null}
        <Text style={styles.message}>{toast.message}</Text>
      </View>
      <Pressable
        onPress={onDismiss}
        style={({ pressed }) => [styles.close, pressed && styles.pressed]}
      >
        <Ionicons name="close" size={20} color={Colors.light.onSurface} />
      </Pressable>
      {toast.duration > 0 && <ToastProgressBar duration={toast.duration} color={color} />}
    </View>
  );
}

function ToastProgressBar({ duration, color }: { duration: number; color: string }) {
  const remaining = useSharedValue(100);
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${remaining.value}%`,
  }));

  useEffect(() => {
    remaining.value = 100;
    remaining.value = withTiming(0, { duration, easing: Easing.linear });

    return () => cancelAnimation(remaining);
  }, [duration, remaining]);

  return (
    <View
      pointerEvents="none"
      style={[styles.progressTrack, { backgroundColor: `${color}33` }]}
    >
      <Animated.View style={[styles.progressFill, { backgroundColor: color }, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 500,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    elevation: 6,
  },
  content: { flex: 1, gap: 4 },
  title: { color: Colors.light.onSurface, fontSize: 14, fontWeight: '600' },
  message: { color: Colors.light.onSurface, fontSize: 14, lineHeight: 20 },
  close: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.6 },
  progressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  progressFill: { height: '100%' },
});
