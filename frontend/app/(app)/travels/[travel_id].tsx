import { useLocalSearchParams } from 'expo-router';

import { TravelDetailsScreen } from '@/screens/travels/TravelDetailsScreen';
import { TravelEditorScreen } from '@/screens/travels/TravelEditorScreen';

export default function TabTravel() {
  const { mode } = useLocalSearchParams();
  const currentMode = (Array.isArray(mode) ? mode[0] : mode);

  return currentMode === 'C' || currentMode === 'M' ? <TravelEditorScreen /> : <TravelDetailsScreen />;
}
