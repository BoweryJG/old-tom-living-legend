/**
 * Interactive Audio Mixer for Old Tom: The Living Legend
 * 
 * Creates real-time, emotionally responsive audio mixing that adapts to
 * user interactions, story progression, and emotional state detection
 */

import { OrchestralComposer, MusicalTheme } from './orchestralComposer';
import { spatialAudioEngine } from './spatialAudioEngine';
import type { SpatialAudioEngine, SpatialAudioSource, Vector3D } from './spatialAudioEngine';

export interface EmotionalState {
  primary: string; // happiness, sadness, excitement, wonder, calm, etc.
  intensity: number; // 0-1
  confidence: number; // 0-1, how confident we are in this reading
  timestamp: number;
  context: string; // story context that triggered this emotion
}

export interface InteractionEvent {
  type: 'touch' | 'voice' | 'gesture' | 'gaze' | 'choice';
  position?: Vector3D;
  intensity: number;
  duration: number;
  target?: string; // What was interacted with
  context: string; // Story context
  timestamp: number;
}

export interface AudioLayer {
  id: string;
  name: string;
  type: 'music' | 'environment' | 'voice' | 'effects' | 'whale_sounds';
  sources: string[]; // Spatial audio source IDs
  volume: number;
  priority: number;
  emotional_triggers: string[];
  interaction_triggers: string[];
  story_triggers: string[];
  fadeTime: number;
  crossfadeGroup?: string; // For mutually exclusive layers
  adaptiveParameters: AdaptiveParameters;
}

export interface AdaptiveParameters {
  tempo_sensitivity: number; // How much tempo responds to emotion
  volume_sensitivity: number; // How much volume responds to interaction
  spatial_movement: boolean; // Whether sources move in response to interaction
  harmonic_adaptation: boolean; // Whether harmony adapts to emotion
  reverb_adaptation: boolean; // Whether reverb adapts to environment/emotion
  filter_adaptation: boolean; // Whether filtering adapts to state
}

export interface StoryMoment {
  id: string;
  name: string;
  emotional_arc: EmotionalState[];
  audio_cues: AudioCue[];
  expected_duration: number;
  adaptive_triggers: AdaptiveTrigger[];
}

export interface AudioCue {
  trigger_time: number; // Seconds from moment start
  type: 'play' | 'stop' | 'fade_in' | 'fade_out' | 'crossfade' | 'spatial_move';
  target: string; // Layer or source ID
  parameters: any;
  conditional?: {
    emotion?: string;
    interaction?: string;
    user_choice?: string;
  };
}

export interface AdaptiveTrigger {
  id: string;
  condition: {
    emotion?: { state: string; min_intensity: number };
    interaction?: { type: string; min_intensity: number };
    story_progress?: number;
    time_in_moment?: number;
  };
  audio_response: {
    type: 'layer_adjust' | 'spatial_move' | 'theme_introduction' | 'effect_trigger';
    parameters: any;
  };
  cooldown?: number; // Minimum time between triggers
  max_triggers?: number; // Maximum times this can trigger
}

export class InteractiveAudioMixer {
  private orchestralComposer: OrchestralComposer;
  private spatialEngine: SpatialAudioEngine;
  private audioContext: AudioContext;
  
  private layers: Map<string, AudioLayer> = new Map();
  private currentEmotionalState: EmotionalState;
  private emotionalHistory: EmotionalState[] = [];
  private interactionHistory: InteractionEvent[] = [];
  private currentStoryMoment: StoryMoment | null = null;
  private storyMomentStartTime: number = 0;
  
  private adaptiveTriggerStates: Map<string, { last_triggered: number; trigger_count: number }> = new Map();
  private crossfadeGroups: Map<string, string[]> = new Map(); // Group name -> layer IDs
  
  private isRealtimeMixingEnabled: boolean = true;
  private emotionalSmoothingFactor: number = 0.3; // How quickly emotion changes affect audio
  private interactionResponseTime: number = 100; // ms to respond to interactions
  
  constructor(
    orchestralComposer: OrchestralComposer,
    spatialEngine: SpatialAudioEngine,
    audioContext: AudioContext
  ) {
    this.orchestralComposer = orchestralComposer;
    this.spatialEngine = spatialEngine;
    this.audioContext = audioContext;
    
    this.currentEmotionalState = {
      primary: 'wonder',
      intensity: 0.5,
      confidence: 0.8,
      timestamp: Date.now(),
      context: 'app_start'
    };
    
    this.initializeDefaultLayers();
    this.setupRealtimeProcessing();
  }

  /**
   * Initialize default audio layers for the Old Tom experience
   */
  private initializeDefaultLayers(): void {
    // Main orchestral layer
    this.layers.set('orchestral_main', {
      id: 'orchestral_main',
      name: 'Main Orchestral Score',
      type: 'music',
      sources: ['main-theme', 'old-tom-theme'],
      volume: 0.7,
      priority: 1,
      emotional_triggers: ['wonder', 'friendship', 'discovery'],
      interaction_triggers: ['touch', 'voice'],
      story_triggers: ['story_start', 'character_introduction'],
      fadeTime: 2.0,
      crossfadeGroup: 'music_primary',
      adaptiveParameters: {
        tempo_sensitivity: 0.8,
        volume_sensitivity: 0.6,
        spatial_movement: false,
        harmonic_adaptation: true,
        reverb_adaptation: true,
        filter_adaptation: false
      }
    });

    // Whale songs layer
    this.layers.set('whale_ambient', {
      id: 'whale_ambient',
      name: 'Whale Song Ambience',
      type: 'whale_sounds',
      sources: ['old-tom-calls', 'pod-communication'],
      volume: 0.5,
      priority: 2,
      emotional_triggers: ['calm', 'wonder', 'sadness'],
      interaction_triggers: ['touch_whale', 'voice_call'],
      story_triggers: ['whale_appearance', 'communication_scene'],
      fadeTime: 3.0,
      adaptiveParameters: {
        tempo_sensitivity: 0.3,
        volume_sensitivity: 0.9,
        spatial_movement: true,
        harmonic_adaptation: false,
        reverb_adaptation: true,
        filter_adaptation: true
      }
    });

    // Ocean environment layer
    this.layers.set('ocean_environment', {
      id: 'ocean_environment',
      name: 'Ocean Environmental Audio',
      type: 'environment',
      sources: ['ocean-waves', 'underwater-ambient', 'coastal-wind'],
      volume: 0.4,
      priority: 3,
      emotional_triggers: ['calm', 'peaceful', 'mystery'],
      interaction_triggers: ['water_touch', 'swimming'],
      story_triggers: ['ocean_scene', 'underwater_transition'],
      fadeTime: 4.0,
      adaptiveParameters: {
        tempo_sensitivity: 0.2,
        volume_sensitivity: 0.7,
        spatial_movement: false,
        harmonic_adaptation: false,
        reverb_adaptation: true,
        filter_adaptation: true
      }
    });

    // Historical whaling station layer
    this.layers.set('whaling_station', {
      id: 'whaling_station',
      name: 'Whaling Station Atmosphere',
      type: 'environment',
      sources: ['boat-creaking', 'rope-rigging', 'dock-activity'],
      volume: 0.3,
      priority: 4,
      emotional_triggers: ['hardworking', 'historical', 'community'],
      interaction_triggers: ['station_exploration'],
      story_triggers: ['station_scene', 'historical_moment'],
      fadeTime: 2.5,
      crossfadeGroup: 'environment_primary',
      adaptiveParameters: {
        tempo_sensitivity: 0.4,
        volume_sensitivity: 0.8,
        spatial_movement: true,
        harmonic_adaptation: false,
        reverb_adaptation: true,
        filter_adaptation: false
      }
    });

    // Interactive effects layer
    this.layers.set('interactive_effects', {
      id: 'interactive_effects',
      name: 'Interactive Sound Effects',
      type: 'effects',
      sources: ['water-ripples', 'whale-responses', 'touch-feedback'],
      volume: 0.8,
      priority: 0, // Highest priority
      emotional_triggers: ['excitement', 'discovery'],
      interaction_triggers: ['touch', 'voice', 'gesture'],
      story_triggers: ['interactive_moment'],
      fadeTime: 0.5,
      adaptiveParameters: {
        tempo_sensitivity: 0.1,
        volume_sensitivity: 1.0,
        spatial_movement: true,
        harmonic_adaptation: false,
        reverb_adaptation: false,
        filter_adaptation: false
      }
    });

    // Voice and dialogue layer
    this.layers.set('voice_dialogue', {
      id: 'voice_dialogue',
      name: 'Voice and Dialogue',
      type: 'voice',
      sources: ['old-tom-voice', 'narrator-voice', 'george-voice'],
      volume: 0.9,
      priority: 0, // Highest priority
      emotional_triggers: ['conversation', 'learning'],
      interaction_triggers: ['voice', 'question'],
      story_triggers: ['dialogue_scene', 'narration'],
      fadeTime: 1.0,
      adaptiveParameters: {
        tempo_sensitivity: 0.1,
        volume_sensitivity: 0.3,
        spatial_movement: true,
        harmonic_adaptation: false,
        reverb_adaptation: true,
        filter_adaptation: false
      }
    });

    // Setup crossfade groups
    this.crossfadeGroups.set('music_primary', ['orchestral_main']);
    this.crossfadeGroups.set('environment_primary', ['ocean_environment', 'whaling_station']);
  }

  /**
   * Update emotional state and trigger adaptive audio responses
   */
  updateEmotionalState(newState: EmotionalState): void {
    // Smooth emotional transitions to avoid jarring audio changes
    const smoothedState = this.smoothEmotionalTransition(this.currentEmotionalState, newState);
    
    this.emotionalHistory.push(this.currentEmotionalState);
    if (this.emotionalHistory.length > 50) {
      this.emotionalHistory.shift(); // Keep recent history only
    }
    
    this.currentEmotionalState = smoothedState;
    
    if (this.isRealtimeMixingEnabled) {
      this.adaptLayersToEmotion(smoothedState);
      this.triggerEmotionalResponses(smoothedState);
    }
  }

  /**
   * Process user interaction and create audio feedback
   */
  handleInteraction(interaction: InteractionEvent): void {
    this.interactionHistory.push(interaction);
    if (this.interactionHistory.length > 100) {
      this.interactionHistory.shift();
    }

    // Immediate audio feedback for interaction
    this.createInteractionFeedback(interaction);
    
    // Adaptive layer responses
    this.adaptLayersToInteraction(interaction);
    
    // Check for story moment triggers
    if (this.currentStoryMoment) {
      this.checkAdaptiveTriggers(interaction);
    }
  }

  /**
   * Start a story moment with its associated audio design
   */
  startStoryMoment(moment: StoryMoment): void {
    this.currentStoryMoment = moment;
    this.storyMomentStartTime = Date.now();
    
    console.log(`Starting story moment: ${moment.name}`);
    
    // Schedule audio cues
    moment.audio_cues.forEach(cue => {
      setTimeout(() => {
        this.executeAudioCue(cue);
      }, cue.trigger_time * 1000);
    });
    
    // Setup adaptive triggers
    this.resetAdaptiveTriggers();
  }

  /**
   * Create immediate audio feedback for user interactions
   */
  private createInteractionFeedback(interaction: InteractionEvent): void {
    switch (interaction.type) {
      case 'touch':
        if (interaction.position) {
          this.createTouchRippleEffect(interaction.position, interaction.intensity);
        }
        break;
        
      case 'voice':
        this.createVoiceResponseEffect(interaction.intensity);
        break;
        
      case 'gesture':
        this.createGestureResponseEffect(interaction);
        break;
        
      case 'choice':
        this.createChoiceConfirmationEffect(interaction.intensity);
        break;
    }
  }

  /**
   * Create water ripple effect at touch position
   */
  private createTouchRippleEffect(position: Vector3D, intensity: number): void {
    const rippleId = `ripple-${Date.now()}`;
    
    // Create ripple sound source
    this.spatialEngine.createSource(
      rippleId,
      '/assets/audio/sounds/effects/water-ripple-touch.wav',
      position,
      {
        volume: intensity * 0.7,
        maxDistance: 50,
        loop: false
      }
    ).then(() => {
      this.spatialEngine.playSource(rippleId);
      
      // Animate ripple expansion
      this.animateRippleExpansion(rippleId, position, intensity);
      
      // Clean up after effect
      setTimeout(() => {
        this.spatialEngine.removeSource(rippleId);
      }, 3000);
    });
  }

  /**
   * Animate ripple expanding outward from touch point
   */
  private animateRippleExpansion(sourceId: string, center: Vector3D, intensity: number): void {
    const startTime = Date.now();
    const duration = 2000 + (intensity * 1000); // 2-3 seconds based on intensity
    const maxRadius = 20 + (intensity * 30); // Expansion distance
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1.0) return;
      
      const currentRadius = progress * maxRadius;
      const angle = performance.now() * 0.001; // Slow rotation
      
      const newPosition: Vector3D = {
        x: center.x + Math.cos(angle) * currentRadius * 0.1, // Slight spiral
        y: center.y,
        z: center.z + Math.sin(angle) * currentRadius * 0.1
      };
      
      this.spatialEngine.updateSourcePosition(sourceId, newPosition);
      
      // Fade out as it expands
      const layer = this.layers.get('interactive_effects');
      if (layer) {
        const fadeVolume = (1 - progress) * intensity * 0.7;
        // Update source volume (implementation would require spatial engine extension)
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  /**
   * Create voice response effect when user speaks
   */
  private createVoiceResponseEffect(intensity: number): void {
    // Old Tom responds to voice with whale calls
    const responseId = `voice-response-${Date.now()}`;
    
    // Position Old Tom's response near the listener but not directly at them
    const responsePosition: Vector3D = {
      x: (Math.random() - 0.5) * 10,
      y: -2, // Slightly underwater
      z: 5 + Math.random() * 5
    };
    
    this.spatialEngine.createSource(
      responseId,
      '/assets/audio/sounds/whale-songs/old-tom-friendly-response.wav',
      responsePosition,
      {
        volume: intensity * 0.8,
        maxDistance: 100,
        loop: false
      }
    ).then(() => {
      // Delay response slightly for natural feeling
      setTimeout(() => {
        this.spatialEngine.playSource(responseId);
        
        // Old Tom swims closer during response
        this.animateWhaleApproach(responseId, responsePosition);
        
        setTimeout(() => {
          this.spatialEngine.removeSource(responseId);
        }, 5000);
      }, 500 + Math.random() * 1000);
    });
  }

  /**
   * Animate Old Tom swimming closer during voice interaction
   */
  private animateWhaleApproach(sourceId: string, startPosition: Vector3D): void {
    const startTime = Date.now();
    const duration = 3000;
    const targetPosition: Vector3D = { x: 0, y: -1, z: 3 }; // Closer to listener
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      
      // Smooth approach with slight arc
      const currentPosition: Vector3D = {
        x: startPosition.x + (targetPosition.x - startPosition.x) * progress,
        y: startPosition.y + (targetPosition.y - startPosition.y) * progress + Math.sin(progress * Math.PI) * 2,
        z: startPosition.z + (targetPosition.z - startPosition.z) * progress
      };
      
      this.spatialEngine.updateSourcePosition(sourceId, currentPosition);
      
      if (progress < 1.0) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  /**
   * Create gesture response effect
   */
  private createGestureResponseEffect(interaction: InteractionEvent): void {
    // Different responses based on gesture context
    if (interaction.context.includes('whale')) {
      this.createWhaleGestureResponse(interaction);
    } else if (interaction.context.includes('water')) {
      this.createWaterGestureResponse(interaction);
    }
  }

  /**
   * Create choice confirmation audio effect
   */
  private createChoiceConfirmationEffect(intensity: number): void {
    const confirmId = `choice-confirm-${Date.now()}`;
    
    // Gentle confirmation chime
    this.spatialEngine.createSource(
      confirmId,
      '/assets/audio/sounds/effects/choice-confirmation.wav',
      { x: 0, y: 0, z: 0 }, // Centered on listener
      {
        volume: intensity * 0.6,
        maxDistance: 20,
        loop: false
      }
    ).then(() => {
      this.spatialEngine.playSource(confirmId);
      
      setTimeout(() => {
        this.spatialEngine.removeSource(confirmId);
      }, 2000);
    });
  }

  /**
   * Adapt audio layers based on emotional state
   */
  private adaptLayersToEmotion(emotionalState: EmotionalState): void {
    this.layers.forEach(layer => {
      if (layer.emotional_triggers.includes(emotionalState.primary)) {
        this.adjustLayerForEmotion(layer, emotionalState);
      }
    });
  }

  /**
   * Adjust specific layer parameters based on emotion
   */
  private adjustLayerForEmotion(layer: AudioLayer, emotion: EmotionalState): void {
    const { adaptiveParameters } = layer;
    const intensity = emotion.intensity;
    
    // Volume adaptation
    if (adaptiveParameters.volume_sensitivity > 0) {
      const volumeMultiplier = 1.0 + (intensity - 0.5) * adaptiveParameters.volume_sensitivity;
      const newVolume = layer.volume * Math.max(0.1, Math.min(2.0, volumeMultiplier));
      this.fadeLayerVolume(layer.id, newVolume, 1.0);
    }
    
    // Tempo adaptation for musical layers
    if (layer.type === 'music' && adaptiveParameters.tempo_sensitivity > 0) {
      this.adjustLayerTempo(layer, emotion);
    }
    
    // Spatial movement adaptation
    if (adaptiveParameters.spatial_movement) {
      this.adjustLayerSpatialMovement(layer, emotion);
    }
    
    // Reverb adaptation
    if (adaptiveParameters.reverb_adaptation) {
      this.adjustLayerReverb(layer, emotion);
    }
  }

  /**
   * Smooth emotional transitions to avoid jarring audio changes
   */
  private smoothEmotionalTransition(current: EmotionalState, target: EmotionalState): EmotionalState {
    const smoothingFactor = this.emotionalSmoothingFactor;
    
    return {
      primary: target.primary, // Emotion type changes immediately
      intensity: current.intensity + (target.intensity - current.intensity) * smoothingFactor,
      confidence: target.confidence,
      timestamp: target.timestamp,
      context: target.context
    };
  }

  /**
   * Execute scheduled audio cue from story moment
   */
  private executeAudioCue(cue: AudioCue): void {
    // Check if conditional requirements are met
    if (cue.conditional) {
      if (!this.evaluateConditional(cue.conditional)) {
        return;
      }
    }
    
    switch (cue.type) {
      case 'play':
        this.playLayer(cue.target);
        break;
      case 'stop':
        this.stopLayer(cue.target);
        break;
      case 'fade_in':
        this.fadeLayerIn(cue.target, cue.parameters.duration || 2.0);
        break;
      case 'fade_out':
        this.fadeLayerOut(cue.target, cue.parameters.duration || 2.0);
        break;
      case 'crossfade':
        this.crossfadeLayers(cue.target, cue.parameters.to, cue.parameters.duration || 3.0);
        break;
      case 'spatial_move':
        this.moveLayerSpatially(cue.target, cue.parameters.position, cue.parameters.duration || 5.0);
        break;
    }
  }

  /**
   * Check if adaptive triggers should fire based on current conditions
   */
  private checkAdaptiveTriggers(interaction?: InteractionEvent): void {
    if (!this.currentStoryMoment) return;
    
    const currentTime = Date.now();
    const momentElapsed = (currentTime - this.storyMomentStartTime) / 1000;
    
    this.currentStoryMoment.adaptive_triggers.forEach(trigger => {
      const triggerState = this.adaptiveTriggerStates.get(trigger.id);
      
      // Check cooldown
      if (triggerState && trigger.cooldown) {
        if (currentTime - triggerState.last_triggered < trigger.cooldown * 1000) {
          return;
        }
      }
      
      // Check max triggers
      if (triggerState && trigger.max_triggers) {
        if (triggerState.trigger_count >= trigger.max_triggers) {
          return;
        }
      }
      
      // Evaluate trigger condition
      if (this.evaluateTriggerCondition(trigger.condition, momentElapsed, interaction)) {
        this.executeTriggerResponse(trigger);
        
        // Update trigger state
        this.adaptiveTriggerStates.set(trigger.id, {
          last_triggered: currentTime,
          trigger_count: (triggerState?.trigger_count || 0) + 1
        });
      }
    });
  }

  /**
   * Evaluate if trigger condition is met
   */
  private evaluateTriggerCondition(
    condition: AdaptiveTrigger['condition'],
    momentElapsed: number,
    interaction?: InteractionEvent
  ): boolean {
    // Check emotional condition
    if (condition.emotion) {
      if (this.currentEmotionalState.primary !== condition.emotion.state) return false;
      if (this.currentEmotionalState.intensity < condition.emotion.min_intensity) return false;
    }
    
    // Check interaction condition
    if (condition.interaction && interaction) {
      if (interaction.type !== condition.interaction.type) return false;
      if (interaction.intensity < condition.interaction.min_intensity) return false;
    }
    
    // Check story progress
    if (condition.story_progress !== undefined) {
      // Implementation would check story completion percentage
    }
    
    // Check time in moment
    if (condition.time_in_moment !== undefined) {
      if (momentElapsed < condition.time_in_moment) return false;
    }
    
    return true;
  }

  /**
   * Execute adaptive trigger response
   */
  private executeTriggerResponse(trigger: AdaptiveTrigger): void {
    switch (trigger.audio_response.type) {
      case 'layer_adjust':
        this.adjustLayerFromTrigger(trigger.audio_response.parameters);
        break;
      case 'spatial_move':
        this.moveSpatialSourceFromTrigger(trigger.audio_response.parameters);
        break;
      case 'theme_introduction':
        this.introduceThemeFromTrigger(trigger.audio_response.parameters);
        break;
      case 'effect_trigger':
        this.triggerEffectFromTrigger(trigger.audio_response.parameters);
        break;
    }
  }

  // Layer control methods
  private playLayer(layerId: string): void {
    const layer = this.layers.get(layerId);
    if (!layer) return;
    
    layer.sources.forEach(sourceId => {
      this.spatialEngine.playSource(sourceId);
    });
  }

  private stopLayer(layerId: string): void {
    const layer = this.layers.get(layerId);
    if (!layer) return;
    
    layer.sources.forEach(sourceId => {
      this.spatialEngine.stopSource(sourceId);
    });
  }

  private fadeLayerVolume(layerId: string, targetVolume: number, duration: number): void {
    // Implementation would smoothly transition layer volume
    console.log(`Fading layer ${layerId} to volume ${targetVolume} over ${duration}s`);
  }

  private fadeLayerIn(layerId: string, duration: number): void {
    this.fadeLayerVolume(layerId, 1.0, duration);
  }

  private fadeLayerOut(layerId: string, duration: number): void {
    this.fadeLayerVolume(layerId, 0.0, duration);
  }

  private crossfadeLayers(fromLayerId: string, toLayerId: string, duration: number): void {
    this.fadeLayerOut(fromLayerId, duration);
    this.fadeLayerIn(toLayerId, duration);
  }

  private setupRealtimeProcessing(): void {
    // Setup regular processing cycle for adaptive audio
    setInterval(() => {
      if (this.isRealtimeMixingEnabled) {
        this.processRealtimeAdaptations();
      }
    }, 100); // 10 times per second
  }

  private processRealtimeAdaptations(): void {
    // Continuous adaptive processing based on current state
    this.updateEmotionalTrendAnalysis();
    this.updateInteractionPatternAnalysis();
    this.applySubtleAdaptations();
  }

  // Additional helper methods would be implemented here...
  private updateEmotionalTrendAnalysis(): void {
    // Analyze emotional trends over time
  }

  private updateInteractionPatternAnalysis(): void {
    // Analyze user interaction patterns
  }

  private applySubtleAdaptations(): void {
    // Apply gentle real-time adaptations
  }

  private createWhaleGestureResponse(interaction: InteractionEvent): void {
    // Create whale-specific gesture responses
  }

  private createWaterGestureResponse(interaction: InteractionEvent): void {
    // Create water-specific gesture responses
  }

  private adaptLayersToInteraction(interaction: InteractionEvent): void {
    // Adapt layers based on interaction type and intensity
  }

  private triggerEmotionalResponses(state: EmotionalState): void {
    // Trigger specific audio responses to emotional changes
  }

  private adjustLayerTempo(layer: AudioLayer, emotion: EmotionalState): void {
    // Adjust musical tempo based on emotional state
  }

  private adjustLayerSpatialMovement(layer: AudioLayer, emotion: EmotionalState): void {
    // Adjust spatial movement patterns based on emotion
  }

  private adjustLayerReverb(layer: AudioLayer, emotion: EmotionalState): void {
    // Adjust reverb characteristics based on emotion
  }

  private evaluateConditional(conditional: any): boolean {
    // Evaluate conditional requirements for audio cues
    return true;
  }

  private moveLayerSpatially(layerId: string, position: Vector3D, duration: number): void {
    // Move layer sources spatially over time
  }

  private resetAdaptiveTriggers(): void {
    this.adaptiveTriggerStates.clear();
  }

  private adjustLayerFromTrigger(parameters: any): void {
    // Adjust layer based on trigger parameters
  }

  private moveSpatialSourceFromTrigger(parameters: any): void {
    // Move spatial source based on trigger
  }

  private introduceThemeFromTrigger(parameters: any): void {
    // Introduce new musical theme
  }

  private triggerEffectFromTrigger(parameters: any): void {
    // Trigger audio effect
  }

  /**
   * Enable/disable real-time adaptive mixing
   */
  setRealtimeMixing(enabled: boolean): void {
    this.isRealtimeMixingEnabled = enabled;
  }

  /**
   * Get current mixing state for debugging
   */
  getMixingState(): any {
    return {
      currentEmotion: this.currentEmotionalState,
      activeLayers: Array.from(this.layers.keys()),
      currentStoryMoment: this.currentStoryMoment?.name,
      realtimeMixingEnabled: this.isRealtimeMixingEnabled
    };
  }
}

// Create audio context lazily
let audioContext: AudioContext | null = null;
const getAudioContext = (): AudioContext => {
  if (!audioContext && typeof window !== 'undefined') {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext!;
};

// Create orchestral composer instance lazily
let orchestralComposerInstance: OrchestralComposer | null = null;
const getOrchestralComposer = (): OrchestralComposer => {
  if (!orchestralComposerInstance && typeof window !== 'undefined') {
    orchestralComposerInstance = new OrchestralComposer(getAudioContext());
  }
  return orchestralComposerInstance!;
};

// Create singleton instance lazily
let interactiveAudioMixerInstance: InteractiveAudioMixer | null = null;

// Export a getter function instead of immediate initialization
const getInteractiveAudioMixer = (): InteractiveAudioMixer => {
  if (!interactiveAudioMixerInstance && typeof window !== 'undefined') {
    interactiveAudioMixerInstance = new InteractiveAudioMixer(
      getOrchestralComposer(),
      spatialAudioEngine as any,
      getAudioContext()
    );
  }
  return interactiveAudioMixerInstance!;
};

// Export as a proxy that initializes on first access
export const interactiveAudioMixer = new Proxy({} as InteractiveAudioMixer, {
  get(target, prop) {
    const instance = getInteractiveAudioMixer();
    return instance[prop as keyof InteractiveAudioMixer];
  }
});