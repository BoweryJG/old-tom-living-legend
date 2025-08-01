/**
 * Captain Tom Narration View
 * Pulitzer-level visual storytelling component with audio, effects, and interactivity
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { storyIntegrationService } from '../../services/storyIntegrationService';
import { captainTomNarration, interactiveMoments } from '../../content/story/captainTomNarration';
import OceanParticles from '../OceanParticles';
import './CaptainTomNarrationView.css';

interface VisualEffect {
  id: string;
  type: 'particle' | 'shader' | 'animation' | 'transition';
  config: any;
}

const CaptainTomNarrationView: React.FC = () => {
  const [currentSegment, setCurrentSegment] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualEffects, setVisualEffects] = useState<VisualEffect[]>([]);
  const [emotionalState, setEmotionalState] = useState<string>('wonder');
  const [userInteraction, setUserInteraction] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Initialize story on mount
  useEffect(() => {
    initializeStory();
    
    // Listen for emotional state changes
    window.addEventListener('emotionalStateChange', handleEmotionalStateChange);
    
    return () => {
      window.removeEventListener('emotionalStateChange', handleEmotionalStateChange);
    };
  }, []);

  const initializeStory = async () => {
    const { firstSegment, visualDescription, soundscape } = await storyIntegrationService.initializeStory();
    const segmentWithAudio = await storyIntegrationService.getCurrentSegment();
    
    setCurrentSegment(segmentWithAudio.segment);
    setAudioUrl(segmentWithAudio.audioUrl || null);
    
    // Initialize visual effects
    initializeVisualEffects(firstSegment);
  };

  const handleEmotionalStateChange = (event: any) => {
    setEmotionalState(event.detail.emotion);
    updateVisualTheme(event.detail.emotion);
  };

  const initializeVisualEffects = (segment: typeof captainTomNarration[0]) => {
    const effects: VisualEffect[] = segment.specialEffects.map((effect, index) => ({
      id: `${segment.id}_effect_${index}`,
      type: determineEffectType(effect),
      config: generateEffectConfig(effect, segment.emotionalTone)
    }));
    
    setVisualEffects(effects);
  };

  const determineEffectType = (effect: string): VisualEffect['type'] => {
    if (effect.includes('particle')) return 'particle';
    if (effect.includes('transition')) return 'transition';
    if (effect.includes('glow') || effect.includes('light')) return 'shader';
    return 'animation';
  };

  const generateEffectConfig = (effect: string, emotion: string) => {
    // Generate configuration based on effect type and emotional tone
    const configs: Record<string, any> = {
      'floating_bioluminescent_particles': {
        count: 1000,
        color: '#00ffff',
        size: 0.1,
        speed: 0.5,
        spread: 50
      },
      'aurora_australis_in_sky': {
        colors: ['#00ff00', '#0000ff', '#ff00ff'],
        intensity: 0.7,
        speed: 0.3
      },
      'time_freeze_effect': {
        duration: 3000,
        blur: 5,
        grayscale: 0.8
      },
      'ripple_transformation_global': {
        startRadius: 0,
        endRadius: 1000,
        duration: 5000,
        color: '#4488ff'
      }
    };
    
    return configs[effect] || {};
  };

  const updateVisualTheme = (emotion: string) => {
    const themes: Record<string, any> = {
      wonder: { 
        background: 'linear-gradient(180deg, #001a33 0%, #003366 100%)',
        particleColor: '#00ffff',
        lightIntensity: 0.8
      },
      exciting: {
        background: 'linear-gradient(180deg, #ff6600 0%, #ffaa00 100%)',
        particleColor: '#ffff00',
        lightIntensity: 1.2
      },
      gentle: {
        background: 'linear-gradient(180deg, #6699cc 0%, #99ccff 100%)',
        particleColor: '#ffffff',
        lightIntensity: 0.6
      },
      mysterious: {
        background: 'linear-gradient(180deg, #000033 0%, #330066 100%)',
        particleColor: '#9900ff',
        lightIntensity: 0.4
      },
      heartwarming: {
        background: 'linear-gradient(180deg, #ff9999 0%, #ffcccc 100%)',
        particleColor: '#ff6666',
        lightIntensity: 0.9
      },
      bittersweet: {
        background: 'linear-gradient(180deg, #666699 0%, #9999cc 100%)',
        particleColor: '#ccccff',
        lightIntensity: 0.7
      },
      inspiring: {
        background: 'linear-gradient(180deg, #0066cc 0%, #00ccff 100%)',
        particleColor: '#ffffff',
        lightIntensity: 1.0
      }
    };
    
    const theme = themes[emotion] || themes.wonder;
    
    // Apply theme to the view
    if (canvasRef.current) {
      canvasRef.current.style.background = theme.background;
    }
  };

  const playNarration = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play();
      setIsPlaying(true);
      
      // Sync visual effects with audio
      syncVisualsWithAudio();
    }
  };

  const syncVisualsWithAudio = () => {
    if (!currentSegment || !audioRef.current) return;
    
    const duration = audioRef.current.duration || 30; // fallback duration
    const effectInterval = duration / visualEffects.length;
    
    visualEffects.forEach((effect, index) => {
      setTimeout(() => {
        triggerVisualEffect(effect);
      }, effectInterval * index * 1000);
    });
  };

  const triggerVisualEffect = (effect: VisualEffect) => {
    console.log('Triggering effect:', effect);
    
    // Dispatch custom event for effect systems
    window.dispatchEvent(new CustomEvent('triggerStoryEffect', {
      detail: { effect, emotionalState }
    }));
  };

  const handleNextSegment = async () => {
    const nextSegment = await storyIntegrationService.nextSegment();
    
    if (nextSegment) {
      setCurrentSegment(nextSegment.segment);
      setAudioUrl(nextSegment.audioUrl || null);
      initializeVisualEffects(nextSegment.segment);
      
      // Reset and play
      setIsPlaying(false);
      setTimeout(() => playNarration(), 500);
    } else {
      // Story complete
      handleStoryComplete();
    }
  };

  const handleStoryComplete = () => {
    console.log('Story complete!');
    // Show completion screen with user's choices and impact
    const progress = storyIntegrationService.getProgress();
    console.log('User journey:', progress);
  };

  const handleInteraction = async (interaction: typeof interactiveMoments[0]) => {
    setUserInteraction(interaction);
    
    // Pause narration during interaction
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const submitInteraction = async (choice: any) => {
    if (!userInteraction) return;
    
    const result = await storyIntegrationService.handleInteraction(userInteraction.id, choice);
    
    // Resume narration
    if (audioRef.current) {
      audioRef.current.play();
    }
    
    setUserInteraction(null);
  };

  const renderNarrationText = () => {
    if (!currentSegment) return null;
    
    // Split text into animated spans for word-by-word reveal
    const words = currentSegment.text.split(' ');
    
    return (
      <div className="narration-text-container" ref={textRef}>
        <AnimatePresence>
          {words.map((word, index) => (
            <motion.span
              key={`${currentSegment.id}_word_${index}`}
              className="narration-word"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut"
              }}
            >
              {word}{' '}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  const renderInteractionPrompt = () => {
    if (!userInteraction) return null;
    
    return (
      <motion.div
        className="interaction-prompt"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <h3>{userInteraction.prompt}</h3>
        
        {userInteraction.id === 'create_splash_pattern' && (
          <div className="splash-pattern-selector">
            <button onClick={() => submitInteraction('gentle_splash')}>Gentle Splash</button>
            <button onClick={() => submitInteraction('mighty_splash')}>Mighty Splash</button>
            <button onClick={() => submitInteraction('rhythmic_splash')}>Rhythmic Pattern</button>
          </div>
        )}
        
        {userInteraction.id === 'choose_kindness' && (
          <div className="kindness-choice">
            <button onClick={() => submitInteraction('share')}>Share the Fish</button>
            <button onClick={() => submitInteraction('keep')}>Keep the Fish</button>
          </div>
        )}
        
        {userInteraction.id === 'your_ripple' && (
          <div className="ripple-promise">
            <input
              type="text"
              placeholder="What kind thing will you do?"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  submitInteraction(e.currentTarget.value);
                }
              }}
            />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="captain-tom-narration-view">
      {/* Background Canvas with Effects */}
      <Canvas 
        ref={canvasRef}
        className="story-canvas"
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={emotionalState === 'exciting' ? 1.5 : 1} />
        
        {/* Ocean particles with emotional response */}
        <OceanParticles 
          count={emotionalState === 'wonder' ? 5000 : 3000}
          color={emotionalState === 'heartwarming' ? '#ff9999' : '#00ccff'}
        />
        
        {/* Dynamic visual effects */}
        {visualEffects.map(effect => (
          <VisualEffectRenderer key={effect.id} effect={effect} />
        ))}
      </Canvas>

      {/* Narration Overlay */}
      <div className="narration-overlay">
        {/* Captain Tom's ghostly presence */}
        <motion.div 
          className="captain-tom-presence"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Text display with typewriter effect */}
        <div className="narration-text">
          {renderNarrationText()}
        </div>

        {/* Interactive prompts */}
        <AnimatePresence>
          {renderInteractionPrompt()}
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="story-progress">
          <div 
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Audio controls */}
        <div className="audio-controls">
          {!isPlaying ? (
            <button onClick={playNarration}>Begin Story</button>
          ) : (
            <button onClick={handleNextSegment}>Continue</button>
          )}
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={audioUrl || undefined}
          onTimeUpdate={(e) => {
            const audio = e.currentTarget;
            setProgress((audio.currentTime / audio.duration) * 100);
          }}
          onEnded={() => {
            setIsPlaying(false);
            // Auto-advance for non-interactive segments
            if (!userInteraction) {
              setTimeout(handleNextSegment, 2000);
            }
          }}
        />
      </div>

      {/* Chapter indicator */}
      <div className="chapter-indicator">
        <h2>{currentSegment?.chapter.replace(/_/g, ' ').toUpperCase()}</h2>
      </div>
    </div>
  );
};

// Visual Effect Renderer Component
const VisualEffectRenderer: React.FC<{ effect: VisualEffect }> = ({ effect }) => {
  // This would render specific visual effects based on type
  // For now, return null as a placeholder
  return null;
};

export default CaptainTomNarrationView;