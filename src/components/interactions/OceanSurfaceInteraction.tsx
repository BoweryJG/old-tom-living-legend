import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/web';
import { Box, useTheme, alpha } from '@mui/material';
import { Waves, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { MagicalGestureRecognizer } from './MagicalGestureRecognizer';

interface OceanSurfaceInteractionProps {
  onOldTomEmergence: (location: { x: number; y: number }) => void;
  onTimeChange: (timeOfDay: 'dawn' | 'morning' | 'afternoon' | 'sunset' | 'night') => void;
  onWeatherChange: (weather: 'calm' | 'gentle' | 'stormy') => void;
  currentTimeOfDay: 'dawn' | 'morning' | 'afternoon' | 'sunset' | 'night';
  currentWeather: 'calm' | 'gentle' | 'stormy';
  oldTomVisible: boolean;
  accessibility?: {
    reduceMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
  };
}

export const OceanSurfaceInteraction: React.FC<OceanSurfaceInteractionProps> = ({
  onOldTomEmergence,
  onTimeChange,
  onWeatherChange,
  currentTimeOfDay,
  currentWeather,
  oldTomVisible,
  accessibility = {
    reduceMotion: false,
    highContrast: false,
    screenReader: false
  }
}) => {
  const theme = useTheme();
  const [touchPoints, setTouchPoints] = useState<Array<{ x: number; y: number; id: string; timestamp: number }>>([]);
  const [waveAnimation, setWaveAnimation] = useState(0);
  const [oldTomPosition, setOldTomPosition] = useState<{ x: number; y: number } | null>(null);

  // Time of day color schemes
  const timeColorSchemes = {
    dawn: {
      sky: ['#FFB74D', '#FF8A65', '#F06292'],
      water: ['#0277BD', '#0288D1', '#039BE5'],
      ambient: 0.3
    },
    morning: {
      sky: ['#81C784', '#64B5F6', '#90CAF9'],
      water: ['#0277BD', '#039BE5', '#03A9F4'],
      ambient: 0.6
    },
    afternoon: {
      sky: ['#64B5F6', '#42A5F5', '#2196F3'],
      water: ['#0277BD', '#0288D1', '#039BE5'],
      ambient: 1.0
    },
    sunset: {
      sky: ['#FF8A65', '#FF7043', '#FF5722'],
      water: ['#E65100', '#FF6F00', '#FF8F00'],
      ambient: 0.4
    },
    night: {
      sky: ['#3F51B5', '#303F9F', '#1A237E'],
      water: ['#0D47A1', '#1565C0', '#1976D2'],
      ambient: 0.1
    }
  };

  const currentColors = timeColorSchemes[currentTimeOfDay];

  // Handle magical gestures
  const handleGesture = useCallback((event: any) => {
    switch (event.type) {
      case 'tap':
        if (event.data.oceanSurface) {
          setOldTomPosition({ x: event.data.x, y: event.data.y });
          onOldTomEmergence({ x: event.data.x, y: event.data.y });
          
          // Create touch point for visual feedback
          const touchPoint = {
            x: event.data.x,
            y: event.data.y,
            id: `touch-${Date.now()}`,
            timestamp: Date.now()
          };
          setTouchPoints(prev => [...prev, touchPoint]);
          
          // Remove touch point after animation
          setTimeout(() => {
            setTouchPoints(prev => prev.filter(t => t.id !== touchPoint.id));
          }, 3000);
        }
        break;
        
      case 'swipe':
        if (event.data.timeOfDay) {
          const times: Array<'dawn' | 'morning' | 'afternoon' | 'sunset' | 'night'> = 
            ['dawn', 'morning', 'afternoon', 'sunset', 'night'];
          const currentIndex = times.indexOf(currentTimeOfDay);
          const newIndex = event.data.timeOfDay === 'advance' 
            ? (currentIndex + 1) % times.length
            : (currentIndex - 1 + times.length) % times.length;
          onTimeChange(times[newIndex]);
        }
        
        if (event.data.weather) {
          const weathers: Array<'calm' | 'gentle' | 'stormy'> = ['calm', 'gentle', 'stormy'];
          const currentIndex = weathers.indexOf(currentWeather);
          const newIndex = event.data.weather === 'clear' 
            ? Math.max(0, currentIndex - 1)
            : Math.min(weathers.length - 1, currentIndex + 1);
          onWeatherChange(weathers[newIndex]);
        }
        break;
        
      case 'breath':
        if (event.data.whaleSpout) {
          // Create whale spout effect at Old Tom's position
          if (oldTomPosition) {
            const spoutPoint = {
              x: oldTomPosition.x,
              y: oldTomPosition.y - 50, // Above Old Tom
              id: `spout-${Date.now()}`,
              timestamp: Date.now()
            };
            setTouchPoints(prev => [...prev, spoutPoint]);
            
            setTimeout(() => {
              setTouchPoints(prev => prev.filter(t => t.id !== spoutPoint.id));
            }, 2000);
          }
        }
        break;
        
      case 'tilt':
        if (event.data.oldTomDirection && oldTomVisible) {
          // Move Old Tom based on device tilt
          const containerRect = { width: window.innerWidth, height: window.innerHeight };
          const newX = Math.max(50, Math.min(containerRect.width - 50, 
            (oldTomPosition?.x || containerRect.width / 2) + event.data.oldTomDirection.x * 100));
          const newY = Math.max(50, Math.min(containerRect.height - 50,
            (oldTomPosition?.y || containerRect.height / 2) + event.data.oldTomDirection.y * 100));
          
          setOldTomPosition({ x: newX, y: newY });
        }
        break;
    }
  }, [currentTimeOfDay, currentWeather, oldTomPosition, oldTomVisible, onOldTomEmergence, onTimeChange, onWeatherChange]);

  // Ocean surface gradient animation
  const oceanGradient = useSpring({
    background: accessibility.highContrast 
      ? 'linear-gradient(180deg, #000000 0%, #333333 50%, #666666 100%)'
      : `linear-gradient(180deg, ${currentColors.sky[0]} 0%, ${currentColors.sky[1]} 30%, ${currentColors.water[0]} 60%, ${currentColors.water[1]} 100%)`,
    config: { duration: accessibility.reduceMotion ? 0 : 2000 }
  });

  // Wave animation
  useEffect(() => {
    if (accessibility.reduceMotion) return;
    
    const interval = setInterval(() => {
      setWaveAnimation(prev => (prev + 0.02) % (Math.PI * 2));
    }, 50);
    
    return () => clearInterval(interval);
  }, [accessibility.reduceMotion]);

  return (
    <Box sx={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <MagicalGestureRecognizer
        onGesture={handleGesture}
        enableMagicalFeedback={!accessibility.reduceMotion}
        accessibility={{
          announceGestures: accessibility.screenReader,
          largeTargets: true,
          highContrast: accessibility.highContrast
        }}
      >
        <animated.div
          style={{
            ...oceanGradient,
            width: '100%',
            height: '100%',
            position: 'relative'
          }}
          role="application"
          aria-label="Interactive ocean surface - Twofold Bay where Old Tom lives"
        >
          {/* 3D Ocean Surface */}
          {!accessibility.reduceMotion && (
            <Canvas
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              camera={{ position: [0, 5, 10], fov: 60 }}
            >
              <ambientLight intensity={currentColors.ambient} />
              <directionalLight position={[10, 10, 5]} intensity={0.5} />
              
              <OceanWaves 
                timeOfDay={currentTimeOfDay}
                weather={currentWeather}
                touchPoints={touchPoints}
                waveAnimation={waveAnimation}
              />
              
              <Environment preset="sunset" />
            </Canvas>
          )}
          
          {/* Touch Points and Effects */}
          {touchPoints.map(point => (
            <TouchPointEffect
              key={point.id}
              x={point.x}
              y={point.y}
              timestamp={point.timestamp}
              highContrast={accessibility.highContrast}
              isSpout={point.id.includes('spout')}
            />
          ))}
          
          {/* Old Tom Position Indicator */}
          {oldTomVisible && oldTomPosition && (
            <OldTomIndicator
              x={oldTomPosition.x}
              y={oldTomPosition.y}
              highContrast={accessibility.highContrast}
              reduceMotion={accessibility.reduceMotion}
            />
          )}
          
          {/* Time and Weather Indicators */}
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              background: alpha(theme.palette.background.paper, 0.8),
              borderRadius: '16px',
              padding: '12px 16px',
              backdropFilter: 'blur(10px)',
              border: accessibility.highContrast ? '2px solid white' : 'none'
            }}
          >
            <Box sx={{ fontSize: '0.9rem', fontWeight: 500, mb: 0.5 }}>
              {currentTimeOfDay.charAt(0).toUpperCase() + currentTimeOfDay.slice(1)}
            </Box>
            <Box sx={{ fontSize: '0.8rem', opacity: 0.7 }}>
              {currentWeather.charAt(0).toUpperCase() + currentWeather.slice(1)} seas
            </Box>
          </Box>
          
          {/* Accessibility Instructions */}
          {accessibility.screenReader && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                right: 20,
                background: alpha(theme.palette.background.paper, 0.9),
                borderRadius: '12px',
                padding: '16px',
                fontSize: '1rem',
                lineHeight: 1.5
              }}
              role="region"
              aria-label="Interaction instructions"
            >
              Tap anywhere on the ocean surface to call Old Tom to that location. 
              Swipe left or right to change the time of day. 
              Swipe up for clearer weather, down for stormier seas. 
              If your device supports it, tilt to guide Old Tom's movement, 
              or blow gently near the microphone to create whale spouts.
            </Box>
          )}
        </animated.div>
      </MagicalGestureRecognizer>
    </Box>
  );
};

// 3D Ocean Waves Component
const OceanWaves: React.FC<{
  timeOfDay: string;
  weather: string;
  touchPoints: Array<{ x: number; y: number; id: string; timestamp: number }>;
  waveAnimation: number;
}> = ({ timeOfDay, weather, touchPoints, waveAnimation }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  
  useFrame(() => {
    if (meshRef.current) {
      // Animate waves based on weather
      const intensity = weather === 'stormy' ? 0.3 : weather === 'gentle' ? 0.1 : 0.05;
      meshRef.current.rotation.z = Math.sin(waveAnimation) * intensity;
      meshRef.current.position.y = Math.sin(waveAnimation * 2) * intensity * 2;
    }
  });
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[50, 50, 100, 100]} />
      <meshStandardMaterial
        color={timeOfDay === 'night' ? '#0D47A1' : '#0277BD'}
        transparent
        opacity={0.7}
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  );
};

// Touch Point Effect Component
const TouchPointEffect: React.FC<{
  x: number;
  y: number;
  timestamp: number;
  highContrast: boolean;
  isSpout: boolean;
}> = ({ x, y, timestamp, highContrast, isSpout }) => {
  const theme = useTheme();
  
  const effectAnimation = useSpring({
    from: { 
      transform: isSpout ? 'scale(0) translateY(0)' : 'scale(0)',
      opacity: 1
    },
    to: { 
      transform: isSpout ? 'scale(1.5) translateY(-100px)' : 'scale(4)',
      opacity: 0
    },
    config: { tension: 120, friction: 14, duration: isSpout ? 2000 : 3000 }
  });
  
  return (
    <animated.div
      style={{
        ...effectAnimation,
        position: 'absolute',
        left: x - 25,
        top: y - 25,
        width: 50,
        height: 50,
        background: isSpout 
          ? (highContrast ? 'white' : 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(135,206,235,0.3) 100%)')
          : (highContrast ? 'white' : 'radial-gradient(circle, rgba(21,101,192,0.4) 0%, rgba(21,101,192,0.1) 100%)'),
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1000,
        filter: isSpout ? 'blur(2px)' : 'none'
      }}
    />
  );
};

// Old Tom Position Indicator
const OldTomIndicator: React.FC<{
  x: number;
  y: number;
  highContrast: boolean;
  reduceMotion: boolean;
}> = ({ x, y, highContrast, reduceMotion }) => {
  const theme = useTheme();
  
  const pulseAnimation = useSpring({
    from: { transform: 'scale(1)', opacity: 0.8 },
    to: { transform: 'scale(1.2)', opacity: 0.4 },
    config: { duration: reduceMotion ? 0 : 2000 },
    loop: !reduceMotion
  });
  
  return (
    <animated.div
      style={{
        ...pulseAnimation,
        position: 'absolute',
        left: x - 30,
        top: y - 30,
        width: 60,
        height: 60,
        background: highContrast 
          ? 'white' 
          : 'radial-gradient(circle, rgba(21,101,192,0.6) 0%, rgba(21,101,192,0.2) 100%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 500,
        border: highContrast ? '3px solid black' : '2px solid rgba(255,255,255,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px'
      }}
      aria-label="Old Tom's current location"
    >
      🐋
    </animated.div>
  );
};

export default OceanSurfaceInteraction;