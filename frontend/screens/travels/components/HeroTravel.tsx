import { Colors } from '@/constants/Colors';
import { ThemedView } from '../../../components/ThemedView';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Background } from '@react-navigation/elements';

type Props = {
  image?: string;
};

export const travelImages: Record<string, any> = {
  "roma.jpg": require("../../../assets/images/temporal/roma.jpg"),
  "tailandia.jpg": require("../../../assets/images/temporal/tailandia.jpg"),
  "pedraforca.jpg": require("../../../assets/images/temporal/pedraforca.jpg"),
};

export function HeroTravel({ image }: Props) {
  const imageSource = image ? travelImages[image] : undefined;

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
    borderColor: Colors.light.border,
  },
  banner: {
    width: '100%',
    height: 138,
    backgroundColor: '#FCFCFC'
  },
  box: {
    padding: 8,
    maxHeight: 70
  },
  name: {
    fontSize: 16,
    marginBottom: 4
  },
  date: {
    color: Colors.light.textMuted
  }
});