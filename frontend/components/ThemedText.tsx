import { StyleSheet, Text, TextProps } from 'react-native';
import { Colors } from '@/constants/Colors';

type Props = TextProps & {
  type?: 'default' | 'bold' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'small';
};

export function ThemedText({ type = 'default', style, ...rest }: Props) {
  return (
    <Text
      style={[
        type === 'default' ? styles.default : undefined,
        type === 'bold' ? styles.bold : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'small' ? styles.small : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14
  },
  bold: {
    fontSize: 14,
    fontWeight: '600'
  },
  title: {
    fontSize: 22,
    color: Colors.light.text,
    fontWeight: 500
  },
  subtitle: {
    fontSize: 16,
  },
  defaultSemiBold: {
    fontSize: 10,
    fontWeight: '600'
  },
  link: {
    color: Colors.light.tint,
    fontSize: 14,
    cursor: 'pointer'
  },
  small: {
    fontSize: 11
  }
});
