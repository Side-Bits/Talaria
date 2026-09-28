import { Colors } from '@/constants/Colors';
import { ThemedView } from '../../../components/ThemedView';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

type Props = & {

};

export function HeroTravel({  }: Props ) {
  return (
    <ThemedView type='left' style={styles.conteiner}>
      <View style={styles.banner}></View>
      <ThemedView type='list' style={styles.box}>
        <ThemedText style={styles.name}>[name]</ThemedText>
         <ThemedText style={styles.date}>[date]</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    overflow: 'hidden',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border
  },
  banner: {
    width: '100%',
    height: 138,
    backgroundColor: '#ebf5e6'
  },
  box: {
    padding: 8,
    maxHeight: 60
  },
  name: {
    fontSize: 16,
    marginBottom: 4
  },
  date: {
    color: Colors.light.textMuted
  }
});