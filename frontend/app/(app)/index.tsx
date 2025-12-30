import { useSession } from '@/contexts/authContext';
import { router } from 'expo-router';
import { Text, View } from 'react-native';


export default function Index() {
  const { signOut } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          // The `app/_layout.tsx` will redirect to the sign-in screen.
          signOut();
          router.replace('/(auth)/sign-in');
        }}>
        Sign Out
      </Text>
    </View>
  );
}

