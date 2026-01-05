import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';

export function ThemedBlur({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <BlurView intensity={30} tint="light" style={[styles.glass, style]}>
      <LinearGradient colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.02)']} start={[0, 0]} end={[1, 1]} />
      <View style={styles.content}>{children}</View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
});