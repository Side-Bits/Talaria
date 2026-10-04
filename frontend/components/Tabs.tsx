import { useState } from "react";
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

export function Tabs({ data }: Props) {
  const [activeTab, setActiveTab] = useState(Object.keys(data)[0]);

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
                setActiveTab(key);
                tab.onPress();
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
    backgroundColor: "#F5F5F7",
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
    color: "#97969D",
    textAlignVertical: "center",
  },
  active: {
    backgroundColor: Colors.light.onBackground,
    color: Colors.light.surface,
  },
});
