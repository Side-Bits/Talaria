import { Colors } from '@/constants/Colors';
import { ThemedView } from '../../../components/ThemedView';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Travel } from '@/types/travel';
import { formatTravelDates } from '@/scripts/DataScripts';
import { useRouter } from 'expo-router';

type Props = {
  travel: Travel;
};

export const travelImages: Record<string, any> = {
  "roma.jpg": require("../../../assets/images/temporal/roma.jpg"),
  "tailandia.jpg": require("../../../assets/images/temporal/tailandia.jpg"),
  "pedraforca.jpg": require("../../../assets/images/temporal/pedraforca.jpg"),
};

export function HeroTravel({ travel }: Props) {
  const router = useRouter();
  const imageSource = travel.image ? travelImages[travel.image] : undefined;
  const date = formatTravelDates(travel.start_date, travel.end_date);

  const handlePress = (() => router.push({
    pathname: '/(app)/travels/[travel_id]/activities',
    params: {
      travel_id: String(travel.id),
      name: travel.name,
      date,
      description: travel.description ?? '',
      image: travel.image ?? '',
    }
  }));

  return (
    <Pressable
      style={styles.conteiner}
      onPress={handlePress}
    >
      {imageSource ? (
        <ImageBackground
          source={imageSource}
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
  conteiner: {
    width: '100%',
    alignItems: 'flex-start',
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
  }
});