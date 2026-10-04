import { useLocalSearchParams } from 'expo-router';

import { TravelDetailsScreen } from '@/screens/travels/TravelDetailsScreen';
import { TravelEditorScreen } from '@/screens/travels/TravelEditorScreen';
import { AppScreen } from '@/components/AppScreen';

export default function TabTravel() {
  const { mode } = useLocalSearchParams();
  const currentMode = (Array.isArray(mode) ? mode[0] : mode);

  return (
    <AppScreen>
      {currentMode === 'C' || currentMode === 'M' ? <TravelEditorScreen /> : <TravelDetailsScreen />}
    </AppScreen>
  );
}
