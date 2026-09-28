import { Colors } from '@/constants/Colors';
import { ThemedView } from '../../../components/ThemedView';
import { StyleSheet, View } from 'react-native';

type Props = & {

};

export function HeroActivity({  }: Props ) {
  return (
    <ThemedView type='center' style={styles.conteiner}>
      <View style={styles.banner}></View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    width: '100%',
    minHeight: 100,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border
  },
  banner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e6f5f4'
  },
});