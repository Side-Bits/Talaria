import { ImageBackground, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { globalStyles } from '@/constants/Global';

export function ImageGallery() {
  return (
    <View style={styles.imageGallery}>
      <ImageBackground
        source={require('../../../assets/images/temporal/tailandia.jpg')}
        style={[styles.image, styles.imageTop, globalStyles.shadow]}
        imageStyle={styles.imageFill}
        resizeMode="cover"
      />
      <ImageBackground
        source={require('../../../assets/images/temporal/argentina.jpg')}
        style={[styles.image, styles.imageUpperRight, globalStyles.shadow]}
        imageStyle={styles.imageFill}
        resizeMode="cover"
      />
      <ImageBackground
        source={require('../../../assets/images/temporal/japan.jpg')}
        style={[styles.image, styles.imageRight, globalStyles.shadow]}
        imageStyle={styles.imageFill}
        resizeMode="cover"
      />
      <ImageBackground
        source={require('../../../assets/images/temporal/paris.jpg')}
        style={[styles.image, styles.imageLowerRight, globalStyles.shadow]}
        imageStyle={styles.imageFill}
        resizeMode="cover"
      />
      <ImageBackground
        source={require('../../../assets/images/temporal/roma.jpg')}
        style={[styles.image, styles.imageBottom, globalStyles.shadow]}
        imageStyle={styles.imageFill}
        resizeMode="cover"
      />
      <ImageBackground
        source={require('../../../assets/images/temporal/novayork.jpg')}
        style={[styles.image, styles.imageLowerLeft, globalStyles.shadow]}
        imageStyle={styles.imageFill}
        resizeMode="cover"
      />
      <ImageBackground
        source={require('../../../assets/images/temporal/barcelona.jpg')}
        style={[styles.image, styles.imageLeft, globalStyles.shadow]}
        imageStyle={styles.imageFill}
        resizeMode="cover"
      />
      <ImageBackground
        source={require('../../../assets/images/temporal/finlandia.jpg')}
        style={[styles.image, styles.imageUpperLeft, globalStyles.shadow]}
        imageStyle={styles.imageFill}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageGallery: {
    marginVertical: 16,
    width: '80%',
    maxWidth: 360,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  image: {
    position: 'absolute',
    width: '24%',
    height: '24%',
    borderRadius: 4,
    backgroundColor: Colors.light.iconBackground,
    overflow: 'hidden',
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
  imageTop: {
    top: '0%',
    left: '38%',
    transform: [{ rotate: '-4deg' }],
  },
  imageUpperRight: {
    top: '11%',
    left: '65%',
    transform: [{ rotate: '6deg' }],
  },
  imageRight: {
    top: '38%',
    left: '76%',
    transform: [{ rotate: '2deg' }],
  },
  imageLowerRight: {
    top: '65%',
    left: '65%',
    transform: [{ rotate: '-3deg' }],
  },
  imageBottom: {
    top: '76%',
    left: '38%',
    transform: [{ rotate: '2deg' }],
  },
  imageLowerLeft: {
    top: '65%',
    left: '11%',
    transform: [{ rotate: '6deg' }],
  },
  imageLeft: {
    top: '38%',
    left: '0%',
    transform: [{ rotate: '-4deg' }],
  },
  imageUpperLeft: {
    top: '11%',
    left: '11%',
    transform: [{ rotate: '6deg' }],
  },
});
