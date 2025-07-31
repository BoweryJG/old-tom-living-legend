import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography } from '@mui/material';

interface OldTomCharacterProps {
  isVisible?: boolean;
  animationType?: 'idle' | 'speaking' | 'swimming' | 'greeting';
  position?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
  onAnimationComplete?: () => void;
}

const OldTomCharacter: React.FC<OldTomCharacterProps> = ({
  isVisible = true,
  animationType = 'idle',
  position = 'center',
  size = 'medium',
  onAnimationComplete
}) => {
  const [currentAnimation, setCurrentAnimation] = useState(animationType);

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
    left: { justifyContent: 'flex-start' },
    center: { justifyContent: 'center' },
    right: { justifyContent: 'flex-end' }
  };

  // Simplified animation variants
  const orcaVariants = {
    idle: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    
    speaking: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    
    swimming: {
      x: [-30, 30, -30],
      rotate: [-5, 5, -5],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    
    greeting: {
      rotate: [0, -10, 10, -10, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        ease: "easeOut",
        onComplete: onAnimationComplete
      }
    }
  };

  const dimensions = sizeConfig[size];

  return (
    <AnimatePresence>
      {isVisible && (
        <Box
          sx={{
            display: 'flex',
            ...positionConfig[position],
            width: '100%',
            height: dimensions.height,
            position: 'relative',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              variants={orcaVariants}
              animate={currentAnimation}
              style={{
                width: dimensions.width,
                height: dimensions.height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Whale body */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Main whale emoji */}
                <Typography
                  sx={{
                    fontSize: dimensions.fontSize,
                    userSelect: 'none',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
                  }}
                >
                  🐋
                </Typography>

                {/* Speaking indicator */}
                {currentAnimation === 'speaking' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    style={{
                      position: 'absolute',
                      top: '20%',
                      right: '-20%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 0.5,
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -5, 0],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: '#4FC3F7',
                            }}
                          />
                        </motion.div>
                      ))}
                    </Box>
                  </motion.div>
                )}

                {/* Breathing bubbles */}
                {currentAnimation === 'idle' && (
                  <motion.div
                    animate={{
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    style={{
                      position: 'absolute',
                      top: '10%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <Typography sx={{ fontSize: '1.5rem' }}>
                      ○
                    </Typography>
                  </motion.div>
                )}
              </Box>
            </motion.div>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default OldTomCharacter;