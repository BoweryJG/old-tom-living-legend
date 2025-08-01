// Hugging Face Higgs Audio Service for Old Tom's voice
interface HiggsAudioResponse {
  audio_url?: string;
  error?: string;
}

class HiggsAudioService {
  private baseUrl = 'https://smola-higgs-audio-v2.hf.space';
  
  async generateOldTomVoice(text: string): Promise<string | null> {
    try {
      // Use the correct Gradio API endpoint
      const predictData = {
        data: [
          `Generate audio following instruction.

<|scene_desc_start|>
Audio is an elderly Australian sea captain, weathered voice, 80 years old, speaking slowly and deliberately with wisdom and warmth. Deep, gravelly voice with Australian accent.
<|scene_desc_end|>`, // System prompt for Old Tom
          text, // Input text
          "en_man", // Voice preset - English male voice
          null, // No reference audio
          null, // No reference text
          1024, // Max completion tokens
          0.8, // Temperature - slightly lower for consistency
          0.95, // Top P
          50, // Top K
          { headers: ["stops"], data: [["<|end_of_text|>"], ["<|eot_id|>"]], metadata: null }, // Stop strings
          7, // RAS Window Length
          2, // RAS Max Num Repeat
        ],
        fn_index: 2,
      };

      console.log('Calling Gradio API with request:', JSON.stringify(predictData, null, 2));
      
      const response = await fetch(`${this.baseUrl}/gradio_api/call/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API call error:', errorText);
        throw new Error(`Failed to call API: ${response.status}`);
      }

      const result = await response.json();
      console.log('API response:', result);

      // The response should contain an event_id
      if (result.event_id) {
        // Now fetch the result using the event_id
        const resultResponse = await fetch(`${this.baseUrl}/gradio_api/call/predict/${result.event_id}`);
        
        if (!resultResponse.ok) {
          throw new Error(`Failed to get result: ${resultResponse.status}`);
        }

        // Read the stream
        const reader = resultResponse.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        let audioUrl = null;
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.trim().startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                console.log('Stream data:', data);
                
                if (data[1] && data[1].path) {
                  // Audio file path returned
                  audioUrl = `${this.baseUrl}/file=${data[1].path}`;
                } else if (data[1] && typeof data[1] === 'string') {
                  // Direct audio URL or base64
                  if (data[1].startsWith('http') || data[1].includes('base64')) {
                    audioUrl = data[1];
                  } else {
                    audioUrl = `${this.baseUrl}/file=${data[1]}`;
                  }
                }
              } catch (e) {
                console.error('Error parsing stream data:', e);
              }
            }
          }
        }

        return audioUrl;
      } else {
        console.error('No event_id in response');
        return null;
      }
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