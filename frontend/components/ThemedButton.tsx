import { Colors } from "@/constants/Colors";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
} from "react-native";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

type ThemedButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export function ThemedButton({
  title,
  loading = false,
  buttonStyle,
  textStyle,
  disabled,
  ...others
}: ThemedButtonProps) {
  return (
    <Pressable
      {...others}
      disabled={disabled || loading}
      style={[
        styles.button,
        (disabled || loading) && styles.disabled,
        buttonStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Colors.light.onPrimary} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
