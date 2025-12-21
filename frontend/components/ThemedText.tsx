import { StyleSheet, Text, TextProps} from 'react-native';
import { Colors } from '@/constants/Colors';

type Props = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ type = 'default', style, ...rest }: Props) {
  return (
    <Text
      style={[
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  subtitle: {
    fontSize: 16,
  },
  defaultSemiBold: {
    fontSize: 10,
    fontWeight: '600',
  },
  link: {
    color: Colors.light.tint,
    fontSize: 14,
    cursor: 'pointer'
  },
});
