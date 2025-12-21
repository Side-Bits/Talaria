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

  console.log('Session:', session);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session} >
        <Stack.Screen name="(app)" options={{ headerTitle: 'Talaria' }} />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

