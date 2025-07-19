import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { NavigationContainer } from '@/components/ui/NavigationContainer';
import { AudioProvider } from '@/components/ui/AudioProvider';
import { PerformanceMonitor } from '@/components/ui/PerformanceMonitor';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const StoryPage = lazy(() => import('@/pages/StoryPage'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const OceanPage = lazy(() => import('@/pages/OceanPage'));
const TimePortalPage = lazy(() => import('@/pages/TimePortalPage'));
const PaintingPage = lazy(() => import('@/pages/PaintingPage'));
const DreamPage = lazy(() => import('@/pages/DreamPage'));

function App() {
  return (
    <ErrorBoundary>
      <AudioProvider>
        <PerformanceMonitor>
          <Box
            sx={{
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <NavigationContainer>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/story" element={<StoryPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/ocean" element={<OceanPage />} />
                  <Route path="/time-portal" element={<TimePortalPage />} />
                  <Route path="/painting" element={<PaintingPage />} />
                  <Route path="/dream" element={<DreamPage />} />
                </Routes>
              </Suspense>
            </NavigationContainer>
          </Box>
        </PerformanceMonitor>
      </AudioProvider>
    </ErrorBoundary>
  );
}

export default App;