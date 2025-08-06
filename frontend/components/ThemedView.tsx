import { View, StyleSheet, ViewProps } from 'react-native';

type Props = ViewProps & {
  type: 'center' | 'left' | 'right' | 'align' | 'column' | 'container' | 'box';
};

export function ThemedView({ type, style, ...rest }: Props) {
  return (
    <View
      style={[
        type === 'center' ? styles.center : undefined,
        type === 'left' ? styles.left : undefined,
        type === 'right' ? styles.right : undefined,
        type === 'align' ? styles.align : undefined,
        type === 'column' ? styles.column : undefined,
        type === 'container' ? styles.container : undefined,
        type === 'box' ? styles.box : undefined,
        style
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  align: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  box: {
    paddingVertical: 8,
  }
});

