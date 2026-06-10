import { Stack } from 'expo-router';
import { SessionProvider, useSession } from '@/contexts/authContext';
import { SplashScreenController } from '@/components/Splash';

export default function Root() {
  // While is loading, show the splash screen
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session } = useSession();

  const DEV_BYPASS_AUTH = true // TODO: remove before commit
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
