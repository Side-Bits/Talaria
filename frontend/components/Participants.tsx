import { View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

type Props = & {
  size: number;
};

export function Participants({ size }: Props ) {
  return (
    <ThemedView type='row'>
      {Array.from({ length: 3 }).map((_, i) => (
        <View
          style={{
            width: size,
            height: size,
            backgroundColor: '#000',
            borderRadius: 50,
            borderWidth: 1.5,
            borderColor: '#FFF',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: i === 0 ? 0 : -size * 0.25,
          }}
        >
          <ThemedText style={{ color: '#FFF', fontSize: size * 0.5 }}>M</ThemedText>
        </View>
      ))}
    </ThemedView>
  );
}
