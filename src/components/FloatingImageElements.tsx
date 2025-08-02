import React, { useMemo } from 'react';
import { Box, keyframes } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingImageElementsProps {
  images?: string[];
  type: 'floating' | 'parallax' | 'foreground';
  chapter: number;
}

// Dreamy floating animation
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-30px) translateX(20px) rotate(2deg) scale(1.05);
  }
  50% {
    transform: translateY(-50px) translateX(-10px) rotate(-1deg) scale(1.08);
  }
  75% {
    transform: translateY(-20px) translateX(15px) rotate(1deg) scale(1.03);
  }
`;

// Parallax drift animation
const parallaxDrift = keyframes`
  0% {
    transform: translateX(0) scale(1.2);
  }
  100% {
    transform: translateX(-10%) scale(1.2);
  }
`;

// Ethereal pulse
const etherealPulse = keyframes`
  0%, 100% {
    opacity: 0.3;
    filter: blur(8px) brightness(1.2);
  }
  50% {
    opacity: 0.6;
    filter: blur(4px) brightness(1.5);
  }
`;

const FloatingImageElements: React.FC<FloatingImageElementsProps> = ({ 
  images = [], 
  type, 
  chapter 
}) => {
  const elementStyles = useMemo(() => {
    switch (type) {
      case 'floating':
        return images.map((_, index) => ({
          position: 'absolute' as const,
          width: `${200 + index * 50}px`,
          height: `${200 + index * 50}px`,
          top: `${20 + (index * 25)}%`,
          left: index % 2 === 0 ? `${10 + index * 15}%` : 'auto',
          right: index % 2 === 1 ? `${10 + index * 15}%` : 'auto',
          zIndex: 10 + index,
        }));
      
      case 'parallax':
        return images.map((_, index) => ({
          position: 'absolute' as const,
          width: '120%',
          height: '120%',
          top: '-10%',
          left: '-10%',
          zIndex: 2 + index,
        }));
      
      case 'foreground':
        return [{
          position: 'absolute' as const,
          width: '40%',
          height: 'auto',
          bottom: '10%',
          right: '5%',
          zIndex: 20,
        }];
      
      default:
        return [];
    }
  }, [type, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <AnimatePresence>
      {images.map((image, index) => (
        <motion.div
          key={`${chapter}-${type}-${index}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ 
            duration: 1.5, 
            delay: index * 0.3,
            ease: 'easeOut' 
          }}
        >
          <Box
            sx={{
              ...elementStyles[index],
              pointerEvents: 'none',
              willChange: 'transform',
            }}
          >
            {type === 'floating' && (
              <Box
                component="img"
                src={image}
                alt=""
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  opacity: 0.7,
                  animation: `${floatAnimation} ${20 + index * 5}s ease-in-out infinite`,
                  animationDelay: `${index * 2}s`,
                  filter: 'blur(2px) brightness(1.1)',
                  mixBlendMode: 'luminosity',
                  '&:hover': {
                    filter: 'blur(0px) brightness(1.3)',
                  }
                }}
              />
            )}

            {type === 'parallax' && (
              <Box
                component="img"
                src={image}
                alt=""
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: index === 0 ? 0.3 : 0.2,
                  animation: `${parallaxDrift} ${30 + index * 10}s linear infinite alternate`,
                  filter: `blur(${4 + index * 2}px)`,
                  transform: `scale(${1.2 + index * 0.1})`,
                }}
              />
            )}

            {type === 'foreground' && (
              <Box
                component="img"
                src={image}
                alt=""
                sx={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  animation: `${etherealPulse} 6s ease-in-out infinite`,
                  filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.5))',
                  transform: 'scaleX(-1)', // Flip for variety
                }}
              />
            )}
          </Box>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default FloatingImageElements;