// @ts-nocheck
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag, useWheel, usePinch } from '@use-gesture/react';
import { Box, useTheme } from '@mui/material';

interface GestureEvent {
  type: 'tap' | 'swipe' | 'pinch' | 'tilt' | 'breath' | 'voice';
  data: any;
  timestamp: number;
  childFriendly: boolean;
}

interface MagicalGestureRecognizerProps {
  onGesture: (event: GestureEvent) => void;
  children: React.ReactNode;
  enableMagicalFeedback?: boolean;
  accessibility?: {
    announceGestures: boolean;
    largeTargets: boolean;
    highContrast: boolean;
  };
}

export const MagicalGestureRecognizer: React.FC<MagicalGestureRecognizerProps> = ({
  onGesture,
  children,
  enableMagicalFeedback = true,
  accessibility = {
    announceGestures: false,
    largeTargets: false,
    highContrast: false
  }
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Array<{ id: string; x: number; y: number; timestamp: number }>>([]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });

  // Magical ripple effect for touch interactions
  const createRipple = useCallback((x: number, y: number) => {
    if (!enableMagicalFeedback) return;
    
    const newRipple = {
      id: `ripple-${Date.now()}-${Math.random()}`,
      x,
      y,
      timestamp: Date.now()
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  }, [enableMagicalFeedback]);

  // Enhanced drag gesture for Old Tom swimming
  const bind = useDrag(
    ({ movement: [mx, my], velocity: [vx, vy], tap, xy: [x, y] }) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const relativeX = x - rect.left;
      const relativeY = y - rect.top;

      if (tap) {
        createRipple(relativeX, relativeY);
        onGesture({
          type: 'tap',
          data: { 
            x: relativeX, 
            y: relativeY, 
            oceanSurface: relativeY < rect.height * 0.3,
            oldTomEmergence: true
          },
          timestamp: Date.now(),
          childFriendly: true
        });
      } else if (Math.abs(mx) > 50 || Math.abs(my) > 50) {
        // Swipe gesture for time/weather changes
        const direction = Math.abs(mx) > Math.abs(my) 
          ? (mx > 0 ? 'right' : 'left')
          : (my > 0 ? 'down' : 'up');
        
        onGesture({
          type: 'swipe',
          data: { 
            direction, 
            velocity: { x: vx, y: vy },
            timeOfDay: direction === 'right' ? 'advance' : 'reverse',
            weather: direction === 'up' ? 'clear' : 'stormy'
          },
          timestamp: Date.now(),
          childFriendly: true
        });
      }
    },
    { 
      threshold: 10,
      swipe: { distance: 50, velocity: 0.5 }
    }
  );

  // Pinch gesture for exploration
  const bindPinch = usePinch(
    ({ offset: [scale, angle], movement: [ms, ma] }) => {
      if (Math.abs(ms) > 0.1) {
        onGesture({
          type: 'pinch',
          data: { 
            scale, 
            angle,
            exploring: scale > 1,
            historicalDetail: scale > 1.5,
            hiddenContent: scale > 2
          },
          timestamp: Date.now(),
          childFriendly: true
        });
      }
    }
  );

  // Device tilt for Old Tom following
  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      const { alpha, beta, gamma } = event;
      if (alpha !== null && beta !== null && gamma !== null) {
        setDeviceOrientation({ alpha, beta, gamma });
        
        // Significant tilt triggers Old Tom movement
        if (Math.abs(gamma || 0) > 15 || Math.abs(beta || 0) > 15) {
          onGesture({
            type: 'tilt',
            data: { 
              alpha, 
              beta, 
              gamma,
              oldTomDirection: {
                x: (gamma || 0) / 90, // -1 to 1
                y: (beta || 0) / 90   // -1 to 1
              },
              swimIntensity: Math.min(Math.abs(gamma || 0) / 45, 1)
            },
            timestamp: Date.now(),
            childFriendly: true
          });
        }
      }
    };

    if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      return () => window.removeEventListener('deviceorientation', handleDeviceOrientation);
    }
  }, [onGesture]);

  // Microphone breath detection for whale spouts
  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let microphone: MediaStreamAudioSourceNode;
    let dataArray: Uint8Array;
    let animationFrame: number;

    const initializeMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: { 
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        microphone.connect(analyser);
        
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const detectBreath = () => {
          analyser.getByteFrequencyData(dataArray);
          
          // Detect breath-like audio patterns (low frequency, sustained)
          const lowFreqEnergy = dataArray.slice(0, 10).reduce((sum, val) => sum + val, 0) / 10;
          const isBreathPattern = lowFreqEnergy > 30 && lowFreqEnergy < 80;
          
          if (isBreathPattern && !isBreathing) {
            setIsBreathing(true);
            onGesture({
              type: 'breath',
              data: { 
                intensity: lowFreqEnergy / 80,
                whaleSpout: true,
                breathingEffect: true,
                oldTomResponse: 'surface'
              },
              timestamp: Date.now(),
              childFriendly: true
            });
            
            // Reset after breath
            setTimeout(() => setIsBreathing(false), 2000);
          }
          
          animationFrame = requestAnimationFrame(detectBreath);
        };
        
        detectBreath();
        
      } catch (error) {
        console.log('Microphone not available:', error);
      }
    };

    initializeMicrophone();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (audioContext) audioContext.close();
    };
  }, [onGesture, isBreathing]);

  // Magical breathing animation
  const breathingAnimation = useSpring({
    transform: isBreathing ? 'scale(1.05)' : 'scale(1)',
    config: { tension: 300, friction: 30 }
  });

  return (
    <animated.div
      ref={containerRef}
      {...bind()}
      {...bindPinch()}
      style={{
        ...breathingAnimation,
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none',
        cursor: 'grab',
        minHeight: accessibility.largeTargets ? '48px' : '44px'
      }}
      role="button"
      tabIndex={0}
      aria-label="Interactive magical surface - tap to make Old Tom emerge, swipe to change time, pinch to explore"
      aria-describedby={accessibility.announceGestures ? 'gesture-instructions' : undefined}
    >
      {children}
      
      {/* Magical ripple effects */}
      {ripples.map(ripple => (
        <MagicalRipple
          key={ripple.id}
          x={ripple.x}
          y={ripple.y}
          timestamp={ripple.timestamp}
          highContrast={accessibility.highContrast}
        />
      ))}
      
      {/* Accessibility instructions */}
      {accessibility.announceGestures && (
        <div
          id="gesture-instructions"
          style={{ 
            position: 'absolute', 
            left: '-9999px',
            width: '1px',
            height: '1px'
          }}
          aria-live="polite"
        >
          Touch the ocean to call Old Tom. Swipe to change the time of day. 
          Pinch to explore hidden details. Tilt your device to guide Old Tom's swimming.
          Blow gently to create whale spouts.
        </div>
      )}
    </animated.div>
  );
};

interface MagicalRippleProps {
  x: number;
  y: number;
  timestamp: number;
  highContrast: boolean;
}

const MagicalRipple: React.FC<MagicalRippleProps> = ({ x, y, timestamp, highContrast }) => {
  const theme = useTheme();
  
  const rippleAnimation = useSpring({
    from: { 
      transform: 'scale(0) rotate(0deg)', 
      opacity: 0.8,
      background: highContrast 
        ? 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(0,0,0,0.1) 100%)'
        : 'radial-gradient(circle, rgba(21,101,192,0.3) 0%, rgba(21,101,192,0.05) 100%)'
    },
    to: { 
      transform: 'scale(3) rotate(180deg)', 
      opacity: 0,
      background: highContrast 
        ? 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 100%)'
        : 'radial-gradient(circle, rgba(21,101,192,0.1) 0%, rgba(21,101,192,0) 100%)'
    },
    config: { tension: 200, friction: 25, duration: 1000 }
  });

  return (
    <animated.div
      style={{
        ...rippleAnimation,
        position: 'absolute',
        left: x - 20,
        top: y - 20,
        width: 40,
        height: 40,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1000,
        mixBlendMode: highContrast ? 'difference' : 'multiply'
      }}
    />
  );
};

export default MagicalGestureRecognizer;