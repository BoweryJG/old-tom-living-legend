import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Container, Button, Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

// Import Old Tom's voice service and chat component
import { ElevenLabsTTSService } from './services/elevenLabsTTS';
import OldTomChat from './components/OldTomChat';
import OceanParticles from './components/OceanParticles';
import OldTomCharacter from './components/OldTomCharacter';
import OrchestraManager from './components/OrchestraManager';

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

// Initialize Old Tom's voice service
const oldTomVoice = new ElevenLabsTTSService();

// Enhanced Marine-themed Home Page
const HomePage: React.FC = () => {
  const [isOldTomSpeaking, setIsOldTomSpeaking] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [oldTomAnimation, setOldTomAnimation] = useState<'idle' | 'speaking' | 'greeting'>('idle');
  const [currentMood, setCurrentMood] = useState<'peaceful' | 'mysterious' | 'adventurous' | 'nostalgic' | 'dramatic'>('peaceful');
  const [, setUserInteracted] = useState(false);

  const handleTalkToOldTom = async () => {
    if (isOldTomSpeaking) return;
    
    setIsOldTomSpeaking(true);
    setOldTomAnimation('greeting');
    setCurrentMood('adventurous'); // Change mood when Old Tom speaks
    
    try {
      await oldTomVoice.initialize();
      
      // After greeting animation, start speaking
      setTimeout(() => {
        setOldTomAnimation('speaking');
      }, 1000);
      
      const greetingText = `Ahoy there, young navigator! I am Old Tom, the great orca of Eden Bay. 
        For decades, my pod and I worked alongside the Davidson whalers in the ancient partnership 
        known as the "Law of the Tongue." Would you like to hear tales of our adventures 
        beneath the Southern Ocean waves?`;
      
      await oldTomVoice.streamTextToSpeech(greetingText, 'old-tom');
    } catch (error) {
      console.error('Error with Old Tom voice:', error);
    }
    
    setIsOldTomSpeaking(false);
    setOldTomAnimation('idle');
    setCurrentMood('peaceful'); // Return to peaceful mood
  };

  const handleOpenChat = () => {
    setChatVisible(true);
  };

  return (
    <>
      {/* Google Fonts Import */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" 
        rel="stylesheet" 
      />
      
      <Box
        onClick={() => setUserInteracted(true)}
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a1a2e 0%, #16537e 25%, #2E8B57 75%, #1a4d3a 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(46, 139, 87, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(15, 52, 96, 0.4) 0%, transparent 50%)
            `,
            animation: 'oceanWaves 8s ease-in-out infinite',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 4,
            }}
          >
            {/* Main Title with Antique Marine Styling */}
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom 
              sx={{
                background: 'linear-gradient(45deg, #F5F5DC 30%, #D4AF37 70%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                marginBottom: 3,
                position: 'relative',
                '&::after': {
                  content: '"⚓"',
                  position: 'absolute',
                  right: '-60px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '3rem',
                  color: '#8B7355',
                  animation: 'anchorSway 3s ease-in-out infinite',
                }
              }}
            >
              🐋 Old Tom
            </Typography>

            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom 
              sx={{ 
                mb: 4,
                fontStyle: 'italic',
                position: 'relative',
                '&::before, &::after': {
                  content: '"⟶"',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#8B7355',
                  fontSize: '1.5rem',
                },
                '&::before': { left: '-40px', transform: 'translateY(-50%) rotate(180deg)' },
                '&::after': { right: '-40px' },
              }}
            >
              The Living Legend of Eden Bay
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ 
                maxWidth: '900px', 
                mb: 6,
                background: 'rgba(15, 52, 96, 0.3)',
                padding: 3,
                borderRadius: 2,
                border: '2px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                '&::before': {
                  content: '"⛵"',
                  position: 'absolute',
                  top: '-15px',
                  left: '20px',
                  fontSize: '2rem',
                  background: 'rgba(15, 52, 96, 0.8)',
                  padding: '5px 10px',
                  borderRadius: '50%',
                }
              }}
            >
              In the waters off Eden, Australia, a legendary partnership was forged between man and whale. 
              Old Tom, the great orca, led his pod in the ancient "Law of the Tongue" — guiding whalers 
              to their quarry in exchange for the choicest portions. This is his story, brought to life 
              through the magic of Studio Ghibli artistry and modern AI storytelling.
            </Typography>

            {/* Feature Grid with Maritime Styling */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              width: '100%',
              maxWidth: '800px',
            }}>
              {[
                { icon: '🎭', title: 'Converse with Old Tom', desc: 'AI-powered conversations with the legendary orca' },
                { icon: '🌊', title: 'Living Ocean World', desc: 'Interactive marine environment with realistic physics' },
                { icon: '🎨', title: 'Ghibli Artistry', desc: 'Hand-crafted animations in Studio Ghibli style' },
                { icon: '📜', title: 'Historical Chronicles', desc: 'Educational content about the true Davidson partnership' }
              ].map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(46, 139, 87, 0.2) 0%, rgba(15, 52, 96, 0.3) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: 3,
                    padding: 3,
                    textAlign: 'center',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 40px rgba(212, 175, 55, 0.2)',
                      borderColor: 'rgba(212, 175, 55, 0.6)',
                    }
                  }}
                >
                  <Typography variant="h3" sx={{ fontSize: '3rem', mb: 1 }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontFamily: '"Cinzel", serif',
                    color: '#D4AF37',
                    mb: 1,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontFamily: '"Crimson Text", serif',
                    fontSize: '0.95rem',
                    opacity: 0.9,
                  }}>
                    {feature.desc}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* DEBUG: Simple test button */}
            <Box sx={{ 
              mt: 6, 
              display: 'flex', 
              gap: 3, 
              flexWrap: 'wrap', 
              justifyContent: 'center',
              background: 'red', // DEBUG: Make visible
              padding: 2,
              borderRadius: 2
            }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleTalkToOldTom}
                disabled={isOldTomSpeaking}
                sx={{
                  background: 'linear-gradient(45deg, #2E8B57 30%, #4CAF50 90%)',
                  color: '#F5F5DC',
                  fontFamily: '"Cinzel", serif',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  padding: '16px 32px',
                  borderRadius: 4,
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(46, 139, 87, 0.3)',
                  border: '2px solid rgba(212, 175, 55, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #4CAF50 30%, #2E8B57 90%)',
                    boxShadow: '0 12px 40px rgba(46, 139, 87, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(45deg, #555 30%, #777 90%)',
                    opacity: 0.7,
                  },
                  '&::before': {
                    content: isOldTomSpeaking ? '"🌊"' : '"🐋"',
                    position: 'absolute',
                    left: '16px',
                    fontSize: '1.5rem',
                    animation: isOldTomSpeaking ? 'speaking 1s infinite' : 'none',
                  }
                }}
              >
                {isOldTomSpeaking ? 'Old Tom is speaking...' : 'Talk to Old Tom'}
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={handleOpenChat}
                sx={{
                  color: '#D4AF37',
                  borderColor: 'rgba(212, 175, 55, 0.6)',
                  fontFamily: '"Cinzel", serif',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  padding: '16px 32px',
                  borderRadius: 4,
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#D4AF37',
                    background: 'rgba(212, 175, 55, 0.1)',
                    transform: 'translateY(-2px)',
                  }
                }}
                startIcon={<ChatIcon />}
              >
                Chat with Old Tom
              </Button>
            </Box>
          </Box>
        </Container>

        {/* Floating Chat Button */}
        <Fab
          color="primary"
          aria-label="chat"
          onClick={handleOpenChat}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(45deg, #2E8B57 30%, #4CAF50 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #4CAF50 30%, #2E8B57 90%)',
            },
            boxShadow: '0 8px 32px rgba(46, 139, 87, 0.3)',
            zIndex: 1000,
          }}
        >
          <ChatIcon />
        </Fab>

        {/* Old Tom Character Animation */}
        <OldTomCharacter
          isVisible={true}
          animationType={oldTomAnimation}
          position="right"
          size="large"
          isAnimating={isOldTomSpeaking}
        />

        {/* CSS Animations */}
        <style jsx>{`
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
        `}</style>
      </Box>

      {/* Old Tom Chat Interface */}
      <OldTomChat open={chatVisible} onClose={() => setChatVisible(false)} />

      {/* Orchestra Manager */}
      <OrchestraManager
        currentMood={currentMood}
        isPlaying={true}
        volume={0.3}
        onMoodChange={(mood) => setCurrentMood(mood as any)}
      />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* 3D Ocean Particles Background */}
      {/* <OceanParticles intensity="high" /> */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;