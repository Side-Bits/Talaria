import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';

type Props = {
  letter: string;
  size: number;
  background?: string;
};

export function IconProfile({ size = 25, letter, background = Colors.light.iconBackground }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor: background, }]}>
      <ThemedText type='title' style={{ color: Colors.light.onIcon, fontSize: size * 0.5, paddingBottom: size * 0.05 }}>{letter}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
});
