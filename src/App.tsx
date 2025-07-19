import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Button } from '@mui/material';

// Import existing components
import OceanParticles from './components/OceanParticles';
import OldTomCharacter from './components/OldTomCharacter';
import OldTomChat from './components/OldTomChat';
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
  const [isOldTomSpeaking, setIsOldTomSpeaking] = useState(false);
  const [, setUserInteracted] = useState(false);

  const handleTalkToOldTom = async () => {
    if (isOldTomSpeaking) return;
    
    setIsOldTomSpeaking(true);
    setOldTomAnimation('greeting');
    setUserInteracted(true);
    
    setTimeout(() => {
      setOldTomAnimation('speaking');
    }, 1000);
    
    setTimeout(() => {
      setIsOldTomSpeaking(false);
      setOldTomAnimation('idle');
    }, 5000);
  };

  const handleOpenChat = () => {
    setChatVisible(true);
    setUserInteracted(true);
  };

  return (
    <Box 
      onClick={() => setUserInteracted(true)}
      sx={{ 
        position: 'relative', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a1a2e 0%, #16537e 25%, #2E8B57 75%, #1a4d3a 100%)',
        overflow: 'hidden',
      }}
    >
      {/* 3D Ocean Environment */}
      <OceanParticles intensity="high" />
      
      {/* Main Content Container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 3,
        }}
      >
        {/* Title */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h1" 
            sx={{
              fontSize: { xs: '3rem', md: '4.5rem' },
              background: 'linear-gradient(45deg, #F5F5DC 30%, #D4AF37 70%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
              mb: 2,
            }}
          >
            🐋 Old Tom
          </Typography>
          
          <Typography 
            variant="h2" 
            sx={{
              fontSize: { xs: '1.5rem', md: '2.5rem' },
              color: '#D4AF37',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontStyle: 'italic',
            }}
          >
            The Living Legend of Eden Bay
          </Typography>
        </Box>

        {/* Interactive Buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          mb: 4,
        }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleTalkToOldTom}
            disabled={isOldTomSpeaking}
            sx={{
              background: 'linear-gradient(45deg, #2E8B57 30%, #4CAF50 90%)',
              color: '#F5F5DC',
              fontSize: '1.3rem',
              fontWeight: 600,
              padding: '18px 36px',
              borderRadius: 4,
              textTransform: 'none',
              boxShadow: '0 8px 32px rgba(46, 139, 87, 0.4)',
              border: '2px solid rgba(212, 175, 55, 0.5)',
              '&:hover': {
                background: 'linear-gradient(45deg, #4CAF50 30%, #2E8B57 90%)',
                transform: 'translateY(-3px)',
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, #555 30%, #777 90%)',
                opacity: 0.7,
              },
            }}
          >
            {isOldTomSpeaking ? '🌊 Old Tom is speaking...' : '🐋 Meet Old Tom'}
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={handleOpenChat}
            sx={{
              color: '#D4AF37',
              borderColor: 'rgba(212, 175, 55, 0.7)',
              fontSize: '1.3rem',
              fontWeight: 600,
              padding: '18px 36px',
              borderRadius: 4,
              textTransform: 'none',
              borderWidth: 2,
              '&:hover': {
                borderColor: '#D4AF37',
                background: 'rgba(212, 175, 55, 0.15)',
                transform: 'translateY(-3px)',
              }
            }}
          >
            💬 Chat Adventure
          </Button>
        </Box>
      </Box>
      
      {/* Old Tom Character */}
      <OldTomCharacter
        isVisible={true}
        animationType={oldTomAnimation}
        position="right"
        size="large"
        isAnimating={isOldTomSpeaking}
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