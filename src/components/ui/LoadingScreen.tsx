import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { animated, useSpring } from '@react-spring/web';
import Lottie from 'lottie-react';

interface LoadingScreenProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
  animationData?: object;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading magical adventure...',
  progress = 0,
  showProgress = false,
  animationData,
}) => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 200, friction: 20 },
  });

  const waveAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-10px)' });
        await next({ transform: 'translateY(0px)' });
      }
    },
    config: { duration: 2000 },
  });

  const progressSpring = useSpring({
    value: progress,
    config: { tension: 100, friction: 30 },
  });

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)',
        zIndex: 9999,
        padding: 3,
      }}
    >
      <animated.div style={fadeIn}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          {/* Loading Animation */}
          <animated.div style={waveAnimation}>
            <Box
              sx={{
                width: 120,
                height: 120,
                mb: 4,
                position: 'relative',
              }}
            >
              {animationData ? (
                <Lottie
                  animationData={animationData}
                  loop
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #1565C0, #42A5F5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(21, 101, 192, 0.3)',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%': {
                        transform: 'scale(1)',
                        boxShadow: '0 8px 32px rgba(21, 101, 192, 0.3)',
                      },
                      '50%': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 12px 40px rgba(21, 101, 192, 0.5)',
                      },
                      '100%': {
                        transform: 'scale(1)',
                        boxShadow: '0 8px 32px rgba(21, 101, 192, 0.3)',
                      },
                    },
                  }}
                >
                  <CircularProgress
                    size={60}
                    thickness={3}
                    sx={{
                      color: 'white',
                      '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          </animated.div>

          {/* Loading Text */}
          <Typography
            variant="h5"
            sx={{
              color: '#1565C0',
              fontWeight: 500,
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {message}
          </Typography>

          {/* Progress Bar */}
          {showProgress && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Box
                sx={{
                  width: '100%',
                  height: 8,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  mb: 1,
                }}
              >
                <animated.div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #1565C0, #42A5F5)',
                    borderRadius: 4,
                    width: progressSpring.value.to(v => `${v}%`),
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#1565C0',
                  opacity: 0.8,
                  fontSize: '0.875rem',
                }}
              >
                {Math.round(progress)}%
              </Typography>
            </Box>
          )}

          {/* Floating particles effect */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: -1,
            }}
          >
            {[...Array(12)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: 4 + Math.random() * 8,
                  height: 4 + Math.random() * 8,
                  backgroundColor: 'rgba(21, 101, 192, 0.2)',
                  borderRadius: '50%',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float-${i} ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                  '@keyframes float-0': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(180deg)' },
                  },
                  '@keyframes float-1': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-15px) rotate(90deg)' },
                  },
                  '@keyframes float-2': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-25px) rotate(270deg)' },
                  },
                  // Add more keyframes for other particles
                  [`@keyframes float-${i}`]: {
                    '0%, 100%': { 
                      transform: 'translateY(0px) rotate(0deg)',
                      opacity: 0.2,
                    },
                    '50%': { 
                      transform: `translateY(-${10 + Math.random() * 20}px) rotate(${Math.random() * 360}deg)`,
                      opacity: 0.6,
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </animated.div>
    </Box>
  );
};