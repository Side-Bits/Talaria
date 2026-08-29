import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useThemeColors } from '@/hooks/useThemeColors';

export type FormInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'date'
  | 'number'
  | 'tel';

export type FormInputLabelMode = 'static' | 'floating' | 'placeholder';
export type FormInputIconName = React.ComponentProps<typeof Ionicons>['name'];

export type FormInputAction = {
  icon: FormInputIconName;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  disabled?: boolean;
  testID?: string;
};

export type FormInputProps = Omit<
  TextInputProps,
  'editable' | 'multiline' | 'readOnly' | 'secureTextEntry' | 'style'
> & {
  type?: FormInputType;
  label: string;
  labelMode?: FormInputLabelMode;
  error?: string | null;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  leadingIcon?: FormInputIconName;
  leadingAction?: FormInputAction;
  trailingIcon?: FormInputIconName;
  trailingAction?: FormInputAction;
  showPasswordToggle?: boolean;
  clearable?: boolean;
  multiline?: boolean;
  minLines?: number;
  containerStyle?: StyleProp<ViewStyle>;
  controlStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

type ActionButtonProps = FormInputAction & {
  color: string;
  disabledByInput: boolean;
};

function ActionButton({
  icon,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  disabled,
  testID,
  color,
  disabledByInput,
}: ActionButtonProps) {
  const isDisabled = disabled || disabledByInput;

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
      testID={testID}
    >
      <Ionicons name={icon} size={20} color={color} />
    </Pressable>
  );
}

function getTypeDefaults(type: FormInputType): Partial<TextInputProps> {
  switch (type) {
    case 'email':
      return {
        autoCapitalize: 'none',
        autoCorrect: false,
        autoComplete: 'email',
        inputMode: 'email',
        keyboardType: 'email-address',
      };
    case 'password':
      return {
        autoCapitalize: 'none',
        autoCorrect: false,
        spellCheck: false,
      };
    case 'number':
      return {
        inputMode: 'decimal',
        keyboardType: 'decimal-pad',
      };
    case 'tel':
      return {
        autoComplete: 'tel',
        inputMode: 'tel',
        keyboardType: 'phone-pad',
      };
    case 'date':
      return {
        autoCapitalize: 'none',
        autoCorrect: false,
      };
    default:
      return {
        inputMode: 'text',
      };
  }
}

export const FormInput = forwardRef<TextInput, FormInputProps>(function FormInput(
  {
    type = 'text',
    label,
    labelMode = 'static',
    error,
    helperText,
    required = false,
    disabled = false,
    readOnly = false,
    leadingIcon,
    leadingAction,
    trailingIcon,
    trailingAction,
    showPasswordToggle,
    clearable = false,
    multiline = false,
    minLines = 3,
    containerStyle,
    controlStyle,
    inputStyle,
    value,
    defaultValue,
    placeholder,
    placeholderTextColor,
    accessibilityLabel,
    numberOfLines,
    onBlur,
    onChangeText,
    onFocus,
    ...rest
  },
  forwardedRef
) {
  const colors = useThemeColors();
  const inputRef = useRef<TextInput | null>(null);
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');

  const displayedValue = value ?? uncontrolledValue;
  const hasValue = displayedValue.length > 0;
  const hasError = Boolean(error);
  const isPassword = type === 'password';
  const hasPasswordToggle = isPassword && (showPasswordToggle ?? true);
  const isFloating = labelMode === 'floating';
  const isLabelRaised = isFloating && (focused || hasValue);
  const hasLeadingAdornment = Boolean(leadingAction || leadingIcon);
  const labelAnimation = useRef(new Animated.Value(isLabelRaised ? 1 : 0)).current;
  const borderColor = hasError
    ? colors.error
    : focused
      ? colors.primary
      : colors.border;
  const accentColor = hasError ? colors.error : focused ? colors.primary : colors.textMuted;
  const message = error || helperText;
  const resolvedPlaceholder =
    labelMode === 'placeholder'
      ? placeholder ?? label
      : isFloating && !isLabelRaised
        ? undefined
        : placeholder;
  const multilineMinHeight = multiline ? Math.max(96, minLines * 24 + 20) : undefined;

  useEffect(() => {
    Animated.timing(labelAnimation, {
      toValue: isLabelRaised ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isLabelRaised, labelAnimation]);

  const assignRef = (node: TextInput | null) => {
    inputRef.current = node;

    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  const handleChangeText = (text: string) => {
    if (value === undefined) {
      setUncontrolledValue(text);
    }

    onChangeText?.(text);
  };

  const handleClear = () => {
    inputRef.current?.clear();
    setUncontrolledValue('');
    onChangeText?.('');
    inputRef.current?.focus();
  };

  const renderedLabel = (
    <Text
      style={[
        styles.label,
        { color: hasError ? colors.error : focused ? colors.primary : colors.textMuted },
        required && styles.requiredLabel,
      ]}
    >
      {label}
      {required ? ' *' : ''}
    </Text>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {labelMode === 'static' && renderedLabel}

      <View
        style={[
          styles.control,
          multiline && styles.multilineControl,
          { backgroundColor: colors.background, borderColor, minHeight: multilineMinHeight },
          readOnly && styles.readOnly,
          disabled && styles.disabled,
          controlStyle,
        ]}
      >
        {isFloating && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.floatingLabel,
              {
                backgroundColor: colors.background,
                left: hasLeadingAdornment ? 50 : 10,
                transform: [
                  {
                    translateX: labelAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, hasLeadingAdornment ? -40 : 0],
                    }),
                  },
                  {
                    translateY: labelAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [24, 0],
                    }),
                  },
                  {
                    scale: labelAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.15, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {renderedLabel}
          </Animated.View>
        )}

        {leadingAction ? (
          <ActionButton
            {...leadingAction}
            color={accentColor}
            disabledByInput={disabled}
          />
        ) : leadingIcon ? (
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.icon}>
            <Ionicons name={leadingIcon} size={20} color={accentColor} />
          </View>
        ) : null}

        <TextInput
          {...getTypeDefaults(type)}
          {...rest}
          accessibilityLabel={accessibilityLabel ?? `${label}${required ? ', required' : ''}`}
          accessibilityState={{ disabled }}
          defaultValue={defaultValue}
          editable={!disabled && !readOnly}
          multiline={multiline}
          numberOfLines={numberOfLines ?? (multiline ? minLines : undefined)}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onChangeText={handleChangeText}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          placeholder={resolvedPlaceholder}
          placeholderTextColor={placeholderTextColor ?? colors.textMuted}
          readOnly={readOnly}
          ref={assignRef}
          secureTextEntry={isPassword && !passwordVisible}
          style={[
            styles.input,
            { color: colors.onSurface },
            isFloating && styles.floatingInput,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          value={value}
        />

        {clearable && hasValue && !readOnly && (
          <ActionButton
            accessibilityLabel={`Clear ${label}`}
            color={accentColor}
            disabledByInput={disabled}
            icon="close-circle-outline"
            onPress={handleClear}
          />
        )}

        {trailingAction ? (
          <ActionButton
            {...trailingAction}
            color={accentColor}
            disabledByInput={disabled}
          />
        ) : trailingIcon ? (
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.icon}>
            <Ionicons name={trailingIcon} size={20} color={accentColor} />
          </View>
        ) : null}

        {hasPasswordToggle && (
          <ActionButton
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
            color={accentColor}
            disabledByInput={disabled}
            icon={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
            onPress={() => setPasswordVisible((visible) => !visible)}
          />
        )}
      </View>

      {message && (
        <Text
          accessibilityLiveRegion={hasError ? 'polite' : 'none'}
          style={[styles.message, { color: hasError ? colors.error : colors.textMuted }]}
        >
          {message}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  requiredLabel: {
    fontWeight: '500',
  },
  control: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  multilineControl: {
    alignItems: 'flex-start',
  },
  readOnly: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 4,
    paddingVertical: 10,
    fontSize: 16,
  },
  floatingInput: {
    paddingTop: 16,
    paddingBottom: 4,
  },
  multilineInput: {
    minHeight: 76,
    textAlignVertical: 'top',
  },
  floatingLabel: {
    position: 'absolute',
    top: -9,
    zIndex: 1,
    paddingHorizontal: 3,
  },
  icon: {
    width: 32,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    width: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPressed: {
    opacity: 0.55,
  },
  message: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
  },
});
