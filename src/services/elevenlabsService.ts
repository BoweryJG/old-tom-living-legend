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

  // Preload common phrases for better performance
  async preloadCommonPhrases(phrases: string[], voiceId?: string): Promise<void> {
    const promises = phrases.map(phrase => 
      this.generateSpeech(phrase, { voiceId }).catch(error => {
        console.warn(`Failed to preload phrase: "${phrase}"`, error);
      })
    );
    
    await Promise.allSettled(promises);
  }
}

export const elevenlabsService = new ElevenLabsService();
export default ElevenLabsService;