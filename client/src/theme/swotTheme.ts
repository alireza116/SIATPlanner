import { Theme } from '@mui/material';

export interface SwotColors {
  main: string;
  light: string;
  dark: string;
}

export interface SwotTheme {
  Strength: SwotColors;
  Weakness: SwotColors;
  Opportunity: SwotColors;
  Threat: SwotColors;
}

// Custom colors can be defined here
export const customSwotColors: Partial<SwotTheme> = {
  Strength: {
    main: '#1b5e20', // darker green
    light: '#2e7d32', // less dark green
    dark: '#003300', // very dark green
  },
  Weakness: {
    main: '#b71c1c', // darker red
    light: '#c62828', // less dark red
    dark: '#7f0000', // very dark red
  },
  Opportunity: {
    main: '#0d47a1', // darker blue
    light: '#1565c0', // less dark blue
    dark: '#002171', // very dark blue
  },
  Threat: {
    main: '#e65100', // darker orange
    light: '#ef6c00', // less dark orange
    dark: '#b23c17', // very dark orange
  }
};

export const getSwotColor = (type: keyof SwotTheme, theme: Theme) => {
  // Check if custom colors exist for this type
  if (customSwotColors[type]) {
    return customSwotColors[type] as SwotColors;
  }

  // Default MUI theme colors
  const defaultColors = {
    Strength: {
      main: theme.palette.success.main,
      light: theme.palette.success.light,
      dark: theme.palette.success.dark,
    },
    Weakness: {
      main: theme.palette.error.main,
      light: theme.palette.error.light,
      dark: theme.palette.error.dark,
    },
    Opportunity: {
      main: theme.palette.info.main,
      light: theme.palette.info.light,
      dark: theme.palette.info.dark,
    },
    Threat: {
      main: theme.palette.warning.main,
      light: theme.palette.warning.light,
      dark: theme.palette.warning.dark,
    }
  }[type];

  return defaultColors;
};

export type SwotChipColor = "success" | "error" | "info" | "warning";

export const getSwotChipColor = (type: keyof SwotTheme): SwotChipColor => {
  const colors: Record<keyof SwotTheme, SwotChipColor> = {
    Strength: "success",
    Weakness: "error",
    Opportunity: "info",
    Threat: "warning"
  };
  return colors[type];
}; 