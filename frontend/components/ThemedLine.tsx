import { Colors } from '@/constants/Colors';
import { View, StyleSheet, ViewProps } from 'react-native';

type Props = ViewProps & {
  type: 'all' | 'transparent';
  margin?: number;
};

export function ThemedLine({ type, margin = 16, style, ...rest }: Props) {
  return (
    <View
      style={[
        type === 'all' && styles.all,
        type === 'transparent' && styles.transparent,
        { margin: margin },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  all: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.light.border,
  },
  transparent: {
    height: 1,
  }
});
