import React, { useEffect, useState } from 'react';
import { Box, keyframes } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryMomentAnimationsProps {
  chapter: number;
  isActive: boolean;
}

// Whale silhouette swimming animation
const whaleSwimAnimation = keyframes`
  0% {
    transform: translateX(-100%) translateY(0) rotate(-5deg);
  }
  25% {
    transform: translateX(25%) translateY(-30px) rotate(0deg);
  }
  50% {
    transform: translateX(50%) translateY(0) rotate(5deg);
  }
  75% {
    transform: translateX(75%) translateY(30px) rotate(0deg);
  }
  100% {
    transform: translateX(200%) translateY(0) rotate(-5deg);
  }
`;

// Lightning flash for storm chapter
const lightningFlash = keyframes`
  0%, 100% { opacity: 0; }
  10%, 11% { opacity: 1; }
  12% { opacity: 0.5; }
  13% { opacity: 1; }
`;

// Rope animation for the hunt
const ropeSwing = keyframes`
  0%, 100% { transform: rotate(-10deg) translateX(0); }
  50% { transform: rotate(10deg) translateX(20px); }
`;

// Museum light rays
const lightRayAnimation = keyframes`
  0% { opacity: 0; transform: translateY(100%); }
  50% { opacity: 0.3; }
  100% { opacity: 0; transform: translateY(-100%); }
`;

const StoryMomentAnimations: React.FC<StoryMomentAnimationsProps> = ({ chapter, isActive }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 15000);
      return () => clearTimeout(timer);
    }
  }, [isActive, chapter]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <>
          {/* Chapter 1: The Legend Begins - Whale pod silhouettes */}
          {chapter === 1 && (
            <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              {[...Array(3)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    bottom: `${20 + i * 15}%`,
                    left: '-200px',
                    width: '150px',
                    height: '80px',
                    animation: `${whaleSwimAnimation} ${15 + i * 2}s linear ${i * 3}s infinite`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4) 0%, transparent 70%)',
                      filter: 'blur(2px)',
                      transform: 'scale(1.5)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      clipPath: 'polygon(10% 50%, 25% 30%, 50% 25%, 75% 35%, 90% 50%, 85% 65%, 70% 70%, 50% 75%, 30% 70%, 15% 65%)',
                    }
                  }}
                />
              ))}
            </Box>
          )}

          {/* Chapter 2: Law of the Tongue - Partnership handshake visual */}
          {chapter === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '300px',
                  height: '300px',
                  pointerEvents: 'none',
                }}
              >
                <Box
                  component="svg"
                  viewBox="0 0 300 300"
                  sx={{ width: '100%', height: '100%' }}
                >
                  <motion.circle
                    cx="150"
                    cy="150"
                    r="100"
                    fill="none"
                    stroke="rgba(255, 215, 0, 0.3)"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  />
                  <motion.path
                    d="M 100 150 Q 150 100, 200 150 Q 150 200, 100 150"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.5)"
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Chapter 3: The Hunt - Animated ropes and harpoons */}
          {chapter === 3 && (
            <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {[...Array(2)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    top: `${30 + i * 20}%`,
                    right: `${10 + i * 15}%`,
                    width: '200px',
                    height: '3px',
                    backgroundColor: 'rgba(139, 69, 19, 0.6)',
                    transformOrigin: 'right center',
                    animation: `${ropeSwing} 3s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: '-20px',
                      top: '-8px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'rgba(192, 192, 192, 0.7)',
                      clipPath: 'polygon(0 50%, 100% 0, 100% 100%)',
                    }
                  }}
                />
              ))}
            </Box>
          )}

          {/* Chapter 4: The Storm - Lightning and rain effects */}
          {chapter === 4 && (
            <>
              {/* Lightning flashes */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  animation: `${lightningFlash} 8s infinite`,
                  pointerEvents: 'none',
                  mixBlendMode: 'screen',
                }}
              />
              
              {/* Rain effect */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: `repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 2px,
                      rgba(255, 255, 255, 0.1) 2px,
                      rgba(255, 255, 255, 0.1) 3px
                    )`,
                    animation: 'fall 0.5s linear infinite',
                    '@keyframes fall': {
                      to: { transform: 'translateY(100%)' }
                    }
                  }
                }}
              />
            </>
          )}

          {/* Chapter 5: Final Hunt - Sunset rays and aged effect */}
          {chapter === 5 && (
            <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {[...Array(5)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: `${i * 25}%`,
                    width: '5%',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(255, 140, 0, 0.2) 0%, transparent 100%)',
                    animation: `${lightRayAnimation} 10s ease-in-out infinite`,
                    animationDelay: `${i * 2}s`,
                    transformOrigin: 'top center',
                  }}
                />
              ))}
              
              {/* Aged film effect */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 20% 50%, transparent 30%, rgba(139, 69, 19, 0.1) 100%)`,
                  mixBlendMode: 'multiply',
                }}
              />
            </Box>
          )}

          {/* Chapter 6: Museum - Spotlights and dust particles */}
          {chapter === 6 && (
            <>
              {/* Museum spotlights */}
              {[...Array(3)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    top: '-50%',
                    left: `${20 + i * 30}%`,
                    width: '200px',
                    height: '150%',
                    background: `linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 40%)`,
                    transform: 'rotate(15deg)',
                    transformOrigin: 'top center',
                    pointerEvents: 'none',
                    animation: `sway ${5 + i}s ease-in-out infinite alternate`,
                    '@keyframes sway': {
                      from: { transform: 'rotate(10deg)' },
                      to: { transform: 'rotate(20deg)' }
                    }
                  }}
                />
              ))}
              
              {/* Dust particles */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                    animation: 'float 20s linear infinite',
                    '@keyframes float': {
                      from: { transform: 'translateY(100%) translateX(0)' },
                      to: { transform: 'translateY(-100%) translateX(50px)' }
                    }
                  }
                }}
              />
            </>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default StoryMomentAnimations;