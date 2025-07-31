// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, Fade, IconButton, Tooltip, Alert } from '@mui/material';
import { Mic, MicOff, VolumeUp, VolumeOff, Psychology, Chat } from '@mui/icons-material';
import { animated, useSpring } from '@react-spring/web';

import { speechRecognitionService } from '../../services/speechRecognitionService';
import { emotionalAIService } from '../../services/emotionalAIService';
import { askOldTomService } from '../../services/askOldTomService';
import { privacyService } from '../../services/privacyService';

interface AIIntegratedCharacterProps {
  characterId: 'old-tom' | 'george-davidson' | 'child-narrator';
  position?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  enableVoice?: boolean;
  enableEmotionalAI?: boolean;
  context?: string;
  childAge?: number;
  onAIResponse?: (response: string) => void;
  showControls?: boolean;
  autoInitialize?: boolean;
}

const characterConfig = {
  'old-tom': {
    name: 'Old Tom',
    emoji: '🐋',
    color: '#1565C0',
    gradientColors: ['rgba(21, 101, 192, 0.1)', 'rgba(2, 119, 189, 0.2)'],
    greetings: [
      "Welcome to my ocean realm, young explorer!",
      "The tides have brought you to me...",
      "Ah, another soul seeking stories from the deep!",
      "Come closer, and I'll share the ocean's secrets."
    ]
  },
  'george-davidson': {
    name: 'George Davidson',
    emoji: '⚓',
    color: '#8D6E63',
    gradientColors: ['rgba(141, 110, 99, 0.1)', 'rgba(121, 85, 72, 0.2)'],
    greetings: [
      "G'day there, young mate! Welcome aboard our story.",
      "Well hello there, little sailor! Ready to hear some tales?",
      "Ah, a curious young soul! Come here and I'll tell you about the old days."
    ]
  },
  'child-narrator': {
    name: 'Young Explorer',
    emoji: '👦',
    color: '#FF9800',
    gradientColors: ['rgba(255, 152, 0, 0.1)', 'rgba(245, 124, 0, 0.2)'],
    greetings: [
      "Oh wow! Are you here to learn about Old Tom too?",
      "Hi there! I can't wait to show you what I've discovered!",
      "Welcome! You're going to love meeting Old Tom!"
    ]
  }
};

export const AIIntegratedCharacter: React.FC<AIIntegratedCharacterProps> = ({
  characterId,
  position = 'center',
  size = 'medium',
  interactive = true,
  enableVoice = true,
  enableEmotionalAI = true,
  context = 'general',
  childAge,
  onAIResponse,
  showControls = true,
  autoInitialize = true
}) => {
  const config = characterConfig[characterId];
  
  // Local state management (replacing Redux)
  const [isHovered, setIsHovered] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [currentGreeting, setCurrentGreeting] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [averageResponseTime, setAverageResponseTime] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Size configurations
  const sizeConfig = {
    small: { width: 80, height: 80, fontSize: '1.5rem' },
    medium: { width: 150, height: 150, fontSize: '2rem' },
    large: { width: 200, height: 200, fontSize: '3rem' },
  };
  const dimensions = sizeConfig[size];
  
  // Position configurations
  const positionStyles = {
    left: { position: 'absolute' as const, left: 20, top: '50%', transform: 'translateY(-50%)' },
    center: { position: 'relative' as const, margin: '0 auto' },
    right: { position: 'absolute' as const, right: 20, top: '50%', transform: 'translateY(-50%)' }
  };
  
  // Initialize AI session
  useEffect(() => {
    if (autoInitialize && !sessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      
      // Show greeting after initialization
      setTimeout(() => {
        const greeting = config.greetings[Math.floor(Math.random() * config.greetings.length)];
        setCurrentGreeting(greeting);
        setShowGreeting(true);
        
        // Auto-hide greeting
        setTimeout(() => setShowGreeting(false), 5000);
      }, 1000);
    }
  }, [autoInitialize, sessionId, config.greetings]);
  
  // Speech recognition setup
  useEffect(() => {
    if (!enableVoice) return;
    
    const handleSpeechResult = (result: any) => {
      setSpeechTranscript(result.transcript);
      
      if (result.isFinal && result.transcript.trim()) {
        handleVoiceInput(result.transcript);
      }
    };
    
    const handleSpeechError = (error: Error) => {
      console.error('Speech recognition error:', error);
      setIsListening(false);
    };
    
    speechRecognitionService.addListener('result', handleSpeechResult);
    speechRecognitionService.addErrorListener(handleSpeechError);
    
    return () => {
      speechRecognitionService.removeListener('result', handleSpeechResult);
      speechRecognitionService.removeErrorListener(handleSpeechError);
    };
  }, [enableVoice]);
  
  // Handle AI interactions
  const handleAIInteraction = useCallback(async (inputText?: string, interactionType: string = 'casual_chat') => {
    if (isProcessing) return;
    
    // Check privacy consent first
    if (!privacyConsent) {
      try {
        const consent = await privacyService.requestConsent(
          'basic_interaction',
          childAge || 7,
          ['basic_interaction', 'character_chat']
        );
        setPrivacyConsent(consent.consentRequired || false);
        if (!consent) return;
      } catch (error) {
        console.error('Privacy consent failed:', error);
        return;
      }
    }
    
    setIsProcessing(true);
    const startTime = Date.now();
    
    try {
      const response = await askOldTomService.askOldTom({
        question: inputText || `Hello ${config.name}!`,
        childAge: childAge || 7,
        sessionId: sessionId || 'default-session',
        context: {
          currentEmotion: currentEmotion || undefined,
          previousTopics: [],
          learningLevel: 'beginner'
        },
        inputMethod: inputText ? 'text' : 'voice'
      });
      
      if (response.textResponse) {
        setAiResponse(response.textResponse);
        onAIResponse?.(response.textResponse);
        
        // Update emotional state if available
        if (response.emotion) {
          setCurrentEmotion(response.emotion);
        }
        
        // Auto-hide AI response after 8 seconds
        setTimeout(() => setAiResponse(''), 8000);
        
        // Handle voice synthesis if enabled
        if (enableVoice && voiceEnabled && response.textResponse) {
          playAudioResponse(response.textResponse);
        }
      }
      
      // Update performance metrics
      const responseTime = Date.now() - startTime;
      setAverageResponseTime(prev => prev === 0 ? responseTime : (prev + responseTime) / 2);
      
    } catch (error) {
      console.error('AI interaction failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, privacyConsent, childAge, sessionId, config.name, currentEmotion, onAIResponse, enableVoice, voiceEnabled]);
  
  const handleVoiceInput = useCallback(async (transcript: string) => {
    await handleAIInteraction(transcript, 'question');
  }, [handleAIInteraction]);
  
  const handleVoiceToggle = useCallback(async () => {
    if (!enableVoice) return;
    
    if (isListening) {
      speechRecognitionService.stopListening();
      setIsListening(false);
    } else {
      try {
        await speechRecognitionService.startListening();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition start failed:', error);
      }
    }
  }, [enableVoice, isListening]);
  
  const playAudioResponse = useCallback((text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Character-specific voice settings
      if (characterId === 'old-tom') {
        utterance.rate = 0.7;
        utterance.pitch = 0.6;
      } else if (characterId === 'george-davidson') {
        utterance.rate = 0.8;
        utterance.pitch = 0.8;
      } else if (characterId === 'child-narrator') {
        utterance.rate = 1.0;
        utterance.pitch = 1.2;
      }
      
      utterance.volume = 0.7;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  }, [characterId, voiceEnabled]);
  
  const toggleVoice = useCallback(() => {
    setVoiceEnabled(!voiceEnabled);
  }, [voiceEnabled]);
  
  // Animations
  const floatAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-8px)' });
        await next({ transform: 'translateY(0px)' });
      }
    },
    config: { duration: 3000 },
  });
  
  const hoverAnimation = useSpring({
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
    config: { tension: 200, friction: 20 },
  });
  
  const speakingAnimation = useSpring({
    transform: isSpeaking ? 'scale(1.02)' : 'scale(1)',
    filter: isSpeaking ? 'brightness(1.05) saturate(1.2)' : 'brightness(1) saturate(1)',
    config: { tension: 150, friction: 15 },
  });
  
  const emotionalAnimation = useSpring({
    borderColor: currentEmotion ? 
      (currentEmotion === 'excited' ? '#FFD700' :
       currentEmotion === 'gentle' ? '#87CEEB' :
       currentEmotion === 'wise' ? '#DDA0DD' : config.color) :
      config.color,
    boxShadow: isListening ? 
      `0 0 20px ${config.color}66, 0 0 40px ${config.color}33` :
      `0 8px 32px ${config.color}33`,
    config: { duration: 1000 }
  });
  
  return (
    <Box
      sx={{
        ...positionStyles[position],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
        zIndex: 10,
      }}
      onClick={() => interactive && handleAIInteraction()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Privacy Notice */}
      {!privacyConsent && (
        <Alert 
          severity="info" 
          sx={{ 
            position: 'absolute', 
            top: -60, 
            left: '50%', 
            transform: 'translateX(-50%)',
            fontSize: '0.75rem',
            maxWidth: 250
          }}
        >
          Click to start AI conversation (parental consent may be required)
        </Alert>
      )}
      
      {/* AI Controls */}
      {showControls && enableVoice && (
        <Box
          sx={{
            position: 'absolute',
            top: -45,
            right: -25,
            display: 'flex',
            gap: 0.5,
            zIndex: 10,
          }}
        >
          <Tooltip title={isListening ? 'Stop Listening' : 'Start Voice Chat'}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleVoiceToggle();
              }}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: isListening ? '#FF9800' : '#2196F3',
                color: 'white',
                '&:hover': {
                  backgroundColor: isListening ? '#F57C00' : '#1976D2',
                },
              }}
            >
              {isListening ? <MicOff fontSize="small" /> : <Mic fontSize="small" />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title={voiceEnabled ? 'Mute Voice' : 'Enable Voice'}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleVoice();
              }}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: voiceEnabled ? '#4CAF50' : '#9E9E9E',
                color: 'white',
                '&:hover': {
                  backgroundColor: voiceEnabled ? '#388E3C' : '#757575',
                },
              }}
            >
              {voiceEnabled ? <VolumeUp fontSize="small" /> : <VolumeOff fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
      
      {/* Main Character */}
      <animated.div
        style={{
          ...floatAnimation,
          ...hoverAnimation,
          ...speakingAnimation,
        }}
      >
        <animated.div style={emotionalAnimation}>
          <Box
            sx={{
              width: dimensions.width,
              height: dimensions.height,
              position: 'relative',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${config.gradientColors[0]}, ${config.gradientColors[1]})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid',
              borderColor: config.color,
              transition: 'all 0.3s ease',
              '&:hover': interactive ? {
                transform: 'scale(1.02)',
              } : {},
            }}
          >
            {/* Character Emoji/Icon */}
            <Box
              sx={{
                fontSize: dimensions.fontSize,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              }}
            >
              {config.emoji}
            </Box>
            
            {/* Status Indicators */}
            {isSpeaking && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#4CAF50',
                  border: '2px solid white',
                  animation: 'pulse 1s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.2)', opacity: 0.7 },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                  },
                }}
              />
            )}
            
            {isListening && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -5,
                  left: -5,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#FF9800',
                  border: '2px solid white',
                  animation: 'bounce 1s ease-in-out infinite',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-3px)' },
                  },
                }}
              />
            )}
            
            {isProcessing && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  right: -5,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#2196F3',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Psychology fontSize="inherit" sx={{ fontSize: '10px', color: 'white' }} />
              </Box>
            )}
            
            {/* Emotion Indicator */}
            {currentEmotion && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '1rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}
              >
                {currentEmotion === 'excited' && '🎉'}
                {currentEmotion === 'wise' && '🧙‍♂️'}
                {currentEmotion === 'gentle' && '😌'}
                {currentEmotion === 'curious' && '🌟'}
                {currentEmotion === 'happy' && '😊'}
                {currentEmotion === 'protective' && '🛡️'}
              </Box>
            )}
          </Box>
        </animated.div>
      </animated.div>
      
      {/* Speech Transcript */}
      {speechTranscript && isListening && (
        <Fade in timeout={200}>
          <Box
            sx={{
              position: 'absolute',
              top: -90,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              padding: 1.5,
              maxWidth: 250,
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              border: `1px solid ${config.color}`,
            }}
          >
            <Typography variant="caption" sx={{ color: config.color, fontWeight: 500 }}>
              "{speechTranscript}"
            </Typography>
          </Box>
        </Fade>
      )}
      
      {/* Greeting */}
      {showGreeting && currentGreeting && (
        <Fade in timeout={500}>
          <Box
            sx={{
              position: 'absolute',
              top: speechTranscript ? -140 : -90,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              padding: 2,
              maxWidth: 280,
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              border: `1px solid ${config.color}`,
              zIndex: 5,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid rgba(255, 255, 255, 0.95)',
              },
            }}
          >
            <Typography
              variant={size === 'large' ? 'body1' : 'body2'}
              sx={{
                color: config.color,
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              {currentGreeting}
            </Typography>
          </Box>
        </Fade>
      )}
      
      {/* AI Response */}
      {aiResponse && (
        <Fade in timeout={500}>
          <Box
            sx={{
              position: 'absolute',
              top: (showGreeting || speechTranscript) ? -180 : -90,
              left: '50%',
              transform: 'translateX(-50%)',
              background: `${config.color}DD`,
              color: 'white',
              borderRadius: 3,
              padding: 2,
              maxWidth: 320,
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              zIndex: 10,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: `8px solid ${config.color}DD`,
              },
            }}
          >
            <Typography
              variant={size === 'large' ? 'body1' : 'body2'}
              sx={{
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              {aiResponse}
            </Typography>
          </Box>
        </Fade>
      )}
      
      {/* Interactive Hints */}
      {interactive && isHovered && !isProcessing && (
        <Fade in timeout={200}>
          <Typography
            variant="caption"
            sx={{
              mt: 1,
              color: config.color,
              fontWeight: 500,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Chat fontSize="inherit" />
            Click to chat with {config.name}
          </Typography>
        </Fade>
      )}
      
      {isProcessing && (
        <Fade in timeout={200}>
          <Typography
            variant="caption"
            sx={{
              mt: 1,
              color: '#2196F3',
              fontWeight: 500,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Psychology fontSize="inherit" />
            {config.name} is thinking...
          </Typography>
        </Fade>
      )}
      
      {/* Performance indicator for debugging */}
      {process.env.NODE_ENV === 'development' && averageResponseTime > 0 && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: -40,
            fontSize: '0.7rem',
            color: '#666',
            textAlign: 'center',
          }}
        >
          Avg: {Math.round(averageResponseTime)}ms
        </Typography>
      )}
    </Box>
  );
};

export default AIIntegratedCharacter;