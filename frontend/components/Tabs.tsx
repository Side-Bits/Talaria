import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";

type Tab = {
  label: string;
  onPress: () => void;
};

type Props = {
  data: Record<string, Tab>;
  scroll: boolean;
};

export function Tabs({ data, scroll }: Props) {
  return (
    <View style={styles.tabs}>
      <ThemedView type="between" style={styles.container}>
        {Object.entries(data).map(([key, tab]) => (
          <ThemedView type="center" key={key}>
            <ThemedText type="center" style={styles.text} onPress={tab.onPress}>
              {tab.label}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    width: "100%",
    padding: 4,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginVertical: 8,
  },
  container: {
    gap: 4,
  },
  text: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.light.onSurface,
    color: Colors.light.onPrimary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
});
