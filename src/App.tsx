import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Button, Fade } from '@mui/material';

// Import simplified components
import OceanParticles from './components/OceanParticles';
import OldTomCharacter from './components/OldTomCharacter';
import OldTomChat from './components/OldTomChat';
import OrchestraManager from './components/OrchestraManager';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AccessibilityProvider } from './components/accessibility/AccessibilityProvider';
import LoadingScreen from './components/ui/LoadingScreen';

// Create Studio Ghibli + Marine theme
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
      default: '#0a1a2e',
      paper: 'rgba(15, 52, 96, 0.9)',
    },
    text: {
      primary: '#F5F5DC', // Beige
      secondary: '#D4AF37', // Gold
    },
  },
  typography: {
    fontFamily: '"Cinzel", "Playfair Display", "Times New Roman", serif',
    h1: {
      fontFamily: '"Cinzel Decorative", "Playfair Display", serif',
      fontWeight: 800,
      fontSize: 'clamp(3rem, 8vw, 5rem)',
      letterSpacing: '0.05em',
      textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
    },
    h2: {
      fontFamily: '"Cinzel", serif',
      fontWeight: 600,
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
      letterSpacing: '0.03em',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    },
    body1: {
      fontFamily: '"Crimson Text", "Georgia", serif',
      fontSize: '1.1rem',
      lineHeight: 1.7,
    },
  },
});

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [chatVisible, setChatVisible] = useState(false);
  const [currentMood, setCurrentMood] = useState<'peaceful' | 'mysterious' | 'adventurous'>('peaceful');
  const [characterAnimation, setCharacterAnimation] = useState<'idle' | 'greeting' | 'speaking'>('idle');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Simulate loading for smoother initial render
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleMeetOldTom = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setCharacterAnimation('greeting');
      setCurrentMood('adventurous');
      
      // Open chat after greeting animation
      setTimeout(() => {
        setChatVisible(true);
        setCharacterAnimation('speaking');
      }, 2000);
    } else {
      setChatVisible(true);
      setCharacterAnimation('speaking');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          
          {/* Google Fonts */}
          <link 
            href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" 
            rel="stylesheet" 
          />

          <Box
            sx={{
              position: 'relative',
              minHeight: '100vh',
              background: 'linear-gradient(180deg, #0a1a2e 0%, #1a3a4e 50%, #0a2a3e 100%)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Optimized Ocean Background - Only render when visible */}
            <Fade in={!chatVisible} timeout={1000}>
              <Box sx={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                <OceanParticles intensity="low" />
              </Box>
            </Fade>

            {/* Main Content */}
            <Fade in={!chatVisible} timeout={800}>
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 10,
                  textAlign: 'center',
                  px: 3,
                  maxWidth: '800px',
                  width: '100%',
                }}
              >
                {/* Title Section */}
                <Box sx={{ mb: 6 }}>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      color: '#FFFFFF',
                      mb: 2,
                      opacity: 0,
                      animation: 'fadeInUp 1.2s ease-out forwards',
                    }}
                  >
                    Old Tom
                  </Typography>
                  
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      color: '#FFD700',
                      fontStyle: 'italic',
                      opacity: 0,
                      animation: 'fadeInUp 1.2s ease-out 0.3s forwards',
                    }}
                  >
                    The Living Legend of Eden Bay
                  </Typography>
                </Box>

                {/* Single Primary CTA */}
                <Box
                  sx={{
                    opacity: 0,
                    animation: 'fadeInUp 1.2s ease-out 0.6s forwards',
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleMeetOldTom}
                    sx={{
                      background: 'linear-gradient(45deg, #2E8B57 30%, #4CAF50 90%)',
                      color: '#FFFFFF',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      px: 6,
                      py: 3,
                      borderRadius: 50,
                      textTransform: 'none',
                      boxShadow: '0 8px 32px rgba(46, 139, 87, 0.4)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(46, 139, 87, 0.6)',
                      },
                    }}
                  >
                    {hasInteracted ? '🐋 Continue Adventure' : '🐋 Meet Old Tom'}
                  </Button>
                </Box>

                {/* Subtitle */}
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    mt: 3,
                    fontSize: '1.1rem',
                    opacity: 0,
                    animation: 'fadeIn 1.2s ease-out 0.9s forwards',
                  }}
                >
                  An interactive ocean adventure powered by AI
                </Typography>
              </Box>
            </Fade>

            {/* Old Tom Character - Simplified */}
            <Fade in={hasInteracted && !chatVisible} timeout={1000}>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '10%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 5,
                }}
              >
                <OldTomCharacter
                  animationType={characterAnimation}
                  size="large"
                  position="center"
                />
              </Box>
            </Fade>

            {/* Chat Interface */}
            <OldTomChat 
              open={chatVisible} 
              onClose={() => {
                setChatVisible(false);
                setCharacterAnimation('idle');
                setCurrentMood('peaceful');
              }} 
            />

            {/* Background Music - Subtle */}
            <OrchestraManager
              currentMood={currentMood}
              isPlaying={hasInteracted}
              volume={0.2}
              onMoodChange={setCurrentMood}
            />
          </Box>

          {/* Animation Keyframes */}
          <style jsx global>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
          `}</style>
        </ThemeProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
};

export default App;