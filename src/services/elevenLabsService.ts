// ElevenLabs Text-to-Speech Service for realistic Old Tom voice
interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  modelId?: string;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

class ElevenLabsService {
  private apiKey: string;
  private voiceId: string;
  private modelId: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    // You'll need to add your ElevenLabs API key here
    // Get one from https://elevenlabs.io
    this.apiKey = process.env.REACT_APP_ELEVENLABS_API_KEY || '';
    
    // Voice ID for Old Tom - you can create a custom voice or use a preset
    // Some good preset options:
    // - 'IKne3meq5aSn9XLyUdCD' - Deep male voice
    // - 'TX3LPaxmHKxFdv7VOQHJ' - Older male voice
    this.voiceId = process.env.REACT_APP_ELEVENLABS_VOICE_ID || 'TX3LPaxmHKxFdv7VOQHJ';
    
    // Model ID - 'eleven_monolingual_v1' or 'eleven_multilingual_v2'
    this.modelId = 'eleven_monolingual_v1';
  }

  async generateOldTomVoice(text: string): Promise<string | null> {
    if (!this.apiKey) {
      console.error('❌ ElevenLabs API key not configured');
      return null;
    }

    console.log('🎙️ Generating Old Tom voice with ElevenLabs...');

    try {
      // Voice settings for Old Tom - weathered, gravelly sea captain
      const voiceSettings: VoiceSettings = {
        stability: 0.65, // Lower for more expressive, weathered voice
        similarity_boost: 0.75, // Balance between consistency and expressiveness
        style: 0.3, // Add some style variation for character
        use_speaker_boost: true // Enhance voice clarity
      };

      // Add natural pauses for elderly speech pattern
      const modifiedText = text
        .replace(/\. /g, '... ')
        .replace(/\, /g, ', ... ')
        .replace(/Old Tom/g, 'Old Tom... ');

      const response = await fetch(`${this.baseUrl}/text-to-speech/${this.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: modifiedText,
          model_id: this.modelId,
          voice_settings: voiceSettings,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ ElevenLabs API error:', response.status, error);
        
        // Common error handling
        if (response.status === 401) {
          console.error('Invalid API key - please check your ElevenLabs configuration');
        } else if (response.status === 422) {
          console.error('Invalid voice ID or settings');
        } else if (response.status === 429) {
          console.error('Rate limit exceeded - too many requests');
        }
        
        return null;
      }

      // Convert the audio stream to a blob URL
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log('✅ ElevenLabs audio generated successfully');
      return audioUrl;

    } catch (error) {
      console.error('❌ Error generating ElevenLabs voice:', error);
      return null;
    }
  }

  // Get available voices (useful for testing)
  async getVoices() {
    if (!this.apiKey) {
      console.error('❌ ElevenLabs API key not configured');
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`);
      }

      const data = await response.json();
      return data.voices;
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      return [];
    }
  }

  // Get user subscription info (to check usage limits)
  async getSubscriptionInfo() {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/user/subscription`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subscription: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching subscription info:', error);
      return null;
    }
  }
}

export const elevenLabsService = new ElevenLabsService();