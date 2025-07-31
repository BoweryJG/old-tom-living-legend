// @ts-nocheck
import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { animated, useSpring, useTrail } from '@react-spring/web';
import { 
  PlayArrowRounded, 
  ChatRounded, 
  ExploreRounded,
  AutoStoriesRounded,
  WavesRounded,
  AccessTimeRounded 
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveCharacter } from '@/store/slices/characterSlice';
import { navigateToScene } from '@/store/slices/storySlice';
import OldTomCharacter from '@/components/characters/OldTomCharacter';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { progress } = useAppSelector(state => state.story);
  const { activeCharacter } = useAppSelector(state => state.character);

  useEffect(() => {
    dispatch(setActiveCharacter('old-tom'));
    dispatch(navigateToScene('home'));
  }, [dispatch]);

  const heroAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 200, friction: 25 },
    delay: 200,
  });

  const features = [
    {
      id: 'story',
      title: 'Begin Adventure',
      description: 'Start Old Tom\'s magical oceanic journey',
      icon: <AutoStoriesRounded />,
      path: '/story',
      color: '#1565C0',
    },
    {
      id: 'chat',
      title: 'Ask Old Tom',
      description: 'Chat with our wise ocean storyteller',
      icon: <ChatRounded />,
      path: '/chat',
      color: '#388E3C',
    },
    {
      id: 'ocean',
      title: 'Explore Ocean',
      description: 'Interactive underwater adventures',
      icon: <WavesRounded />,
      path: '/ocean',
      color: '#0277BD',
    },
    {
      id: 'time-portal',
      title: 'Time Portal',
      description: 'Travel between past and present',
      icon: <AccessTimeRounded />,
      path: '/time-portal',
      color: '#F57C00',
    },
    {
      id: 'painting',
      title: 'Living Paintings',
      description: 'Touch and bring art to life',
      icon: <ExploreRounded />,
      path: '/painting',
      color: '#7B1FA2',
    },
    {
      id: 'dream',
      title: 'Whale Dreams',
      description: 'Surreal underwater dreamscapes',
      icon: <WavesRounded />,
      path: '/dream',
      color: '#C2185B',
    },
  ];

  const trail = useTrail(features.length, {
    from: { opacity: 0, transform: 'translateY(40px) scale(0.9)' },
    to: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    config: { tension: 200, friction: 20 },
    delay: 600,
  });

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Ocean Animation */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(2, 119, 189, 0.1) 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'url("/images/ocean-waves.svg") repeat-x',
            backgroundSize: '200px 100px',
            animation: 'wave 10s linear infinite',
          },
          '@keyframes wave': {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '200px 0' },
          },
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ pt: 4, pb: 8 }}>
          {/* Hero Section */}
          <animated.div style={heroAnimation}>
            <Box
              sx={{
                textAlign: 'center',
                mb: 6,
                pt: 4,
              }}
            >
              {/* Old Tom Character */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 4,
                }}
              >
                <OldTomCharacter
                  size="large"
                  animation="idle"
                  showGreeting
                />
              </Box>

              <Typography
                variant="h1"
                sx={{
                  mb: 3,
                  background: 'linear-gradient(45deg, #1565C0, #0277BD)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
              >
                Old Tom
              </Typography>
              
              <Typography
                variant="h3"
                sx={{
                  mb: 2,
                  color: '#1565C0',
                  fontWeight: 300,
                }}
              >
                The Living Legend
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: 'text.secondary',
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Dive into a magical ocean adventure where ancient wisdom meets modern wonder. 
                Join Old Tom as he shares tales from the depths of time and tide.
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowRounded />}
                onClick={() => handleFeatureClick('/story')}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: 8,
                  background: 'linear-gradient(45deg, #1565C0, #42A5F5)',
                  boxShadow: '0 8px 24px rgba(21, 101, 192, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0D47A1, #1565C0)',
                    boxShadow: '0 12px 32px rgba(21, 101, 192, 0.4)',
                  },
                }}
              >
                Begin Your Adventure
              </Button>
            </Box>
          </animated.div>

          {/* Features Grid */}
          <Grid container spacing={3}>
            {trail.map((props, index) => {
              const feature = features[index];
              return (
                <Grid item xs={12} sm={6} md={4} key={feature.id}>
                  <animated.div style={props}>
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
                          background: 'rgba(255, 255, 255, 0.95)',
                        },
                      }}
                      onClick={() => handleFeatureClick(feature.path)}
                    >
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: `linear-gradient(45deg, ${feature.color}, ${feature.color}CC)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                            color: 'white',
                            fontSize: '1.5rem',
                            boxShadow: `0 4px 16px ${feature.color}40`,
                          }}
                        >
                          {feature.icon}
                        </Box>
                        
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 1,
                            color: '#1A1A1A',
                            fontWeight: 600,
                          }}
                        >
                          {feature.title}
                        </Typography>
                        
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.5,
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </animated.div>
                </Grid>
              );
            })}
          </Grid>

          {/* Progress Indicator */}
          {progress.completedScenes.length > 0 && (
            <Box
              sx={{
                mt: 6,
                p: 3,
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, color: '#1565C0' }}>
                Your Journey Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progress.completedScenes.length} scenes explored • {Math.floor(progress.totalTimeSpent / 60)} minutes of adventure
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;