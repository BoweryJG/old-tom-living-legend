import { EventEmitter } from 'events';

// Global agentConfigs fallback
let agentConfigs: any = {
  'old-tom': {
    voiceConfig: {
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah voice configured for Australian male sea captain
      stability: 0.75, // Stable but with character variation
      similarityBoost: 0.85, // High similarity for consistent Australian accent
      style: 0.6, // Expressive for storytelling but weathered
      speakerBoost: true
    }
  }
};

interface ElevenLabsConfig {
  apiKey: string;
  baseUrl: string;
  wsBaseUrl: string;
  defaultVoiceSettings: {
    stability: number;
    similarityBoost: number;
    style: number;
    speakerBoost: boolean;
  };
}

interface StreamOptions {
  voiceId: string;
  modelId?: string;
  voiceSettings?: {
    stability: number;
    similarityBoost: number;
    style?: number;
    speakerBoost?: boolean;
  };
  outputFormat?: 'mp3_44100_128' | 'pcm_16000' | 'pcm_22050' | 'pcm_24000' | 'pcm_44100';
  optimizeStreamingLatency?: number;
}

interface AudioQueueItem {
  audioData: ArrayBuffer;
  timestamp: number;
  duration?: number;
}

export class ElevenLabsTTSService extends EventEmitter {
  private config: ElevenLabsConfig;
  private websocket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private audioQueue: AudioQueueItem[] = [];
  private isPlaying: boolean = false;
  private currentSource: AudioBufferSourceNode | null = null;
  private nextPlayTime: number = 0;
  private streamBuffer: ArrayBuffer[] = [];
  private isConnected: boolean = false;

  constructor() {
    super();
    this.config = {
      apiKey: process.env.REACT_APP_ELEVENLABS_API_KEY || '',
      baseUrl: 'https://api.elevenlabs.io/v1',
      wsBaseUrl: 'wss://api.elevenlabs.io/v1',
      defaultVoiceSettings: {
        stability: 0.75,
        similarityBoost: 0.85,
        style: 0.3,
        speakerBoost: true,
      },
    };
  }

  async initialize(): Promise<void> {
    try {
      // Validate API key is configured
      if (!this.config.apiKey) {
        throw new Error(
          'ElevenLabs API key is not configured. Please set REACT_APP_ELEVENLABS_API_KEY environment variable.'
        );
      }

      // Initialize audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Resume audio context if suspended (for browser autoplay policies)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.emit('initialized');
    } catch (error) {
      this.emit('error', { type: 'initialization', error });
      throw error;
    }
  }

  /**
   * Get voice configuration for a specific agent
   */
  getAgentVoiceConfig(agentId: string): StreamOptions | null {
    const agentConfig = (agentConfigs as any)[agentId];
    if (!agentConfig?.voiceConfig) {
      return null;
    }

    const { voiceId, stability, similarityBoost, style, speakerBoost } = agentConfig.voiceConfig;

    return {
      voiceId,
      voiceSettings: {
        stability,
        similarityBoost,
        style,
        speakerBoost,
      },
      modelId: 'eleven_turbo_v2',
      outputFormat: 'pcm_44100',
      optimizeStreamingLatency: 2, // Optimize for low latency
    };
  }

  /**
   * Stream text-to-speech with browser fallback
   */
  async streamTextToSpeech(text: string, agentId: string): Promise<void> {
    const voiceConfig = this.getAgentVoiceConfig(agentId);
    if (!voiceConfig) {
      throw new Error(`No voice configuration found for agent: ${agentId}`);
    }

    // Try ElevenLabs API first if we have a key
    if (this.config.apiKey) {
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.config.apiKey
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: voiceConfig.voiceSettings
          })
        });

        if (response.ok) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          
          audio.oncanplaythrough = () => {
            audio.play().catch(console.error);
          };
          
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            this.emit('stream-ended');
          };

          this.emit('stream-started');
          return;
        }
      } catch (error) {
        console.warn('ElevenLabs API failed, falling back to browser TTS:', error);
      }
    }

    // Fallback to browser's built-in text-to-speech
    console.log('Using browser TTS fallback for Old Tom');
    this.useBrowserTTS(text, agentId);
  }

  /**
   * Fallback to browser's built-in speech synthesis
   */
  private useBrowserTTS(text: string, agentId: string): void {
    if (!('speechSynthesis' in window)) {
      console.error('Browser does not support speech synthesis');
      this.emit('error', { type: 'browser-tts-not-supported' });
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure Old Tom's voice characteristics - 80-year-old Australian sea captain
    if (agentId === 'old-tom') {
      // Find the best voice for an old Australian sea captain
      const voices = window.speechSynthesis.getVoices();
      
      // First priority: Australian voices
      let oldTomVoice = voices.find(voice => 
        voice.lang.includes('en-AU') || // Australian English
        voice.name.toLowerCase().includes('australian') ||
        voice.name.toLowerCase().includes('aussie')
      );
      
      // Second priority: Older/gruff male English voices
      if (!oldTomVoice) {
        oldTomVoice = voices.find(voice => 
          (voice.lang.includes('en-GB') || voice.lang.includes('en-')) &&
          (voice.name.toLowerCase().includes('gordon') || // Often an older male voice
          voice.name.toLowerCase().includes('fred') ||   // Usually older/gruff
          voice.name.toLowerCase().includes('arthur') ||
          voice.name.toLowerCase().includes('male'))
        );
      }
      
      // Third priority: Any deep male voice
      if (!oldTomVoice) {
        oldTomVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('daniel') ||
          voice.name.toLowerCase().includes('david') ||
          voice.name.toLowerCase().includes('alex')
        );
      }
      
      if (oldTomVoice) {
        utterance.voice = oldTomVoice;
        console.log('Using voice for Old Tom:', oldTomVoice.name);
      }
      
      // Configure for 80-year-old sea captain
      utterance.pitch = 0.5;  // Much lower pitch - old and weathered
      utterance.rate = 0.6;   // Very slow, deliberate speech of an elder
      utterance.volume = 0.8; // Slightly quieter, not shouting
    } else {
      // Default voice settings for other characters
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      utterance.volume = 0.8;
    }

    utterance.onstart = () => {
      this.emit('stream-started');
    };

    utterance.onend = () => {
      this.emit('stream-ended');
    };

    utterance.onerror = (error) => {
      console.error('Browser TTS error:', error);
      this.emit('error', { type: 'browser-tts', error });
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Stop current playback
   */
  stopPlayback(): void {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = null;
    }

    this.audioQueue = [];
    this.streamBuffer = [];
    this.isPlaying = false;
    this.nextPlayTime = 0;

    this.emit('playback-stopped');
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stopPlayback();

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.removeAllListeners();
  }
}

// Export singleton instance
const elevenLabsTTSInstance = new ElevenLabsTTSService();
export default elevenLabsTTSInstance;

// Export class for testing
export { ElevenLabsTTSService as ElevenLabsTTS };