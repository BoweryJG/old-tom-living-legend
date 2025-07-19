import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    ocean: Palette['primary'];
    forest: Palette['primary'];
    sunset: Palette['primary'];
  }

  interface PaletteOptions {
    ocean?: PaletteOptions['primary'];
    forest?: PaletteOptions['primary'];
    sunset?: PaletteOptions['primary'];
  }
}

// Studio Ghibli-inspired color palette
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0', // Deep Ocean Blue
      light: '#5E92F3',
      dark: '#003C8F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#388E3C', // Forest Green
      light: '#6ABF69',
      dark: '#00600F',
      contrastText: '#FFFFFF',
    },
    ocean: {
      main: '#0277BD',
      light: '#58A5F0',
      dark: '#004C8C',
      contrastText: '#FFFFFF',
    },
    forest: {
      main: '#2E7D32',
      light: '#60AD5E',
      dark: '#005005',
      contrastText: '#FFFFFF',
    },
    sunset: {
      main: '#F57C00',
      light: '#FFAD42',
      dark: '#BB4D00',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#E3F2FD',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#4A4A4A',
    },
  },
  typography: {
    fontFamily: '"Crimson Text", "Georgia", serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 400,
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 400,
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(0,0,0,0.08)',
    '0px 4px 16px rgba(0,0,0,0.12)',
    '0px 8px 24px rgba(0,0,0,0.16)',
    '0px 12px 32px rgba(0,0,0,0.20)',
    '0px 16px 40px rgba(0,0,0,0.24)',
    '0px 20px 48px rgba(0,0,0,0.28)',
    '0px 24px 56px rgba(0,0,0,0.32)',
    '0px 28px 64px rgba(0,0,0,0.36)',
    '0px 32px 72px rgba(0,0,0,0.40)',
    '0px 36px 80px rgba(0,0,0,0.44)',
    '0px 40px 88px rgba(0,0,0,0.48)',
    '0px 44px 96px rgba(0,0,0,0.52)',
    '0px 48px 104px rgba(0,0,0,0.56)',
    '0px 52px 112px rgba(0,0,0,0.60)',
    '0px 56px 120px rgba(0,0,0,0.64)',
    '0px 60px 128px rgba(0,0,0,0.68)',
    '0px 64px 136px rgba(0,0,0,0.72)',
    '0px 68px 144px rgba(0,0,0,0.76)',
    '0px 72px 152px rgba(0,0,0,0.80)',
    '0px 76px 160px rgba(0,0,0,0.84)',
    '0px 80px 168px rgba(0,0,0,0.88)',
    '0px 84px 176px rgba(0,0,0,0.92)',
    '0px 88px 184px rgba(0,0,0,0.96)',
    '0px 92px 192px rgba(0,0,0,1.00)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '12px 24px',
          fontSize: '1.1rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.16)',
          },
        },
        contained: {
          boxShadow: '0px 4px 16px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 4px 16px rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 32px rgba(0,0,0,0.16)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});