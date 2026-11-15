import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';

type Props = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  onPress: () => void;
};

export function ErrorCard({ title, description, image, onPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} />
        </View>
        <ThemedText type='title' style={{ width: '100%', textAlign: 'center' }}>{title}</ThemedText>
        <ThemedText type='subtitle' style={{ width: '100%', textAlign: 'center' }}>{description}</ThemedText>
        <ThemedButton
          title="Try again"
          onPress={onPress}
          width='auto'
          size='sm'
          buttonStyle={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
  imageContainer: {
    maxHeight: 190,
  },
  image: {
    width: 170,
    height: 190,
  },
  button: {
    marginTop: 8,
  },
});
