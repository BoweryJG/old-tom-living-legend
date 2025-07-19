import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Import existing components
import UXOrchestrator from './components/ux/UXOrchestrator';
import StudioGhibliAudioManager from './components/audio/StudioGhibliAudioManager';
import OceanParticles from './components/OceanParticles';
import OldTomCharacter from './components/OldTomCharacter';
import OldTomChat from './components/OldTomChat';
import AIIntegratedCharacter from './components/ai/AIIntegratedCharacter';
import AskOldTomInterface from './components/ai/AskOldTomInterface';
import NavigationContainer from './components/ui/NavigationContainer';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Create Studio Ghibli + Antique Marine theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2E8B57', // Sea green
      light: '#4CAF50',
      dark: '#1B4332',
    },
    secondary: {
      main: '#8B7355', // Antique brass
      light: '#D4AF37',
      dark: '#654321',
    },
    background: {
      default: 'linear-gradient(135deg, #0F3460 0%, #16537e 50%, #2E8B57 100%)',
      paper: 'rgba(15, 52, 96, 0.9)',
    },
    text: {
      primary: '#F5F5DC', // Beige
      secondary: '#D4AF37', // Gold
    },
  },
  typography: {
    fontFamily: '"Cinzel", "Playfair Display", "Times New Roman", serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 800,
    h1: {
      fontFamily: '"Cinzel Decorative", "Playfair Display", serif',
      fontWeight: 800,
      fontSize: '4.5rem',
      letterSpacing: '0.1em',
      textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
      color: '#F5F5DC',
    },
    h2: {
      fontFamily: '"Cinzel", "Playfair Display", serif',
      fontWeight: 600,
      fontSize: '2.5rem',
      letterSpacing: '0.05em',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      color: '#D4AF37',
    },
    body1: {
      fontFamily: '"Crimson Text", "Georgia", serif',
      fontSize: '1.1rem',
      lineHeight: 1.7,
      letterSpacing: '0.02em',
      color: '#F5F5DC',
    },
  },
  spacing: 8,
});

// Main Story/Home Page
const StoryPage: React.FC = () => {
  const [oldTomAnimation, setOldTomAnimation] = useState<'idle' | 'speaking' | 'greeting'>('idle');
  const [chatVisible, setChatVisible] = useState(false);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* 3D Ocean Environment */}
      <OceanParticles intensity="high" />
      
      {/* Old Tom Character */}
      <OldTomCharacter
        isVisible={true}
        animationType={oldTomAnimation}
        position="center"
        size="large"
        isAnimating={true}
        onAnimationComplete={() => setOldTomAnimation('idle')}
      />

      {/* Old Tom Chat Interface */}
      <OldTomChat 
        open={chatVisible} 
        onClose={() => setChatVisible(false)} 
      />
    </Box>
  );
};

// Ocean Exploration Page
const OceanPage: React.FC = () => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <OceanParticles intensity="high" />
      <OldTomCharacter
        isVisible={true}
        animationType="swimming"
        position="center"
        size="large"
        isAnimating={true}
      />
    </Box>
  );
};

// Chat/Conversation Page
const ChatPage: React.FC = () => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <OceanParticles intensity="medium" />
      <OldTomChat open={true} onClose={() => {}} />
    </Box>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // User profile for UX orchestration
  const userProfile = {
    name: "Young Explorer",
    age: 8,
    accessibilityNeeds: [],
    learningPreferences: ["visual", "interactive", "storytelling"]
  };

  // Current progress tracking
  const currentProgress = {
    totalSteps: 10,
    completedSteps: 3,
    currentChapter: "Meeting Old Tom"
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        
        {/* Google Fonts Import */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" 
          rel="stylesheet" 
        />

        <Router>
          <Routes>
            <Route path="/" element={<StoryPage />} />
            <Route path="/story" element={<StoryPage />} />
            <Route path="/ocean" element={<OceanPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </Router>

        {/* Global CSS Animations */}
        <style jsx global>{`
          @keyframes oceanWaves {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(5px) rotate(-0.5deg); }
          }
          
          @keyframes anchorSway {
            0%, 100% { transform: translateY(-50%) rotate(-5deg); }
            50% { transform: translateY(-60%) rotate(5deg); }
          }

          @keyframes speaking {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }

          @keyframes magical-sparkle {
            0% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1) rotate(180deg); }
            100% { opacity: 0; transform: scale(0) rotate(360deg); }
          }
        `}</style>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;