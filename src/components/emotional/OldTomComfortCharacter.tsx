import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  alpha,
  Fade
} from '@mui/material';
import {
  Favorite,
  Hug,
  SelfImprovement,
  MusicNote,
  Lightbulb
} from '@mui/icons-material';
import { useSpring, animated, config } from '@react-spring/web';
import { useAccessibility } from '../accessibility/AccessibilityProvider';

interface ComfortResponse {
  type: 'reassurance' | 'distraction' | 'breathing' | 'story' | 'music';
  message: string;
  childMessage: string;
  action?: () => void;
  duration?: number;
}

interface OldTomComfortCharacterProps {
  emotionalState: {
    comfort: number;
    needsSupport: boolean;
    lastTrigger?: string;
  };
  onComfortProvided: () => void;
  visible: boolean;
}

export const OldTomComfortCharacter: React.FC<OldTomComfortCharacterProps> = ({
  emotionalState,
  onComfortProvided,
  visible
}) => {
  const theme = useTheme();
  const { settings, announceToScreenReader } = useAccessibility();
  const [currentResponse, setCurrentResponse] = useState<ComfortResponse | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);

  // Old Tom's comfort responses based on emotional state
  const comfortResponses: ComfortResponse[] = [
    {
      type: 'reassurance',
      message: "I'm here with you, and everything is going to be okay. You're safe with me.",
      childMessage: "I'm here with you! You're safe and everything is okay.",
    },
    {
      type: 'breathing',
      message: "Let's take some deep breaths together. Breathe in slowly with me...",
      childMessage: "Let's breathe together! In... and out... nice and slow.",
      action: () => setShowBreathingGuide(true)
    },
    {
      type: 'distraction',
      message: "Would you like to think about something happy? Maybe the beautiful ocean waves?",
      childMessage: "Let's think about happy things! Like playing in the ocean waves!",
    },
    {
      type: 'story',
      message: "I have a gentle story about when I helped other whales feel better. Would you like to hear it?",
      childMessage: "I know a happy story about helping other whale friends! Want to hear it?",
    },
    {
      type: 'music',
      message: "Sometimes gentle whale songs help me feel better. Shall we listen to some peaceful sounds?",
      childMessage: "Let's listen to gentle whale songs together. They always make me feel better!",
    }
  ];

  // Select appropriate response based on comfort level
  const selectComfortResponse = useCallback(() => {
    if (emotionalState.comfort <= 2) {
      // Very low comfort - offer breathing and reassurance
      return comfortResponses.filter(r => r.type === 'reassurance' || r.type === 'breathing')[
        Math.floor(Math.random() * 2)
      ];
    } else if (emotionalState.comfort <= 3) {
      // Moderate discomfort - offer distractions
      return comfortResponses[Math.floor(Math.random() * comfortResponses.length)];
    }
    return null;
  }, [emotionalState.comfort, comfortResponses]);

  // Show comfort response when needed
  useEffect(() => {
    if (visible && emotionalState.needsSupport && !currentResponse) {
      const response = selectComfortResponse();
      if (response) {
        setCurrentResponse(response);
        announceToScreenReader(`Old Tom says: ${settings.simplifiedLanguage ? response.childMessage : response.message}`);
      }
    }
  }, [visible, emotionalState.needsSupport, currentResponse, selectComfortResponse, settings.simplifiedLanguage, announceToScreenReader]);

  // Old Tom character animation
  const tomAnimation = useSpring({
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1) translateY(0px)' : 'scale(0.8) translateY(20px)',
    config: config.gentle
  });

  // Breathing animation for Old Tom
  const breathingAnimation = useSpring({
    transform: isBreathing ? 'scale(1.05)' : 'scale(1)',
    config: { duration: 2000 },
    loop: isBreathing
  });

  // Comfort message animation
  const messageAnimation = useSpring({
    opacity: currentResponse ? 1 : 0,
    transform: currentResponse ? 'translateY(0px)' : 'translateY(10px)',
    config: config.gentle
  });

  // Start breathing exercise
  const startBreathingExercise = useCallback(() => {
    setIsBreathing(true);
    setShowBreathingGuide(true);
    announceToScreenReader('Starting breathing exercise with Old Tom');
    
    // Guide through breathing cycles
    let cycle = 0;
    const maxCycles = 5;
    
    const breathingGuide = setInterval(() => {
      if (cycle >= maxCycles) {
        setIsBreathing(false);
        setShowBreathingGuide(false);
        clearInterval(breathingGuide);
        announceToScreenReader('Breathing exercise complete. How are you feeling now?');
        onComfortProvided();
        return;
      }
      
      // In breath
      announceToScreenReader('Breathe in slowly...');
      setTimeout(() => {
        announceToScreenReader('Hold...');
        setTimeout(() => {
          announceToScreenReader('Breathe out slowly...');
          cycle++;
        }, 1000);
      }, 4000);
    }, 8000);
  }, [announceToScreenReader, onComfortProvided]);

  // Handle comfort action
  const handleComfortAction = useCallback((response: ComfortResponse) => {
    if (response.action) {
      response.action();
    } else {
      // Provide comfort and mark as helped
      setTimeout(() => {
        setCurrentResponse(null);
        onComfortProvided();
      }, 3000);
    }
  }, [onComfortProvided]);

  if (!visible) {
    return null;
  }

  return (
    <animated.div style={tomAnimation}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
          maxWidth: 350,
          width: '90%'
        }}
      >
        {/* Old Tom Character */}
        <Card
          sx={{
            backgroundColor: alpha(theme.palette.info.main, 0.95),
            color: theme.palette.info.contrastText,
            borderRadius: 3,
            mb: currentResponse ? 2 : 0,
            overflow: 'visible',
            border: settings.highContrast ? '2px solid white' : 'none'
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <animated.div style={breathingAnimation}>
              <Box
                sx={{
                  fontSize: '4rem',
                  mb: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
                role="img"
                aria-label="Old Tom the whale"
              >
                🐋
              </Box>
            </animated.div>
            
            <Typography variant="h6" sx={{ mb: 1 }}>
              Old Tom
            </Typography>
            
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {settings.simplifiedLanguage ? 'I'm here to help you feel better' : 'Here to provide comfort and support'}
            </Typography>
          </CardContent>
        </Card>

        {/* Comfort Message */}
        {currentResponse && (
          <animated.div style={messageAnimation}>
            <Card
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: settings.highContrast ? '2px solid currentColor' : `1px solid ${alpha(theme.palette.info.main, 0.3)}`
              }}
            >
              <CardContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {settings.simplifiedLanguage ? currentResponse.childMessage : currentResponse.message}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {currentResponse.type === 'breathing' && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={startBreathingExercise}
                      startIcon={<SelfImprovement />}
                    >
                      {settings.simplifiedLanguage ? 'Breathe with me' : 'Start breathing exercise'}
                    </Button>
                  )}
                  
                  {currentResponse.type === 'music' && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => handleComfortAction(currentResponse)}
                      startIcon={<MusicNote />}
                    >
                      {settings.simplifiedLanguage ? 'Play gentle sounds' : 'Play calming whale songs'}
                    </Button>
                  )}
                  
                  {currentResponse.type === 'story' && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => handleComfortAction(currentResponse)}
                      startIcon={<Lightbulb />}
                    >
                      {settings.simplifiedLanguage ? 'Tell me the story' : 'Share the comforting story'}
                    </Button>
                  )}
                  
                  {(currentResponse.type === 'reassurance' || currentResponse.type === 'distraction') && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => handleComfortAction(currentResponse)}
                      startIcon={<Favorite />}
                    >
                      {settings.simplifiedLanguage ? 'That helps, thank you' : 'This helps me feel better'}
                    </Button>
                  )}
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      setCurrentResponse(null);
                      onComfortProvided();
                    }}
                  >
                    {settings.simplifiedLanguage ? 'I feel better now' : 'I\'m feeling better, thanks'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </animated.div>
        )}

        {/* Breathing Guide Overlay */}
        {showBreathingGuide && (
          <Fade in={showBreathingGuide}>
            <Box
              sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10000,
                textAlign: 'center'
              }}
            >
              <Card
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.95),
                  color: theme.palette.primary.contrastText,
                  p: 4,
                  borderRadius: 3,
                  minWidth: 300
                }}
              >
                <animated.div style={breathingAnimation}>
                  <Box sx={{ fontSize: '6rem', mb: 2 }}>
                    🐋
                  </Box>
                </animated.div>
                
                <Typography variant="h4" sx={{ mb: 2 }}>
                  {settings.simplifiedLanguage ? 'Breathe with Old Tom' : 'Breathing Exercise'}
                </Typography>
                
                <Typography variant="body1">
                  {settings.simplifiedLanguage 
                    ? 'Watch Old Tom grow and shrink. Breathe with him!'
                    : 'Follow Old Tom\'s breathing rhythm. In... and out...'
                  }
                </Typography>
                
                <Button
                  onClick={() => {
                    setIsBreathing(false);
                    setShowBreathingGuide(false);
                    setCurrentResponse(null);
                    onComfortProvided();
                  }}
                  sx={{ 
                    mt: 2, 
                    color: 'inherit',
                    borderColor: 'currentColor'
                  }}
                  variant="outlined"
                >
                  {settings.simplifiedLanguage ? 'All done!' : 'Finish exercise'}
                </Button>
              </Card>
            </Box>
          </Fade>
        )}
      </Box>
    </animated.div>
  );
};

export default OldTomComfortCharacter;