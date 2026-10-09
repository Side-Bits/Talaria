import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedView } from './ThemedView';
import { IconProfile } from './IconProfile';
import { useSession } from '@/contexts/authContext';

type Participant = {
  id_client: number;
  username: string;
  background?: string;
};

type Props = {
  editable: boolean;
  size: number;
  data: Record<string, Participant>;
};

export function Participants({ editable, size, data = {} }: Props) {
  // Add user sesion if exist
  const { user } = useSession();
  const participants = [
    ...(user ? [{ id_client: user.id, username: user.username }] : []),
    ...Object.values(data).filter((participant) => participant.id_client !== user?.id),
  ];

  return (
    <ThemedView type='row'>
      {participants.map((participant, i) => (
        <View
          key={participant.id_client}
          style={[styles.box, { marginLeft: i === 0 ? 0 : -size * 0.25}]}
        >
          <IconProfile
            size={size}
            letter={participant.username.charAt(0).toUpperCase()}
            background={participant.background}
          />
        </View>
      ))}
      {editable && (
        <Pressable
          style={[styles.box, { marginLeft: participants.length === 0 ? 0 : -size * 0.25}]}
        >
          <IconProfile
            size={size}
            letter={'+'}
            background='#FFF'
          />
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
