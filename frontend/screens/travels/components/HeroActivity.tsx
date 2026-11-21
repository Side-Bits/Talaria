import { Colors } from '@/constants/Colors';
import { ThemedView } from '../../../components/ThemedView';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { getImageBase64 } from '@/scripts/ImageScripts';

type Props = {
  image?: string;
};

export function HeroActivity({ image }: Props) {
  return (
    <ThemedView type='left' style={styles.conteiner}>
      {image ? (
        <ImageBackground
          source={{ uri: getImageBase64(image) }}
          style={styles.banner}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.banner}></View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    overflow: 'hidden',
    width: '100%',
    height: 138,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#FCFCFC'
  },
  banner: {
    width: '100%',
    height: 138,
    backgroundColor: '#fCfCfC',
  },
});