import { ThemedText } from './ThemedText';
import { StyleSheet, View } from 'react-native';

export function Header() {
  return (
    <View style={styles.header}>
      <ThemedText type="title">Hola Mundo</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
}); 