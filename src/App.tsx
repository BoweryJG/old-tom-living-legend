import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Button } from '@mui/material';

// Import existing components
import OceanParticles from './components/OceanParticles';
import OldTomCharacter from './components/OldTomCharacter';
import OldTomChat from './components/OldTomChat';
import OrchestraManager from './components/OrchestraManager';
import AIIntegratedCharacter from './components/ai/AIIntegratedCharacter';
import AskOldTomInterface from './components/ai/AskOldTomInterface';
import { EmotionalFeedbackSystem } from './components/emotional/EmotionalFeedbackSystem';
import { OldTomComfortCharacter } from './components/emotional/OldTomComfortCharacter';
import { EducationalProgressTracker } from './components/education/EducationalProgressTracker';
import { CelebrationAnimations } from './components/education/CelebrationAnimations';
import { MagicalGestureRecognizer } from './components/interactions/MagicalGestureRecognizer';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AccessibilityProvider } from './components/accessibility/AccessibilityProvider';
import { ElevenLabsTTSService } from './services/elevenLabsTTS';
import { oldTomDialogue } from './content/dialogue/oldTomVoices';

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
    // Custom Studio Ghibli palette colors
    ocean: {
      main: '#1565C0',
      light: '#42A5F5',
      dark: '#0D47A1',
    },
    sunset: {
      main: '#FF7043',
      light: '#FFAB91',
      dark: '#D84315',
    },
    forest: {
      main: '#388E3C',
      light: '#66BB6A',
      dark: '#1B5E20',
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

// Main Story/Home Page
const StoryPage: React.FC = () => {
  const [oldTomAnimation, setOldTomAnimation] = useState<'idle' | 'speaking' | 'greeting'>('greeting');
  const [chatVisible, setChatVisible] = useState(false);
  const [isOldTomSpeaking, setIsOldTomSpeaking] = useState(true);
  const [currentMood, setCurrentMood] = useState<'peaceful' | 'mysterious' | 'adventurous' | 'nostalgic' | 'dramatic'>('adventurous');
  const [showCelebration, setShowCelebration] = useState<{ type: 'achievement' | 'learning' | 'discovery' | 'mastery' | 'friendship'; visible: boolean } | null>({ type: 'discovery', visible: true });
  const [emotionalState, setEmotionalState] = useState({
    comfort: 5,
    engagement: 5,
    confidence: 5,
    needsSupport: false,
    preferredPace: 'normal' as 'slow' | 'normal' | 'fast',
  });
  const [, setUserInteracted] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Simple public folder paths - these SHOULD work
  const studioGhibliImages = [
    '/2025-07-19_FLUX_1-schnell-infer_Image_7b1cc.webp',
    '/2025-07-19_FLUX_1-schnell-infer_Image_158ba.webp',
    '/2025-07-19_FLUX_1-schnell-infer_Image_21ea0.webp',
    '/2025-07-19_FLUX_1-schnell-infer_Image_278de.webp',
    '/2025-07-19_FLUX_1-schnell-infer_Image_b48b2.webp',
    '/2025-07-19_FLUX_1-schnell-infer_Image_d2891.webp'
  ];

  // Preload images to ensure they display
  React.useEffect(() => {
    console.log('Preloading FLUX images...');
    studioGhibliImages.forEach((imagePath, index) => {
      const img = new Image();
      img.onload = () => console.log(`✅ Loaded image ${index + 1}:`, imagePath);
      img.onerror = () => console.error(`❌ Failed to load image ${index + 1}:`, imagePath);
      img.src = imagePath;
    });
  }, []);

  // Auto-cycle through your beautiful images
  React.useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % studioGhibliImages.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(imageInterval);
  }, [studioGhibliImages.length]);

  // Initialize audio only, don't auto-start on iOS
  React.useEffect(() => {
    const initializeAudio = async () => {
      try {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (!isIOS) {
          await oldTomVoice.initialize();
        }
      } catch (error) {
        console.error('Error initializing Old Tom voice:', error);
      }
    };
    
    initializeAudio();
  }, []);

  const handleTalkToOldTom = async () => {
    if (isOldTomSpeaking) return;
    
    setIsOldTomSpeaking(true);
    setOldTomAnimation('speaking');
    setCurrentMood('adventurous');
    setUserInteracted(true);
    
    try {
      // Initialize audio context on first user interaction (iOS requirement)
      if (!oldTomVoice.audioContext) {
        await oldTomVoice.initialize();
      }
      
      // Use the amazing character dialogue instead of generic text
      const greetingDialogue = oldTomDialogue.find(d => d.id === 'tom_ch1_intro');
      const wisdomDialogue = oldTomDialogue.find(d => d.id === 'tom_ch1_wisdom');
      const adventureText = greetingDialogue?.text + " " + wisdomDialogue?.text;
      
      await oldTomVoice.streamTextToSpeech(adventureText, 'old-tom');
      
      // Reset speaking state when audio ends
      oldTomVoice.on('stream-ended', () => {
        setIsOldTomSpeaking(false);
        setOldTomAnimation('idle');
        setCurrentMood('peaceful');
      });
      
    } catch (error) {
      console.error('Error with Old Tom voice:', error);
      // Reset state immediately if voice fails
      setIsOldTomSpeaking(false);
      setOldTomAnimation('greeting');
      setCurrentMood('peaceful');
    }
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
        background: `linear-gradient(135deg, rgba(10,26,46,0.8) 0%, rgba(22,83,126,0.8) 25%, rgba(46,139,87,0.8) 75%, rgba(26,77,58,0.8) 100%), url('${studioGhibliImages[currentImageIndex]}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#0a1a2e', // Fallback color if images don't load
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      {/* 3D Ocean Environment */}
      <OceanParticles intensity="high" />
      
      {/* NO NAVIGATION - JUST OLD TOM EXPERIENCE */}

      {/* Magical Gesture Recognition */}
      <MagicalGestureRecognizer
        onGesture={(gesture) => {
          console.log('Magical gesture:', gesture);
          if (gesture === 'wave_hello') {
            handleTalkToOldTom();
          }
        }}
        enableMagicalFeedback={true}
      >
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
            backgroundColor: 'rgba(0,0,0,0.1)',
            backdropFilter: 'blur(1px)',
          }}
        >
        {/* Title */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h1" 
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              color: '#FFFFFF',
              textShadow: '4px 4px 8px rgba(0,0,0,0.9)',
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            🐋 Old Tom
          </Typography>
          
          <Typography 
            variant="h2" 
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              color: '#FFD700',
              textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
              fontStyle: 'italic',
              fontWeight: 'bold',
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
              background: 'linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)',
              color: '#FFFFFF',
              fontSize: '2rem',
              fontWeight: 800,
              padding: '24px 48px',
              borderRadius: 8,
              textTransform: 'none',
              boxShadow: '0 12px 40px rgba(255, 107, 53, 0.6)',
              border: '4px solid #FFFFFF',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF8C42 30%, #FFA726 90%)',
                transform: 'translateY(-5px) scale(1.05)',
                boxShadow: '0 16px 50px rgba(255, 107, 53, 0.8)',
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
              color: '#FFFFFF',
              borderColor: '#FFFFFF',
              backgroundColor: 'rgba(255,255,255,0.1)',
              fontSize: '2rem',
              fontWeight: 800,
              padding: '24px 48px',
              borderRadius: 8,
              textTransform: 'none',
              borderWidth: 4,
              boxShadow: '0 8px 32px rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255,215,0,0.2)',
                transform: 'translateY(-5px) scale(1.05)',
                boxShadow: '0 12px 40px rgba(255,215,0,0.5)',
              }
            }}
          >
            💬 Chat Adventure
          </Button>
        </Box>
        </Box>
      </MagicalGestureRecognizer>
      
      {/* AI-Integrated Old Tom Character */}
      <AIIntegratedCharacter
        characterId="old-tom"
        position="center"
        size="large"
        interactive={true}
        enableVoice={true}
        enableEmotionalAI={true}
        childAge={8}
        onAIResponse={(response) => console.log('AI Response:', response)}
        showControls={true}
        autoInitialize={true}
      />

      {/* FLUX Images - Only show if they actually load */}
      {studioGhibliImages.map((imagePath, index) => (
        <img 
          key={index}
          src={imagePath}
          alt={`Old Tom Scene ${index + 1}`}
          onLoad={() => console.log(`✅ Image ${index + 1} loaded successfully`)}
          onError={() => console.error(`❌ Image ${index + 1} failed to load`)}
          style={{
            position: 'fixed',
            bottom: index === 0 ? 20 : index === 1 ? 20 : 20,
            right: index === 0 ? 20 : 'auto',
            left: index === 1 ? 20 : index === 2 ? 'auto' : 'auto',
            top: index === 2 ? 20 : 'auto',
            width: index === 0 ? 300 : index === 1 ? 200 : index === 2 ? 350 : 0,
            height: index === 0 ? 400 : index === 1 ? 300 : index === 2 ? 250 : 0,
            objectFit: 'contain',
            zIndex: 1000,
            borderRadius: 8,
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: index > 2 ? 'none' : 'block', // Only show first 3 images as overlays
          }}
        />
      ))}

      {/* Traditional Old Tom Character */}
      <OldTomCharacter
        isVisible={true}
        animationType={oldTomAnimation}
        position="center"
        size="large"
        isAnimating={true}
        onAnimationComplete={() => setOldTomAnimation('speaking')}
      />


      {/* Old Tom Chat Interface */}
      <OldTomChat 
        open={chatVisible} 
        onClose={() => setChatVisible(false)} 
      />

      {/* Orchestra Manager for Music */}
      <OrchestraManager
        currentMood={currentMood}
        isPlaying={true}
        volume={0.3}
        onMoodChange={(mood) => setCurrentMood(mood as any)}
      />
    </Box>
  );
};


const App: React.FC = () => {

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
        
        {/* Google Fonts Import */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" 
          rel="stylesheet" 
        />

        {/* NO FUCKING ROUTING - GO STRAIGHT TO OLD TOM EXPERIENCE */}
        <StoryPage />

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

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }

          @keyframes sway {
            0%, 100% { transform: translateX(0px) rotate(0deg); }
            25% { transform: translateX(-5px) rotate(-2deg); }
            75% { transform: translateX(5px) rotate(2deg); }
          }

          @keyframes glow {
            0% { box-shadow: 0 8px 32px rgba(255,215,0,0.3), 0 0 20px rgba(255,215,0,0.2); }
            100% { box-shadow: 0 12px 40px rgba(255,215,0,0.6), 0 0 30px rgba(255,215,0,0.4); }
          }
        `}</style>
        </ThemeProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
};

export default App;