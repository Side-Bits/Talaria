import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";

type Tab = {
  label: string;
  onPress?: () => void;
};

type Props = {
  data: Record<string, Tab>;
  activeTab: string;
  onTabChange: (key: string) => void;
  scroll: boolean;
};

export function Tabs({ data, activeTab, onTabChange }: Props) {
  return (
    <View style={styles.tabs}>
      <ThemedView type="between" style={styles.container}>
        {Object.entries(data).map(([key, tab]) => (
          <ThemedView type="center" key={key}>
            <ThemedText
              type="center"
              style={[
                styles.text,
                activeTab === key ? styles.active : undefined,
              ]}
              onPress={() => {
                onTabChange(key);
                tab.onPress?.();
              }}
            >
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
    height: 44,
    maxHeight: 44,
    padding: 6,
    borderRadius: 16,
    backgroundColor: Colors.light.navigationBackground,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    gap: 4,
  },
  text: {
    flex: 1,
    width: "100%",
    padding: 8,
    borderRadius: 12,
    color: Colors.light.navigationInactive,
    textAlignVertical: "center",
  },
  active: {
    backgroundColor: Colors.light.navigationActive,
    color: Colors.light.onNavigationActive,
  },
});
