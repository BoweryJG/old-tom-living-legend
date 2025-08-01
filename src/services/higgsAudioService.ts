// Hugging Face Higgs Audio Service for Old Tom's voice
interface HiggsAudioResponse {
  audio_url?: string;
  error?: string;
}

class HiggsAudioService {
  private baseUrl = 'https://smola-higgs-audio-v2.hf.space';
  
  async generateOldTomVoice(text: string): Promise<string | null> {
    try {
      // Direct prediction endpoint
      const response = await fetch(`${this.baseUrl}/run/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [
            `Generate audio following instruction.

<|scene_desc_start|>
Audio is an elderly Australian sea captain, weathered voice, 80 years old, speaking slowly and deliberately with wisdom and warmth. Deep, gravelly voice with Australian accent.
<|scene_desc_end|>`, // System prompt
            text, // Input text
            "en_man", // Voice preset
            null, // No reference audio
            null, // No reference text
            1024, // Max completion tokens
            0.8, // Temperature
            0.95, // Top P
            50, // Top K
            { headers: ["stops"], data: [["<|end_of_text|>"], ["<|eot_id|>"]], metadata: null }, // Stop strings
            7, // RAS Window Length
            2, // RAS Max Num Repeat
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('API response:', result);

      // Check if we have audio data in the response
      if (result.data && result.data[1]) {
        const audioData = result.data[1];
        
        // Handle different response formats
        if (typeof audioData === 'object' && audioData.path) {
          return `${this.baseUrl}/file=${audioData.path}`;
        } else if (typeof audioData === 'string') {
          if (audioData.startsWith('http') || audioData.includes('base64')) {
            return audioData;
          } else {
            return `${this.baseUrl}/file=${audioData}`;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error generating Old Tom voice:', error);
      return null;
    }
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