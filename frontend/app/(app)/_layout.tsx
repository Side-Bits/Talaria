import { Stack } from 'expo-router';

export default function Root() {
  return (
    <RootNavigator />
  );
}

function RootNavigator() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

