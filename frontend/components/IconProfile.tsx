import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

type Props = {
  size: number;
};

export function IconProfile({ size = 25 }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <ThemedText type='title' style={{ color: "#FFF", fontSize: size * 0.6 }}>M</ThemedText>
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
