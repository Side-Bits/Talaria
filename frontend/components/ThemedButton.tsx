import { Colors } from "@/constants/Colors";
import { ReactNode, useState } from "react";
import {
  ActivityIndicator,
  ColorValue,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  View,
} from "react-native";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "soft"
  | "destructive"
  | "outline";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonIconProps = { size: number; color: ColorValue };

type ThemedButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  radius?: number;
  width?: ViewStyle["width"];
  leadingIcon?: (props: ButtonIconProps) => ReactNode;
  trailingIcon?: (props: ButtonIconProps) => ReactNode;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function ThemedButton({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  radius = 8,
  width = "100%",
  leadingIcon,
  trailingIcon,
  buttonStyle,
  textStyle,
  disabled,
  style,
  onFocus,
  onBlur,
  ...others
}: ThemedButtonProps) {
  const [focused, setFocused] = useState(false);
  const isDisabled = Boolean(disabled || loading);
  const labelStyle = [styles.text, textVariants[variant], textStyle];
  const labelColor = StyleSheet.flatten<TextStyle>(labelStyle).color ?? Colors.light.onPrimary;
  const iconProps = { size: size === "lg" ? 20 : 16, color: labelColor };

  return (
    <Pressable
      {...others}
      disabled={isDisabled}
      onFocus={event => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={event => {
        setFocused(false);
        onBlur?.(event);
      }}
      style={pressState => [
        styles.button,
        buttonVariants[variant],
        buttonSizes[size],
        { borderRadius: radius, width },
        buttonStyle,
        typeof style === "function" ? style(pressState) : style,
        focused && !isDisabled && styles.focused,
        pressState.pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={labelColor} />
      ) : (
        <View style={styles.content} pointerEvents="none">
          {leadingIcon && (
            <View>
              {leadingIcon(iconProps)}
            </View>
          )}
          <Text style={labelStyle}>{title}</Text>
          {trailingIcon && (
            <View>
              {trailingIcon(iconProps)}
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
  },
  focused: {
    borderColor: Colors.light.onSurface,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    maxWidth: "100%",
  },
  text: {
    fontSize: 14,
    flexShrink: 1,
    textAlign: "center",
  },
});

const buttonSizes = StyleSheet.create({
  sm: {
    height: 32,
    paddingHorizontal: 12,
  },
  md: {
    height: 40,
    paddingHorizontal: 16,
  },
  lg: {
    height: 48,
    paddingHorizontal: 20,
  },
});

const buttonVariants = StyleSheet.create({
  primary: {
    backgroundColor: Colors.light.primary,
  },
  secondary: {
    backgroundColor: Colors.light.secondary,
  },
  soft: {
    backgroundColor: `${Colors.light.primary}1A`,
  },
  destructive: {
    backgroundColor: Colors.light.error,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: Colors.light.primary,
  },
});

const textVariants = StyleSheet.create({
  primary: {
    color: Colors.light.onPrimary,
  },
  secondary: {
    color: Colors.light.onSecondary,
  },
  soft: {
    color: Colors.light.onSurface,
  },
  destructive: {
    color: Colors.light.onError,
  },
  outline: {
    color: Colors.light.onSurface,
  },
});
