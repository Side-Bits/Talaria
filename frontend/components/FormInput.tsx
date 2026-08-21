import { useThemeColors } from "@/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { useState, type ComponentType, type ReactElement } from "react";
import {
  StyleProp,
  TextStyle,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  type TextInputProps,
  TextInput,
  Pressable,
  Platform,
} from "react-native";

export type FormInputType = "text" | "email" | "password";
export type FormInputLabelMode = "static" | "floating" | "placeholder";
export type FormInputIconName = React.ComponentProps<typeof Ionicons>["name"];
export type FormInputIconProps = { color: string; size: number };
export type FormInputIcon =
  FormInputIconName | ReactElement | ComponentType<FormInputIconProps>;

export type FormInputAction = {
  icon: FormInputIcon;
  onPress: () => void;
  disabled?: boolean;
  color: string;
};

type FormInputProps = {
  type?: FormInputType;
  label: string;
  labelMode?: FormInputLabelMode;
  error?: string | null;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  controlStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leadingIcon?: FormInputIcon;
  leadingAction?: FormInputAction;
  trailingIcon?: FormInputIcon;
  trailingAction?: FormInputAction;
} & TextInputProps;

function renderIcon(icon: FormInputIcon, color: string) {
  if (typeof icon === "string") {
    return <Ionicons name={icon} size={20} color={color} />;
  }

  if (typeof icon === "function") {
    const Icon = icon;
    return <Icon color={color} size={20} />;
  }

  return icon;
}

function ActionButton({ icon, onPress, disabled, color }: FormInputAction) {
  const preserveWebFocus = Platform.select({
    web: {
      onMouseDown: (event: { preventDefault: () => void }) =>
        event.preventDefault(),
    },
  });

  return (
    <Pressable
      {...preserveWebFocus}
      disabled={disabled}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
    >
      {renderIcon(icon, color)}
    </Pressable>
  );
}

export function FormInput({
  containerStyle,
  controlStyle,
  clearable = true,
  disabled = false,
  error,
  inputStyle,
  label,
  labelMode = "static",
  leadingAction,
  leadingIcon,
  placeholder,
  required,
  trailingAction,
  trailingIcon,
  type = "text",
  value,
  onBlur,
  onChangeText,
  onFocus,
  ...inputProps
}: FormInputProps) {
  const colors = useThemeColors();
  const [focused, setFocused] = useState(false);

  const isPassword = type === "password";
  const [passwordVisible, setPasswordVisible] = useState(false);

  const hasError = Boolean(error);
  const borderColor = hasError
    ? colors.error
    : focused
      ? colors.primary
      : colors.border;
  const accentColor = hasError
    ? colors.error
    : focused
      ? colors.primary
      : colors.textMuted;
  const renderedLabel = (
    <Text
      style={[
        styles.label,
        {
          color: hasError
            ? colors.error
            : focused
              ? colors.primary
              : colors.textMuted,
        },
        required && styles.requiredLabel,
      ]}
    >
      {label}
      {required ? " *" : ""}
    </Text>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {labelMode === "static" && renderedLabel}

      <View style={[styles.inputContainer, { borderColor }, controlStyle]}>
        {leadingAction ? (
          <ActionButton
            {...leadingAction}
            color={accentColor}
            disabled={disabled}
          />
        ) : leadingIcon ? (
          <View style={styles.icon}>
            {renderIcon(leadingIcon, accentColor)}
          </View>
        ) : null}

        <TextInput
          {...inputProps}
          placeholder={placeholder}
          secureTextEntry={isPassword && !passwordVisible}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, { color: colors.onSurface }, inputStyle]}
        />

        {trailingAction ? (
          <ActionButton
            {...trailingAction}
            color={accentColor}
            disabled={disabled}
          />
        ) : trailingIcon ? (
          <View style={styles.icon}>
            {renderIcon(trailingIcon, accentColor)}
          </View>
        ) : null}

        {clearable && Boolean(value) && (
          <ActionButton
            color={accentColor}
            disabled={disabled}
            icon="close"
            onPress={() => onChangeText?.("")}
          />
        )}

        {isPassword && (
          <ActionButton
            color={accentColor}
            disabled={disabled}
            icon={passwordVisible ? "eye-off-outline" : "eye-outline"}
            onPress={() => setPasswordVisible((visible) => !visible)}
          />
        )}
      </View>

      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  requiredLabel: {
    fontWeight: "700",
  },
  inputContainer: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 4,
    paddingVertical: 10,
    fontSize: 16,
    outlineStyle: "solid",
    outlineWidth: 0,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
  },
  icon: {
    width: 32,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  action: {
    width: 40,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  actionPressed: {
    opacity: 0.6,
  },
});
