import { Footer } from '@/components/Footer';
import { ThemedBlur } from '@/components/ThemedBlur';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native';

export default function Root() {
  const { height, width } = useWindowDimensions(); // TODO: generic parameter

  return (
    <ThemedView type='middle'>
      <View style={{ maxWidth: 500, width:'100%', height: height, paddingHorizontal: 16 }}>
        <RootNavigator />
      </View>
    </ThemedView>
  );
}

function RootNavigator() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.light.background } }}/>;
}

const styles = StyleSheet.create({
  container:{
    width: '100%',
    maxWidth: 400,
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  box: {
    padding: 4,
  }
});

