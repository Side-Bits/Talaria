import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

export function Footer() {
  return (
    <View style={styles.footer}>
      <ThemedText type="subtitle">Hola Mundo</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  }
});