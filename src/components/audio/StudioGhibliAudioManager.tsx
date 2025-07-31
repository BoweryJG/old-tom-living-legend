// @ts-nocheck
/**
 * Studio Ghibli Audio Manager Component for Old Tom: The Living Legend
 * 
 * Central audio management component that orchestrates all audio systems
 * to create the magical Studio Ghibli soundscape experience
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  setAudioContext, 
  setSpatialAudioEnabled, 
  setListenerPosition,
  setSpatialSource
} from '@/store/slices/audioSlice';
import { OrchestralComposer } from '@/services/audio/orchestralComposer';
import { SpatialAudioEngine, Vector3D } from '@/services/audio/spatialAudioEngine';
import { InteractiveAudioMixer, EmotionalState, InteractionEvent } from '@/services/audio/interactiveAudioMixer';

interface StudioGhibliAudioManagerProps {
  children: React.ReactNode;
  emotionalState?: EmotionalState;
  currentStoryMoment?: string;
  userInteractions?: InteractionEvent[];
  isUnderwater?: boolean;
  listenerPosition?: Vector3D;
}

interface AudioAsset {
  id: string;
  url: string;
  type: 'orchestral' | 'whale_sound' | 'environment' | 'voice' | 'effect';
  preload: boolean;
  spatial: boolean;
  loop: boolean;
}

export const StudioGhibliAudioManager: React.FC<StudioGhibliAudioManagerProps> = ({
  children,
  emotionalState,
  currentStoryMoment,
  userInteractions = [],
  isUnderwater = false,
  listenerPosition = { x: 0, y: 0, z: 0 }
}) => {
  const dispatch = useAppDispatch();
  const audioState = useAppSelector(state => state.audio);
  
  // Audio system references
  const audioContextRef = useRef<AudioContext | null>(null);
  const orchestralComposerRef = useRef<OrchestralComposer | null>(null);
  const spatialEngineRef = useRef<SpatialAudioEngine | null>(null);
  const interactiveMixerRef = useRef<InteractiveAudioMixer | null>(null);
  
  // Component state
  const [isInitialized, setIsInitialized] = useState(false);
  const [audioAssets, setAudioAssets] = useState<Map<string, AudioAsset>>(new Map());
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);
  const [currentEnvironment, setCurrentEnvironment] = useState<'surface' | 'underwater'>('surface');

  /**
   * Initialize all audio systems
   */
  const initializeAudioSystems = useCallback(async () => {
    try {
      // Create Web Audio Context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      dispatch(setAudioContext(audioContext));

      // Wait for user interaction to resume context if needed
      if (audioContext.state === 'suspended') {
        document.addEventListener('click', () => {
          audioContext.resume();
        }, { once: true });
      }

      // Initialize orchestral composer
      const orchestralComposer = new OrchestralComposer(audioContext);
      orchestralComposerRef.current = orchestralComposer;

      // Initialize spatial audio engine
      const spatialEngine = new SpatialAudioEngine(audioContext);
      spatialEngineRef.current = spatialEngine;

      // Initialize interactive mixer
      const interactiveMixer = new InteractiveAudioMixer(
        orchestralComposer,
        spatialEngine,
        audioContext
      );
      interactiveMixerRef.current = interactiveMixer;

      // Load essential audio assets
      await loadAudioAssets();

      // Setup environment
      setupInitialEnvironment();

      setIsInitialized(true);
      console.log('Studio Ghibli audio systems initialized successfully');

    } catch (error) {
      console.error('Failed to initialize audio systems:', error);
    }
  }, [dispatch]);

  /**
   * Load and cache audio assets
   */
  const loadAudioAssets = useCallback(async (): Promise<void> => {
    const assetDefinitions: AudioAsset[] = [
      // Orchestral music
      {
        id: 'main-theme',
        url: '/assets/audio/music/orchestral/main-theme-oceans-embrace.mp3',
        type: 'orchestral',
        preload: true,
        spatial: false,
        loop: true
      },
      {
        id: 'old-tom-leitmotif',
        url: '/assets/audio/music/orchestral/old-tom-leitmotif-ancient-guardian.mp3',
        type: 'orchestral',
        preload: true,
        spatial: false,
        loop: true
      },
      {
        id: 'partnership-theme',
        url: '/assets/audio/music/orchestral/partnership-bonds-beyond-words.mp3',
        type: 'orchestral',
        preload: false,
        spatial: false,
        loop: true
      },

      // Old Tom's whale sounds
      {
        id: 'old-tom-greeting',
        url: '/assets/audio/sounds/whale-songs/old-tom-greeting-call.wav',
        type: 'whale_sound',
        preload: true,
        spatial: true,
        loop: false
      },
      {
        id: 'old-tom-gentle-song',
        url: '/assets/audio/sounds/whale-songs/old-tom-gentle-song.wav',
        type: 'whale_sound',
        preload: true,
        spatial: true,
        loop: true
      },
      {
        id: 'old-tom-excitement',
        url: '/assets/audio/sounds/whale-songs/old-tom-excitement-calls.wav',
        type: 'whale_sound',
        preload: false,
        spatial: true,
        loop: false
      },

      // Environmental sounds
      {
        id: 'ocean-waves-gentle',
        url: '/assets/audio/sounds/environmental/ocean-waves-gentle.wav',
        type: 'environment',
        preload: true,
        spatial: true,
        loop: true
      },
      {
        id: 'underwater-ambient',
        url: '/assets/audio/sounds/environmental/underwater-ambient-shallow.wav',
        type: 'environment',
        preload: true,
        spatial: false,
        loop: true
      },
      {
        id: 'coastal-wind',
        url: '/assets/audio/sounds/environmental/coastal-wind-gentle.wav',
        type: 'environment',
        preload: true,
        spatial: true,
        loop: true
      },

      // Interactive effects
      {
        id: 'water-ripple-touch',
        url: '/assets/audio/sounds/effects/water-ripple-touch.wav',
        type: 'effect',
        preload: true,
        spatial: true,
        loop: false
      },
      {
        id: 'choice-confirmation',
        url: '/assets/audio/sounds/effects/choice-confirmation.wav',
        type: 'effect',
        preload: true,
        spatial: false,
        loop: false
      }
    ];

    const assetMap = new Map<string, AudioAsset>();
    const preloadAssets = assetDefinitions.filter(asset => asset.preload);
    
    // Load preload assets first
    let loaded = 0;
    const total = preloadAssets.length;

    for (const asset of preloadAssets) {
      try {
        assetMap.set(asset.id, asset);
        
        // Create spatial audio source if needed
        if (asset.spatial && spatialEngineRef.current) {
          await spatialEngineRef.current.createSource(
            asset.id,
            asset.url,
            { x: 0, y: 0, z: 0 }, // Default position
            {
              loop: asset.loop,
              volume: 0.8,
              maxDistance: asset.type === 'environment' ? 1000 : 100
            }
          );
        }

        loaded++;
        setLoadingProgress((loaded / total) * 100);

      } catch (error) {
        console.warn(`Failed to load audio asset ${asset.id}:`, error);
      }
    }

    // Store all asset definitions for lazy loading
    assetDefinitions.forEach(asset => {
      if (!assetMap.has(asset.id)) {
        assetMap.set(asset.id, asset);
      }
    });

    setAudioAssets(assetMap);
    setIsPreloading(false);
  }, []);

  /**
   * Setup initial audio environment
   */
  const setupInitialEnvironment = useCallback(() => {
    if (!spatialEngineRef.current || !interactiveMixerRef.current) return;

    // Set initial environment to surface/coastal
    spatialEngineRef.current.setEnvironment('surface');
    
    // Start ambient ocean sounds
    const oceanPosition: Vector3D = { x: 0, y: 0, z: -20 };
    spatialEngineRef.current.updateSourcePosition('ocean-waves-gentle', oceanPosition);
    spatialEngineRef.current.playSource('ocean-waves-gentle');

    // Position wind sounds
    const windPosition: Vector3D = { x: -30, y: 10, z: 0 };
    spatialEngineRef.current.updateSourcePosition('coastal-wind', windPosition);
    spatialEngineRef.current.playSource('coastal-wind');

    // Start with gentle main theme
    if (orchestralComposerRef.current) {
      orchestralComposerRef.current.playTheme('main-theme', 'soft');
    }

    console.log('Initial audio environment setup complete');
  }, []);

  /**
   * Handle emotional state changes
   */
  useEffect(() => {
    if (!emotionalState || !interactiveMixerRef.current || !isInitialized) return;

    interactiveMixerRef.current.updateEmotionalState(emotionalState);
    
    // Adapt orchestral music to emotion
    if (orchestralComposerRef.current) {
      orchestralComposerRef.current.adaptToUserEmotion(
        emotionalState.primary, 
        emotionalState.intensity
      );
    }

  }, [emotionalState, isInitialized]);

  /**
   * Handle user interactions
   */
  useEffect(() => {
    if (!userInteractions.length || !interactiveMixerRef.current || !isInitialized) return;

    const latestInteraction = userInteractions[userInteractions.length - 1];
    interactiveMixerRef.current.handleInteraction(latestInteraction);

  }, [userInteractions, isInitialized]);

  /**
   * Handle underwater/surface transitions
   */
  useEffect(() => {
    if (!spatialEngineRef.current || !isInitialized) return;

    if (isUnderwater !== (currentEnvironment === 'underwater')) {
      const newEnvironment = isUnderwater ? 'underwater' : 'surface';
      setCurrentEnvironment(newEnvironment);
      
      // Transition to underwater acoustics
      spatialEngineRef.current.setUnderwater(
        isUnderwater,
        Math.abs(listenerPosition.y),
        {
          salinity: 35,
          temperature: 15,
          bubbles: isUnderwater
        }
      );

      // Fade environmental sounds appropriately
      if (isUnderwater) {
        spatialEngineRef.current.playSource('underwater-ambient');
        // Fade out surface sounds
      } else {
        spatialEngineRef.current.stopSource('underwater-ambient');
        // Fade in surface sounds
      }

      console.log(`Audio environment transitioned to: ${newEnvironment}`);
    }
  }, [isUnderwater, currentEnvironment, listenerPosition.y, isInitialized]);

  /**
   * Handle listener position updates
   */
  useEffect(() => {
    if (!spatialEngineRef.current || !isInitialized) return;

    spatialEngineRef.current.updateListener(listenerPosition);
    dispatch(setListenerPosition(listenerPosition));

  }, [listenerPosition, dispatch, isInitialized]);

  /**
   * Handle story moment changes
   */
  useEffect(() => {
    if (!currentStoryMoment || !interactiveMixerRef.current || !isInitialized) return;

    // Load story moment from predefined moments
    const storyMoments = getStoryMoments();
    const moment = storyMoments.get(currentStoryMoment);
    
    if (moment) {
      interactiveMixerRef.current.startStoryMoment(moment);
      console.log(`Started story moment: ${currentStoryMoment}`);
    }

  }, [currentStoryMoment, isInitialized]);

  /**
   * Initialize audio systems on component mount
   */
  useEffect(() => {
    initializeAudioSystems();

    // Cleanup on unmount
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [initializeAudioSystems]);

  /**
   * Handle window focus/blur for audio performance
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audioContextRef.current) return;

      if (document.hidden) {
        // Reduce audio processing when tab is not visible
        if (interactiveMixerRef.current) {
          interactiveMixerRef.current.setRealtimeMixing(false);
        }
      } else {
        // Resume full audio processing when tab is visible
        if (interactiveMixerRef.current) {
          interactiveMixerRef.current.setRealtimeMixing(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  /**
   * Create Old Tom swimming animation
   */
  const animateOldTomSwimming = useCallback((radius: number = 25, speed: number = 1.5) => {
    if (!spatialEngineRef.current || !isInitialized) return;

    // Create or update Old Tom's spatial presence
    spatialEngineRef.current.animateWhaleSwimming('old-tom-gentle-song', radius, speed, 60);
    
    console.log('Old Tom swimming animation started');
  }, [isInitialized]);

  /**
   * Trigger Old Tom greeting
   */
  const triggerOldTomGreeting = useCallback((position?: Vector3D) => {
    if (!spatialEngineRef.current || !isInitialized) return;

    const greetingPosition = position || { x: 10, y: -2, z: 5 };
    
    spatialEngineRef.current.updateSourcePosition('old-tom-greeting', greetingPosition);
    spatialEngineRef.current.playSource('old-tom-greeting');
    
    console.log('Old Tom greeting triggered');
  }, [isInitialized]);

  /**
   * Get predefined story moments
   */
  const getStoryMoments = () => {
    // This would typically be loaded from a configuration file
    return new Map([
      ['story_opening', {
        id: 'story_opening',
        name: 'The Legend Begins',
        emotional_arc: [
          { primary: 'wonder', intensity: 0.6, confidence: 0.8, timestamp: 0, context: 'opening' },
          { primary: 'curiosity', intensity: 0.8, confidence: 0.9, timestamp: 30, context: 'discovery' }
        ],
        audio_cues: [
          {
            trigger_time: 0,
            type: 'fade_in' as const,
            target: 'main-theme',
            parameters: { duration: 3.0 }
          },
          {
            trigger_time: 15,
            type: 'play' as const,
            target: 'old-tom-gentle-song',
            parameters: {}
          }
        ],
        expected_duration: 60,
        adaptive_triggers: []
      }]
    ]);
  };

  // Loading screen while preloading assets
  if (isPreloading) {
    return (
      <div className="audio-loading-overlay">
        <div className="loading-content">
          <h3>Preparing the Ocean's Symphony...</h3>
          <div className="loading-bar">
            <div 
              className="loading-progress" 
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p>Loading Studio Ghibli audio experience</p>
        </div>
      </div>
    );
  }

  // Expose audio controls to children through context
  const audioControls = {
    isInitialized,
    animateOldTomSwimming,
    triggerOldTomGreeting,
    spatialEngine: spatialEngineRef.current,
    orchestralComposer: orchestralComposerRef.current,
    interactiveMixer: interactiveMixerRef.current
  };

  return (
    <AudioControlsContext.Provider value={audioControls}>
      {children}
      
      {/* Audio visualization component (optional) */}
      {process.env.NODE_ENV === 'development' && (
        <AudioDebugPanel 
          spatialEngine={spatialEngineRef.current}
          interactiveMixer={interactiveMixerRef.current}
          currentEnvironment={currentEnvironment}
        />
      )}
    </AudioControlsContext.Provider>
  );
};

// Context for accessing audio controls from child components
export const AudioControlsContext = React.createContext<any>(null);

export const useAudioControls = () => {
  const context = React.useContext(AudioControlsContext);
  if (!context) {
    throw new Error('useAudioControls must be used within StudioGhibliAudioManager');
  }
  return context;
};

// Debug panel for development
interface AudioDebugPanelProps {
  spatialEngine: SpatialAudioEngine | null;
  interactiveMixer: InteractiveAudioMixer | null;
  currentEnvironment: string;
}

const AudioDebugPanel: React.FC<AudioDebugPanelProps> = ({
  spatialEngine,
  interactiveMixer,
  currentEnvironment
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 9999,
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '5px'
        }}
      >
        Audio Debug
      </button>
    );
  }

  const mixingState = interactiveMixer?.getMixingState();

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      width: 300,
      backgroundColor: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h4>Audio Debug Panel</h4>
        <button onClick={() => setIsVisible(false)}>×</button>
      </div>
      
      <div><strong>Environment:</strong> {currentEnvironment}</div>
      <div><strong>Active Sources:</strong> {spatialEngine?.getSources().size || 0}</div>
      
      {mixingState && (
        <>
          <div><strong>Current Emotion:</strong> {mixingState.currentEmotion.primary} ({(mixingState.currentEmotion.intensity * 100).toFixed(0)}%)</div>
          <div><strong>Story Moment:</strong> {mixingState.currentStoryMoment || 'None'}</div>
          <div><strong>Realtime Mixing:</strong> {mixingState.realtimeMixingEnabled ? 'On' : 'Off'}</div>
          <div><strong>Active Layers:</strong></div>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            {mixingState.activeLayers.map((layer: string) => (
              <li key={layer}>{layer}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default StudioGhibliAudioManager;