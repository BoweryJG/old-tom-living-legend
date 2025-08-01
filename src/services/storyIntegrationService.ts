/**
 * Story Integration Service
 * Connects Captain Tom's narration with story branches, audio, and visual effects
 */

import { captainTomNarration, emotionalBeats, spectacularVisuals, interactiveMoments } from '../content/story/captainTomNarration';
import { audioStorageService } from './audioStorageService';

interface StoryState {
  currentChapter: string;
  currentSegmentIndex: number;
  audioQueue: string[];
  visualQueue: any[];
  userChoices: Record<string, any>;
  emotionalState: 'wonder' | 'exciting' | 'gentle' | 'mysterious' | 'heartwarming' | 'bittersweet' | 'inspiring';
}

interface StorySegmentWithAudio {
  segment: typeof captainTomNarration[0];
  audioUrl?: string;
  audioDuration?: number;
  visualTiming?: number[];
}

class StoryIntegrationService {
  private state: StoryState = {
    currentChapter: 'introduction',
    currentSegmentIndex: 0,
    audioQueue: [],
    visualQueue: [],
    userChoices: {},
    emotionalState: 'wonder'
  };

  private audioCache: Map<string, string> = new Map();
  private preloadedAudio: Map<string, HTMLAudioElement> = new Map();

  /**
   * Initialize the story experience
   */
  async initializeStory() {
    console.log('🌊 Initializing Old Tom story experience...');
    
    // Preload first chapter audio
    await this.preloadChapterAudio('introduction');
    
    // Set initial emotional state
    this.updateEmotionalState('wonder');
    
    return {
      firstSegment: captainTomNarration[0],
      visualDescription: captainTomNarration[0].visualDescription,
      soundscape: captainTomNarration[0].soundscape
    };
  }

  /**
   * Get the current story segment with audio
   */
  async getCurrentSegment(): Promise<StorySegmentWithAudio> {
    const segment = captainTomNarration[this.state.currentSegmentIndex];
    
    // Check if audio is cached
    let audioUrl: string | undefined = this.audioCache.get(segment.id);
    
    if (!audioUrl) {
      // Generate audio on demand
      console.log(`🎙️ Generating audio for: ${segment.id}`);
      const generatedUrl = await this.generateAudioForSegment(segment);
      
      if (generatedUrl) {
        audioUrl = generatedUrl;
        this.audioCache.set(segment.id, generatedUrl);
      }
    }

    return {
      segment,
      audioUrl,
      audioDuration: await this.getAudioDuration(audioUrl || null),
      visualTiming: this.calculateVisualTiming(segment)
    };
  }

  /**
   * Progress to the next story segment
   */
  async nextSegment(): Promise<StorySegmentWithAudio | null> {
    if (this.state.currentSegmentIndex < captainTomNarration.length - 1) {
      this.state.currentSegmentIndex++;
      const nextSegment = await this.getCurrentSegment();
      
      // Update emotional state
      this.updateEmotionalState(nextSegment.segment.emotionalTone);
      
      // Preload next segment's audio
      if (this.state.currentSegmentIndex < captainTomNarration.length - 1) {
        this.preloadSegmentAudio(captainTomNarration[this.state.currentSegmentIndex + 1]);
      }
      
      return nextSegment;
    }
    
    return null;
  }

  /**
   * Jump to a specific chapter
   */
  async goToChapter(chapterName: string): Promise<StorySegmentWithAudio | null> {
    const chapterIndex = captainTomNarration.findIndex(s => s.chapter === chapterName);
    
    if (chapterIndex !== -1) {
      this.state.currentSegmentIndex = chapterIndex;
      this.state.currentChapter = chapterName;
      
      // Preload chapter audio
      await this.preloadChapterAudio(chapterName);
      
      return this.getCurrentSegment();
    }
    
    return null;
  }

  /**
   * Handle interactive moments
   */
  async handleInteraction(momentId: string, userChoice: any) {
    console.log(`🎮 User interaction: ${momentId}`, userChoice);
    
    // Store user choice
    this.state.userChoices[momentId] = userChoice;
    
    // Special handling for specific interactions
    switch (momentId) {
      case 'create_splash_pattern':
        // Generate custom audio based on splash pattern
        const splashAudio = await this.generateSplashSound(userChoice);
        return { audio: splashAudio, visual: 'splash_pattern_effect' };
        
      case 'choose_kindness':
        // This choice affects the story's emotional tone
        if (userChoice === 'share') {
          this.updateEmotionalState('heartwarming');
        }
        break;
        
      case 'your_ripple':
        // Store the child's promise for the ending
        this.state.userChoices.childPromise = userChoice;
        break;
    }
    
    return { stored: true, choice: userChoice };
  }

  /**
   * Get spectacular visual for current moment
   */
  getSpectacularVisual(visualId: string) {
    const visual = spectacularVisuals.find(v => v.id === visualId);
    if (!visual) return null;
    
    return {
      ...visual,
      emotionalState: this.state.emotionalState,
      userChoices: this.state.userChoices
    };
  }

  /**
   * Private helper methods
   */
  
  private async generateAudioForSegment(segment: typeof captainTomNarration[0]): Promise<string | null> {
    // Use the audio storage service which handles caching and Supabase storage
    return audioStorageService.getAudioForSegment(segment.id);
  }

  private async preloadChapterAudio(chapterName: string) {
    const chapterSegments = captainTomNarration.filter(s => s.chapter === chapterName);
    
    // Preload first 3 segments of the chapter
    const toPreload = chapterSegments.slice(0, 3);
    
    for (const segment of toPreload) {
      if (!this.audioCache.has(segment.id)) {
        this.preloadSegmentAudio(segment);
      }
    }
  }

  private async preloadSegmentAudio(segment: typeof captainTomNarration[0]) {
    try {
      // Use audio storage service which handles everything
      const audioUrl = await audioStorageService.getAudioForSegment(segment.id);
      if (audioUrl) {
        this.audioCache.set(segment.id, audioUrl);
        
        // Create audio element for true preloading
        const audio = new Audio(audioUrl);
        audio.preload = 'auto';
        this.preloadedAudio.set(segment.id, audio);
      }
    } catch (error) {
      console.error(`Failed to preload audio for ${segment.id}:`, error);
    }
  }

  private async getAudioDuration(audioUrl: string | null): Promise<number> {
    if (!audioUrl) return 0;
    
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.addEventListener('error', () => {
        resolve(0);
      });
    });
  }

  private calculateVisualTiming(segment: typeof captainTomNarration[0]): number[] {
    // Calculate timing points for visual effects based on text length
    const words = segment.text.split(' ').length;
    const estimatedDuration = words * 0.4; // Rough estimate: 0.4 seconds per word
    
    // Create timing points for special effects
    const timingPoints: number[] = [];
    const effectCount = segment.specialEffects.length;
    
    for (let i = 0; i < effectCount; i++) {
      timingPoints.push((estimatedDuration / effectCount) * i);
    }
    
    return timingPoints;
  }

  private updateEmotionalState(emotion: typeof this.state.emotionalState) {
    this.state.emotionalState = emotion;
    
    // Emit event for UI updates
    window.dispatchEvent(new CustomEvent('emotionalStateChange', { 
      detail: { emotion, chapter: this.state.currentChapter }
    }));
  }

  private async generateSplashSound(pattern: any): Promise<string> {
    // This would integrate with the spatial audio engine
    // For now, return a placeholder
    return '/assets/audio/sounds/splash-pattern.mp3';
  }

  /**
   * Get story progress
   */
  getProgress() {
    return {
      currentSegment: this.state.currentSegmentIndex,
      totalSegments: captainTomNarration.length,
      percentage: (this.state.currentSegmentIndex / captainTomNarration.length) * 100,
      currentChapter: this.state.currentChapter,
      emotionalJourney: this.getEmotionalJourney(),
      userChoices: this.state.userChoices
    };
  }

  private getEmotionalJourney() {
    // Track the emotional arc of the story
    const journey = captainTomNarration.slice(0, this.state.currentSegmentIndex + 1)
      .map(s => s.emotionalTone);
    
    return {
      path: journey,
      current: this.state.emotionalState,
      nextShift: this.findNextEmotionalShift()
    };
  }

  private findNextEmotionalShift() {
    for (let i = this.state.currentSegmentIndex + 1; i < captainTomNarration.length; i++) {
      if (captainTomNarration[i].emotionalTone !== this.state.emotionalState) {
        return {
          segmentId: captainTomNarration[i].id,
          newEmotion: captainTomNarration[i].emotionalTone,
          distance: i - this.state.currentSegmentIndex
        };
      }
    }
    return null;
  }
}

export const storyIntegrationService = new StoryIntegrationService();