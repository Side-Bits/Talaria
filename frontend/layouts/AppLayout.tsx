import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export function AppLayout() {
  return (
    <ThemedView type='middle'>
      <View style={{ maxWidth: 500, width: '100%', height: '100%', paddingHorizontal: 16 }}>
        <AppNavigator />
      </View>
    </ThemedView>
  );
}

function AppNavigator() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.light.background } }} />;
}
