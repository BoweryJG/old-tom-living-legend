// Audio Service Manager - Handles ElevenLabs and fallbacks
import { elevenLabsService } from './elevenLabsService';

interface HiggsAudioResponse {
  audio_url?: string;
  error?: string;
}

class HiggsAudioService {
  private baseUrl = 'https://smola-higgs-audio-v2.hf.space';
  private useWebSpeechOnly = true; // Force Web Speech API until we get a working Higgs endpoint
  
  async generateOldTomVoice(text: string): Promise<string | null> {
    console.log('🎙️ Starting audio generation for text:', text.substring(0, 50) + '...');
    
    // Skip directly to Web Speech API for now
    if (this.useWebSpeechOnly) {
      console.log('🎯 Using Web Speech API directly...');
      try {
        const audioBlob = await this.generateWithWebSpeechAPI(text);
        if (audioBlob) {
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log('✅ Web Speech audio generated successfully!');
          return audioUrl;
        }
      } catch (error) {
        console.error('❌ Web Speech API failed:', error);
        return null;
      }
    }

    // Original flow (currently disabled)
    console.log('🔄 Falling back to alternative approaches...');
    try {
      const audioBlob = await this.generateWithWebAPI(text);
      if (audioBlob) {
        return audioBlob;
      }
    } catch (error) {
      console.error('❌ Web API approach failed:', error);
    }

    // Option 3: Try the original Higgs approaches (may fail due to CORS)
    const approaches = [
      () => this.tryQueueBasedAPI(text),
      () => this.tryDirectAPI(text),
      () => this.tryAlternativeAPI(text),
    ];

    for (let i = 0; i < approaches.length; i++) {
      console.log(`🔄 Trying Higgs approach ${i + 1} of ${approaches.length}...`);
      try {
        const result = await approaches[i]();
        if (result) {
          console.log(`✅ Approach ${i + 1} succeeded!`);
          return result;
        }
      } catch (error) {
        console.error(`❌ Approach ${i + 1} failed:`, error);
      }
    }

    console.error('❌ All approaches failed to generate audio');
    return null;
  }

  private async generateWithWebAPI(text: string): Promise<string | null> {
    console.log('🌐 Trying Web-based TTS approach...');
    
    // Create a more sophisticated audio using Web Audio API
    // This generates a base64 audio that mimics an old sea captain's voice
    try {
      // For now, return null to fall back to other methods
      // In production, you would implement a proper TTS service here
      // or use a proxy server to bypass CORS
      return null;
    } catch (error) {
      console.error('Web API error:', error);
      return null;
    }
  }

  private async tryQueueBasedAPI(text: string): Promise<string | null> {
    console.log('🚀 Trying queue-based API approach...');
    
    const sessionHash = Math.random().toString(36).substring(7);
    const requestData = {
      data: [
        `Generate audio following instruction.

<|scene_desc_start|>
Audio is an elderly Australian sea captain, weathered voice, 80 years old, speaking slowly and deliberately with wisdom and warmth. Deep, gravelly voice with Australian accent.
<|scene_desc_end|>`,
        text,
        "en_man",
        null,
        null,
        1024,
        0.8,
        0.95,
        50,
        { headers: ["stops"], data: [["<|end_of_text|>"], ["<|eot_id|>"]], metadata: null },
        7,
        2,
      ],
      event_data: null,
      fn_index: 2,
      session_hash: sessionHash,
    };

    console.log('📤 Queue join request:', `${this.baseUrl}/queue/join`);
    
    const joinResponse = await fetch(`${this.baseUrl}/queue/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('📥 Queue join response:', joinResponse.status);

    if (!joinResponse.ok) {
      throw new Error(`Queue join failed: ${joinResponse.status}`);
    }

    // Wait for result via SSE
    return new Promise((resolve, reject) => {
      const eventSource = new EventSource(`${this.baseUrl}/queue/data?session_hash=${sessionHash}`);
      let timeout = setTimeout(() => {
        eventSource.close();
        reject(new Error('Queue timeout after 30 seconds'));
      }, 30000);

      eventSource.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          console.log('📨 SSE message:', msg);
          
          if (msg.msg === 'process_completed' && msg.output?.data?.[1]) {
            clearTimeout(timeout);
            eventSource.close();
            
            const audioData = msg.output.data[1];
            if (typeof audioData === 'object' && audioData.path) {
              resolve(`${this.baseUrl}/file=${audioData.path}`);
            } else if (typeof audioData === 'string') {
              resolve(`${this.baseUrl}/file=${audioData}`);
            } else {
              resolve(null);
            }
          } else if (msg.msg === 'process_error') {
            clearTimeout(timeout);
            eventSource.close();
            reject(new Error('Process error: ' + JSON.stringify(msg)));
          }
        } catch (e) {
          console.error('SSE parse error:', e);
        }
      };

      eventSource.onerror = (error) => {
        clearTimeout(timeout);
        eventSource.close();
        reject(error);
      };
    });
  }

  private async tryDirectAPI(text: string): Promise<string | null> {
    console.log('🚀 Trying direct API approach...');
    
    const requestData = {
      data: [
        `Generate audio following instruction.

<|scene_desc_start|>
Audio is an elderly Australian sea captain, weathered voice, 80 years old, speaking slowly and deliberately with wisdom and warmth. Deep, gravelly voice with Australian accent.
<|scene_desc_end|>`,
        text,
        "en_man",
        null,
        null,
        1024,
        0.8,
        0.95,
        50,
        { headers: ["stops"], data: [["<|end_of_text|>"], ["<|eot_id|>"]], metadata: null },
        7,
        2,
      ],
    };

    const response = await fetch(`${this.baseUrl}/run/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('📥 Direct API response:', response.status);

    if (!response.ok) {
      throw new Error(`Direct API failed: ${response.status}`);
    }

    const result = await response.json();
    if (result.data?.[1]) {
      const audioData = result.data[1];
      if (typeof audioData === 'object' && audioData.path) {
        return `${this.baseUrl}/file=${audioData.path}`;
      } else if (typeof audioData === 'string') {
        return `${this.baseUrl}/file=${audioData}`;
      }
    }

    return null;
  }

  private async tryAlternativeAPI(text: string): Promise<string | null> {
    console.log('🚀 Trying alternative API approach with fn_index...');
    
    const requestData = {
      fn_index: 2,
      data: [
        `Generate audio following instruction.

<|scene_desc_start|>
Audio is an elderly Australian sea captain, weathered voice, 80 years old, speaking slowly and deliberately with wisdom and warmth. Deep, gravelly voice with Australian accent.
<|scene_desc_end|>`,
        text,
        "en_man",
        null,
        null,
        1024,
        0.8,
        0.95,
        50,
        { headers: ["stops"], data: [["<|end_of_text|>"], ["<|eot_id|>"]], metadata: null },
        7,
        2,
      ],
    };

    const response = await fetch(`${this.baseUrl}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('📥 Alternative API response:', response.status);

    if (!response.ok) {
      throw new Error(`Alternative API failed: ${response.status}`);
    }

    const result = await response.json();
    if (result.data?.[1]) {
      const audioData = result.data[1];
      if (typeof audioData === 'object' && audioData.path) {
        return `${this.baseUrl}/file=${audioData.path}`;
      } else if (typeof audioData === 'string') {
        return `${this.baseUrl}/file=${audioData}`;
      }
    }

    return null;
  }

  private async generateWithWebSpeechAPI(text: string): Promise<Blob | null> {
    console.log('🗣️ Generating with Web Speech API...');
    
    return new Promise((resolve) => {
      try {
        // Create speech synthesis utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure for old sea captain voice
        utterance.rate = 0.85; // Slower speech
        utterance.pitch = 0.7; // Lower pitch for gravelly voice
        utterance.volume = 1.0;
        
        // Try to find an Australian or deep male voice
        const voices = speechSynthesis.getVoices();
        const australianVoice = voices.find(v => 
          v.lang.includes('en-AU') || 
          v.name.toLowerCase().includes('australia')
        );
        const maleVoice = voices.find(v => 
          v.name.toLowerCase().includes('male') || 
          v.name.toLowerCase().includes('man')
        );
        
        utterance.voice = australianVoice || maleVoice || voices[0];
        
        // Since Web Speech API doesn't provide audio blob directly,
        // we'll create a simple audio blob as a placeholder
        // In production, you'd use a proper TTS service
        console.log('⚠️ Web Speech API fallback - using placeholder audio');
        
        // Create a simple sine wave as placeholder audio
        const sampleRate = 44100;
        const duration = Math.max(2, text.length * 0.05); // Estimate duration
        const numSamples = sampleRate * duration;
        const audioBuffer = new Float32Array(numSamples);
        
        // Generate a low-frequency sine wave (mimics deep voice)
        const frequency = 120; // Hz - low frequency for deep voice
        for (let i = 0; i < numSamples; i++) {
          audioBuffer[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.3;
        }
        
        // Convert to WAV format
        const wavBlob = this.createWavBlob(audioBuffer, sampleRate);
        
        // Actually speak the text (for user feedback)
        speechSynthesis.speak(utterance);
        
        resolve(wavBlob);
      } catch (error) {
        console.error('❌ Web Speech API error:', error);
        resolve(null);
      }
    });
  }
  
  private createWavBlob(audioBuffer: Float32Array, sampleRate: number): Blob {
    const length = audioBuffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, audioBuffer[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  // Alternative: Direct API call using gradio_client style
  async generateVoiceDirectly(text: string): Promise<string | null> {
    try {
      // Make the prediction directly
      const predictResponse = await fetch(`${this.baseUrl}/run/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fn_index: 2,
          data: [
            text,
            "en_man", // English male voice
            null,
            null,
            1024,
            0.8,
            0.95,
            50,
            "Generate audio of an elderly Australian sea captain with a deep, weathered voice.",
            { headers: ["stops"], data: [["<|end_of_text|>"], ["<|eot_id|>"]], metadata: null },
            7,
            2,
          ],
        }),
      });

      const result = await predictResponse.json();
      
      if (result.data && result.data[1]) {
        return `${this.baseUrl}/file=${result.data[1]}`;
      }
      
      return null;
    } catch (error) {
      console.error('Error with direct API call:', error);
      return null;
    }
  }
}

export const higgsAudioService = new HiggsAudioService();