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

// Import components
import OceanParticles from './components/OceanParticles';
import OldTomCharacter from './components/OldTomCharacter';
import OldTomChat from './components/OldTomChat';
import OrchestraManager from './components/OrchestraManager';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AccessibilityProvider } from './components/accessibility/AccessibilityProvider';
import LoadingScreen from './components/ui/LoadingScreen';
import { higgsAudioService } from './services/higgsAudioService';

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
      fontSize: 'clamp(2.5rem, 6vw, 4rem)',
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
    h3: {
      fontFamily: '"Cinzel", serif',
      fontWeight: 500,
      fontSize: 'clamp(1.2rem, 3vw, 2rem)',
    },
    body1: {
      fontFamily: '"Crimson Text", "Georgia", serif',
      fontSize: 'clamp(1rem, 2vw, 1.3rem)',
      lineHeight: 1.8,
    },
  },
});

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(0); // 0 = landing page
  const [chatVisible, setChatVisible] = useState(false);
  const [currentMood, setCurrentMood] = useState<'peaceful' | 'mysterious' | 'adventurous' | 'nostalgic' | 'dramatic'>('mysterious');
  const [characterAnimation, setCharacterAnimation] = useState<'idle' | 'greeting' | 'speaking' | 'swimming'>('idle');
  const [isNarrating, setIsNarrating] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
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
      const audioUrl = await higgsAudioService.generateOldTomVoice(chapterText);
      
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        
        audio.onended = () => {
          setIsNarrating(false);
          setCharacterAnimation('idle');
          setCurrentAudio(null);
        };
        
        audio.onerror = () => {
          // Fallback to whale sounds if narration fails
          playWhaleSound();
          setIsNarrating(false);
          setCharacterAnimation('idle');
        };
        
        await audio.play();
      } else {
        // Fallback to whale sounds
        playWhaleSound();
        setIsNarrating(false);
        setCharacterAnimation('idle');
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

  if (loading) {
    return <LoadingScreen />;
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
              background: 'linear-gradient(180deg, #0a1a2e 0%, #1a3a4e 50%, #0a2a3e 100%)',
              overflow: 'hidden',
            }}
          >
            {/* Ocean Background */}
            <Box sx={{ position: 'absolute', inset: 0, zIndex: 1 }}>
              <OceanParticles intensity={currentChapter === 0 ? "low" : "medium"} />
            </Box>

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
                    px: 3,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h1" sx={{ color: '#FFFFFF', mb: 2 }}>
                    Old Tom
                  </Typography>
                  <Typography variant="h2" sx={{ color: '#FFD700', fontStyle: 'italic', mb: 4 }}>
                    The Living Legend of Eden Bay
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      maxWidth: '600px', 
                      mb: 6,
                      fontSize: '1.2rem'
                    }}
                  >
                    The true story of an extraordinary partnership between orcas and whalers 
                    that lasted over 30 years in Eden, Australia.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={startStory}
                      startIcon={<PlayIcon />}
                      sx={{
                        background: 'linear-gradient(45deg, #2E8B57 30%, #4CAF50 90%)',
                        fontSize: '1.2rem',
                        px: 4,
                        py: 2,
                      }}
                    >
                      Begin the Story
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => setChatVisible(true)}
                      startIcon={<ChatIcon />}
                      sx={{
                        borderColor: '#FFD700',
                        color: '#FFD700',
                        fontSize: '1.2rem',
                        px: 4,
                        py: 2,
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
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h3" sx={{ color: '#D4AF37', mb: 1 }}>
                      Chapter {currentChapter}
                    </Typography>
                    <Typography variant="h2" sx={{ color: '#FFFFFF', mb: 2 }}>
                      {storyChapters[currentChapter - 1].title}
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#4FC3F7', fontStyle: 'italic' }}>
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
                      maxWidth: '800px',
                      mx: 'auto',
                      position: 'relative',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#F5F5DC',
                        textAlign: 'center',
                        px: 3,
                        py: 4,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 2,
                        backdropFilter: 'blur(5px)',
                      }}
                    >
                      {storyChapters[currentChapter - 1].content}
                    </Typography>
                    
                    {/* Narration Button */}
                    <IconButton
                      onClick={() => isNarrating ? stopNarration() : narateChapter(currentChapter - 1)}
                      sx={{
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                        backgroundColor: isNarrating ? 'rgba(255, 87, 34, 0.2)' : 'rgba(255, 215, 0, 0.2)',
                        color: isNarrating ? '#FF5722' : '#FFD700',
                        border: `2px solid ${isNarrating ? '#FF5722' : '#FFD700'}`,
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

                  {/* Navigation */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 4,
                    }}
                  >
                    <IconButton
                      onClick={prevChapter}
                      disabled={currentChapter === 1}
                      sx={{
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:disabled': { opacity: 0.3 },
                      }}
                    >
                      <ArrowBackIcon fontSize="large" />
                    </IconButton>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {storyChapters.map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 8,
                            height: 8,
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
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:disabled': { opacity: 0.3 },
                      }}
                    >
                      <ArrowForwardIcon fontSize="large" />
                    </IconButton>
                  </Box>

                  {/* Ask Old Tom Button */}
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button
                      variant="text"
                      onClick={() => setChatVisible(true)}
                      sx={{ color: '#4FC3F7' }}
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
                    bottom: '5%',
                    right: '5%',
                    zIndex: 5,
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
              onMoodChange={setCurrentMood}
            />
          </Box>
        </ThemeProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
};

export default App;