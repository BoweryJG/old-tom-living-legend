import axios from 'axios';

interface ElevenLabsConfig {
  apiKey: string;
  baseURL: string;
  defaultVoiceId: string;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

interface EmotionalVoiceSettings extends VoiceSettings {
  emotion: 'wise' | 'protective' | 'gentle' | 'excited' | 'concerned' | 'nostalgic' | 'mysterious';
  age_adaptation: 'young_child' | 'older_child' | 'general';
  speaking_pace: 'slow' | 'normal' | 'fast';
  character_intensity: number; // 0-1 scale
}

interface CharacterVoiceProfile {
  voiceId: string;
  baseSettings: VoiceSettings;
  emotionalVariations: Record<string, Partial<VoiceSettings>>;
  characterTraits: {
    accent: string;
    speaking_style: string;
    vocabulary_level: string;
  };
}

interface TextToSpeechRequest {
  text: string;
  voice_id?: string;
  voice_settings?: VoiceSettings;
  model_id?: string;
}

interface Voice {
  voice_id: string;
  name: string;
  samples: any[];
  category: string;
  fine_tuning: {
    language: string;
    is_allowed_to_fine_tune: boolean;
  };
  labels: Record<string, string>;
  description: string;
  preview_url: string;
  available_for_tiers: string[];
  settings: VoiceSettings;
}

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private axiosInstance;
  private audioCache: Map<string, string> = new Map();
  private characterVoices: Map<string, CharacterVoiceProfile> = new Map();
  private emotionalPresets: Map<string, EmotionalVoiceSettings> = new Map();

  constructor(config: Partial<ElevenLabsConfig> = {}) {
    this.config = {
      apiKey: process.env.REACT_APP_ELEVENLABS_API_KEY || '',
      baseURL: 'https://api.elevenlabs.io/v1',
      defaultVoiceId: 'old-tom-voice',
      ...config,
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      headers: {
        'xi-api-key': this.config.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 60000, // Longer timeout for audio generation
    });

    this.initializeCharacterVoices();
    this.initializeEmotionalPresets();
  }

  async generateSpeech(
    text: string, 
    options: {
      voiceId?: string;
      voiceSettings?: VoiceSettings;
      modelId?: string;
    } = {}
  ): Promise<string> {
    try {
      const voiceId = options.voiceId || this.config.defaultVoiceId;
      const cacheKey = `${voiceId}-${text}`;
      
      // Check cache first
      if (this.audioCache.has(cacheKey)) {
        return this.audioCache.get(cacheKey)!;
      }

      const voiceSettings: VoiceSettings = {
        stability: 0.75,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true,
        ...options.voiceSettings,
      };

      const requestData: TextToSpeechRequest = {
        text,
        voice_settings: voiceSettings,
        model_id: options.modelId || 'eleven_turbo_v2',
      };

      const response = await this.axiosInstance.post(
        `/text-to-speech/${voiceId}`,
        requestData,
        {
          responseType: 'arraybuffer',
          headers: {
            'Accept': 'audio/mpeg',
          },
        }
      );

      // Convert audio buffer to base64 data URL
      const audioBuffer = response.data;
      const base64Audio = this.arrayBufferToBase64(audioBuffer);
      const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;

      // Cache the result
      this.audioCache.set(cacheKey, audioDataUrl);
      
      return audioDataUrl;
    } catch (error) {
      console.error('ElevenLabs TTS Error:', error);
      throw new Error('Failed to generate speech');
    }
  }

  async getAvailableVoices(): Promise<Voice[]> {
    try {
      const response = await this.axiosInstance.get('/voices');
      return response.data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  }

  async getVoiceById(voiceId: string): Promise<Voice | null> {
    try {
      const response = await this.axiosInstance.get(`/voices/${voiceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching voice:', error);
      return null;
    }
  }

  async createCharacterVoice(
    characterName: string,
    description: string,
    audioSamples: File[]
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('name', `${characterName} Voice`);
      formData.append('description', description);
      
      audioSamples.forEach((file, index) => {
        formData.append(`files`, file, `sample_${index}.wav`);
      });

      const response = await this.axiosInstance.post('/voices/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.voice_id;
    } catch (error) {
      console.error('Error creating voice:', error);
      throw new Error('Failed to create character voice');
    }
  }

  async generateSpeechStream(
    text: string,
    voiceId?: string,
    onAudioChunk?: (chunk: Uint8Array) => void
  ): Promise<void> {
    try {
      const requestData: TextToSpeechRequest = {
        text,
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.8,
        },
        model_id: 'eleven_turbo_v2',
      };

      const response = await this.axiosInstance.post(
        `/text-to-speech/${voiceId || this.config.defaultVoiceId}/stream`,
        requestData,
        {
          responseType: 'stream',
          headers: {
            'Accept': 'audio/mpeg',
          },
        }
      );

      if (onAudioChunk) {
        response.data.on('data', (chunk: Uint8Array) => {
          onAudioChunk(chunk);
        });
      }

      return new Promise((resolve, reject) => {
        response.data.on('end', resolve);
        response.data.on('error', reject);
      });
    } catch (error) {
      console.error('ElevenLabs streaming error:', error);
      throw new Error('Failed to stream speech');
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  clearCache() {
    this.audioCache.clear();
  }

  getCacheSize(): number {
    return this.audioCache.size;
  }

  updateConfig(newConfig: Partial<ElevenLabsConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.apiKey) {
      this.axiosInstance.defaults.headers['xi-api-key'] = newConfig.apiKey;
    }
  }

  private initializeCharacterVoices() {
    // Old Tom - Deep, wise whale voice
    this.characterVoices.set('old-tom', {
      voiceId: process.env.REACT_APP_OLD_TOM_VOICE_ID || 'old-tom-voice',
      baseSettings: {
        stability: 0.85,
        similarity_boost: 0.75,
        style: 0.15,
        use_speaker_boost: true
      },
      emotionalVariations: {
        wise: { stability: 0.9, style: 0.1 },
        protective: { stability: 0.8, similarity_boost: 0.8, style: 0.2 },
        gentle: { stability: 0.9, similarity_boost: 0.7, style: 0.05 },
        nostalgic: { stability: 0.85, style: 0.25 },
        mysterious: { stability: 0.75, style: 0.3 }
      },
      characterTraits: {
        accent: 'Deep oceanic resonance',
        speaking_style: 'Slow, deliberate, wise',
        vocabulary_level: 'Sophisticated but accessible'
      }
    });

    // George Davidson - Authentic Australian whaler
    this.characterVoices.set('george-davidson', {
      voiceId: process.env.REACT_APP_GEORGE_VOICE_ID || 'george-voice',
      baseSettings: {
        stability: 0.8,
        similarity_boost: 0.85,
        style: 0.2,
        use_speaker_boost: true
      },
      emotionalVariations: {
        gentle: { stability: 0.85, style: 0.15 },
        concerned: { stability: 0.75, similarity_boost: 0.9, style: 0.25 },
        nostalgic: { stability: 0.8, style: 0.3 },
        protective: { stability: 0.8, similarity_boost: 0.8 }
      },
      characterTraits: {
        accent: 'Early 1900s Australian maritime',
        speaking_style: 'Straightforward, honest, warm',
        vocabulary_level: 'Period-appropriate but clear'
      }
    });

    // Child Narrator - Excited, curious young voice
    this.characterVoices.set('child-narrator', {
      voiceId: process.env.REACT_APP_CHILD_VOICE_ID || 'child-voice',
      baseSettings: {
        stability: 0.7,
        similarity_boost: 0.8,
        style: 0.4,
        use_speaker_boost: false
      },
      emotionalVariations: {
        excited: { stability: 0.6, style: 0.5 },
        curious: { stability: 0.75, style: 0.35 },
        gentle: { stability: 0.8, style: 0.25 },
        joyful: { stability: 0.65, style: 0.45 }
      },
      characterTraits: {
        accent: 'Modern, clear, enthusiastic',
        speaking_style: 'Quick when excited, naturally curious',
        vocabulary_level: 'Age-appropriate and relatable'
      }
    });
  }

  private initializeEmotionalPresets() {
    // Emotional presets for different scenarios
    this.emotionalPresets.set('storytelling-wise', {
      stability: 0.9,
      similarity_boost: 0.75,
      style: 0.1,
      use_speaker_boost: true,
      emotion: 'wise',
      age_adaptation: 'general',
      speaking_pace: 'slow',
      character_intensity: 0.8
    });

    this.emotionalPresets.set('comforting-gentle', {
      stability: 0.95,
      similarity_boost: 0.7,
      style: 0.05,
      use_speaker_boost: true,
      emotion: 'gentle',
      age_adaptation: 'young_child',
      speaking_pace: 'slow',
      character_intensity: 0.9
    });

    this.emotionalPresets.set('educational-excited', {
      stability: 0.7,
      similarity_boost: 0.8,
      style: 0.3,
      use_speaker_boost: false,
      emotion: 'excited',
      age_adaptation: 'older_child',
      speaking_pace: 'normal',
      character_intensity: 0.7
    });
  }

  async generateCharacterSpeech(
    text: string,
    characterId: string,
    emotion: string = 'gentle',
    ageGroup: 'young_child' | 'older_child' | 'general' = 'general'
  ): Promise<string> {
    const profile = this.characterVoices.get(characterId);
    if (!profile) {
      throw new Error(`Character voice profile not found: ${characterId}`);
    }

    // Get base settings and apply emotional variation
    const baseSettings = profile.baseSettings;
    const emotionalVariation = profile.emotionalVariations[emotion] || {};
    const voiceSettings = { ...baseSettings, ...emotionalVariation };

    // Adapt for age group
    if (ageGroup === 'young_child') {
      voiceSettings.stability = Math.min(0.95, voiceSettings.stability + 0.1);
      voiceSettings.style = Math.max(0, (voiceSettings.style || 0) - 0.1);
    }

    return this.generateSpeech(text, {
      voiceId: profile.voiceId,
      voiceSettings,
      modelId: 'eleven_turbo_v2_5' // Use latest model for better quality
    });
  }

  async generateEmotionalSpeech(
    text: string,
    presetName: string,
    characterId?: string
  ): Promise<string> {
    const preset = this.emotionalPresets.get(presetName);
    if (!preset) {
      throw new Error(`Emotional preset not found: ${presetName}`);
    }

    let voiceId = this.config.defaultVoiceId;
    if (characterId) {
      const profile = this.characterVoices.get(characterId);
      if (profile) {
        voiceId = profile.voiceId;
      }
    }

    const { emotion, age_adaptation, speaking_pace, character_intensity, ...voiceSettings } = preset;

    return this.generateSpeech(text, {
      voiceId,
      voiceSettings,
      modelId: 'eleven_turbo_v2_5'
    });
  }

  async generateContextualSpeech(
    text: string,
    context: {
      character: string;
      emotion: string;
      situation: 'educational' | 'comforting' | 'storytelling' | 'encouraging';
      childAge?: number;
      urgency?: 'low' | 'medium' | 'high';
    }
  ): Promise<string> {
    const { character, emotion, situation, childAge = 7, urgency = 'low' } = context;
    
    const profile = this.characterVoices.get(character);
    if (!profile) {
      return this.generateSpeech(text); // Fallback to default
    }

    // Determine age group
    const ageGroup = childAge <= 5 ? 'young_child' : 
                    childAge <= 8 ? 'older_child' : 'general';

    // Get base settings
    let voiceSettings = { ...profile.baseSettings };
    
    // Apply emotional variation
    if (profile.emotionalVariations[emotion]) {
      voiceSettings = { ...voiceSettings, ...profile.emotionalVariations[emotion] };
    }

    // Situational adjustments
    switch (situation) {
      case 'educational':
        voiceSettings.stability = Math.min(0.9, voiceSettings.stability + 0.05);
        voiceSettings.style = Math.max(0.1, (voiceSettings.style || 0));
        break;
      case 'comforting':
        voiceSettings.stability = Math.min(0.95, voiceSettings.stability + 0.1);
        voiceSettings.style = Math.max(0, (voiceSettings.style || 0) - 0.1);
        voiceSettings.similarity_boost = Math.min(0.9, voiceSettings.similarity_boost + 0.05);
        break;
      case 'storytelling':
        voiceSettings.style = Math.min(0.4, (voiceSettings.style || 0) + 0.1);
        break;
      case 'encouraging':
        voiceSettings.similarity_boost = Math.min(0.9, voiceSettings.similarity_boost + 0.1);
        break;
    }

    // Age adaptations
    if (ageGroup === 'young_child') {
      voiceSettings.stability = Math.min(0.95, voiceSettings.stability + 0.1);
      voiceSettings.style = Math.max(0, (voiceSettings.style || 0) - 0.1);
    }

    // Urgency adjustments
    if (urgency === 'high') {
      voiceSettings.style = Math.min(0.5, (voiceSettings.style || 0) + 0.15);
    }

    return this.generateSpeech(text, {
      voiceId: profile.voiceId,
      voiceSettings,
      modelId: 'eleven_turbo_v2_5'
    });
  }

  // Enhanced streaming with character support
  async generateCharacterSpeechStream(
    text: string,
    characterId: string,
    emotion: string = 'gentle',
    onAudioChunk?: (chunk: Uint8Array) => void
  ): Promise<void> {
    const profile = this.characterVoices.get(characterId);
    if (!profile) {
      return this.generateSpeechStream(text, undefined, onAudioChunk);
    }

    const baseSettings = profile.baseSettings;
    const emotionalVariation = profile.emotionalVariations[emotion] || {};
    const voiceSettings = { ...baseSettings, ...emotionalVariation };

    try {
      const requestData: TextToSpeechRequest = {
        text,
        voice_settings: voiceSettings,
        model_id: 'eleven_turbo_v2_5',
      };

      const response = await this.axiosInstance.post(
        `/text-to-speech/${profile.voiceId}/stream`,
        requestData,
        {
          responseType: 'stream',
          headers: {
            'Accept': 'audio/mpeg',
          },
        }
      );

      if (onAudioChunk) {
        response.data.on('data', (chunk: Uint8Array) => {
          onAudioChunk(chunk);
        });
      }

      return new Promise((resolve, reject) => {
        response.data.on('end', resolve);
        response.data.on('error', reject);
      });
    } catch (error) {
      console.error('ElevenLabs character streaming error:', error);
      throw new Error('Failed to stream character speech');
    }
  }

  // Voice cloning and character creation methods
  async createCharacterVoiceClone(
    characterName: string,
    description: string,
    audioSamples: File[],
    voiceProfile: Partial<CharacterVoiceProfile>
  ): Promise<string> {
    try {
      const voiceId = await this.createCharacterVoice(characterName, description, audioSamples);
      
      // Store the character profile
      const profile: CharacterVoiceProfile = {
        voiceId,
        baseSettings: {
          stability: 0.8,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true
        },
        emotionalVariations: {},
        characterTraits: {
          accent: 'Custom',
          speaking_style: 'Natural',
          vocabulary_level: 'Adaptive'
        },
        ...voiceProfile
      };

      this.characterVoices.set(characterName, profile);
      return voiceId;
    } catch (error) {
      console.error('Error creating character voice clone:', error);
      throw error;
    }
  }

  // Character voice management
  getCharacterVoices(): Map<string, CharacterVoiceProfile> {
    return new Map(this.characterVoices);
  }

  updateCharacterVoiceProfile(characterId: string, updates: Partial<CharacterVoiceProfile>): void {
    const existing = this.characterVoices.get(characterId);
    if (existing) {
      this.characterVoices.set(characterId, { ...existing, ...updates });
    }
  }

  addEmotionalVariation(
    characterId: string, 
    emotion: string, 
    settings: Partial<VoiceSettings>
  ): void {
    const profile = this.characterVoices.get(characterId);
    if (profile) {
      profile.emotionalVariations[emotion] = settings;
      this.characterVoices.set(characterId, profile);
    }
  }

  // Preload common phrases for better performance
  async preloadCommonPhrases(phrases: string[], voiceId?: string): Promise<void> {
    const promises = phrases.map(phrase => 
      this.generateSpeech(phrase, { voiceId }).catch(error => {
        console.warn(`Failed to preload phrase: "${phrase}"`, error);
      })
    );
    
    await Promise.allSettled(promises);
  }

  // Preload character-specific phrases
  async preloadCharacterPhrases(
    characterId: string, 
    phrases: string[], 
    emotions: string[] = ['gentle']
  ): Promise<void> {
    const profile = this.characterVoices.get(characterId);
    if (!profile) return;

    const promises: Promise<any>[] = [];
    
    for (const phrase of phrases) {
      for (const emotion of emotions) {
        promises.push(
          this.generateCharacterSpeech(phrase, characterId, emotion)
            .catch(error => {
              console.warn(`Failed to preload character phrase: "${phrase}" with emotion "${emotion}"`, error);
            })
        );
      }
    }
    
    await Promise.allSettled(promises);
  }

  // Performance optimization
  async warmupCharacterVoices(): Promise<void> {
    const warmupPhrases = [
      "Hello, little explorer!",
      "That's a wonderful question.",
      "Let me tell you about that."
    ];

    const characters = Array.from(this.characterVoices.keys());
    const emotions = ['gentle', 'wise', 'excited'];

    for (const character of characters) {
      await this.preloadCharacterPhrases(character, warmupPhrases, emotions);
    }
  }
}

export const elevenlabsService = new ElevenLabsService();
export default ElevenLabsService;