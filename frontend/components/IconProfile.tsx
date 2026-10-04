import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

type Props = {
  letter: string;
  size: number;
  background?: string;
};

export function IconProfile({ size = 25, letter, background = '#f7f7f7' }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor: background, }]}>
      <ThemedText type='title' style={{ color: '#d3d3d3', fontSize: size * 0.5, paddingBottom: size * 0.05 }}>{letter}</ThemedText>
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
