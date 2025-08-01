// Web Speech API Service for Old Tom's voice as a fallback
class WebSpeechService {
  private synthesis: SpeechSynthesis;
  private isSupported: boolean;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
  }

  async generateOldTomVoice(text: string): Promise<void> {
    if (!this.isSupported) {
      console.error('Web Speech API not supported in this browser');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice parameters for Old Tom
        utterance.rate = 0.85; // Slower for elderly character
        utterance.pitch = 0.7; // Lower pitch for gravelly voice
        utterance.volume = 1.0;
        
        // Try to find an Australian or British English voice
        const voices = this.synthesis.getVoices();
        const preferredVoices = voices.filter(voice => 
          voice.lang.includes('en-AU') || 
          voice.lang.includes('en-GB') ||
          voice.name.toLowerCase().includes('male')
        );
        
        if (preferredVoices.length > 0) {
          utterance.voice = preferredVoices[0];
        } else if (voices.length > 0) {
          // Fallback to any available voice
          utterance.voice = voices.find(v => v.lang.includes('en')) || voices[0];
        }

        utterance.onend = () => {
          console.log('✅ Web Speech playback completed');
          resolve();
        };

        utterance.onerror = (event) => {
          console.error('❌ Web Speech error:', event);
          reject(event);
        };

        console.log('🗣️ Starting Web Speech synthesis...');
        this.synthesis.speak(utterance);
      } catch (error) {
        console.error('Error in Web Speech synthesis:', error);
        reject(error);
      }
    });
  }

  stop() {
    if (this.isSupported) {
      this.synthesis.cancel();
    }
  }

  // Get available voices for debugging
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }
}

export const webSpeechService = new WebSpeechService();