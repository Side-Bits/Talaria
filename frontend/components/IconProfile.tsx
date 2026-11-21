import { View, StyleSheet, ImageBackground } from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { getImageBase64 } from '@/scripts/ImageScripts';

type Props = {
  letter: string;
  size: number;
  photo?: string;
};

export function IconProfile({ size = 25, letter, photo }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor: Colors.light.iconBackground, overflow: 'hidden' }]}>
      {photo ? (
        <ImageBackground
          source={{ uri: getImageBase64(photo) }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <ThemedText
          type='title'
          selectable={false}
          style={{ color: Colors.light.onIcon, fontSize: size * 0.5, paddingBottom: size * 0.05 }}
        >
          {letter}
        </ThemedText>
      )}
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
