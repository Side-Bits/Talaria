import { ThemedBlur } from '@/components/ThemedBlur';
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
        <View style={{ position: 'absolute', bottom: 64, width: Math.min(500 - 32, width - 32), alignItems: 'center' }}>
          <ThemedBlur style={ styles.container }>
            <Pressable onPress={() => router.replace('/(app)/travels')}>
              <View style={ styles.box }>
                <Ionicons name="home-outline" size={20} color={Colors.light.gray} />
              </View>
            </Pressable>
            <Pressable onPress={() => router.replace('/(app)/activity')}>
              <View style={ styles.box }>
                <Ionicons name="add-outline" size={30} color={Colors.light.text} />
              </View>
            </Pressable>
            <Pressable onPress={() => console.log('person-outline')}>
              <View style={ styles.box }>
                <Ionicons name="person-outline" size={20} color={Colors.light.gray} />
              </View>
            </Pressable>
          </ThemedBlur>
        </View>
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
    padding: 4,
  },
  box: {
    padding: 4,
  }
});

