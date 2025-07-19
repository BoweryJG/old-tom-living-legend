import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography } from '@mui/material';

interface OldTomCharacterProps {
  isVisible?: boolean;
  isAnimating?: boolean;
  animationType?: 'idle' | 'speaking' | 'swimming' | 'breaching' | 'greeting';
  position?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
  onAnimationComplete?: () => void;
}

const OldTomCharacter: React.FC<OldTomCharacterProps> = ({
  isVisible = true,
  isAnimating = false,
  animationType = 'idle',
  position = 'center',
  size = 'medium',
  onAnimationComplete
}) => {
  const [currentAnimation, setCurrentAnimation] = useState(animationType);
  const [isBreathing] = useState(true);

  useEffect(() => {
    setCurrentAnimation(animationType);
  }, [animationType]);

  // Size configurations
  const sizeConfig = {
    small: { width: 120, height: 80, fontSize: '3rem' },
    medium: { width: 180, height: 120, fontSize: '4.5rem' },
    large: { width: 240, height: 160, fontSize: '6rem' }
  };

  // Position configurations
  const positionConfig = {
    left: { x: -200, justifyContent: 'flex-start' },
    center: { x: 0, justifyContent: 'center' },
    right: { x: 200, justifyContent: 'flex-end' }
  };

  // Animation variants for different states
  const orcaVariants = {
    // Gentle idle floating
    idle: {
      y: [0, -8, 0],
      rotate: [0, 1, -1, 0],
      scale: 1,
      transition: {
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        },
        rotate: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    
    // Active speaking with gentle bobbing
    speaking: {
      y: [0, -12, -8, -12, 0],
      rotate: [0, 2, -2, 1, 0],
      scale: [1, 1.05, 1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    
    // Swimming motion
    swimming: {
      x: [-50, 50, -50],
      y: [0, -15, 5, -10, 0],
      rotate: [0, 8, -5, 3, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    
    // Dramatic breaching
    breaching: {
      y: [0, -80, -120, -80, 0],
      rotate: [0, -15, 10, -5, 0],
      scale: [1, 1.1, 1.2, 1.1, 1],
      transition: {
        duration: 3,
        ease: "easeOut",
        times: [0, 0.3, 0.5, 0.7, 1]
      }
    },
    
    // Friendly greeting wave
    greeting: {
      rotate: [0, 15, -10, 5, 0],
      y: [0, -10, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: 2,
        ease: "easeInOut"
      }
    },
    
    // Entry animation
    enter: {
      opacity: [0, 1],
      y: [100, 0],
      scale: [0.8, 1],
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    },
    
    // Exit animation
    exit: {
      opacity: [1, 0],
      y: [0, -100],
      scale: [1, 0.8],
      transition: {
        duration: 1,
        ease: "easeIn"
      }
    }
  };

  // Tail animation (separate element for fluid motion)
  const tailVariants = {
    idle: {
      rotate: [0, 8, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }
    },
    swimming: {
      rotate: [0, 15, -15, 10, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    speaking: {
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Eye blink animation
  const blinkVariants = {
    open: { scaleY: 1 },
    blink: { 
      scaleY: 0.1,
      transition: { duration: 0.1 }
    }
  };

  const [isBlinking, setIsBlinking] = useState(false);

  // Random blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Breathing animation for the body
  const breathingVariants = {
    inhale: { scale: 1.02 },
    exhale: { scale: 1 }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: positionConfig[position].justifyContent,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial="enter"
            animate={currentAnimation}
            exit="exit"
            variants={orcaVariants}
            onAnimationComplete={onAnimationComplete}
            style={{
              position: 'relative',
              width: sizeConfig[size].width,
              height: sizeConfig[size].height,
            }}
          >
            {/* Main Orca Body */}
            <motion.div
              animate={isBreathing ? 'inhale' : 'exhale'}
              variants={breathingVariants}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
              }}
            >
              {/* Orca Body - Main Shape */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '70%',
                  background: 'linear-gradient(145deg, #1a1a1a 0%, #333 50%, #1a1a1a 100%)',
                  borderRadius: '50px 20px 30px 50px',
                  top: '15%',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '30%',
                    height: '40%',
                    background: 'white',
                    borderRadius: '50%',
                    clipPath: 'ellipse(80% 60% at 30% 40%)',
                  }
                }}
              >
                {/* White Patches */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '30%',
                    left: '15%',
                    width: '25%',
                    height: '30%',
                    background: 'white',
                    borderRadius: '50%',
                    opacity: 0.9,
                  }}
                />
                
                {/* Eye */}
                <motion.div
                  animate={isBlinking ? 'blink' : 'open'}
                  variants={blinkVariants}
                  style={{
                    position: 'absolute',
                    top: '25%',
                    left: '20%',
                    width: '8px',
                    height: '8px',
                    background: '#1a1a1a',
                    borderRadius: '50%',
                    transformOrigin: 'center',
                  }}
                />
              </Box>

              {/* Dorsal Fin */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '5%',
                  left: '40%',
                  width: '20px',
                  height: '30px',
                  background: 'linear-gradient(145deg, #1a1a1a, #444)',
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  borderRadius: '3px',
                }}
              />

              {/* Pectoral Fins */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '25%',
                  width: '25px',
                  height: '15px',
                  background: 'linear-gradient(145deg, #1a1a1a, #333)',
                  borderRadius: '15px 5px',
                  transform: 'rotate(-20deg)',
                }}
              />
            </motion.div>

            {/* Tail - Separate animated element */}
            <motion.div
              variants={tailVariants}
              animate={currentAnimation === 'swimming' ? 'swimming' : 
                      currentAnimation === 'speaking' ? 'speaking' : 'idle'}
              style={{
                position: 'absolute',
                right: '-15px',
                top: '40%',
                transformOrigin: 'left center',
              }}
            >
              <Box
                sx={{
                  width: '30px',
                  height: '40px',
                  background: 'linear-gradient(145deg, #1a1a1a, #333)',
                  clipPath: 'polygon(0% 20%, 70% 0%, 100% 50%, 70% 100%, 0% 80%)',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                }}
              />
            </motion.div>

            {/* Speech Bubbles (when speaking) */}
            <AnimatePresence>
              {currentAnimation === 'speaking' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.2rem',
                      color: '#D4AF37',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      animation: 'pulse 1.5s infinite',
                    }}
                  >
                    🌊 💬 🐋
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Water Ripples */}
            <motion.div
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '20px',
                border: '2px solid rgba(79, 195, 247, 0.6)',
                borderRadius: '50%',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default OldTomCharacter;