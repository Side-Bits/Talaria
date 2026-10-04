import { useLocalSearchParams } from 'expo-router';

import { ActivityDetailsScreen } from '@/screens/travels/ActivityDetailsScreen';
import { ActivityEditorScreen } from '@/screens/travels/ActivityEditorScreen';
import { AppScreen } from '@/components/AppScreen';

export default function TabActivity() {
  const { mode } = useLocalSearchParams();
  const currentMode = (Array.isArray(mode) ? mode[0] : mode);

  return (
    <AppScreen>
      {currentMode === 'C' || currentMode === 'M' ? <ActivityEditorScreen /> : <ActivityDetailsScreen />}
    </AppScreen>
  );
}
