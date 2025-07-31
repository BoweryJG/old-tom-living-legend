// @ts-nocheck
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const StoryPage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" gutterBottom>
          Story Adventure
        </Typography>
        <Typography variant="body1">
          Interactive storytelling experience - Coming Soon!
        </Typography>
      </Box>
    </Container>
  );
};

export default StoryPage;