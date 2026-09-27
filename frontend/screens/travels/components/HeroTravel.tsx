import { Colors } from '@/constants/Colors';
import { ThemedView } from '../../../components/ThemedView';
import { StyleSheet } from 'react-native';

type Props = & {

};

export function HeroTravel({  }: Props ) {
  return (
    <ThemedView type='center' style={styles.conteiner}>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    width: '100%',
    minHeight: 200,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border
  }
});