export const tokens = {
  colors: {
    background: {
      base: '#0A0A0F',
      midnight: '#0B0F1A',
      card: 'rgba(255, 255, 255, 0.03)',
      glass: 'rgba(255, 255, 255, 0.05)',
    },
    accents: {
      purple: '#7C5CFC',
      cyan: '#3BC9DB',
      mint: '#9AE6B4',
    },
    text: {
      primary: '#F1F1F1',
      secondary: '#A0A0B0',
      muted: '#6B6B80',
      inverse: '#0A0A0F',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      glass: 'rgba(255, 255, 255, 0.12)',
    },
  },
  spacing: {
    section: '100vh',
    container: '1200px',
    gutter: '24px',
    gutterLg: '48px',
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 4px 16px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
    glow: {
      purple: '0 0 20px rgba(124, 92, 252, 0.15)',
      cyan: '0 0 20px rgba(59, 201, 219, 0.15)',
    },
  },
  typography: {
    display: {
      fontFamily: "'Space Grotesk', sans-serif",
      tracking: '-0.03em',
      weights: {
        light: 300,
        bold: 700,
      },
    },
    body: {
      fontFamily: "'Inter', sans-serif",
      weights: {
        regular: 400,
        medium: 500,
      },
    },
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.08)',
    blur: '16px',
    hoverBg: 'rgba(255, 255, 255, 0.06)',
  },
} as const;

export type AccentColor = keyof typeof tokens.colors.accents;
