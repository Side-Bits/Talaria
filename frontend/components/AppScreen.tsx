import { ReactNode } from "react";
import { ScrollView } from "react-native";

type Props = {
  children: ReactNode;
};

export function AppScreen({ children }: Props) {
  return (
    <ScrollView
      style={{ flex: 1, width: "100%", maxWidth: 500, alignSelf: "center" }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: 8,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
    >
      {children}
    </ScrollView>
  );
}
