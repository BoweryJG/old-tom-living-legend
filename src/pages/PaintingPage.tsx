// @ts-nocheck
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const PaintingPage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" gutterBottom>
          Painting
        </Typography>
        <Typography variant="body1">
          Coming Soon\!
        </Typography>
      </Box>
    </Container>
  );
};

export default PaintingPage;
