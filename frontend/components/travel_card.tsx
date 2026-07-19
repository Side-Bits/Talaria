import { Pressable, StyleSheet } from "react-native"
import { ThemedView } from "./ThemedView"
import { ThemedText } from "./ThemedText"
import { Travel } from "@/types/travel"
import { useRouter } from "expo-router"
import { useThemeColors } from "@/hooks/useThemeColors"
import { formatTravelDates } from "@/scripts/DataScripts"
import { Colors } from "@/constants/Colors"

type TravelCardProps = {
  travel: Travel
  onPress?: () => void
}

export function TravelCard({ travel, onPress }: TravelCardProps) {
  const router = useRouter()
  const colors = useThemeColors()

  const handlePress = onPress ?? (() => router.push({
    pathname: '/(app)/travels/[travel_id]/activities',
    params: { travel_id: String(travel.id), name: String(travel.name) },
  }))

  const dateRange = formatTravelDates(travel.start_date, travel.end_date)

  return (
    <Pressable
      style={[styles.container, { borderColor: colors.border }]}
      onPress={handlePress}
    >
      <ThemedView type="list">
        <ThemedText type="default" style={styles.name}>
          {travel.name}
        </ThemedText>
        <ThemedText type="default" style={{ color: colors.gray }}>
          {dateRange}
        </ThemedText>
      </ThemedView>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    backgroundColor: Colors.light.template,
  },
  name: {
    fontWeight: '500',
  },
})
