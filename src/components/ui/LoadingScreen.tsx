// @ts-nocheck
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { keyframes } from '@mui/system';

// Gentle wave animation
const wave = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const LoadingScreen: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0a1a2e 0%, #1a3a4e 50%, #0a2a3e 100%)',
        zIndex: 9999,
      }}
    >
      {/* Animated whale emoji */}
      <Typography
        sx={{
          fontSize: '5rem',
          animation: `${wave} 2s ease-in-out infinite`,
          mb: 3,
        }}
      >
        🐋
      </Typography>

      {/* Loading text */}
      <Typography
        variant="h6"
        sx={{
          color: '#F5F5DC',
          fontFamily: '"Cinzel", serif',
          letterSpacing: '0.1em',
          mb: 3,
        }}
      >
        Preparing Your Ocean Adventure
      </Typography>

      {/* Progress indicator */}
      <CircularProgress
        size={40}
        thickness={2}
        sx={{
          color: '#4FC3F7',
        }}
      />
    </Box>
  );
};

export default LoadingScreen;
export { LoadingScreen };