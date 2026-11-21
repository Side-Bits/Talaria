import { Colors } from '@/constants/Colors';
import { ThemedView } from '../../../components/ThemedView';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Travel } from '@/types/travel';
import { formatTravelDates } from '@/scripts/DataScripts';
import { useRouter } from 'expo-router';
import { getImageBase64 } from '@/scripts/ImageScripts';

type Props = {
  travel: Travel;
};

export function HeroTravel({ travel }: Props) {
  const router = useRouter();
  const date = formatTravelDates(travel.start_date, travel.end_date);

  const handlePress = (() => router.push({
    pathname: '/(app)/travels/[travel_id]/activities',
    params: {
      travel_id: travel.id,
      name: travel.name,
    }
  }));

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
    >
      {travel.image ? (
        <ImageBackground
          source={{ uri: getImageBase64(travel.image) }}
          style={styles.banner}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.banner}/>
      )}
      <ThemedView type='list' style={styles.box}>
        <ThemedText>{travel.name}</ThemedText>
        <ThemedText textMuted={true}>{date}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'flex-start',
    overflow: 'hidden',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background
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
  }
});