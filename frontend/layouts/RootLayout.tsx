import { Stack } from 'expo-router';
import { SessionProvider, useSession } from '@/contexts/authContext';
import { SplashScreenController } from '@/components/Splash';
import { ToastProvider } from '@/contexts/toastContext';

export function RootLayout() {
  return (
    <ToastProvider>
      <SessionProvider>
        <SplashScreenController />
        <RootNavigator />
      </SessionProvider>
    </ToastProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useSession();

  // Do nothing while is loading to keep the splash screen visible.
  if (isLoading) {
    return null;
  }

  const DEV_BYPASS_AUTH = false  // TODO: remove before commit
  const isAuthenticated = DEV_BYPASS_AUTH || !!session

  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: "white" }
    }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" options={{ headerTitle: 'Talaria' }} />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
