/**
 * Audio Accessibility Service for Old Tom: The Living Legend
 * 
 * Ensures the Studio Ghibli audio experience is accessible to users with
 * hearing impairments through visual indicators, haptic feedback, and
 * adaptive audio processing
 */

export interface AudioAccessibilitySettings {
  visualIndicators: boolean;
  hapticFeedback: boolean;
  captionMode: 'off' | 'basic' | 'descriptive' | 'full';
  frequencyBoost: {
    enabled: boolean;
    lowBoost: number;    // dB boost for low frequencies
    midBoost: number;    // dB boost for mid frequencies  
    highBoost: number;   // dB boost for high frequencies
  };
  volumeNormalization: boolean;
  spatialAudioSimplification: boolean;
  reducedMotion: boolean;
  colorBlindAccessibility: boolean;
  contrastMode: 'normal' | 'high' | 'maximum';
}

export interface VisualAudioIndicator {
  id: string;
  type: 'waveform' | 'pulse' | 'ripple' | 'directional' | 'intensity';
  position: { x: number; y: number };
  color: string;
  intensity: number;
  duration: number;
  audioSourceId: string;
  description: string;
}

export interface AudioCaption {
  id: string;
  text: string;
  type: 'music' | 'environment' | 'whale_sound' | 'voice' | 'effect';
  startTime: number;
  duration: number;
  position?: { x: number; y: number }; // For spatial captions
  emotional_context?: string;
  volume_level?: 'quiet' | 'moderate' | 'loud';
}

export interface HapticPattern {
  id: string;
  name: string;
  pattern: number[]; // Vibration pattern in milliseconds
  intensity: number; // 0-1
  audioType: 'music' | 'whale_sound' | 'environment' | 'effect';
  trigger: 'onset' | 'rhythm' | 'emotional_peak' | 'interaction';
}

export class AudioAccessibilityService {
  private settings: AudioAccessibilitySettings;
  private visualIndicators: Map<string, VisualAudioIndicator> = new Map();
  private activeCaptions: Map<string, AudioCaption> = new Map();
  private hapticPatterns: Map<string, HapticPattern> = new Map();
  private audioContext: AudioContext;
  private frequencyAnalyzer: AnalyserNode | null = null;
  private visualIndicatorCallbacks: ((indicator: VisualAudioIndicator) => void)[] = [];
  private captionCallbacks: ((caption: AudioCaption) => void)[] = [];
  private hapticDevice: any = null; // Gamepad API for haptic feedback

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    
    // Default accessibility settings
    this.settings = {
      visualIndicators: true,
      hapticFeedback: false,
      captionMode: 'basic',
      frequencyBoost: {
        enabled: false,
        lowBoost: 0,
        midBoost: 0,
        highBoost: 0
      },
      volumeNormalization: true,
      spatialAudioSimplification: false,
      reducedMotion: false,
      colorBlindAccessibility: false,
      contrastMode: 'normal'
    };

    this.initializeFrequencyAnalyzer();
    this.initializeHapticPatterns();
    this.detectHapticDevice();
    this.loadUserPreferences();
  }

  /**
   * Initialize frequency analyzer for audio visualization
   */
  private initializeFrequencyAnalyzer(): void {
    this.frequencyAnalyzer = this.audioContext.createAnalyser();
    this.frequencyAnalyzer.fftSize = 512;
    this.frequencyAnalyzer.smoothingTimeConstant = 0.8;
    this.frequencyAnalyzer.connect(this.audioContext.destination);
  }

  /**
   * Initialize haptic feedback patterns for different audio types
   */
  private initializeHapticPatterns(): void {
    // Old Tom whale call pattern
    this.hapticPatterns.set('old_tom_call', {
      id: 'old_tom_call',
      name: 'Old Tom Whale Call',
      pattern: [200, 100, 300, 150, 400, 100, 200], // Deep, rhythmic pattern
      intensity: 0.8,
      audioType: 'whale_sound',
      trigger: 'onset'
    });

    // Ocean waves pattern
    this.hapticPatterns.set('ocean_waves', {
      id: 'ocean_waves',
      name: 'Ocean Waves',
      pattern: [150, 50, 200, 75, 180, 60, 220, 80], // Rolling wave pattern
      intensity: 0.4,
      audioType: 'environment',
      trigger: 'rhythm'
    });

    // Musical emotional peak pattern
    this.hapticPatterns.set('orchestral_peak', {
      id: 'orchestral_peak',
      name: 'Orchestral Emotional Peak',
      pattern: [100, 30, 150, 40, 200, 50, 300], // Building intensity
      intensity: 0.9,
      audioType: 'music',
      trigger: 'emotional_peak'
    });

    // Touch interaction feedback
    this.hapticPatterns.set('touch_feedback', {
      id: 'touch_feedback',
      name: 'Touch Interaction',
      pattern: [50, 20, 80], // Quick confirmation
      intensity: 0.6,
      audioType: 'effect',
      trigger: 'interaction'
    });

    // Whale echolocation pattern
    this.hapticPatterns.set('echolocation', {
      id: 'echolocation',
      name: 'Whale Echolocation',
      pattern: [30, 20, 30, 20, 30, 100, 50], // Quick clicks then pause
      intensity: 0.5,
      audioType: 'whale_sound',
      trigger: 'onset'
    });
  }

  /**
   * Detect if haptic feedback device is available
   */
  private async detectHapticDevice(): Promise<void> {
    if ('getGamepads' in navigator) {
      const gamepads = navigator.getGamepads();
      for (const gamepad of gamepads) {
        if (gamepad && gamepad.vibrationActuator) {
          this.hapticDevice = gamepad;
          console.log('Haptic device detected:', gamepad.id);
          break;
        }
      }
    }

    // Check for mobile vibration API
    if ('vibrate' in navigator) {
      this.hapticDevice = navigator;
      console.log('Mobile vibration API available');
    }
  }

  /**
   * Load user accessibility preferences from storage
   */
  private loadUserPreferences(): void {
    try {
      const saved = localStorage.getItem('oldTomAccessibilitySettings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load accessibility preferences:', error);
    }
  }

  /**
   * Save user accessibility preferences
   */
  private saveUserPreferences(): void {
    try {
      localStorage.setItem('oldTomAccessibilitySettings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save accessibility preferences:', error);
    }
  }

  /**
   * Update accessibility settings
   */
  updateSettings(newSettings: Partial<AudioAccessibilitySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveUserPreferences();
    this.applyAccessibilitySettings();
  }

  /**
   * Apply current accessibility settings to audio processing
   */
  private applyAccessibilitySettings(): void {
    // Apply frequency boosting if enabled
    if (this.settings.frequencyBoost.enabled) {
      this.applyFrequencyBoost();
    }

    // Update visual indicator settings
    if (this.settings.visualIndicators) {
      this.startVisualIndicatorProcessing();
    } else {
      this.stopVisualIndicatorProcessing();
    }

    // Update haptic feedback settings
    if (this.settings.hapticFeedback && this.hapticDevice) {
      console.log('Haptic feedback enabled');
    }
  }

  /**
   * Apply frequency boost for hearing accessibility
   */
  private applyFrequencyBoost(): void {
    if (!this.frequencyAnalyzer) return;

    // Create EQ filters for frequency boosting
    const lowShelf = this.audioContext.createBiquadFilter();
    lowShelf.type = 'lowshelf';
    lowShelf.frequency.setValueAtTime(200, this.audioContext.currentTime);
    lowShelf.gain.setValueAtTime(this.settings.frequencyBoost.lowBoost, this.audioContext.currentTime);

    const midPeaking = this.audioContext.createBiquadFilter();
    midPeaking.type = 'peaking';
    midPeaking.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    midPeaking.Q.setValueAtTime(1, this.audioContext.currentTime);
    midPeaking.gain.setValueAtTime(this.settings.frequencyBoost.midBoost, this.audioContext.currentTime);

    const highShelf = this.audioContext.createBiquadFilter();
    highShelf.type = 'highshelf';
    highShelf.frequency.setValueAtTime(5000, this.audioContext.currentTime);
    highShelf.gain.setValueAtTime(this.settings.frequencyBoost.highBoost, this.audioContext.currentTime);

    // Chain filters
    this.frequencyAnalyzer.connect(lowShelf);
    lowShelf.connect(midPeaking);
    midPeaking.connect(highShelf);
    highShelf.connect(this.audioContext.destination);
  }

  /**
   * Start visual indicator processing
   */
  private startVisualIndicatorProcessing(): void {
    if (!this.frequencyAnalyzer) return;

    const bufferLength = this.frequencyAnalyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const processAudio = () => {
      this.frequencyAnalyzer!.getByteFrequencyData(dataArray);
      
      // Analyze frequency data for visual indicators
      this.analyzeAudioForVisuals(dataArray);
      
      if (this.settings.visualIndicators) {
        requestAnimationFrame(processAudio);
      }
    };

    processAudio();
  }

  /**
   * Stop visual indicator processing
   */
  private stopVisualIndicatorProcessing(): void {
    this.visualIndicators.clear();
    this.notifyVisualIndicatorCallbacks();
  }

  /**
   * Analyze audio data and create visual indicators
   */
  private analyzeAudioForVisuals(frequencyData: Uint8Array): void {
    // Clear existing indicators
    this.visualIndicators.clear();

    // Analyze different frequency ranges
    const bassRange = this.getFrequencyRangeAverage(frequencyData, 0, 50);      // 0-200Hz
    const midRange = this.getFrequencyRangeAverage(frequencyData, 50, 150);     // 200-1500Hz  
    const highRange = this.getFrequencyRangeAverage(frequencyData, 150, 255);   // 1500Hz+

    // Create visual indicators based on frequency analysis
    if (bassRange > 30) { // Low frequency activity (whale calls, ocean)
      this.createVisualIndicator({
        id: 'bass_activity',
        type: 'pulse',
        position: { x: 50, y: 80 },
        color: this.getAccessibleColor('blue', bassRange),
        intensity: bassRange / 255,
        duration: 500,
        audioSourceId: 'low_frequency',
        description: 'Deep ocean sounds'
      });
    }

    if (midRange > 40) { // Mid frequency activity (voices, whale songs)
      this.createVisualIndicator({
        id: 'mid_activity',
        type: 'waveform',
        position: { x: 50, y: 50 },
        color: this.getAccessibleColor('green', midRange),
        intensity: midRange / 255,
        duration: 300,
        audioSourceId: 'mid_frequency',
        description: 'Whale songs and voices'
      });
    }

    if (highRange > 35) { // High frequency activity (effects, details)
      this.createVisualIndicator({
        id: 'high_activity',
        type: 'ripple',
        position: { x: 50, y: 20 },
        color: this.getAccessibleColor('yellow', highRange),
        intensity: highRange / 255,
        duration: 200,
        audioSourceId: 'high_frequency',
        description: 'Sound effects and details'
      });
    }

    // Notify UI components of visual indicator updates
    this.notifyVisualIndicatorCallbacks();
  }

  /**
   * Get average amplitude for frequency range
   */
  private getFrequencyRangeAverage(data: Uint8Array, startBin: number, endBin: number): number {
    let sum = 0;
    const count = endBin - startBin;
    
    for (let i = startBin; i < endBin && i < data.length; i++) {
      sum += data[i];
    }
    
    return sum / count;
  }

  /**
   * Create a visual indicator
   */
  private createVisualIndicator(indicator: VisualAudioIndicator): void {
    this.visualIndicators.set(indicator.id, indicator);
    
    // Auto-remove after duration
    setTimeout(() => {
      this.visualIndicators.delete(indicator.id);
      this.notifyVisualIndicatorCallbacks();
    }, indicator.duration);
  }

  /**
   * Get accessible color based on user settings
   */
  private getAccessibleColor(baseColor: string, intensity: number): string {
    const alpha = Math.max(0.3, intensity / 255);
    
    if (this.settings.colorBlindAccessibility) {
      // Use patterns or shapes instead of colors for color-blind users
      return this.getColorBlindFriendlyColor(baseColor, alpha);
    }

    if (this.settings.contrastMode === 'high') {
      return this.getHighContrastColor(baseColor, alpha);
    }

    if (this.settings.contrastMode === 'maximum') {
      return alpha > 0.5 ? '#FFFFFF' : '#000000';
    }

    // Normal color mapping
    const colorMap: Record<string, string> = {
      blue: `rgba(70, 130, 255, ${alpha})`,
      green: `rgba(50, 200, 100, ${alpha})`,
      yellow: `rgba(255, 200, 50, ${alpha})`,
      red: `rgba(255, 100, 100, ${alpha})`
    };

    return colorMap[baseColor] || `rgba(128, 128, 128, ${alpha})`;
  }

  /**
   * Get color-blind friendly alternatives
   */
  private getColorBlindFriendlyColor(baseColor: string, alpha: number): string {
    // Use patterns or specific color combinations safe for color blindness
    const colorBlindMap: Record<string, string> = {
      blue: `rgba(0, 100, 200, ${alpha})`,      // Strong blue
      green: `rgba(200, 150, 0, ${alpha})`,     // Orange instead of green
      yellow: `rgba(255, 255, 100, ${alpha})`,  // Bright yellow
      red: `rgba(150, 0, 150, ${alpha})`        // Purple instead of red
    };

    return colorBlindMap[baseColor] || `rgba(128, 128, 128, ${alpha})`;
  }

  /**
   * Get high contrast color
   */
  private getHighContrastColor(baseColor: string, alpha: number): string {
    return alpha > 0.5 ? '#FFFFFF' : '#000000';
  }

  /**
   * Create audio caption
   */
  createCaption(caption: Omit<AudioCaption, 'id'>): void {
    const id = `caption_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullCaption: AudioCaption = { id, ...caption };
    
    this.activeCaptions.set(id, fullCaption);
    
    // Notify caption callbacks
    this.captionCallbacks.forEach(callback => callback(fullCaption));
    
    // Auto-remove after duration
    setTimeout(() => {
      this.activeCaptions.delete(id);
    }, caption.duration);
  }

  /**
   * Create contextual captions for whale sounds
   */
  createWhaleAudioCaption(whaleCallType: string, emotional_context: string, volume_level: 'quiet' | 'moderate' | 'loud'): void {
    const captionTexts: Record<string, string> = {
      greeting: 'Old Tom calls out a friendly greeting',
      excitement: 'Old Tom trumpets with excitement',
      gentle_song: 'Old Tom sings a gentle, melodic whale song',
      attention: 'Old Tom calls for attention with distinctive clicks',
      concern: 'Old Tom vocalizes with concern and protection',
      pod_communication: 'The whale pod communicates with complex calls',
      echolocation: 'Sharp echolocation clicks echo through the water'
    };

    let captionText = captionTexts[whaleCallType] || 'Whale vocalization';
    
    // Add emotional context
    if (emotional_context) {
      captionText += ` (${emotional_context})`;
    }

    // Add volume indication
    const volumeIndicator = {
      quiet: ' [soft]',
      moderate: '',
      loud: ' [loud]'
    };
    captionText += volumeIndicator[volume_level];

    this.createCaption({
      text: captionText,
      type: 'whale_sound',
      startTime: this.audioContext.currentTime,
      duration: 3000,
      emotional_context,
      volume_level
    });
  }

  /**
   * Create environmental audio captions
   */
  createEnvironmentCaption(environmentType: string, intensity: number): void {
    const captions: Record<string, string> = {
      ocean_waves: 'Ocean waves lapping against the shore',
      underwater_ambient: 'Peaceful underwater ambience',
      coastal_wind: 'Gentle coastal breeze',
      storm_weather: 'Stormy weather with strong winds',
      boat_creaking: 'Wooden boat creaking rhythmically',
      rope_rigging: 'Rope and rigging sounds from the sailing vessel'
    };

    let captionText = captions[environmentType] || 'Environmental sounds';
    
    // Add intensity description
    if (intensity > 0.7) {
      captionText += ' [intense]';
    } else if (intensity < 0.3) {
      captionText += ' [gentle]';
    }

    this.createCaption({
      text: captionText,
      type: 'environment',
      startTime: this.audioContext.currentTime,
      duration: 2000,
      volume_level: intensity > 0.6 ? 'loud' : intensity > 0.3 ? 'moderate' : 'quiet'
    });
  }

  /**
   * Trigger haptic feedback for audio event
   */
  triggerHapticFeedback(audioType: string, trigger: string, intensity: number = 1.0): void {
    if (!this.settings.hapticFeedback || !this.hapticDevice) return;

    // Find appropriate haptic pattern
    let pattern: HapticPattern | undefined;
    
    for (const [_, hapticPattern] of this.hapticPatterns) {
      if (hapticPattern.audioType === audioType && hapticPattern.trigger === trigger) {
        pattern = hapticPattern;
        break;
      }
    }

    if (!pattern) {
      // Use default pattern
      pattern = {
        id: 'default',
        name: 'Default',
        pattern: [100, 50, 100],
        intensity: 0.5,
        audioType: audioType as any,
        trigger: trigger as any
      };
    }

    // Apply intensity scaling
    const scaledIntensity = Math.min(1.0, pattern.intensity * intensity);
    
    // Trigger haptic feedback
    if (this.hapticDevice.vibrationActuator) {
      // Gamepad haptic API
      this.hapticDevice.vibrationActuator.playEffect('dual-rumble', {
        duration: pattern.pattern.reduce((sum, time) => sum + time, 0),
        strongMagnitude: scaledIntensity,
        weakMagnitude: scaledIntensity * 0.7
      });
    } else if (this.hapticDevice.vibrate) {
      // Mobile vibration API
      this.hapticDevice.vibrate(pattern.pattern);
    }
  }

  /**
   * Register callback for visual indicator updates
   */
  onVisualIndicatorUpdate(callback: (indicator: VisualAudioIndicator) => void): void {
    this.visualIndicatorCallbacks.push(callback);
  }

  /**
   * Register callback for caption updates
   */
  onCaptionUpdate(callback: (caption: AudioCaption) => void): void {
    this.captionCallbacks.push(callback);
  }

  /**
   * Notify all visual indicator callbacks
   */
  private notifyVisualIndicatorCallbacks(): void {
    this.visualIndicators.forEach(indicator => {
      this.visualIndicatorCallbacks.forEach(callback => callback(indicator));
    });
  }

  /**
   * Get current accessibility settings
   */
  getSettings(): AudioAccessibilitySettings {
    return { ...this.settings };
  }

  /**
   * Get active visual indicators
   */
  getActiveVisualIndicators(): Map<string, VisualAudioIndicator> {
    return new Map(this.visualIndicators);
  }

  /**
   * Get active captions
   */
  getActiveCaptions(): Map<string, AudioCaption> {
    return new Map(this.activeCaptions);
  }

  /**
   * Get available haptic patterns
   */
  getHapticPatterns(): Map<string, HapticPattern> {
    return new Map(this.hapticPatterns);
  }

  /**
   * Check if device supports haptic feedback
   */
  isHapticSupported(): boolean {
    return this.hapticDevice !== null;
  }

  /**
   * Preload accessibility preferences based on system settings
   */
  static detectSystemPreferences(): Partial<AudioAccessibilitySettings> {
    const preferences: Partial<AudioAccessibilitySettings> = {};

    // Check for reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      preferences.reducedMotion = true;
      preferences.spatialAudioSimplification = true;
    }

    // Check for high contrast preference
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      preferences.contrastMode = 'high';
    }

    // Check for color scheme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      preferences.contrastMode = 'high';
    }

    return preferences;
  }
}