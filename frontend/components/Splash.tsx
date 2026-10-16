import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo-router';
import { useSession } from '@/contexts/authContext';
import { Colors } from '@/constants/Colors';

// Show the splash screen until the session has been restored.
SplashScreen.preventAutoHideAsync().catch(() => { });

export function SplashScreenController() {
  const { isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/favicon3.png')}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel="Talaria"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    zIndex: 1000,
  },
  image: {
    width: 100,
    height: 100,
  },
});
