import { View } from 'react-native';
import { ThemedView } from './ThemedView';

type Props = & {
  size: number;
  gap: number;
};

export function Participants({ size, gap }: Props ) {
  return (
    <ThemedView type='row'>
        {Array.from({ length: 3 }).map((_, i) => (
            <View style={{ width: size, height: size, backgroundColor: '#ccc', borderRadius: 50, marginRight: gap }} />
        ))}
    </ThemedView>
  );
}