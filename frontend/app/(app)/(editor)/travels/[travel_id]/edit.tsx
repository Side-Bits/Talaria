import { TravelEditorScreen } from '@/screens/travels/TravelEditorScreen';
import { useLocalSearchParams } from 'expo-router';

export default function EditTravel() {
  const { travel_id } = useLocalSearchParams();
  return  <TravelEditorScreen travel_id={travel_id as string} />;
}
