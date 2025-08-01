// Hugging Face Higgs Audio Service for Old Tom's voice
interface HiggsAudioResponse {
  audio_url?: string;
  error?: string;
}

class HiggsAudioService {
  private baseUrl = 'https://smola-higgs-audio-v2.hf.space';
  
  async generateOldTomVoice(text: string): Promise<string | null> {
    try {
      // Use the correct API endpoint format
      const requestBody = {
        fn_index: 2,
        data: [
          text, // Input text
          "en_man", // Voice preset - English male voice
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
      };

      console.log('Sending request to Higgs API:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${this.baseUrl}/run/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`Failed to generate audio: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Higgs API response:', JSON.stringify(result, null, 2));
      
      // The API returns data array with [text_response, audio_data]
      if (result && result.data && result.data[1]) {
        // Check if it's a file path or base64 data
        const audioData = result.data[1];
        
        // If it's a file object with name property
        if (audioData.name) {
          return `${this.baseUrl}/file=${audioData.name}`;
        }
        // If it's a direct file path string
        else if (typeof audioData === 'string' && audioData.startsWith('/tmp/')) {
          return `${this.baseUrl}/file=${audioData}`;
        }
        // If it's base64 data
        else if (typeof audioData === 'string' && audioData.includes('base64')) {
          return audioData;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error generating Old Tom voice:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
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