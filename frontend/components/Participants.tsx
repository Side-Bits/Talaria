import { View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { IconProfile } from './IconProfile';

type Participant = {
  id_client: number;
  username: string;
  background?: string;
};

type Props = {
  size: number;
  data: Record<string, Participant>;
};

export function Participants({ size, data = {} }: Props) {
  const participants = Object.values(data);

  return (
    <ThemedView type='row'>
      {participants.map((participant, i) => (
        <View
          key={participant.id_client}
          style={{
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: i === 0 ? 0 : -size * 0.25,
          }}
        >
          <IconProfile
            size={size}
            letter={participant.username.charAt(0).toUpperCase()}
            background={participant.background}
          />
        </View>
      ))}
    </ThemedView>
  );
}
