import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import Lottie from 'lottie-react';
import { animated, useSpring } from '@react-spring/web';

import { useAppSelector } from '@/store';

interface OldTomCharacterProps {
  size?: 'small' | 'medium' | 'large';
  animation?: 'idle' | 'talking' | 'happy' | 'sad' | 'surprised' | 'thoughtful';
  showGreeting?: boolean;
  onInteraction?: () => void;
  interactive?: boolean;
}

const greetings = [
  "Welcome to my ocean realm, young explorer!",
  "The tides have brought you to me...",
  "Ah, another soul seeking stories from the deep!",
  "Come closer, and I'll share the ocean's secrets.",
  "The waves whisper of your arrival...",
];

export const OldTomCharacter: React.FC<OldTomCharacterProps> = ({
  size = 'medium',
  animation = 'idle',
  showGreeting = false,
  onInteraction,
  interactive = true,
}) => {
  const [currentGreeting, setCurrentGreeting] = useState('');
  const [showGreetingText, setShowGreetingText] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  const { characters, isCharacterSpeaking } = useAppSelector(state => state.character);
  const character = characters['old-tom'];

  // Size configurations
  const sizeConfig = {
    small: { width: 80, height: 80 },
    medium: { width: 150, height: 150 },
    large: { width: 200, height: 200 },
  };

  const dimensions = sizeConfig[size];

  // Animation springs
  const floatAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-10px)' });
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
    transform: isCharacterSpeaking ? 'scale(1.02)' : 'scale(1)',
    filter: isCharacterSpeaking ? 'brightness(1.05) saturate(1.2)' : 'brightness(1) saturate(1)',
    config: { tension: 150, friction: 15 },
  });

  // Load animation data (placeholder - in real implementation, load from assets)
  useEffect(() => {
    // Simulate loading Lottie animation data
    const loadAnimation = async () => {
      try {
        // In a real implementation, you would load the actual Lottie JSON files
        // const response = await fetch(character?.animations[animation]);
        // const data = await response.json();
        // setAnimationData(data);
        
        // For now, we'll use a placeholder
        setAnimationData(null);
      } catch (error) {
        console.error('Error loading animation:', error);
      }
    };

    loadAnimation();
  }, [animation, character]);

  // Show greeting on mount
  useEffect(() => {
    if (showGreeting) {
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      setCurrentGreeting(greeting);
      
      setTimeout(() => {
        setShowGreetingText(true);
      }, 1000);

      // Hide greeting after 5 seconds
      setTimeout(() => {
        setShowGreetingText(false);
      }, 6000);
    }
  }, [showGreeting]);

  const handleClick = () => {
    if (interactive && onInteraction) {
      onInteraction();
    }
  };

  const handleMouseEnter = () => {
    if (interactive) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Character Container */}
      <animated.div
        style={{
          ...floatAnimation,
          ...hoverAnimation,
          ...speakingAnimation,
        }}
      >
        <Box
          sx={{
            width: dimensions.width,
            height: dimensions.height,
            position: 'relative',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(21, 101, 192, 0.1), rgba(2, 119, 189, 0.2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(21, 101, 192, 0.2)',
            border: '3px solid rgba(21, 101, 192, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': interactive ? {
              boxShadow: '0 12px 40px rgba(21, 101, 192, 0.3)',
              border: '3px solid rgba(21, 101, 192, 0.5)',
            } : {},
          }}
        >
          {/* Lottie Animation or Placeholder */}
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop
              style={{
                width: '90%',
                height: '90%',
              }}
            />
          ) : (
            // Placeholder character representation
            <Box
              sx={{
                width: '80%',
                height: '80%',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #1565C0, #42A5F5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: size === 'large' ? '3rem' : size === 'medium' ? '2rem' : '1.5rem',
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              🌊
            </Box>
          )}

          {/* Speaking indicator */}
          {isCharacterSpeaking && (
            <Box
              sx={{
                position: 'absolute',
                top: -5,
                right: -5,
                width: 20,
                height: 20,
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

          {/* Mood indicator */}
          {character?.currentMood && (
            <Box
              sx={{
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '1.2rem',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              }}
            >
              {character.currentMood === 'happy' && '😊'}
              {character.currentMood === 'wise' && '🧙‍♂️'}
              {character.currentMood === 'mysterious' && '🌟'}
              {character.currentMood === 'calm' && '😌'}
              {character.currentMood === 'excited' && '🎉'}
              {character.currentMood === 'sad' && '😔'}
            </Box>
          )}
        </Box>
      </animated.div>

      {/* Greeting Speech Bubble */}
      <Fade in={showGreetingText} timeout={500}>
        <Box
          sx={{
            position: 'absolute',
            top: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            padding: 2,
            maxWidth: 250,
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            border: '1px solid rgba(21, 101, 192, 0.2)',
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
              borderTop: '8px solid rgba(255, 255, 255, 0.95)',
            },
          }}
        >
          <Typography
            variant={size === 'large' ? 'body1' : 'body2'}
            sx={{
              color: '#1565C0',
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            {currentGreeting}
          </Typography>
        </Box>
      </Fade>

      {/* Interactive hint */}
      {interactive && isHovered && (
        <Fade in timeout={200}>
          <Typography
            variant="caption"
            sx={{
              mt: 1,
              color: '#1565C0',
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Click to interact
          </Typography>
        </Fade>
      )}
    </Box>
  );
};

export default OldTomCharacter;