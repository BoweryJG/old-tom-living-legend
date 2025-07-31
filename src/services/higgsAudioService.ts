// Hugging Face Higgs Audio Service for Old Tom's voice
interface HiggsAudioResponse {
  audio_url?: string;
  error?: string;
}

class HiggsAudioService {
  private baseUrl = 'https://smola-higgs-audio-v2.hf.space';
  
  async generateOldTomVoice(text: string): Promise<string | null> {
    try {
      // Use the API endpoint for generate_speech
      const response = await fetch(`${this.baseUrl}/run/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fn_index: 2, // generate_speech function
          data: [
            text, // Input text
            "en_man", // Voice preset - using English male voice
            null, // No reference audio
            null, // No reference text
            1024, // Max completion tokens
            0.8, // Temperature - slightly lower for consistency
            0.95, // Top P
            50, // Top K
            `Generate audio following instruction.
<|scene_desc_start|>
Audio is an elderly Australian sea captain, weathered voice, 80 years old, speaking slowly and deliberately with wisdom and warmth. Deep, gravelly voice with Australian accent.
<|scene_desc_end|>`, // System prompt for Old Tom
            { headers: ["stops"], data: [["<|end_of_text|>"], ["<|eot_id|>"]], metadata: null }, // Stop strings
            7, // RAS Window Length
            2, // RAS Max Num Repeat
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const result = await response.json();
      
      // The API returns [model_response, audio_file_path]
      if (result.data && result.data[1]) {
        // Convert the file path to a full URL
        return `${this.baseUrl}/file=${result.data[1]}`;
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
      // First, get the session hash
      const sessionResponse = await fetch(`${this.baseUrl}/api/predict/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fn_index: 2,
          session_hash: Math.random().toString(36).substring(7),
        }),
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session');
      }

      const sessionData = await sessionResponse.json();
      
      // Now make the actual prediction
      const predictResponse = await fetch(`${this.baseUrl}/api/predict/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
          event_data: null,
          fn_index: 2,
          session_hash: sessionData.session_hash,
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