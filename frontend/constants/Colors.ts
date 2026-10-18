export const Colors = {
  light: {
    // Brand
    primary: '#81AC81',
    onPrimary: '#FFF',
    secondary: '#485348',
    onSecondary: '#FFF',
    tertiary: '#A0A89F',
    onTertiary: '#FFF',

    // Neutrals & Surfaces
    textMuted: '#97969D',
    background: '#FFF',
    onBackground: '#2F2F2F',
    surface: '#FFF',
    onSurface: '#2F2F2F',
    border: '#F5F5F7',

    // Navigation
    navigationBackground: '#F3F3F5',
    navigationActive: '#2F2F2F',
    onNavigationActive: '#FFF',
    navigationInactive: '#97969D',

    // Icons
    iconBackground: '#F7F7F7',
    onIcon: '#D3D3D3',

    // Status / Feedback
    success: '#58B87B',
    onSuccess: '#FFF',
    error: '#CE645C',
    onError: '#FFF',
    warning: '#E4A154',
    onWarning: '#FFF',
    info: '#7DA6FF',
    onInfo: '#FFF',
  },
  dark: {
    // Brand
    primary: '#8DB88D',
    onPrimary: '#14201A',
    secondary: '#9AA59A',
    onSecondary: '#171A17',
    tertiary: '#6B756B',
    onTertiary: '#F2F2F2',

    // Neutrals & Surfaces
    textMuted: '#9A9AA1',
    background: '#121412',
    onBackground: '#EDEDED',
    surface: '#1B1E1B',
    onSurface: '#EDEDED',
    border: '#2A2D2A',

    // Navigation
    navigationBackground: '#1B1E1B',
    navigationActive: '#EDEDED',
    onNavigationActive: '#121412',
    navigationInactive: '#7E857E',

    // Icons
    iconBackground: '#252825',
    onIcon: '#6E736E',

    // Status / Feedback
    success: '#6BCB8E',
    onSuccess: '#0F1F15',
    error: '#E07A72',
    onError: '#2A0F0D',
    warning: '#EBB06A',
    onWarning: '#2A0F0D',
    info: '#8FB3FF',
    onInfo: '#2A0F0D',
  }
} as const;

export type ThemeColors = typeof Colors.light;
