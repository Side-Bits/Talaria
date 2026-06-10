import { Colors } from '@/constants/Colors'
import { useColorScheme } from 'react-native'

export function useThemeColors() {
  const scheme = useColorScheme() ?? 'light'
  return Colors[scheme]
}
