import React, { useEffect, useState } from 'react';
import { Box, Typography, Fade, Grow, keyframes, styled } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicTransitionProps {
  isTransitioning: boolean;
  fromChapter: number;
  toChapter: number;
  chapterTitle?: string;
  chapterYear?: string;
  onTransitionComplete?: () => void;
}

// Define all animations first
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Ripple effect for water transition
const rippleAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

// Whale tail splash animation
const splashAnimation = keyframes`
  0% {
    transform: translateY(100%) rotate(0deg);
    opacity: 0;
  }
  20% {
    transform: translateY(0%) rotate(-15deg);
    opacity: 1;
  }
  40% {
    transform: translateY(-20%) rotate(0deg);
  }
  60% {
    transform: translateY(0%) rotate(15deg);
  }
  100% {
    transform: translateY(100%) rotate(0deg);
    opacity: 0;
  }
`;

// Styled components to avoid TypeScript union type errors
const GradientOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'radial-gradient(ellipse at center, rgba(30, 144, 255, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)',
  animation: `${fadeIn} 0.5s ease-out`,
});

const RippleEffect = styled(Box)<{ delay: number }>(({ delay }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '100px',
  height: '100px',
  marginLeft: '-50px',
  marginTop: '-50px',
  borderRadius: '50%',
  border: '2px solid rgba(255, 255, 255, 0.6)',
  animation: `${rippleAnimation} 2s ease-out ${delay}s`,
}));

const WhaleTailSplash = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '20%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '200px',
  height: '150px',
  animation: `${splashAnimation} 2.5s ease-in-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100 150 Q50 100 0 50 Q50 75 100 0 Q150 75 200 50 Q150 100 100 150' fill='rgba(255,255,255,0.8)'/%3E%3C/svg%3E")`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
  },
}));

// Define float animation for particles
const floatAnim = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const ParticleEffects = styled(Box)({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    width: '4px',
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '50%',
    boxShadow: `
      20px 20px 0 rgba(255, 255, 255, 0.6),
      40px 40px 0 rgba(255, 255, 255, 0.4),
      60px 60px 0 rgba(255, 255, 255, 0.2),
      80px 80px 0 rgba(255, 255, 255, 0.1)
    `,
    animation: `${floatAnim} 3s ease-in-out infinite`,
  },
  '&::before': {
    top: '20%',
    left: '10%',
  },
  '&::after': {
    bottom: '20%',
    right: '10%',
    animationDelay: '1.5s',
  },
});

const ChapterTitleContainer = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  color: 'white',
});

const CinematicTransition: React.FC<CinematicTransitionProps> = ({
  isTransitioning,
  fromChapter,
  toChapter,
  chapterTitle,
  chapterYear,
  onTransitionComplete
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      setShowContent(true);
      const timer = setTimeout(() => {
        setShowContent(false);
        onTransitionComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, onTransitionComplete]);

  return (
    <AnimatePresence>
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          {/* Background overlay with gradient */}
          <GradientOverlay />

          {/* Ripple effects */}
          {[...Array(3)].map((_, i) => (
            <RippleEffect key={i} delay={i * 0.3} />
          ))}

          {/* Whale tail splash */}
          <WhaleTailSplash />

          {/* Chapter title and year */}
          {chapterTitle && (
            <Fade in timeout={1000}>
              <ChapterTitleContainer>
                <Grow in timeout={1200}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                      fontFamily: '"Cinzel Decorative", serif',
                      textShadow: '0 0 30px rgba(255, 255, 255, 0.8)',
                      mb: 2,
                    }}
                  >
                    {chapterTitle}
                  </Typography>
                </Grow>
                {chapterYear && (
                  <Grow in timeout={1500}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        fontFamily: '"Cinzel", serif',
                        color: '#FFD700',
                        textShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
                      }}
                    >
                      {chapterYear}
                    </Typography>
                  </Grow>
                )}
              </ChapterTitleContainer>
            </Fade>
          )}

          {/* Particle effects */}
          <ParticleEffects />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicTransition;