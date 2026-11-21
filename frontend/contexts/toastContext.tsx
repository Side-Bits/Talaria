import { createContext, useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ToastNotification } from '@/components/ToastNotification';
import { createToast, type Toast, type ToastOptions, type ToastService } from '@/domain/toast';

export const ToastContext = createContext<ToastService | undefined>(undefined);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<Toast | null>(null);
  const nextId = useRef(0);
  const insets = useSafeAreaInsets();

  const showToast = useCallback((options: ToastOptions) => {
    // The latest notification replaces the current one, including its timer.
    setToast(createToast(options, ++nextId.current));
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast || toast.duration === 0) return;

    const timeout = setTimeout(() => {
      // An expiring notification must never dismiss a newer one.
      setToast(current => current?.id === toast.id ? null : current);
    }, toast.duration);

    return () => clearTimeout(timeout);
  }, [toast]);

  const service = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext value={service}>
      <View style={styles.container}>
        {children}
        {toast && (
          <View
            pointerEvents="box-none"
            style={[
              styles.overlay,
              {
                top: insets.top + 12,
                left: insets.left + 16,
                right: insets.right + 16,
              },
            ]}
          >
            <ToastNotification key={toast.id} toast={toast} onDismiss={dismissToast} />
          </View>
        )}
      </View>
    </ToastContext>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 10,
  },
});
