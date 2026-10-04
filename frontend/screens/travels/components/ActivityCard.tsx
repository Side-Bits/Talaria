import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { Activity } from "@/types/activity";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { formatActivityDates } from "@/scripts/DataScripts";
import { IconCategory } from "@/components/IconCategory";

type ActivityCardProps = {
  activity: Activity;
  mode: string;
};

export function ActivityCard({ activity, mode }: ActivityCardProps) {
  const router = useRouter();

  const handlePress = (() =>
    router.push({
      pathname: "/(app)/travels/[travel_id]/activities/[activity_id]",
      params: {
        travel_id: activity.id_travel,
        activity_id: String(activity.id),
      },
    })
  );

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
    >
      <ThemedView type="row">
        <View style={ styles.box1 }>
          <View style={styles.line} />
          <IconCategory size={40}/>
          <View style={styles.line} />
        </View>
        <ThemedView type="list" style={ styles.box2 }>
          <ThemedText
            type="default"
            style={{ color: Colors.light.textMuted }}
          >
            {formatActivityDates(activity.start_date, activity.end_date)}
          </ThemedText>
          <ThemedText
            type="default"
          >
            {activity.name}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
  },
  box1: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 16,
  },
  box2: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FBFBFB',
    borderRadius: 8,
    padding: 8,
  },
  line: {
    width: 1,
    height: 10,
    borderLeftWidth: 1.5,
    borderLeftColor: '#FBFBFB',
  }
});
