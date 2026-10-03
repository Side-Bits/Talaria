import { Stack } from 'expo-router';
import { SessionProvider, useSession } from '@/contexts/authContext';
import { SplashScreenController } from '@/components/Splash';

export function RootLayout() {
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootNavigator />
    </SessionProvider>
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
