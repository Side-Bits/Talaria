import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type Props = {
  size: number;
};

export function IconCategory({ size = 25 }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Ionicons
        name="chevron-forward-outline"
        size={size * 0.60}
        color={Colors.light.onBackground}
        style={styles.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 50,
  },
  icon: {
    textAlign: 'center',
    color: Colors.light.onBackground,
  },
});
