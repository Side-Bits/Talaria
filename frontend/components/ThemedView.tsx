import { View, StyleSheet, ViewProps } from 'react-native';

type Props = ViewProps & {
  type: 'center' | 'left' | 'right' | 'align' | 'column' | 'list' | 'container' | 'box' | 'between' | 'middle' | 'row';
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
        type === 'list' ? styles.list : undefined,
        type === 'container' ? styles.container : undefined,
        type === 'box' ? styles.box : undefined,
        type === 'between' ? styles.between : undefined,
        type === 'middle' ? styles.middle : undefined,
        type === 'row' ? styles.row : undefined,
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
    width: '100%',
    alignItems: 'flex-start',
  },
  right: {
    width: '100%',
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
  list: {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  box: {
    paddingVertical: 8,
  },
  between: {
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
  },
  middle: {
    flex: 1,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

