/**
 * Audio-Visual Synchronization Service
 * Coordinates audio playback with visual animations and effects
 */

import { captainTomNarration } from '../content/story/captainTomNarration';
import { storyIntegrationService } from './storyIntegrationService';
import { spatialAudioEngine } from './audio/spatialAudioEngine';
import { emotionalAIService } from './emotionalAIService';
import { interactiveAudioMixer } from './audio/interactiveAudioMixer';
import { audioStorageService } from './audioStorageService';

interface SyncEvent {
  id: string;
  timestamp: number;
  type: 'visual' | 'audio' | 'interaction' | 'emotion';
  action: string;
  data?: any;
}

interface VisualKeyframe {
  time: number;
  scene?: string;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  effects?: string[];
  emotion?: string;
}

interface AudioTrack {
  id: string;
  url: string;
  startTime: number;
  duration: number;
  volume: number;
  fadeIn?: number;
  fadeOut?: number;
  spatial?: {
    position: [number, number, number];
    maxDistance: number;
  };
}

interface SynchronizedSegment {
  segmentId: string;
  narrationTrack: AudioTrack;
  backgroundTracks: AudioTrack[];
  visualKeyframes: VisualKeyframe[];
  syncEvents: SyncEvent[];
  totalDuration: number;
}

class AudioVisualSyncService {
  private audioContext: AudioContext;
  private currentSegment: SynchronizedSegment | null = null;
  private masterTimeline: number = 0;
  private isPlaying: boolean = false;
  private startTime: number = 0;
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private visualCallbacks: Map<string, (keyframe: VisualKeyframe) => void> = new Map();
  private syncEventCallbacks: Map<string, (event: SyncEvent) => void> = new Map();
  private animationFrameId: number | null = null;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.initializeEventHandlers();
  }

  /**
   * Initialize event handlers for cross-component communication
   */
  private initializeEventHandlers() {
    // Listen for emotional state changes
    window.addEventListener('emotionalStateChange', (event: any) => {
      this.handleEmotionalStateChange(event.detail);
    });

    // Listen for user interactions
    window.addEventListener('userInteraction', (event: any) => {
      this.handleUserInteraction(event.detail);
    });
  }

  /**
   * Prepare a story segment for synchronized playback
   */
  async prepareSegment(segmentId: string): Promise<SynchronizedSegment> {
    console.log(`🎬 Preparing synchronized segment: ${segmentId}`);
    
    const segment = captainTomNarration.find(s => s.id === segmentId);
    if (!segment) {
      throw new Error(`Segment not found: ${segmentId}`);
    }

    // Get narration audio
    const narrationUrl = await audioStorageService.getAudioForSegment(segmentId);
    if (!narrationUrl) {
      throw new Error(`No audio available for segment: ${segmentId}`);
    }

    // Load and analyze audio duration
    const narrationDuration = await this.getAudioDuration(narrationUrl);

    // Create visual keyframes based on segment content
    const visualKeyframes = this.generateVisualKeyframes(segment, narrationDuration);

    // Create background audio tracks
    const backgroundTracks = await this.generateBackgroundTracks(segment, narrationDuration);

    // Generate sync events
    const syncEvents = this.generateSyncEvents(segment, narrationDuration);

    const synchronizedSegment: SynchronizedSegment = {
      segmentId,
      narrationTrack: {
        id: `narration-${segmentId}`,
        url: narrationUrl,
        startTime: 0,
        duration: narrationDuration,
        volume: 1.0,
        fadeIn: 0.5,
        fadeOut: 1.0
      },
      backgroundTracks,
      visualKeyframes,
      syncEvents,
      totalDuration: narrationDuration + 2 // Add 2 seconds for fade out
    };

    // Preload all audio
    await this.preloadAudio(synchronizedSegment);

    return synchronizedSegment;
  }

  /**
   * Generate visual keyframes based on segment content
   */
  private generateVisualKeyframes(segment: typeof captainTomNarration[0], duration: number): VisualKeyframe[] {
    const keyframes: VisualKeyframe[] = [];
    
    // Opening keyframe
    keyframes.push({
      time: 0,
      scene: segment.scene,
      cameraPosition: this.getSceneCamera(segment.scene).position,
      cameraTarget: this.getSceneCamera(segment.scene).target,
      emotion: segment.emotionalTone
    });

    // Generate keyframes for special effects
    const effectInterval = duration / (segment.specialEffects.length + 1);
    segment.specialEffects.forEach((effect, index) => {
      keyframes.push({
        time: effectInterval * (index + 1),
        effects: [effect],
        emotion: segment.emotionalTone
      });
    });

    // Add camera movements based on emotional tone
    if (segment.emotionalTone === 'exciting') {
      // Dynamic camera movements for exciting scenes
      keyframes.push({
        time: duration * 0.3,
        cameraPosition: [10, 5, 10],
        cameraTarget: [0, 0, 0]
      });
      keyframes.push({
        time: duration * 0.7,
        cameraPosition: [-10, 5, 10],
        cameraTarget: [0, 0, 0]
      });
    } else if (segment.emotionalTone === 'gentle') {
      // Slow, smooth camera movements
      keyframes.push({
        time: duration * 0.5,
        cameraPosition: [0, 3, 15],
        cameraTarget: [0, 0, 5]
      });
    }

    return keyframes;
  }

  /**
   * Generate background audio tracks
   */
  private async generateBackgroundTracks(segment: typeof captainTomNarration[0], duration: number): Promise<AudioTrack[]> {
    const tracks: AudioTrack[] = [];

    // Ocean ambience
    if (segment.soundscape.includes('ocean waves') || segment.scene.includes('underwater')) {
      tracks.push({
        id: 'ocean-ambience',
        url: '/assets/audio/ambience/ocean-waves-gentle.mp3',
        startTime: 0,
        duration: duration + 2,
        volume: 0.4,
        fadeIn: 2,
        fadeOut: 2,
        spatial: {
          position: [0, -5, 0],
          maxDistance: 100
        }
      });
    }

    // Whale songs
    if (segment.soundscape.includes('whale songs')) {
      tracks.push({
        id: 'whale-songs',
        url: '/assets/audio/ambience/whale-songs-distant.mp3',
        startTime: 2,
        duration: duration - 2,
        volume: 0.3,
        fadeIn: 1,
        fadeOut: 1,
        spatial: {
          position: [20, 0, -10],
          maxDistance: 50
        }
      });
    }

    // Emotional music layers
    const emotionalTheme = this.getEmotionalTheme(segment.emotionalTone);
    if (emotionalTheme) {
      tracks.push({
        id: `emotional-${segment.emotionalTone}`,
        url: emotionalTheme,
        startTime: 0,
        duration: duration,
        volume: 0.5,
        fadeIn: 1,
        fadeOut: 1
      });
    }

    return tracks;
  }

  /**
   * Generate synchronization events
   */
  private generateSyncEvents(segment: typeof captainTomNarration[0], duration: number): SyncEvent[] {
    const events: SyncEvent[] = [];

    // Visual effects timing
    const effectInterval = duration / (segment.specialEffects.length + 1);
    segment.specialEffects.forEach((effect, index) => {
      events.push({
        id: `effect-${index}`,
        timestamp: effectInterval * (index + 1),
        type: 'visual',
        action: 'trigger-effect',
        data: { effect }
      });
    });

    // Emotional beats
    if (segment.emotionalBeat) {
      const emotionalMoments = emotionalAIService.detectEmotionalMoments(segment.text);
      emotionalMoments.forEach((moment, index) => {
        events.push({
          id: `emotion-${index}`,
          timestamp: (duration * moment.position) / segment.text.length,
          type: 'emotion',
          action: 'emotional-response',
          data: { emotion: moment.emotion, intensity: moment.intensity }
        });
      });
    }

    // Interactive moments
    if (segment.interactiveMoment) {
      events.push({
        id: 'interaction-prompt',
        timestamp: duration * 0.8,
        type: 'interaction',
        action: 'show-interaction',
        data: { 
          type: segment.interactiveMoment,
          prompt: this.getInteractionPrompt(segment.interactiveMoment)
        }
      });
    }

    return events;
  }

  /**
   * Play synchronized segment
   */
  async play(segment?: SynchronizedSegment): Promise<void> {
    if (!segment && !this.currentSegment) {
      throw new Error('No segment to play');
    }

    if (segment) {
      this.currentSegment = segment;
    }

    this.isPlaying = true;
    this.startTime = this.audioContext.currentTime;
    this.masterTimeline = 0;

    // Start narration
    await this.playAudioTrack(this.currentSegment!.narrationTrack);

    // Start background tracks
    for (const track of this.currentSegment!.backgroundTracks) {
      await this.playAudioTrack(track);
    }

    // Start visual synchronization loop
    this.startSyncLoop();

    // Dispatch play event
    window.dispatchEvent(new CustomEvent('audioVisualPlaybackStarted', {
      detail: { segmentId: this.currentSegment!.segmentId }
    }));
  }

  /**
   * Pause synchronized playback
   */
  pause(): void {
    this.isPlaying = false;
    
    // Pause all audio
    this.audioElements.forEach(audio => {
      audio.pause();
    });

    // Stop sync loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    window.dispatchEvent(new CustomEvent('audioVisualPlaybackPaused'));
  }

  /**
   * Resume synchronized playback
   */
  resume(): void {
    if (!this.currentSegment) return;

    this.isPlaying = true;
    
    // Resume all audio
    this.audioElements.forEach(audio => {
      audio.play();
    });

    // Restart sync loop
    this.startSyncLoop();

    window.dispatchEvent(new CustomEvent('audioVisualPlaybackResumed'));
  }

  /**
   * Stop synchronized playback
   */
  stop(): void {
    this.isPlaying = false;
    this.masterTimeline = 0;
    
    // Stop and reset all audio
    this.audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    // Stop sync loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    window.dispatchEvent(new CustomEvent('audioVisualPlaybackStopped'));
  }

  /**
   * Main synchronization loop
   */
  private startSyncLoop(): void {
    const syncFrame = () => {
      if (!this.isPlaying || !this.currentSegment) return;

      // Update master timeline
      this.masterTimeline = this.audioContext.currentTime - this.startTime;

      // Process visual keyframes
      const activeKeyframe = this.getActiveKeyframe(this.masterTimeline);
      if (activeKeyframe) {
        this.processVisualKeyframe(activeKeyframe);
      }

      // Process sync events
      const activeEvents = this.getActiveEvents(this.masterTimeline);
      activeEvents.forEach(event => {
        this.processSyncEvent(event);
      });

      // Update UI timeline
      window.dispatchEvent(new CustomEvent('audioVisualTimeUpdate', {
        detail: {
          currentTime: this.masterTimeline,
          totalDuration: this.currentSegment.totalDuration,
          progress: this.masterTimeline / this.currentSegment.totalDuration
        }
      }));

      // Check if segment is complete
      if (this.masterTimeline >= this.currentSegment.totalDuration) {
        this.onSegmentComplete();
      } else {
        this.animationFrameId = requestAnimationFrame(syncFrame);
      }
    };

    this.animationFrameId = requestAnimationFrame(syncFrame);
  }

  /**
   * Play individual audio track
   */
  private async playAudioTrack(track: AudioTrack): Promise<void> {
    const audio = new Audio(track.url);
    audio.volume = track.volume;
    
    // Apply fade in
    if (track.fadeIn) {
      audio.volume = 0;
      const fadeInInterval = setInterval(() => {
        if (audio.volume < track.volume) {
          audio.volume = Math.min(audio.volume + 0.05, track.volume);
        } else {
          clearInterval(fadeInInterval);
        }
      }, track.fadeIn * 1000 / 20);
    }

    // Schedule fade out
    if (track.fadeOut) {
      setTimeout(() => {
        const fadeOutInterval = setInterval(() => {
          if (audio.volume > 0) {
            audio.volume = Math.max(audio.volume - 0.05, 0);
          } else {
            clearInterval(fadeOutInterval);
          }
        }, track.fadeOut * 1000 / 20);
      }, (track.duration - track.fadeOut) * 1000);
    }

    // Apply spatial audio if specified
    if (track.spatial && spatialAudioEngine.isInitialized()) {
      await spatialAudioEngine.loadAndPositionSound(
        track.id,
        track.url,
        track.spatial.position,
        { volume: track.volume, maxDistance: track.spatial.maxDistance }
      );
      spatialAudioEngine.playSource(track.id);
    } else {
      // Play regular audio
      audio.currentTime = track.startTime;
      await audio.play();
    }

    this.audioElements.set(track.id, audio);
  }

  /**
   * Get active visual keyframe
   */
  private getActiveKeyframe(currentTime: number): VisualKeyframe | null {
    if (!this.currentSegment) return null;
    
    const keyframes = this.currentSegment.visualKeyframes;
    for (let i = keyframes.length - 1; i >= 0; i--) {
      if (currentTime >= keyframes[i].time) {
        return keyframes[i];
      }
    }
    return null;
  }

  /**
   * Get active sync events
   */
  private getActiveEvents(currentTime: number): SyncEvent[] {
    if (!this.currentSegment) return [];
    
    return this.currentSegment.syncEvents.filter(event => {
      const eventTime = event.timestamp;
      const triggered = this.triggeredEvents.has(event.id);
      return currentTime >= eventTime && !triggered;
    });
  }

  private triggeredEvents = new Set<string>();

  /**
   * Process visual keyframe
   */
  private processVisualKeyframe(keyframe: VisualKeyframe): void {
    this.visualCallbacks.forEach(callback => {
      callback(keyframe);
    });

    // Dispatch keyframe event
    window.dispatchEvent(new CustomEvent('visualKeyframe', {
      detail: keyframe
    }));
  }

  /**
   * Process sync event
   */
  private processSyncEvent(event: SyncEvent): void {
    if (this.triggeredEvents.has(event.id)) return;
    this.triggeredEvents.add(event.id);

    this.syncEventCallbacks.forEach(callback => {
      callback(event);
    });

    // Dispatch sync event
    window.dispatchEvent(new CustomEvent('syncEvent', {
      detail: event
    }));
  }

  /**
   * Handle segment completion
   */
  private onSegmentComplete(): void {
    this.stop();
    this.triggeredEvents.clear();
    
    window.dispatchEvent(new CustomEvent('segmentComplete', {
      detail: { segmentId: this.currentSegment?.segmentId }
    }));
  }

  /**
   * Register visual callback
   */
  registerVisualCallback(id: string, callback: (keyframe: VisualKeyframe) => void): void {
    this.visualCallbacks.set(id, callback);
  }

  /**
   * Register sync event callback
   */
  registerSyncEventCallback(id: string, callback: (event: SyncEvent) => void): void {
    this.syncEventCallbacks.set(id, callback);
  }

  /**
   * Unregister callbacks
   */
  unregisterCallbacks(id: string): void {
    this.visualCallbacks.delete(id);
    this.syncEventCallbacks.delete(id);
  }

  /**
   * Helper methods
   */
  
  private async getAudioDuration(url: string): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.addEventListener('error', () => {
        resolve(30); // Default duration on error
      });
    });
  }

  private async preloadAudio(segment: SynchronizedSegment): Promise<void> {
    const preloadPromises = [
      this.preloadTrack(segment.narrationTrack),
      ...segment.backgroundTracks.map(track => this.preloadTrack(track))
    ];
    await Promise.all(preloadPromises);
  }

  private async preloadTrack(track: AudioTrack): Promise<void> {
    const audio = new Audio(track.url);
    audio.preload = 'auto';
    return new Promise((resolve) => {
      audio.addEventListener('canplaythrough', () => resolve());
      audio.addEventListener('error', () => resolve());
    });
  }

  private getSceneCamera(scene: string): { position: [number, number, number]; target: [number, number, number] } {
    const sceneConfigs: Record<string, any> = {
      'underwater_introduction': {
        position: [0, -10, 20] as [number, number, number],
        target: [0, 0, 0] as [number, number, number]
      },
      'twofold_bay_surface': {
        position: [30, 10, 30] as [number, number, number],
        target: [0, 0, 0] as [number, number, number]
      },
      'first_meeting': {
        position: [15, 5, 15] as [number, number, number],
        target: [0, 0, 0] as [number, number, number]
      },
      'trust_building': {
        position: [10, 3, 10] as [number, number, number],
        target: [0, 0, 0] as [number, number, number]
      },
      'hunting_together': {
        position: [25, 15, 25] as [number, number, number],
        target: [0, 0, 0] as [number, number, number]
      }
    };
    
    return sceneConfigs[scene] || {
      position: [10, 10, 10] as [number, number, number],
      target: [0, 0, 0] as [number, number, number]
    };
  }

  private getEmotionalTheme(emotion: string): string | null {
    const themes: Record<string, string> = {
      'wonder': '/assets/audio/music/theme-wonder.mp3',
      'exciting': '/assets/audio/music/theme-excitement.mp3',
      'gentle': '/assets/audio/music/theme-gentle.mp3',
      'mysterious': '/assets/audio/music/theme-mystery.mp3',
      'heartwarming': '/assets/audio/music/theme-heartwarming.mp3',
      'bittersweet': '/assets/audio/music/theme-bittersweet.mp3',
      'inspiring': '/assets/audio/music/theme-inspiring.mp3'
    };
    return themes[emotion] || null;
  }

  private getInteractionPrompt(type: string): string {
    const prompts: Record<string, string> = {
      'create_splash_pattern': 'Create your own splash pattern!',
      'choose_kindness': 'What will you share with Old Tom?',
      'whale_call_response': 'Call back to Old Tom!',
      'draw_constellation': 'Connect the stars to create your constellation',
      'promise_ceremony': 'Make your promise to the ocean',
      'memory_selection': 'Choose your favorite moment',
      'your_ripple': 'What ripple will you create?'
    };
    return prompts[type] || 'Interact with the story';
  }

  private handleEmotionalStateChange(detail: any): void {
    // Update audio mixing based on emotional state
    if (this.isPlaying && detail.emotion) {
      interactiveAudioMixer.transitionToEmotion(detail.emotion);
    }
  }

  private handleUserInteraction(detail: any): void {
    // Process user interactions during playback
    if (this.isPlaying) {
      console.log('User interaction during playback:', detail);
      // Could trigger special audio/visual responses
    }
  }

  /**
   * Get current playback state
   */
  getPlaybackState() {
    return {
      isPlaying: this.isPlaying,
      currentTime: this.masterTimeline,
      totalDuration: this.currentSegment?.totalDuration || 0,
      segmentId: this.currentSegment?.segmentId || null,
      progress: this.currentSegment ? this.masterTimeline / this.currentSegment.totalDuration : 0
    };
  }
}

export const audioVisualSyncService = new AudioVisualSyncService();