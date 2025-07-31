// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useSpring, animated, useTrail, config } from '@react-spring/web';
import { useAccessibility } from '../accessibility/AccessibilityProvider';

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  emoji?: string;
}

interface CelebrationAnimationsProps {
  type: 'achievement' | 'learning' | 'discovery' | 'mastery' | 'friendship';
  visible: boolean;
  duration?: number;
  onComplete?: () => void;
  customMessage?: string;
  intensity?: 'gentle' | 'moderate' | 'enthusiastic';
}

export const CelebrationAnimations: React.FC<CelebrationAnimationsProps> = ({
  type,
  visible,
  duration = 3000,
  onComplete,
  customMessage,
  intensity = 'moderate'
}) => {
  const theme = useTheme();
  const { settings, announceToScreenReader } = useAccessibility();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  // Different celebration configurations
  const celebrationConfigs = {
    achievement: {
      colors: [theme.palette.warning.main, theme.palette.secondary.main, theme.palette.primary.main],
      emojis: ['🏆', '⭐', '🎉', '🌟'],
      message: 'Amazing Achievement!',
      childMessage: 'You did it! Great job!',
      particleCount: intensity === 'gentle' ? 15 : intensity === 'moderate' ? 25 : 40
    },
    learning: {
      colors: [theme.palette.info.main, theme.palette.success.main, theme.palette.ocean.main],
      emojis: ['🧠', '💡', '📚', '🎓'],
      message: 'New Knowledge Unlocked!',
      childMessage: 'You learned something new!',
      particleCount: intensity === 'gentle' ? 12 : intensity === 'moderate' ? 20 : 30
    },
    discovery: {
      colors: [theme.palette.forest.main, theme.palette.sunset.main, theme.palette.secondary.main],
      emojis: ['🔍', '🗺️', '💎', '🎯'],
      message: 'Amazing Discovery!',
      childMessage: 'You found something special!',
      particleCount: intensity === 'gentle' ? 18 : intensity === 'moderate' ? 28 : 35
    },
    mastery: {
      colors: [theme.palette.success.main, theme.palette.warning.main, theme.palette.primary.main],
      emojis: ['👑', '🏅', '💫', '✨'],
      message: 'Mastery Achieved!',
      childMessage: 'You\'re really good at this!',
      particleCount: intensity === 'gentle' ? 20 : intensity === 'moderate' ? 30 : 50
    },
    friendship: {
      colors: [theme.palette.error.light, theme.palette.secondary.main, theme.palette.info.main],
      emojis: ['❤️', '🐋', '🤗', '🌈'],
      message: 'Friendship Grows!',
      childMessage: 'Old Tom likes you more!',
      particleCount: intensity === 'gentle' ? 16 : intensity === 'moderate' ? 24 : 32
    }
  };

  const config = celebrationConfigs[type];
  const message = customMessage || (settings.simplifiedLanguage ? config.childMessage : config.message);

  // Generate particles
  useEffect(() => {
    if (visible && !settings.reduceMotion) {
      const newParticles: Particle[] = [];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      for (let i = 0; i < config.particleCount; i++) {
        newParticles.push({
          id: `particle-${i}`,
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
          color: config.colors[Math.floor(Math.random() * config.colors.length)],
          size: Math.random() * 20 + 10,
          emoji: Math.random() > 0.7 ? config.emojis[Math.floor(Math.random() * config.emojis.length)] : undefined
        });
      }

      setParticles(newParticles);
      setShowMessage(true);

      // Announce celebration
      announceToScreenReader(message);

      // Clean up after duration
      const timer = setTimeout(() => {
        setParticles([]);
        setShowMessage(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, settings.reduceMotion, config, message, duration, onComplete, announceToScreenReader]);

  // Main celebration animation
  const mainAnimation = useSpring({
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1)' : 'scale(0.8)',
    config: { tension: 200, friction: 12 }
  });

  // Message animation
  const messageAnimation = useSpring({
    opacity: showMessage ? 1 : 0,
    transform: showMessage ? 'translateY(0px)' : 'translateY(-20px)',
    config: { tension: 280, friction: 20 }
  });

  // Particle trail animation
  const trail = useTrail(particles.length, {
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1)' : 'scale(0)',
    config: { tension: 200, friction: 12, duration: 2000 }
  });

  // Old Tom celebration animation
  const oldTomAnimation = useSpring({
    transform: visible 
      ? 'scale(1.2) rotate(5deg)' 
      : 'scale(1) rotate(0deg)',
    config: { duration: 1000 },
    loop: visible && { reverse: true }
  });

  if (!visible || settings.reduceMotion) {
    return visible ? (
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          textAlign: 'center',
          backgroundColor: theme.palette.background.paper,
          padding: 3,
          borderRadius: 3,
          boxShadow: theme.shadows[8],
          border: settings.highContrast ? '2px solid white' : 'none'
        }}
        role="alert"
        aria-live="assertive"
      >
        <Typography variant="h4" sx={{ mb: 1 }}>
          🎉
        </Typography>
        <Typography variant="h5">
          {message}
        </Typography>
      </Box>
    ) : null;
  }

  return (
    <animated.div style={mainAnimation}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 10000,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
        role="presentation"
        aria-hidden="true"
      >
        {/* Particle Effects */}
        {trail.map((style, index) => {
          const particle = particles[index];
          if (!particle) return null;

          return (
            <animated.div
              key={particle.id}
              style={{
                ...style,
                position: 'absolute',
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size
              }}
            >
              {particle.emoji ? (
                <Box
                  sx={{
                    fontSize: `${particle.size}px`,
                    animation: 'float 3s ease-in-out infinite',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {particle.emoji}
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: particle.color,
                    borderRadius: '50%',
                    animation: 'sparkle 2s ease-in-out infinite',
                    animationDelay: `${index * 0.1}s`
                  }}
                />
              )}
            </animated.div>
          );
        })}

        {/* Central Message */}
        <animated.div
          style={{
            ...messageAnimation,
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: 4,
              borderRadius: 4,
              boxShadow: theme.shadows[12],
              border: `3px solid ${config.colors[0]}`,
              maxWidth: 400
            }}
          >
            {/* Old Tom Celebration */}
            <animated.div style={oldTomAnimation}>
              <Box sx={{ fontSize: '4rem', mb: 2 }}>
                🐋
              </Box>
            </animated.div>

            <Typography 
              variant="h3" 
              sx={{ 
                mb: 2, 
                color: config.colors[0],
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {message}
            </Typography>

            {/* Animated stars */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {[...Array(5)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    fontSize: '2rem',
                    animation: 'starTwinkle 1s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`
                  }}
                >
                  ⭐
                </Box>
              ))}
            </Box>
          </Box>
        </animated.div>

        {/* Magical Ocean Waves Effect */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30vh',
            background: `linear-gradient(180deg, transparent 0%, ${theme.palette.ocean.main}20 50%, ${theme.palette.ocean.main}40 100%)`,
            animation: 'wave 4s ease-in-out infinite'
          }}
        />

        {/* Floating Bubbles */}
        {[...Array(8)].map((_, i) => (
          <Box
            key={`bubble-${i}`}
            sx={{
              position: 'absolute',
              bottom: -50,
              left: `${10 + i * 12}%`,
              width: Math.random() * 30 + 20,
              height: Math.random() * 30 + 20,
              backgroundColor: 'rgba(135, 206, 235, 0.6)',
              borderRadius: '50%',
              animation: 'bubble 6s ease-in-out infinite',
              animationDelay: `${i * 0.8}s`
            }}
          />
        ))}

        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(180deg); }
            }
            
            @keyframes sparkle {
              0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
              50% { transform: scale(1.5) rotate(180deg); opacity: 0.7; }
            }
            
            @keyframes starTwinkle {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.3); }
            }
            
            @keyframes wave {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            
            @keyframes bubble {
              0% { 
                transform: translateY(0px) scale(0); 
                opacity: 0; 
              }
              20% { 
                transform: translateY(-20px) scale(1); 
                opacity: 0.8; 
              }
              100% { 
                transform: translateY(-100vh) scale(0.5); 
                opacity: 0; 
              }
            }
          `}
        </style>
      </Box>
    </animated.div>
  );
};

export default CelebrationAnimations;