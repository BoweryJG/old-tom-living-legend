// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Button, Fade, IconButton, CircularProgress } from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  Chat as ChatIcon,
  VolumeUp as VolumeUpIcon,
  Stop as StopIcon
} from '@mui/icons-material';

console.log('App.tsx: Starting imports...');

// Import components
import OceanParticles from './components/OceanParticles';
import OldTomCharacter from './components/OldTomCharacter';
import OldTomChat from './components/OldTomChat';
import OrchestraManager from './components/OrchestraManager';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AccessibilityProvider } from './components/accessibility/AccessibilityProvider';
import LoadingScreen from './components/ui/LoadingScreen';
import ChapterVisuals from './components/ChapterVisuals';
import AmbientSounds from './components/AmbientSounds';
import DebugPanel from './components/DebugPanel';

console.log('App.tsx: Component imports complete, importing services...');

// Import services with error handling
let higgsAudioService: any = null;
let webSpeechService: any = null;

try {
  higgsAudioService = require('./services/higgsAudioService').higgsAudioService;
  console.log('App.tsx: higgsAudioService imported successfully');
} catch (error) {
  console.error('App.tsx: Failed to import higgsAudioService:', error);
}

try {
  webSpeechService = require('./services/webSpeechService').webSpeechService;
  console.log('App.tsx: webSpeechService imported successfully');
} catch (error) {
  console.error('App.tsx: Failed to import webSpeechService:', error);
}

console.log('App.tsx: All imports complete');

// Story chapters
const storyChapters = [
  {
    id: 1,
    title: "The Legend Begins",
    year: "1895",
    content: `In the cold waters of Twofold Bay, Eden, a remarkable partnership was about to begin. 
    Old Tom, a massive orca with distinctive white markings, approached the Davidson whaling station 
    for the first time. The whalers watched in awe as this intelligent creature seemed to be trying 
    to communicate with them.`,
    mood: 'mysterious' as const
  },
  {
    id: 2,
    title: "The Law of the Tongue",
    year: "1900",
    content: `The Davidsons discovered Old Tom's proposal: he and his pod would help hunt whales 
    in exchange for the tongue and lips - their favorite parts. This became known as the 'Law of 
    the Tongue.' For over 30 years, man and orca would work as one, creating the most extraordinary 
    interspecies partnership in recorded history.`,
    mood: 'peaceful' as const
  },
  {
    id: 3,
    title: "The Hunt",
    year: "1910",
    content: `Old Tom would spot whales far out at sea. Swimming rapidly to shore, he'd leap and 
    crash down - WHACK! WHACK! WHACK! The thunderous tail slaps echoed across the bay. The Davidson 
    men would rush to their boats, following Old Tom as he led them to their prey. Together, they 
    were unstoppable.`,
    mood: 'adventurous' as const
  },
  {
    id: 4,
    title: "The Storm of 1920",
    year: "1920",
    content: `During a fierce storm, young Jackie Davidson's boat capsized. As the crew struggled 
    in the churning seas, Old Tom appeared. He swam beneath Jackie, keeping him afloat for hours 
    until rescue arrived. That day, Old Tom proved the bond between human and orca went far beyond 
    mere hunting partnership.`,
    mood: 'dramatic' as const
  },
  {
    id: 5,
    title: "The Final Hunt",
    year: "1930",
    content: `Old Tom's teeth, worn from decades of rope-pulling, could no longer grip as they once 
    did. On September 17, 1930, after one last hunt with his human partners, Old Tom disappeared into 
    the deep. Days later, his body washed ashore. The Davidsons buried their partner with honors, 
    ending an era that would never be repeated.`,
    mood: 'nostalgic' as const
  },
  {
    id: 6,
    title: "The Museum",
    year: "Today",
    content: `Today, Old Tom's skeleton rests in the Eden Killer Whale Museum, his worn teeth 
    telling the story of a unique partnership. Visitors from around the world come to learn about 
    the orca who chose to work with humans, proving that understanding between species is possible 
    when respect flows both ways.`,
    mood: 'peaceful' as const
  }
];

// Create theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2E8B57',
      light: '#4CAF50',
      dark: '#1B4332',
    },
    secondary: {
      main: '#8B7355',
      light: '#D4AF37',
      dark: '#654321',
    },
    background: {
      default: '#0a1a2e',
      paper: 'rgba(15, 52, 96, 0.9)',
    },
    text: {
      primary: '#F5F5DC',
      secondary: '#D4AF37',
    },
  },
  typography: {
    fontFamily: '"Cinzel", "Playfair Display", "Times New Roman", serif',
    h1: {
      fontFamily: '"Cinzel Decorative", "Playfair Display", serif',
      fontWeight: 800,
      fontSize: 'clamp(2rem, 8vw, 4rem)',
      letterSpacing: '0.05em',
      textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
    },
    h2: {
      fontFamily: '"Cinzel", serif',
      fontWeight: 600,
      fontSize: 'clamp(1.25rem, 5vw, 2.5rem)',
      letterSpacing: '0.03em',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    },
    h3: {
      fontFamily: '"Cinzel", serif',
      fontWeight: 500,
      fontSize: 'clamp(1rem, 4vw, 2rem)',
    },
    body1: {
      fontFamily: '"Crimson Text", "Georgia", serif',
      fontSize: 'clamp(0.95rem, 2.5vw, 1.3rem)',
      lineHeight: 1.8,
    },
  },
});

const App: React.FC = () => {
  console.log('App: Component function starting...');
  
  const [loading, setLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(0); // 0 = landing page
  const [chatVisible, setChatVisible] = useState(false);
  const [currentMood, setCurrentMood] = useState<'peaceful' | 'mysterious' | 'adventurous' | 'nostalgic' | 'dramatic'>('mysterious');
  const [characterAnimation, setCharacterAnimation] = useState<'idle' | 'greeting' | 'speaking' | 'swimming'>('idle');
  const [isNarrating, setIsNarrating] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  console.log('App: State initialized');

  useEffect(() => {
    console.log('App: Running initial useEffect');
    const timer = setTimeout(() => {
      console.log('App: Setting loading to false');
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Play whale sounds
  const playWhaleSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(120, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(180, audioContext.currentTime + 1);
    oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 2);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 1.5);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
  };

  const startStory = () => {
    setCurrentChapter(1);
    setCharacterAnimation('greeting');
    playWhaleSound();
    setTimeout(() => setCharacterAnimation('idle'), 2000);
  };

  // Narration function
  const narateChapter = async (chapterIndex: number) => {
    // Stop any current narration
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
    }

    setIsNarrating(true);
    setCharacterAnimation('speaking');

    try {
      const chapterText = storyChapters[chapterIndex].content;
      console.log('🎤 Generating Old Tom voice for chapter:', chapterIndex);
      console.log('Text:', chapterText);
      
      const audioUrl = await higgsAudioService.generateOldTomVoice(chapterText);
      console.log('🔊 Generated audio URL:', audioUrl);
      
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        
        audio.onended = () => {
          console.log('✅ Audio playback completed');
          setIsNarrating(false);
          setCharacterAnimation('idle');
          setCurrentAudio(null);
        };
        
        audio.onerror = (e) => {
          console.error('❌ Audio playback error:', e);
          console.error('Failed URL was:', audioUrl);
          // Fallback to whale sounds if narration fails
          playWhaleSound();
          setIsNarrating(false);
          setCharacterAnimation('idle');
        };
        
        console.log('▶️ Starting audio playback...');
        await audio.play();
      } else {
        console.error('❌ No audio URL returned from Higgs service');
        console.log('🔄 Falling back to Web Speech API...');
        
        try {
          // Use Web Speech API as fallback
          await webSpeechService.generateOldTomVoice(chapterText);
          setIsNarrating(false);
          setCharacterAnimation('idle');
        } catch (speechError) {
          console.error('❌ Web Speech API also failed:', speechError);
          // Final fallback to whale sounds
          playWhaleSound();
          setIsNarrating(false);
          setCharacterAnimation('idle');
        }
      }
    } catch (error) {
      console.error('Error narrating chapter:', error);
      playWhaleSound();
      setIsNarrating(false);
      setCharacterAnimation('idle');
    }
  };

  const stopNarration = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      setCurrentAudio(null);
    }
    // Also stop Web Speech if it's playing
    webSpeechService.stop();
    setIsNarrating(false);
    setCharacterAnimation('idle');
  };

  const nextChapter = () => {
    if (currentChapter < storyChapters.length) {
      stopNarration();
      setCurrentChapter(currentChapter + 1);
      setCharacterAnimation('swimming');
      playWhaleSound();
      setTimeout(() => setCharacterAnimation('idle'), 1500);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 1) {
      stopNarration();
      setCurrentChapter(currentChapter - 1);
      setCharacterAnimation('swimming');
      setTimeout(() => setCharacterAnimation('idle'), 1500);
    }
  };

  useEffect(() => {
    if (currentChapter > 0 && currentChapter <= storyChapters.length) {
      setCurrentMood(storyChapters[currentChapter - 1].mood);
    }
  }, [currentChapter]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  console.log('App: Rendering, loading state:', loading);
  
  if (loading) {
    console.log('App: Showing loading screen');
    try {
      return <LoadingScreen />;
    } catch (error) {
      console.error('App: LoadingScreen failed:', error);
      // Fallback loading UI
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: '#0a1a2e'
        }}>
          <CircularProgress />
        </div>
      );
    }
  }

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          
          <link 
            href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" 
            rel="stylesheet" 
          />

          <Box
            sx={{
              position: 'relative',
              minHeight: '100vh',
              background: currentChapter === 0 
                ? 'linear-gradient(180deg, #0a1a2e 0%, #1a3a4e 50%, #0a2a3e 100%)'
                : currentChapter === 4 
                ? 'linear-gradient(180deg, #1a1a1a 0%, #2c2c2c 50%, #1a2a3a 100%)' // Stormy
                : currentChapter === 5
                ? 'linear-gradient(180deg, #1a2a3e 0%, #3a2a1e 50%, #2a1a0e 100%)' // Sunset
                : currentChapter === 6
                ? 'linear-gradient(180deg, #2a3a4e 0%, #3a4a5e 50%, #4a5a6e 100%)' // Museum day
                : 'linear-gradient(180deg, #0a1a2e 0%, #1a3a4e 50%, #0a2a3e 100%)', // Default ocean
              transition: 'background 2s ease-in-out',
              overflow: 'hidden',
            }}
          >
            {/* Debug Overlay - Always visible */}
            <Box sx={{ 
              position: 'fixed', 
              top: 10, 
              right: 10, 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              color: 'white',
              padding: 2,
              borderRadius: 1,
              zIndex: 9999,
              fontSize: '12px',
              fontFamily: 'monospace',
              maxWidth: '300px'
            }}>
              <div>Debug Info:</div>
              <div>Loading: {loading ? 'YES' : 'NO'}</div>
              <div>Chapter: {currentChapter}</div>
              <div>Chat: {chatVisible ? 'YES' : 'NO'}</div>
              <div>Services: {higgsAudioService ? '✓' : '✗'} Higgs, {webSpeechService ? '✓' : '✗'} Speech</div>
              <div style={{ marginTop: '10px' }}>
                <button 
                  onClick={() => window.location.reload()} 
                  style={{ 
                    padding: '5px 10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reload
                </button>
              </div>
            </Box>
            
            {/* Ocean Background */}
            <Box sx={{ position: 'absolute', inset: 0, zIndex: 1 }}>
              <OceanParticles 
                intensity={currentChapter === 0 ? "low" : currentChapter === 4 ? "high" : "medium"} 
                mood={currentMood}
              />
            </Box>

            {/* Chapter-specific visuals */}
            {currentChapter > 0 && (
              <ChapterVisuals 
                chapter={currentChapter} 
                mood={currentMood}
              />
            )}

            {/* Landing Page */}
            {currentChapter === 0 && (
              <Fade in timeout={1000}>
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 4, sm: 0 },
                    textAlign: 'center',
                  }}
                >
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      color: '#FFFFFF', 
                      mb: { xs: 1, sm: 2 },
                      px: { xs: 1, sm: 0 }
                    }}
                  >
                    Old Tom
                  </Typography>
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      color: '#FFD700', 
                      fontStyle: 'italic', 
                      mb: { xs: 3, sm: 4 },
                      px: { xs: 1, sm: 0 }
                    }}
                  >
                    The Living Legend of Eden Bay
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      maxWidth: { xs: '100%', sm: '600px' }, 
                      mb: { xs: 4, sm: 6 },
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                      px: { xs: 1, sm: 2 }
                    }}
                  >
                    The true story of an extraordinary partnership between orcas and whalers 
                    that lasted over 30 years in Eden, Australia.
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      gap: { xs: 2, sm: 3 }, 
                      flexDirection: { xs: 'column', sm: 'row' },
                      width: { xs: '100%', sm: 'auto' },
                      px: { xs: 2, sm: 0 }
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={startStory}
                      startIcon={<PlayIcon />}
                      fullWidth
                      sx={{
                        background: 'linear-gradient(45deg, #2E8B57 30%, #4CAF50 90%)',
                        fontSize: { xs: '1rem', sm: '1.2rem' },
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1.5, sm: 2 },
                        minHeight: { xs: '48px', sm: '56px' },
                        width: { xs: '100%', sm: 'auto' }
                      }}
                    >
                      Begin the Story
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => setChatVisible(true)}
                      startIcon={<ChatIcon />}
                      fullWidth
                      sx={{
                        borderColor: '#FFD700',
                        color: '#FFD700',
                        fontSize: { xs: '1rem', sm: '1.2rem' },
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1.5, sm: 2 },
                        minHeight: { xs: '48px', sm: '56px' },
                        width: { xs: '100%', sm: 'auto' },
                        '&:hover': {
                          borderColor: '#FFD700',
                          backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        }
                      }}
                    >
                      Ask Old Tom
                    </Button>
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Story Chapters */}
            {currentChapter > 0 && currentChapter <= storyChapters.length && (
              <Fade in timeout={1000}>
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    px: { xs: 2, md: 4 },
                    py: 4,
                  }}
                >
                  {/* Chapter Header */}
                  <Box sx={{ 
                    textAlign: 'center', 
                    mb: { xs: 3, sm: 4 },
                    px: { xs: 1, sm: 0 }
                  }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: '#D4AF37', 
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' }
                      }}
                    >
                      Chapter {currentChapter}
                    </Typography>
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        color: '#FFFFFF', 
                        mb: { xs: 1, sm: 2 },
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                      }}
                    >
                      {storyChapters[currentChapter - 1].title}
                    </Typography>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: '#4FC3F7', 
                        fontStyle: 'italic',
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' }
                      }}
                    >
                      {storyChapters[currentChapter - 1].year}
                    </Typography>
                  </Box>

                  {/* Story Content */}
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      maxWidth: { xs: '100%', sm: '90%', md: '800px' },
                      mx: 'auto',
                      position: 'relative',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ position: 'relative', width: '100%' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#F5F5DC',
                          textAlign: 'center',
                          px: { xs: 2, sm: 3 },
                          py: { xs: 3, sm: 4 },
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          borderRadius: 2,
                          backdropFilter: 'blur(5px)',
                          fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.2rem' },
                          lineHeight: { xs: 1.7, sm: 1.8 },
                        }}
                      >
                        {storyChapters[currentChapter - 1].content}
                      </Typography>
                      
                      {/* Narration Button */}
                      <IconButton
                        onClick={() => isNarrating ? stopNarration() : narateChapter(currentChapter - 1)}
                        sx={{
                          position: { xs: 'relative', sm: 'absolute' },
                          bottom: { xs: 'auto', sm: 20 },
                          right: { xs: 'auto', sm: 20 },
                          mt: { xs: 2, sm: 0 },
                          mx: { xs: 'auto', sm: 0 },
                          display: { xs: 'flex', sm: 'inline-flex' },
                          backgroundColor: isNarrating ? 'rgba(255, 87, 34, 0.2)' : 'rgba(255, 215, 0, 0.2)',
                          color: isNarrating ? '#FF5722' : '#FFD700',
                          border: `2px solid ${isNarrating ? '#FF5722' : '#FFD700'}`,
                          width: { xs: '56px', sm: '48px' },
                          height: { xs: '56px', sm: '48px' },
                          '&:hover': {
                            backgroundColor: isNarrating ? 'rgba(255, 87, 34, 0.3)' : 'rgba(255, 215, 0, 0.3)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                        title={isNarrating ? "Stop narration" : "Listen to Old Tom narrate this chapter"}
                      >
                        {isNarrating ? (
                          <>
                            <StopIcon />
                            <CircularProgress
                              size={40}
                              sx={{
                                color: '#FF5722',
                                position: 'absolute',
                                opacity: 0.3,
                              }}
                            />
                          </>
                        ) : (
                          <VolumeUpIcon />
                        )}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Navigation */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: { xs: 3, sm: 4 },
                      px: { xs: 1, sm: 0 },
                      gap: { xs: 2, sm: 3 },
                    }}
                  >
                    <IconButton
                      onClick={prevChapter}
                      disabled={currentChapter === 1}
                      sx={{
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        width: { xs: '48px', sm: '56px' },
                        height: { xs: '48px', sm: '56px' },
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:disabled': { opacity: 0.3 },
                      }}
                    >
                      <ArrowBackIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
                    </IconButton>

                    <Box sx={{ 
                      display: 'flex', 
                      gap: { xs: 0.5, sm: 1 },
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      maxWidth: { xs: '200px', sm: 'none' }
                    }}>
                      {storyChapters.map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: { xs: 6, sm: 8 },
                            height: { xs: 6, sm: 8 },
                            borderRadius: '50%',
                            backgroundColor: currentChapter === index + 1 ? '#FFD700' : 'rgba(255, 255, 255, 0.3)',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      ))}
                    </Box>

                    <IconButton
                      onClick={nextChapter}
                      disabled={currentChapter === storyChapters.length}
                      sx={{
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        width: { xs: '48px', sm: '56px' },
                        height: { xs: '48px', sm: '56px' },
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:disabled': { opacity: 0.3 },
                      }}
                    >
                      <ArrowForwardIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
                    </IconButton>
                  </Box>

                  {/* Ask Old Tom Button */}
                  <Box sx={{ 
                    textAlign: 'center', 
                    mt: { xs: 2, sm: 3 },
                    px: { xs: 2, sm: 0 }
                  }}>
                    <Button
                      variant="text"
                      onClick={() => setChatVisible(true)}
                      sx={{ 
                        color: '#4FC3F7',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        padding: { xs: '8px 16px', sm: '10px 20px' }
                      }}
                    >
                      Have questions? Ask Old Tom
                    </Button>
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Old Tom Character */}
            {currentChapter > 0 && (
              <Fade in timeout={1000}>
                <Box
                  sx={{
                    position: 'fixed',
                    bottom: { xs: '2%', sm: '5%' },
                    right: { xs: '2%', sm: '5%' },
                    zIndex: 5,
                    display: { xs: 'none', sm: 'block' }, // Hide on mobile to avoid clutter
                  }}
                >
                  <OldTomCharacter
                    animationType={characterAnimation}
                    size="medium"
                    position="center"
                  />
                </Box>
              </Fade>
            )}

            {/* Chat Interface (Secondary) */}
            <OldTomChat 
              open={chatVisible} 
              onClose={() => setChatVisible(false)} 
            />

            {/* Background Music */}
            <OrchestraManager
              currentMood={currentMood}
              isPlaying={currentChapter > 0}
              volume={0.15}
              onMoodChange={(mood: string) => setCurrentMood(mood as any)}
            />

            {/* Ambient Ocean Sounds */}
            <AmbientSounds 
              chapter={currentChapter}
              isPlaying={currentChapter > 0}
            />

            {/* Debug Panel for iPad */}
            <DebugPanel />
          </Box>
        </ThemeProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
};

export default App;