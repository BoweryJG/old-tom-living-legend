import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    ocean: Palette['primary'];
    sunset: Palette['primary'];
    forest: Palette['primary'];
  }

  interface PaletteOptions {
    ocean?: PaletteOptions['primary'];
    sunset?: PaletteOptions['primary'];
    forest?: PaletteOptions['primary'];
  }
}