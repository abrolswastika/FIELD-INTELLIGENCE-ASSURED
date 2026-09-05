export const lightTheme = {
  mode: "light" as const,

  colors: {
    background: "#F5F7FB",
    card: "#FFFFFF",

    primary: "#2563EB",
    primaryLight: "#EFF6FF",
    primaryBorder: "#DBEAFE",

    text: "#0F172A",
    textSecondary: "#64748B",
    textMuted: "#94A3B8",

    border: "#E2E8F0",
    divider: "#F1F5F9",

    success: "#22C55E",
    successDark: "#166534",
    successLight: "#DCFCE7",

    warning: "#F59E0B",
    warningLight: "#FEF3C7",

    danger: "#EF4444",
    dangerLight: "#FEE2E2",

    disabled: "#CBD5E1",
    disabledText: "#64748B",

    white: "#FFFFFF",
    black: "#000000",
  },
};

export const darkTheme = {
  mode: "dark" as const,

  colors: {
    background: "#0F172A",
    card: "#1E293B",

    primary: "#60A5FA",
    primaryLight: "#172554",
    primaryBorder: "#1E40AF",

    text: "#F8FAFC",
    textSecondary: "#CBD5E1",
    textMuted: "#94A3B8",

    border: "#334155",
    divider: "#334155",

    success: "#4ADE80",
    successDark: "#86EFAC",
    successLight: "#14532D",

    warning: "#FBBF24",
    warningLight: "#78350F",

    danger: "#F87171",
    dangerLight: "#7F1D1D",

    disabled: "#475569",
    disabledText: "#94A3B8",

    white: "#FFFFFF",
    black: "#000000",
  },
};

export type AppTheme =
  | typeof lightTheme
  | typeof darkTheme;


/*
 * Compatibility with the Expo starter components.
 */
export const Colors = {
  light: {
    text: lightTheme.colors.text,
    background: lightTheme.colors.background,
    tint: lightTheme.colors.primary,
    icon: lightTheme.colors.textSecondary,
    tabIconDefault: lightTheme.colors.textMuted,
    tabIconSelected: lightTheme.colors.primary,
    backgroundElement: lightTheme.colors.card,
  },

  dark: {
    text: darkTheme.colors.text,
    background: darkTheme.colors.background,
    tint: darkTheme.colors.primary,
    icon: darkTheme.colors.textSecondary,
    tabIconDefault: darkTheme.colors.textMuted,
    tabIconSelected: darkTheme.colors.primary,
    backgroundElement: darkTheme.colors.card,
  },
};


/*
 * Spacing compatibility with the Expo starter components.
 */
export const Spacing = {
  half: 2,

  one: 4,
  two: 8,
  three: 12,
  four: 16,

  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};