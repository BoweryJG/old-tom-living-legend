/**
 * Orchestral Composer Service for Old Tom: The Living Legend
 * 
 * Creates and manages Studio Ghibli-inspired orchestral compositions
 * with dynamic emotional progression and character leitmotif integration
 */

export interface MusicalTheme {
  id: string;
  name: string;
  character?: string;
  key: string;
  tempo: number;
  mood: string[];
  instruments: string[];
  filePath: string;
  duration: number;
  loopPoints?: {
    start: number;
    end: number;
  };
  variations: {
    intensity: 'soft' | 'medium' | 'full';
    filePath: string;
  }[];
  emotionalTags: string[];
}

export interface OrchestralComposition {
  id: string;
  title: string;
  themes: string[]; // Theme IDs that appear in this composition
  structure: CompositionSection[];
  totalDuration: number;
  adaptiveElements: AdaptiveElement[];
}

interface CompositionSection {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  primaryTheme: string;
  secondaryThemes: string[];
  dynamics: 'pp' | 'p' | 'mp' | 'mf' | 'f' | 'ff';
  emotionalArc: EmotionalPoint[];
}

interface EmotionalPoint {
  time: number; // Seconds from section start
  emotion: string;
  intensity: number; // 0-1
  musicalElements: {
    harmony: string;
    rhythm: string;
    melody: string;
    orchestration: string;
  };
}

interface AdaptiveElement {
  id: string;
  trigger: 'user_emotion' | 'story_progress' | 'interaction' | 'time_of_day';
  condition: any;
  musicalChange: {
    type: 'key_change' | 'tempo_change' | 'orchestration_change' | 'theme_introduction';
    parameters: any;
  };
}

export class OrchestralComposer {
  private themes: Map<string, MusicalTheme> = new Map();
  private compositions: Map<string, OrchestralComposition> = new Map();
  private audioContext: AudioContext;
  private currentComposition: string | null = null;
  private adaptiveListeners: Map<string, (data: any) => void> = new Map();

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.initializeThemes();
    this.initializeCompositions();
  }

  private initializeThemes(): void {
    // Main Theme: Ocean's Embrace
    this.themes.set('main-theme', {
      id: 'main-theme',
      name: "Ocean's Embrace",
      key: 'D Major',
      tempo: 72,
      mood: ['majestic', 'oceanic', 'friendship', 'wonder'],
      instruments: ['strings', 'french_horns', 'harp', 'flute', 'timpani'],
      filePath: '/assets/audio/music/orchestral/main-theme-oceans-embrace.mp3',
      duration: 225, // 3:45
      loopPoints: { start: 30, end: 180 },
      variations: [
        { intensity: 'soft', filePath: '/assets/audio/music/orchestral/main-theme-soft.mp3' },
        { intensity: 'medium', filePath: '/assets/audio/music/orchestral/main-theme-medium.mp3' },
        { intensity: 'full', filePath: '/assets/audio/music/orchestral/main-theme-full.mp3' }
      ],
      emotionalTags: ['wonder', 'vastness', 'gentle_power', 'hope']
    });

    // Old Tom's Leitmotif
    this.themes.set('old-tom', {
      id: 'old-tom',
      name: "The Ancient Guardian",
      character: 'Old Tom',
      key: 'C Minor',
      tempo: 60,
      mood: ['wise', 'protective', 'ancient', 'gentle'],
      instruments: ['cello', 'double_bass', 'french_horn', 'whale_song_harmonics'],
      filePath: '/assets/audio/music/orchestral/old-tom-leitmotif-ancient-guardian.mp3',
      duration: 150, // 2:30
      loopPoints: { start: 15, end: 120 },
      variations: [
        { intensity: 'soft', filePath: '/assets/audio/music/themes/old-tom-whisper.mp3' },
        { intensity: 'medium', filePath: '/assets/audio/music/themes/old-tom-presence.mp3' },
        { intensity: 'full', filePath: '/assets/audio/music/themes/old-tom-powerful.mp3' }
      ],
      emotionalTags: ['wisdom', 'protection', 'ancient_knowledge', 'gentle_strength']
    });

    // George Davidson's Theme
    this.themes.set('george-davidson', {
      id: 'george-davidson',
      name: "Humble Hearts",
      character: 'George Davidson',
      key: 'G Major',
      tempo: 84,
      mood: ['hardworking', 'honest', 'folk', 'earthy'],
      instruments: ['acoustic_guitar', 'fiddle', 'flute', 'strings'],
      filePath: '/assets/audio/music/orchestral/george-davidson-humble-hearts.mp3',
      duration: 135, // 2:15
      loopPoints: { start: 10, end: 110 },
      variations: [
        { intensity: 'soft', filePath: '/assets/audio/music/themes/george-contemplative.mp3' },
        { intensity: 'medium', filePath: '/assets/audio/music/themes/george-working.mp3' },
        { intensity: 'full', filePath: '/assets/audio/music/themes/george-determined.mp3' }
      ],
      emotionalTags: ['honesty', 'hard_work', 'connection_to_land', 'humble_pride']
    });

    // Twofold Bay Theme
    this.themes.set('twofold-bay', {
      id: 'twofold-bay',
      name: "Mystical Waters",
      key: 'A Major',
      tempo: 66,
      mood: ['mystical', 'peaceful', 'golden', 'ethereal'],
      instruments: ['harp', 'flute', 'strings', 'wind_chimes', 'water_percussion'],
      filePath: '/assets/audio/music/orchestral/twofold-bay-mystical-waters.mp3',
      duration: 260, // 4:20
      loopPoints: { start: 20, end: 220 },
      variations: [
        { intensity: 'soft', filePath: '/assets/audio/music/ambient/bay-dawn.mp3' },
        { intensity: 'medium', filePath: '/assets/audio/music/ambient/bay-morning.mp3' },
        { intensity: 'full', filePath: '/assets/audio/music/ambient/bay-golden-hour.mp3' }
      ],
      emotionalTags: ['peace', 'mystical_beauty', 'golden_light', 'natural_wonder']
    });

    // Partnership Theme
    this.themes.set('partnership', {
      id: 'partnership',
      name: "Bonds Beyond Words",
      key: 'E Major',
      tempo: 78,
      mood: ['collaborative', 'trusting', 'growing', 'harmonious'],
      instruments: ['orchestral_dialogue', 'call_and_response', 'interweaving_melodies'],
      filePath: '/assets/audio/music/orchestral/partnership-bonds-beyond-words.mp3',
      duration: 190, // 3:10
      variations: [
        { intensity: 'soft', filePath: '/assets/audio/music/themes/partnership-building.mp3' },
        { intensity: 'medium', filePath: '/assets/audio/music/themes/partnership-working.mp3' },
        { intensity: 'full', filePath: '/assets/audio/music/themes/partnership-triumph.mp3' }
      ],
      emotionalTags: ['trust', 'cooperation', 'mutual_respect', 'growing_bond']
    });

    // Sacrifice Theme
    this.themes.set('sacrifice', {
      id: 'sacrifice',
      name: "Heart of the Ocean",
      key: 'B♭ Minor',
      tempo: 54,
      mood: ['emotional', 'sacrificial', 'noble', 'bittersweet'],
      instruments: ['full_orchestra', 'solo_violin', 'choir', 'whale_song_integration'],
      filePath: '/assets/audio/music/orchestral/sacrifice-heart-of-ocean.mp3',
      duration: 285, // 4:45
      variations: [
        { intensity: 'soft', filePath: '/assets/audio/music/themes/sacrifice-realization.mp3' },
        { intensity: 'medium', filePath: '/assets/audio/music/themes/sacrifice-acceptance.mp3' },
        { intensity: 'full', filePath: '/assets/audio/music/themes/sacrifice-transcendence.mp3' }
      ],
      emotionalTags: ['sacrifice', 'noble_dedication', 'bittersweet_love', 'transcendence']
    });

    // Legacy Theme
    this.themes.set('legacy', {
      id: 'legacy',
      name: "Eternal Tides",
      key: 'F Major',
      tempo: 69,
      mood: ['peaceful', 'memorial', 'hopeful', 'eternal'],
      instruments: ['piano', 'strings', 'childrens_choir', 'ocean_sounds'],
      filePath: '/assets/audio/music/orchestral/legacy-eternal-tides.mp3',
      duration: 210, // 3:30
      variations: [
        { intensity: 'soft', filePath: '/assets/audio/music/themes/legacy-remembrance.mp3' },
        { intensity: 'medium', filePath: '/assets/audio/music/themes/legacy-celebration.mp3' },
        { intensity: 'full', filePath: '/assets/audio/music/themes/legacy-eternal.mp3' }
      ],
      emotionalTags: ['peace', 'remembrance', 'continuing_legacy', 'eternal_hope']
    });
  }

  private initializeCompositions(): void {
    // Story Opening Composition
    this.compositions.set('story-opening', {
      id: 'story-opening',
      title: 'The Legend Begins',
      themes: ['twofold-bay', 'main-theme', 'old-tom'],
      structure: [
        {
          id: 'dawn-introduction',
          name: 'Dawn at Twofold Bay',
          startTime: 0,
          duration: 45,
          primaryTheme: 'twofold-bay',
          secondaryThemes: [],
          dynamics: 'p',
          emotionalArc: [
            {
              time: 0,
              emotion: 'peaceful',
              intensity: 0.3,
              musicalElements: {
                harmony: 'suspended_chords',
                rhythm: 'gentle_waves',
                melody: 'floating_harp',
                orchestration: 'minimal_strings'
              }
            },
            {
              time: 30,
              emotion: 'anticipation',
              intensity: 0.6,
              musicalElements: {
                harmony: 'building_tension',
                rhythm: 'subtle_acceleration',
                melody: 'rising_flute',
                orchestration: 'adding_winds'
              }
            }
          ]
        },
        {
          id: 'main-theme-introduction',
          name: 'The Ocean\'s Call',
          startTime: 45,
          duration: 60,
          primaryTheme: 'main-theme',
          secondaryThemes: ['twofold-bay'],
          dynamics: 'mf',
          emotionalArc: [
            {
              time: 0,
              emotion: 'wonder',
              intensity: 0.7,
              musicalElements: {
                harmony: 'major_seventh_chords',
                rhythm: 'flowing_compound_meter',
                melody: 'soaring_strings',
                orchestration: 'full_string_section'
              }
            }
          ]
        },
        {
          id: 'old-tom-entrance',
          name: 'The Ancient Guardian Emerges',
          startTime: 105,
          duration: 75,
          primaryTheme: 'old-tom',
          secondaryThemes: ['main-theme'],
          dynamics: 'f',
          emotionalArc: [
            {
              time: 0,
              emotion: 'mysterious',
              intensity: 0.5,
              musicalElements: {
                harmony: 'minor_modality',
                rhythm: 'deep_pulse',
                melody: 'low_brass_call',
                orchestration: 'bass_emphasis'
              }
            },
            {
              time: 45,
              emotion: 'awe',
              intensity: 0.9,
              musicalElements: {
                harmony: 'modal_resolution',
                rhythm: 'powerful_downbeats',
                melody: 'triumphant_horns',
                orchestration: 'full_orchestra'
              }
            }
          ]
        }
      ],
      totalDuration: 180,
      adaptiveElements: [
        {
          id: 'emotional-response',
          trigger: 'user_emotion',
          condition: { emotion: 'excitement', threshold: 0.7 },
          musicalChange: {
            type: 'orchestration_change',
            parameters: { addBrass: true, increaseDynamics: 'f' }
          }
        }
      ]
    });

    // Partnership Development Composition
    this.compositions.set('partnership-development', {
      id: 'partnership-development',
      title: 'Building Trust',
      themes: ['george-davidson', 'old-tom', 'partnership'],
      structure: [
        {
          id: 'tentative-meeting',
          name: 'First Encounters',
          startTime: 0,
          duration: 90,
          primaryTheme: 'george-davidson',
          secondaryThemes: ['old-tom'],
          dynamics: 'mp',
          emotionalArc: [
            {
              time: 0,
              emotion: 'uncertainty',
              intensity: 0.4,
              musicalElements: {
                harmony: 'questioning_phrases',
                rhythm: 'hesitant_timing',
                melody: 'alternating_instruments',
                orchestration: 'sparse_texture'
              }
            },
            {
              time: 60,
              emotion: 'curiosity',
              intensity: 0.6,
              musicalElements: {
                harmony: 'approaching_consonance',
                rhythm: 'more_confident',
                melody: 'melodic_overlap',
                orchestration: 'growing_interplay'
              }
            }
          ]
        },
        {
          id: 'partnership-emerges',
          name: 'Understanding Grows',
          startTime: 90,
          duration: 120,
          primaryTheme: 'partnership',
          secondaryThemes: ['george-davidson', 'old-tom'],
          dynamics: 'mf',
          emotionalArc: [
            {
              time: 0,
              emotion: 'trust',
              intensity: 0.7,
              musicalElements: {
                harmony: 'harmonic_convergence',
                rhythm: 'synchronized_patterns',
                melody: 'theme_integration',
                orchestration: 'balanced_ensemble'
              }
            }
          ]
        }
      ],
      totalDuration: 210,
      adaptiveElements: []
    });
  }

  /**
   * Play a specific musical theme with adaptive intensity
   */
  async playTheme(themeId: string, intensity: 'soft' | 'medium' | 'full' = 'medium'): Promise<void> {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme not found: ${themeId}`);
    }

    const variation = theme.variations.find(v => v.intensity === intensity);
    const audioPath = variation ? variation.filePath : theme.filePath;

    // Implementation would load and play the audio file
    // with proper Web Audio API integration
    console.log(`Playing theme: ${theme.name} at ${intensity} intensity`);
    console.log(`Audio path: ${audioPath}`);
  }

  /**
   * Start a complete orchestral composition
   */
  async playComposition(compositionId: string): Promise<void> {
    const composition = this.compositions.get(compositionId);
    if (!composition) {
      throw new Error(`Composition not found: ${compositionId}`);
    }

    this.currentComposition = compositionId;
    
    // Implementation would sequence through composition sections
    // with proper timing and transitions
    console.log(`Starting composition: ${composition.title}`);
    console.log(`Total duration: ${composition.totalDuration} seconds`);
  }

  /**
   * Create emotional musical progression based on story context
   */
  createEmotionalProgression(emotions: string[], duration: number): OrchestralComposition {
    // Implementation would dynamically create musical progression
    // based on emotional requirements and available themes
    
    const adaptedComposition: OrchestralComposition = {
      id: `emotional-${Date.now()}`,
      title: 'Dynamic Emotional Progression',
      themes: this.selectThemesForEmotions(emotions),
      structure: this.createStructureForEmotions(emotions, duration),
      totalDuration: duration,
      adaptiveElements: []
    };

    return adaptedComposition;
  }

  /**
   * Blend character themes for relationship scenes
   */
  blendCharacterThemes(characterIds: string[], relationshipType: string): MusicalTheme {
    // Implementation would create dynamic theme blending
    // for scenes involving multiple characters
    
    const blendedTheme: MusicalTheme = {
      id: `blend-${characterIds.join('-')}`,
      name: `${relationshipType} Theme`,
      key: 'Adaptive',
      tempo: 72,
      mood: ['collaborative', 'harmonious'],
      instruments: ['blended_orchestration'],
      filePath: '/assets/audio/music/themes/dynamic-blend.mp3',
      duration: 180,
      variations: [
        { intensity: 'soft', filePath: '/assets/audio/music/themes/blend-soft.mp3' },
        { intensity: 'medium', filePath: '/assets/audio/music/themes/blend-medium.mp3' },
        { intensity: 'full', filePath: '/assets/audio/music/themes/blend-full.mp3' }
      ],
      emotionalTags: ['relationship', 'harmony', relationshipType]
    };

    return blendedTheme;
  }

  /**
   * Adapt music to user's emotional state
   */
  adaptToUserEmotion(emotion: string, intensity: number): void {
    if (!this.currentComposition) return;

    const composition = this.compositions.get(this.currentComposition);
    if (!composition) return;

    // Find applicable adaptive elements
    const adaptiveElements = composition.adaptiveElements.filter(
      element => element.trigger === 'user_emotion'
    );

    adaptiveElements.forEach(element => {
      if (this.shouldTriggerAdaptation(element, { emotion, intensity })) {
        this.applyMusicalChange(element.musicalChange);
      }
    });
  }

  private selectThemesForEmotions(emotions: string[]): string[] {
    const selectedThemes: string[] = [];
    
    emotions.forEach(emotion => {
      this.themes.forEach((theme, id) => {
        if (theme.emotionalTags.includes(emotion)) {
          selectedThemes.push(id);
        }
      });
    });

    return [...new Set(selectedThemes)]; // Remove duplicates
  }

  private createStructureForEmotions(emotions: string[], duration: number): CompositionSection[] {
    const sections: CompositionSection[] = [];
    const sectionDuration = duration / emotions.length;

    emotions.forEach((emotion, index) => {
      const startTime = index * sectionDuration;
      const primaryTheme = this.findPrimaryThemeForEmotion(emotion);
      
      sections.push({
        id: `emotional-section-${index}`,
        name: `${emotion} progression`,
        startTime,
        duration: sectionDuration,
        primaryTheme,
        secondaryThemes: [],
        dynamics: this.getDynamicsForEmotion(emotion),
        emotionalArc: [
          {
            time: 0,
            emotion,
            intensity: 0.7,
            musicalElements: {
              harmony: this.getHarmonyForEmotion(emotion),
              rhythm: this.getRhythmForEmotion(emotion),
              melody: this.getMelodyForEmotion(emotion),
              orchestration: this.getOrchestrationForEmotion(emotion)
            }
          }
        ]
      });
    });

    return sections;
  }

  private findPrimaryThemeForEmotion(emotion: string): string {
    for (const [id, theme] of this.themes) {
      if (theme.emotionalTags.includes(emotion)) {
        return id;
      }
    }
    return 'main-theme'; // Fallback
  }

  private getDynamicsForEmotion(emotion: string): 'pp' | 'p' | 'mp' | 'mf' | 'f' | 'ff' {
    const dynamicsMap: Record<string, 'pp' | 'p' | 'mp' | 'mf' | 'f' | 'ff'> = {
      peaceful: 'p',
      wonder: 'mf',
      excitement: 'f',
      sadness: 'mp',
      triumph: 'ff',
      mystery: 'pp'
    };
    return dynamicsMap[emotion] || 'mf';
  }

  private getHarmonyForEmotion(emotion: string): string {
    const harmonyMap: Record<string, string> = {
      peaceful: 'consonant_triads',
      wonder: 'suspended_chords',
      excitement: 'powerful_progressions',
      sadness: 'minor_modality',
      triumph: 'major_resolutions',
      mystery: 'diminished_chords'
    };
    return harmonyMap[emotion] || 'diatonic_harmony';
  }

  private getRhythmForEmotion(emotion: string): string {
    const rhythmMap: Record<string, string> = {
      peaceful: 'gentle_flow',
      wonder: 'floating_rhythm',
      excitement: 'driving_pulse',
      sadness: 'slow_reflection',
      triumph: 'bold_accents',
      mystery: 'irregular_patterns'
    };
    return rhythmMap[emotion] || 'moderate_pulse';
  }

  private getMelodyForEmotion(emotion: string): string {
    const melodyMap: Record<string, string> = {
      peaceful: 'stepwise_motion',
      wonder: 'ascending_phrases',
      excitement: 'leaping_intervals',
      sadness: 'descending_lines',
      triumph: 'bold_statements',
      mystery: 'chromatic_movement'
    };
    return melodyMap[emotion] || 'balanced_contour';
  }

  private getOrchestrationForEmotion(emotion: string): string {
    const orchestrationMap: Record<string, string> = {
      peaceful: 'minimal_texture',
      wonder: 'growing_ensemble',
      excitement: 'full_orchestra',
      sadness: 'solo_instruments',
      triumph: 'brass_prominence',
      mystery: 'dark_timbres'
    };
    return orchestrationMap[emotion] || 'balanced_scoring';
  }

  private shouldTriggerAdaptation(element: AdaptiveElement, data: any): boolean {
    // Implementation would check if adaptation conditions are met
    return true; // Simplified for this example
  }

  private applyMusicalChange(change: AdaptiveElement['musicalChange']): void {
    // Implementation would apply real-time musical changes
    console.log(`Applying musical change: ${change.type}`);
  }

  /**
   * Get all available themes
   */
  getThemes(): Map<string, MusicalTheme> {
    return new Map(this.themes);
  }

  /**
   * Get all available compositions
   */
  getCompositions(): Map<string, OrchestralComposition> {
    return new Map(this.compositions);
  }
}