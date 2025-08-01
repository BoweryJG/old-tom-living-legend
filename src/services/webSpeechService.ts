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

        // Get available voices (may need to wait for them to load)
        let voices = this.synthesis.getVoices();
        
        // If voices aren't loaded yet, wait for them
        if (voices.length === 0) {
          this.synthesis.addEventListener('voiceschanged', () => {
            voices = this.synthesis.getVoices();
          }, { once: true });
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice parameters for Old Tom - weathered sea captain
        utterance.rate = 0.65; // Even slower for ancient mariner
        utterance.pitch = 0.3; // Very deep, gravelly voice
        utterance.volume = 0.85; // Slightly lower volume for aged voice
        
        // Voice selection priority for Old Tom
        const voicePriorities = [
          // First priority: Australian male voices
          (v: SpeechSynthesisVoice) => v.lang === 'en-AU' && v.name.toLowerCase().includes('male'),
          (v: SpeechSynthesisVoice) => v.lang === 'en-AU',
          
          // Second priority: British/UK male voices (similar accent)
          (v: SpeechSynthesisVoice) => v.lang === 'en-GB' && v.name.toLowerCase().includes('male'),
          (v: SpeechSynthesisVoice) => v.lang === 'en-GB',
          
          // Third priority: Any English male voice
          (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && v.name.toLowerCase().includes('male'),
          
          // Fourth priority: Specific voice names that sound good
          (v: SpeechSynthesisVoice) => ['daniel', 'gordon', 'bruce', 'fred'].some(name => 
            v.name.toLowerCase().includes(name)
          ),
          
          // Last resort: Any English voice
          (v: SpeechSynthesisVoice) => v.lang.startsWith('en'),
        ];

        // Find the best voice based on priorities
        let selectedVoice: SpeechSynthesisVoice | null = null;
        for (const priorityCheck of voicePriorities) {
          selectedVoice = voices.find(priorityCheck) || null;
          if (selectedVoice) break;
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log(`🎙️ Selected voice: ${selectedVoice.name} (${selectedVoice.lang})`);
          
          // Adjust parameters based on specific voices
          if (selectedVoice.name.toLowerCase().includes('daniel')) {
            utterance.pitch = 0.25; // Daniel voice sounds better even lower
            utterance.rate = 0.6;
          } else if (selectedVoice.name.toLowerCase().includes('karen')) {
            utterance.pitch = 0.2; // Female voices need much lower pitch
            utterance.rate = 0.55;
          } else if (selectedVoice.name.toLowerCase().includes('alex')) {
            utterance.pitch = 0.25;
            utterance.rate = 0.6;
          }
        } else if (voices.length > 0) {
          // Absolute fallback
          utterance.voice = voices[0];
          console.log(`🎙️ Fallback voice: ${voices[0].name}`);
        }

        // Add more dramatic pauses and speech patterns
        const modifiedText = text
          .replace(/\. /g, '... ... ')
          .replace(/\, /g, ', ... ')
          .replace(/Old Tom/g, '... Old Tom... ')
          .replace(/years/g, 'years... ')
          .replace(/whale/gi, '... whale... ')
          .replace(/sea/gi, '... sea... ')
          .replace(/Eden/g, '... Eden... ')
          .replace(/! /g, '! ... ... ')
          .replace(/\? /g, '? ... ... ');

        utterance.text = modifiedText;

        utterance.onstart = () => {
          console.log('🗣️ Old Tom begins to speak...');
        };

        utterance.onend = () => {
          console.log('✅ Old Tom finished speaking');
          resolve();
        };

        utterance.onerror = (event) => {
          console.error('❌ Web Speech error:', event);
          reject(event);
        };

        console.log('🎤 Voice parameters:', {
          rate: utterance.rate,
          pitch: utterance.pitch,
          volume: utterance.volume,
          voice: utterance.voice?.name || 'default'
        });

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

  // Log all available voices to console
  logAvailableVoices(): void {
    const voices = this.synthesis.getVoices();
    console.log('🎤 Available voices:', voices.length);
    voices.forEach((voice, index) => {
      console.log(`${index}: ${voice.name} (${voice.lang}) ${voice.localService ? 'LOCAL' : 'REMOTE'}`);
    });
  }
}

export const webSpeechService = new WebSpeechService();