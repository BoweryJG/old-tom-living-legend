// @ts-nocheck
import React, { useState } from 'react';
import { Box } from '@mui/material';
import CaptainTomNarrationView from '../components/story/CaptainTomNarrationView';
import StoryAudioInitializer from '../components/story/StoryAudioInitializer';

const StoryPage: React.FC = () => {
  const [isAudioReady, setIsAudioReady] = useState(false);

  return (
    <Box sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {!isAudioReady ? (
        <StoryAudioInitializer 
          onReady={() => setIsAudioReady(true)}
          autoPreload={true}
        />
      ) : (
        <CaptainTomNarrationView />
      )}
    </Box>
  );
};

export default StoryPage;