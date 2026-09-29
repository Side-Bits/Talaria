import { Pressable, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Travel } from "@/types/travel";
import { useRouter } from "expo-router";
import { formatTravelDates } from "@/scripts/DataScripts";

type TravelCardProps = {
  travel: Travel;
  onPress?: () => void;
  mode: string;
};

export function TravelCard({ travel, onPress, mode }: TravelCardProps) {
  const router = useRouter();
  const date = formatTravelDates(travel.start_date, travel.end_date);

  const handlePress = onPress ?? (() =>
    router.push({
      pathname: "/(app)/travels/[travel_id]/activities",
      params: {
        travel_id: String(travel.id),
        name: String(travel.name),
        mode: String(mode),
        date: String(date),
        description: String(travel.description),
      },
    })
  );

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}>
      <ThemedView type="list">
        <ThemedText
          type="default"
          style={styles.name}
        >
          {travel.name}
        </ThemedText>
        <ThemedText
          type="default"
        >
          {date}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#FBFBFB",
  },
  name: {
    fontSize: 16,
    marginBottom: 4
  },
});
