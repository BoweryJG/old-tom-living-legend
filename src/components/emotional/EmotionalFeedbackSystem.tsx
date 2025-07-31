// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Slider,
  useTheme,
  alpha,
  Fade,
  Zoom
} from '@mui/material';
import {
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied,
  Favorite,
  Psychology,
  Shield,
  Pause,
  VolumeOff
} from '@mui/icons-material';
import { useSpring, animated, config } from '@react-spring/web';
import { useAccessibility } from '../accessibility/AccessibilityProvider';

interface EmotionalState {
  comfort: number; // 1-5 scale
  engagement: number; // 1-5 scale
  confidence: number; // 1-5 scale
  needsSupport: boolean;
  preferredPace: 'slow' | 'normal' | 'fast';
  triggerWords: string[];
  lastUpdate: Date;
}

interface EmotionalFeedbackSystemProps {
  currentContent: {
    type: 'story' | 'conversation' | 'learning' | 'exploration';
    emotionalTone: 'happy' | 'sad' | 'scary' | 'exciting' | 'calm';
    intensityLevel: number; // 1-5
    potentialTriggers?: string[];
  };
  onStateChange: (state: EmotionalState) => void;
  onComfortAction: (action: 'pause' | 'skip' | 'support' | 'adjust') => void;
  showControls?: boolean;
}

export const EmotionalFeedbackSystem: React.FC<EmotionalFeedbackSystemProps> = ({
  currentContent,
  onStateChange,
  onComfortAction,
  showControls = true
}) => {
  const theme = useTheme();
  const { settings, announceToScreenReader } = useAccessibility();
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    comfort: 5,
    engagement: 4,
    confidence: 4,
    needsSupport: false,
    preferredPace: 'normal',
    triggerWords: [],
    lastUpdate: new Date()
  });
  
  const [showComfortCheck, setShowComfortCheck] = useState(false);
  const [showSupportOptions, setShowSupportOptions] = useState(false);
  const [oldTomResponse, setOldTomResponse] = useState<string | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout>();

  // Comfort level icons and colors
  const comfortLevels = [
    { icon: SentimentVeryDissatisfied, color: theme.palette.error.main, label: 'Very uncomfortable', childLabel: 'Really sad' },
    { icon: SentimentDissatisfied, color: theme.palette.warning.main, label: 'Uncomfortable', childLabel: 'A bit sad' },
    { icon: SentimentNeutral, color: theme.palette.info.main, label: 'Okay', childLabel: 'Okay' },
    { icon: SentimentSatisfied, color: theme.palette.success.light, label: 'Comfortable', childLabel: 'Happy' },
    { icon: SentimentVerySatisfied, color: theme.palette.success.main, label: 'Very comfortable', childLabel: 'Very happy' }
  ];

  // Monitor emotional state based on content
  useEffect(() => {
    let shouldCheckComfort = false;
    
    // Check if content might be emotionally challenging
    if (currentContent.emotionalTone === 'scary' && currentContent.intensityLevel > 3) {
      shouldCheckComfort = true;
    }
    
    if (currentContent.emotionalTone === 'sad' && currentContent.intensityLevel > 2) {
      shouldCheckComfort = true;
    }
    
    if (currentContent.potentialTriggers && currentContent.potentialTriggers.length > 0) {
      const hasTriggers = currentContent.potentialTriggers.some(trigger =>
        emotionalState.triggerWords.some(userTrigger =>
          trigger.toLowerCase().includes(userTrigger.toLowerCase())
        )
      );
      if (hasTriggers) {
        shouldCheckComfort = true;
      }
    }
    
    if (shouldCheckComfort) {
      // Delay comfort check to allow user to process content
      setTimeout(() => {
        setShowComfortCheck(true);
      }, 5000);
    }
  }, [currentContent, emotionalState.triggerWords]);

  // Periodic comfort checks during long content
  useEffect(() => {
    if (currentContent.type === 'story' || currentContent.type === 'learning') {
      checkIntervalRef.current = setInterval(() => {
        setShowComfortCheck(true);
      }, 120000); // Check every 2 minutes
    }
    
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [currentContent.type]);

  // Update emotional state
  const updateEmotionalState = useCallback((updates: Partial<EmotionalState>) => {
    const newState = {
      ...emotionalState,
      ...updates,
      lastUpdate: new Date()
    };
    setEmotionalState(newState);
    onStateChange(newState);
    
    // Trigger Old Tom's response for low comfort
    if (updates.comfort && updates.comfort <= 2) {
      setOldTomResponse("I'm here with you. Would you like me to help make this easier?");
      setTimeout(() => setOldTomResponse(null), 10000);
    }
  }, [emotionalState, onStateChange]);

  // Handle comfort level change
  const handleComfortChange = useCallback((comfort: number) => {
    updateEmotionalState({ comfort });
    setShowComfortCheck(false);
    
    if (comfort <= 2) {
      setShowSupportOptions(true);
      announceToScreenReader('Old Tom is here to help make you feel better');
    } else {
      setShowSupportOptions(false);
      if (comfort >= 4) {
        announceToScreenReader('Great! You\'re feeling good about the story');
      }
    }
  }, [updateEmotionalState, announceToScreenReader]);

  // Comfort check animation
  const comfortCheckAnimation = useSpring({
    opacity: showComfortCheck ? 1 : 0,
    transform: showComfortCheck ? 'translateY(0px)' : 'translateY(20px)',
    config: config.gentle
  });

  // Support options animation
  const supportAnimation = useSpring({
    opacity: showSupportOptions ? 1 : 0,
    transform: showSupportOptions ? 'scale(1)' : 'scale(0.9)',
    config: config.gentle
  });

  // Old Tom response animation
  const oldTomAnimation = useSpring({
    opacity: oldTomResponse ? 1 : 0,
    transform: oldTomResponse ? 'translateX(0px)' : 'translateX(-20px)',
    config: config.gentle
  });

  return (
    <>
      {/* Comfort Check Overlay */}
      {showComfortCheck && (
        <Fade in={showComfortCheck}>
          <animated.div style={comfortCheckAnimation}>
            <Box
              sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                maxWidth: 400,
                width: '90%'
              }}
            >
              <Card
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                  backdropFilter: 'blur(10px)',
                  border: settings.highContrast ? '2px solid white' : 'none',
                  borderRadius: 3,
                  boxShadow: theme.shadows[8]
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Favorite color="primary" />
                    {settings.simplifiedLanguage ? 'How are you feeling?' : 'Comfort Check'}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {settings.simplifiedLanguage 
                      ? 'Tap the face that shows how you feel right now:'
                      : 'How comfortable are you feeling right now?'
                    }
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                    {comfortLevels.map((level, index) => {
                      const IconComponent = level.icon;
                      return (
                        <Button
                          key={index}
                          onClick={() => handleComfortChange(index + 1)}
                          sx={{
                            minWidth: settings.largeTargets ? 56 : 48,
                            minHeight: settings.largeTargets ? 56 : 48,
                            borderRadius: '50%',
                            color: level.color,
                            '&:hover': {
                              backgroundColor: alpha(level.color, 0.1),
                              transform: settings.reduceMotion ? 'none' : 'scale(1.1)'
                            }
                          }}
                          aria-label={settings.simplifiedLanguage ? level.childLabel : level.label}
                        >
                          <IconComponent fontSize="large" />
                        </Button>
                      );
                    })}
                  </Box>
                  
                  <Button
                    onClick={() => setShowComfortCheck(false)}
                    variant="text"
                    size="small"
                  >
                    {settings.simplifiedLanguage ? 'Maybe later' : 'Skip for now'}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </animated.div>
        </Fade>
      )}

      {/* Support Options */}
      {showSupportOptions && (
        <Zoom in={showSupportOptions}>
          <animated.div style={supportAnimation}>
            <Box
              sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 9998,
                maxWidth: 300,
                width: '90%'
              }}
            >
              <Card
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.95),
                  color: theme.palette.primary.contrastText,
                  borderRadius: 3,
                  border: settings.highContrast ? '2px solid white' : 'none'
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Shield />
                    {settings.simplifiedLanguage ? 'I\'m here to help!' : 'Old Tom\'s Support'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        onComfortAction('pause');
                        setShowSupportOptions(false);
                      }}
                      startIcon={<Pause />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      {settings.simplifiedLanguage ? 'Take a break' : 'Pause for a moment'}
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        onComfortAction('adjust');
                        setShowSupportOptions(false);
                      }}
                      startIcon={<VolumeOff />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      {settings.simplifiedLanguage ? 'Make it quieter' : 'Reduce intensity'}
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        onComfortAction('skip');
                        setShowSupportOptions(false);
                      }}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      {settings.simplifiedLanguage ? 'Skip this part' : 'Skip to next section'}
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        onComfortAction('support');
                        setShowSupportOptions(false);
                      }}
                      startIcon={<Psychology />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      {settings.simplifiedLanguage ? 'Get extra help' : 'Talk to Old Tom'}
                    </Button>
                  </Box>
                  
                  <Button
                    fullWidth
                    onClick={() => setShowSupportOptions(false)}
                    sx={{ 
                      mt: 2, 
                      color: 'inherit',
                      textDecoration: 'underline'
                    }}
                  >
                    {settings.simplifiedLanguage ? 'I\'m okay now' : 'Continue as normal'}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </animated.div>
        </Zoom>
      )}

      {/* Old Tom's Comforting Response */}
      {oldTomResponse && (
        <animated.div style={oldTomAnimation}>
          <Box
            sx={{
              position: 'fixed',
              top: 20,
              left: 20,
              zIndex: 9997,
              maxWidth: 350,
              width: '90%'
            }}
          >
            <Card
              sx={{
                backgroundColor: alpha(theme.palette.info.main, 0.95),
                color: theme.palette.info.contrastText,
                borderRadius: 3,
                border: settings.highContrast ? '2px solid white' : 'none'
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ fontSize: '2rem' }}>🐋</Box>
                <Typography variant="body1" sx={{ flex: 1 }}>
                  {oldTomResponse}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </animated.div>
      )}

      {/* Emotional State Controls (for parents/teachers) */}
      {showControls && settings.screenReaderOptimized && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            zIndex: 9996,
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            padding: 2,
            borderRadius: 2,
            maxWidth: 250,
            border: settings.highContrast ? '1px solid white' : 'none'
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Emotional Comfort Level
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SentimentVeryDissatisfied fontSize="small" />
            <Slider
              value={emotionalState.comfort}
              onChange={(_, value) => updateEmotionalState({ comfort: value as number })}
              min={1}
              max={5}
              step={1}
              marks
              size="small"
              sx={{ flex: 1 }}
              aria-label="Comfort level"
            />
            <SentimentVerySatisfied fontSize="small" />
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            Current: {comfortLevels[emotionalState.comfort - 1]?.label}
          </Typography>
        </Box>
      )}

      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px'
        }}
      >
        {emotionalState.comfort <= 2 && 'Comfort support options are now available'}
      </div>
    </>
  );
};

export default EmotionalFeedbackSystem;