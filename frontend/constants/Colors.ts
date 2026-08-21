export const Colors = {
  light: {
    // Brand
    primary: '#F6511E',
    onPrimary: '#FFFFFF',
    primaryContainer: '#FFEADF',
    onPrimaryContainer: '#8A2500',
    secondary: '#1E3A8A',
    onSecondary: '#FFFFFF',
    tertiary: '#0D9488',

    // Neutrals & Surfaces
    background: '#F8FAFC',
    onBackground: '#0F172A',
    surface: '#FFFFFF',
    onSurface: '#0F172A',
    textMuted: '#64748B',
    border: '#E2E8F0',
    borderFocus: '#F6511E',

    // Status / Feedback
    success: '#16A34A',
    onSuccess: '#FFFFFF',
    error: '#B42318',
    onError: '#FFFFFF',
    warning: '#D97706',
    info: '#2563EB',
  },
  dark: {
    primary: '#FF8A65',
    onPrimary: '#4A1200',
    primaryContainer: '#5C1D06',
    onPrimaryContainer: '#FFDBCF',
    secondary: '#93C5FD',
    onSecondary: '#1E3A8A',
    tertiary: '#5EEAD4',

    background: '#0F172A',
    onBackground: '#F8FAFC',
    surface: '#1E293B',
    onSurface: '#F8FAFC',
    textMuted: '#94A3B8',
    border: '#334155',
    borderFocus: '#FF8A65',

    success: '#4ADE80',
    onSuccess: '#003A12',
    error: '#F87171',
    onError: '#450A0A',
    warning: '#FBBF24',
    info: '#60A5FA',
  },
} as const;

export type ThemeColors = typeof Colors.light;
