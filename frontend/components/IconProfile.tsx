import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

type Props = {
  letter: string;
  size: number;
};

export function IconProfile({ size = 25, letter }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <ThemedText type='title' style={{ color: '#646464', fontSize: size * 0.6 }}>{letter}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 50,
  },
});
