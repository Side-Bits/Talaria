import { Pressable, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Travel } from "@/types/travel";
import { useRouter } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";
import { formatTravelDates } from "@/scripts/DataScripts";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type TravelCardProps = {
  travel: Travel;
  onPress?: () => void;
  mode: string;
};

export function TravelCard({ travel, onPress, mode }: TravelCardProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const dateRange = formatTravelDates(travel.start_date, travel.end_date);

  const handlePress = onPress ?? (() =>
    router.push({
      pathname: "/(app)/travels/[travel_id]/activities",
      params: {
        travel_id: String(travel.id),
        name: String(travel.name),
        mode: String(mode),
      },
    })
  );

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <ThemedView type="list" style={styles.content}>
        <ThemedText type="default" style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {travel.name}
        </ThemedText>
        <ThemedText type="default" style={{ color: colors.textMuted }}>
          {dateRange}
        </ThemedText>
      </ThemedView>
      <ThemedView type="row" style={styles.iconContainer}>
        <Ionicons
          name="chevron-forward-outline"
          size={18}
          color={Colors.light.textMuted}
        />
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
    borderWidth: 1,
    marginBottom: 8,
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
  },
  name: {
    fontWeight: "500",
  },
  content: {
    minWidth: 0,
    flexShrink: 1,
  },
  iconContainer: {
    flexShrink: 0,
    marginLeft: 8,
  },
});
