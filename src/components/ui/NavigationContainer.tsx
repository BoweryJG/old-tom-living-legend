// @ts-nocheck
import React from 'react';
import { Box } from '@mui/material';

interface NavigationContainerProps {
  children: React.ReactNode;
}

export const NavigationContainer: React.FC<NavigationContainerProps> = ({ children }) => {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {children}
    </Box>
  );
};