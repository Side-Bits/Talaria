import { Colors } from '@/constants/Colors';
import { ThemedView } from '../../../components/ThemedView';
import { ImageBackground, StyleSheet, View } from 'react-native';

type Props = {
  image?: string;
};

export const activityImages: Record<string, any> = {
  "roma.jpg": require("../../../assets/images/temporal/roma.jpg"),
  "tailandia.jpg": require("../../../assets/images/temporal/tailandia.jpg"),
  "pedraforca.jpg": require("../../../assets/images/temporal/pedraforca.jpg"),
};

export function HeroActivity({ image }: Props) {
  const imageSource = image ? activityImages[image] : undefined;

  return (
    <ThemedView type='left' style={styles.conteiner}>
      {imageSource ? (
        <ImageBackground
          source={imageSource}
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