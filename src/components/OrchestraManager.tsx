// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, IconButton, Slider, Paper, Typography, Tooltip } from '@mui/material';
import {
  VolumeUp,
  PlayArrow,
  Pause,
  MusicNote,
  VolumeDown,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioTrack {
  id: string;
  name: string;
  url: string;
  mood: 'peaceful' | 'mysterious' | 'adventurous' | 'nostalgic' | 'dramatic';
  volume: number;
  isLoop: boolean;
}

interface OrchestraManagerProps {
  currentMood?: 'peaceful' | 'mysterious' | 'adventurous' | 'nostalgic' | 'dramatic';
  isPlaying?: boolean;
  volume?: number;
  onMoodChange?: (mood: string) => void;
}

const OrchestraManager: React.FC<OrchestraManagerProps> = ({
  currentMood = 'peaceful',
  isPlaying = true,
  volume = 0.3,
  onMoodChange
}) => {
  const [masterVolume, setMasterVolume] = useState(volume);
  const [isMusicPlaying, setIsMusicPlaying] = useState(isPlaying);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  // const [currentTrack] = useState<AudioTrack | null>(null); // Unused for now
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [audioLayers, setAudioLayers] = useState<Map<string, HTMLAudioElement>>(new Map());

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());

  // Studio Ghibli-inspired orchestral tracks (using Web Audio API for layering)
  const orchestralLayers = useMemo((): AudioTrack[] => [
    // Base atmospheric layers
    {
      id: 'ocean-ambience',
      name: 'Ocean Ambience',
      url: '/audio/ocean-waves-gentle.mp3',
      mood: 'peaceful',
      volume: 0.4,
      isLoop: true
    },
    {
      id: 'string-harmony',
      name: 'String Harmony',
      url: '/audio/strings-peaceful.mp3',
      mood: 'peaceful',
      volume: 0.3,
      isLoop: true
    },
    {
      id: 'whale-song-distant',
      name: 'Distant Whale Songs',
      url: '/audio/whale-songs-ambient.mp3',
      mood: 'mysterious',
      volume: 0.2,
      isLoop: true
    },
    
    // Melodic layers
    {
      id: 'piano-melody',
      name: 'Piano Melody',
      url: '/audio/piano-nostalgic.mp3',
      mood: 'nostalgic',
      volume: 0.25,
      isLoop: true
    },
    {
      id: 'flute-breeze',
      name: 'Ocean Breeze Flute',
      url: '/audio/flute-gentle.mp3',
      mood: 'peaceful',
      volume: 0.2,
      isLoop: true
    },
    {
      id: 'cello-warmth',
      name: 'Warm Cello',
      url: '/audio/cello-warm.mp3',
      mood: 'nostalgic',
      volume: 0.3,
      isLoop: true
    },
    
    // Adventure layers
    {
      id: 'brass-adventure',
      name: 'Adventure Brass',
      url: '/audio/brass-heroic.mp3',
      mood: 'adventurous',
      volume: 0.35,
      isLoop: true
    },
    {
      id: 'percussion-waves',
      name: 'Wave Percussion',
      url: '/audio/percussion-ocean.mp3',
      mood: 'dramatic',
      volume: 0.4,
      isLoop: true
    }
  ], []);

  // Initialize Web Audio Context and create audio layers
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create placeholder audio elements (in real app, these would be actual audio files)
        const audioMap = new Map<string, HTMLAudioElement>();
        const gainMap = new Map<string, GainNode>();
        
        for (const track of orchestralLayers) {
          // Create audio element (using placeholder since we don't have actual files)
          const audio = new Audio();
          audio.loop = track.isLoop;
          audio.volume = 0; // Start silent, will be controlled by gain nodes
          
          // Create gain node for volume control
          const gainNode = audioContextRef.current!.createGain();
          gainNode.gain.value = track.volume * masterVolume;
          gainNode.connect(audioContextRef.current!.destination);
          
          // In a real implementation, you'd connect the audio source to the gain node
          // const source = audioContextRef.current!.createMediaElementSource(audio);
          // source.connect(gainNode);
          
          audioMap.set(track.id, audio);
          gainMap.set(track.id, gainNode);
        }
        
        setAudioLayers(audioMap);
        gainNodesRef.current = gainMap;
        
      } catch (error) {
        console.error('Error initializing audio context:', error);
        // Fallback to simple HTML5 audio
        initializeFallbackAudio();
      }
    };

    initializeAudio();
    
    return () => {
      // Cleanup
      audioLayers.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback to HTML5 audio if Web Audio API fails
  const initializeFallbackAudio = () => {
    const audioMap = new Map<string, HTMLAudioElement>();
    
    for (const track of orchestralLayers) {
      const audio = new Audio();
      audio.loop = track.isLoop;
      audio.volume = track.volume * masterVolume;
      audioMap.set(track.id, audio);
    }
    
    setAudioLayers(audioMap);
  };

  // Update volumes based on current mood
  useEffect(() => {
    const updateLayerVolumes = () => {
      orchestralLayers.forEach(track => {
        const audio = audioLayers.get(track.id);
        const gainNode = gainNodesRef.current.get(track.id);
        
        if (audio && gainNode) {
          const targetVolume = track.mood === currentMood ? track.volume : 0.1;
          const finalVolume = targetVolume * masterVolume;
          
          // Smooth volume transition
          if (audioContextRef.current) {
            gainNode.gain.setTargetAtTime(
              finalVolume,
              audioContextRef.current.currentTime,
              0.5 // 0.5 second transition
            );
          } else {
            // Fallback for HTML5 audio
            audio.volume = finalVolume;
          }
          
          // Start/stop tracks based on mood
          if (track.mood === currentMood || track.mood === 'peaceful') {
            if (isMusicPlaying && audio.paused && userHasInteracted && audio.readyState >= 2) {
              audio.play().catch(console.error);
            }
          } else {
            // Fade out non-matching tracks
            if (!audio.paused) {
              setTimeout(() => {
                if (gainNode.gain.value < 0.05) {
                  audio.pause();
                }
              }, 1000);
            }
          }
        }
      });
    };

    if (audioLayers.size > 0) {
      updateLayerVolumes();
    }
  }, [currentMood, masterVolume, isMusicPlaying, audioLayers, orchestralLayers, userHasInteracted]);

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const volume = Array.isArray(newValue) ? newValue[0] : newValue;
    setMasterVolume(volume / 100);
  };

  const togglePlayback = () => {
    setIsMusicPlaying(!isMusicPlaying);
    
    audioLayers.forEach(audio => {
      if (isMusicPlaying) {
        if (!audio.paused) {
          audio.pause();
        }
      } else {
        setUserHasInteracted(true);
        if (audio.paused && audio.readyState >= 2) {
          audio.play().catch(console.error);
        }
      }
    });
  };

  const changeMood = (newMood: typeof currentMood) => {
    onMoodChange?.(newMood);
  };

  // Mood visualization component
  const MoodVisualizer: React.FC<{ mood: string }> = ({ mood }) => {
    const getMoodColor = (mood: string) => {
      switch (mood) {
        case 'peaceful': return '#4FC3F7';
        case 'mysterious': return '#7986CB';
        case 'adventurous': return '#FFB74D';
        case 'nostalgic': return '#F8BBD9';
        case 'dramatic': return '#FF8A65';
        default: return '#4FC3F7';
      }
    };

    return (
      <motion.div
        animate={{
          background: `radial-gradient(circle, ${getMoodColor(mood)}33 0%, transparent 70%)`,
          scale: [1, 1.1, 1],
        }}
        transition={{
          background: { duration: 2 },
          scale: { duration: 3, repeat: Infinity }
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        zIndex: 1000,
      }}
      onMouseEnter={() => setIsControlsVisible(true)}
      onMouseLeave={() => setIsControlsVisible(false)}
    >
      {/* Main Music Control Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <IconButton
          onClick={togglePlayback}
          sx={{
            width: 60,
            height: 60,
            background: 'linear-gradient(135deg, rgba(46, 139, 87, 0.9) 0%, rgba(15, 52, 96, 0.9) 100%)',
            color: '#F5F5DC',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(15, 52, 96, 0.9) 0%, rgba(46, 139, 87, 0.9) 100%)',
            },
          }}
        >
          {/* Mood Visualizer Background */}
          <MoodVisualizer mood={currentMood} />
          
          {/* Play/Pause Icon */}
          {isMusicPlaying ? <Pause /> : <PlayArrow />}
          
          {/* Music Note Animation */}
          <motion.div
            animate={isMusicPlaying ? {
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              duration: 2,
              repeat: isMusicPlaying ? Infinity : 0,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              fontSize: '12px',
            }}
          >
            <MusicNote fontSize="small" />
          </motion.div>
        </IconButton>
      </motion.div>

      {/* Expanded Controls */}
      <AnimatePresence>
        {isControlsVisible && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              elevation={8}
              sx={{
                position: 'absolute',
                bottom: 70,
                left: 0,
                width: 280,
                p: 2,
                background: 'linear-gradient(135deg, rgba(15, 52, 96, 0.95) 0%, rgba(46, 139, 87, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: 3,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#D4AF37',
                  fontFamily: '"Cinzel", serif',
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                🎼 Ocean Symphony
              </Typography>

              {/* Volume Control */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VolumeDown sx={{ color: '#F5F5DC', mr: 1 }} />
                <Slider
                  size="small"
                  value={masterVolume * 100}
                  onChange={handleVolumeChange}
                  sx={{
                    color: '#D4AF37',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#D4AF37',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#4FC3F7',
                    },
                  }}
                />
                <VolumeUp sx={{ color: '#F5F5DC', ml: 1 }} />
              </Box>

              {/* Mood Selection */}
              <Typography
                variant="caption"
                sx={{
                  color: '#F5F5DC',
                  display: 'block',
                  mb: 1,
                  textAlign: 'center',
                }}
              >
                Atmosphere
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                {['peaceful', 'mysterious', 'adventurous', 'nostalgic', 'dramatic'].map((mood) => (
                  <Tooltip key={mood} title={mood.charAt(0).toUpperCase() + mood.slice(1)}>
                    <IconButton
                      size="small"
                      onClick={() => changeMood(mood as any)}
                      sx={{
                        backgroundColor: currentMood === mood ? 'rgba(212, 175, 55, 0.3)' : 'transparent',
                        color: currentMood === mood ? '#D4AF37' : '#F5F5DC',
                        fontSize: '1.2rem',
                        minWidth: 'auto',
                        '&:hover': {
                          backgroundColor: 'rgba(212, 175, 55, 0.2)',
                        },
                      }}
                    >
                      {mood === 'peaceful' && '🌊'}
                      {mood === 'mysterious' && '🌙'}
                      {mood === 'adventurous' && '⛵'}
                      {mood === 'nostalgic' && '🕰️'}
                      {mood === 'dramatic' && '⚡'}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default OrchestraManager;