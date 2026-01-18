import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedBlur } from './ThemedBlur';
import { ThemedView } from './ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

export function Floating()
{
  const { height, width } = useWindowDimensions(); // TODO: generic parameter

  return (
    <></>
    // <View style={{ position: 'absolute', bottom: 64, width: Math.min(500 - 32, width - 32), alignItems: 'center' }}>
    //   <ThemedBlur style={ styles.container }>
    //     <Pressable onPress={() => router.replace('/(app)/travels')}>
    //       <ThemedView type='middle' style={ styles.box }>
    //         <Ionicons name="home-outline" size={20} color={Colors.light.text} />
    //         <ThemedText type='small'>Home</ThemedText>
    //       </ThemedView>
    //     </Pressable>
    //   </ThemedBlur>
    // </View>
    );
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