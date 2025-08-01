// Hugging Face Higgs Audio Service for Old Tom's voice
interface HiggsAudioResponse {
  audio_url?: string;
  error?: string;
}

class HiggsAudioService {
  private baseUrl = 'https://smola-higgs-audio-v2.hf.space';
  
  async generateOldTomVoice(text: string): Promise<string | null> {
    try {
      // Step 1: Submit the request to the queue
      const joinData = {
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
        event_data: null,
        fn_index: 2,
        trigger_id: 22,
        session_hash: Math.random().toString(36).substring(7),
      };

      console.log('Joining queue with request:', JSON.stringify(joinData, null, 2));
      
      const joinResponse = await fetch(`${this.baseUrl}/queue/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(joinData),
      });

      if (!joinResponse.ok) {
        const errorText = await joinResponse.text();
        console.error('Queue join error:', errorText);
        throw new Error(`Failed to join queue: ${joinResponse.status}`);
      }

      const eventId = await joinResponse.json();
      console.log('Queue event ID:', eventId);

      // Step 2: Get the data using SSE
      return new Promise((resolve) => {
        const eventSource = new EventSource(`${this.baseUrl}/queue/data?session_hash=${joinData.session_hash}`);
        
        eventSource.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          console.log('SSE message:', msg);
          
          if (msg.msg === 'process_completed') {
            eventSource.close();
            
            if (msg.success && msg.output && msg.output.data && msg.output.data[1]) {
              const audioData = msg.output.data[1];
              
              // Handle different response types
              if (audioData.name) {
                resolve(`${this.baseUrl}/file=${audioData.name}`);
              } else if (typeof audioData === 'string' && audioData.startsWith('/tmp/')) {
                resolve(`${this.baseUrl}/file=${audioData}`);
              } else if (typeof audioData === 'string' && audioData.includes('base64')) {
                resolve(audioData);
              } else {
                console.error('Unknown audio data format:', audioData);
                resolve(null);
              }
            } else {
              console.error('No audio data in response');
              resolve(null);
            }
          } else if (msg.msg === 'process_error') {
            console.error('Process error:', msg);
            eventSource.close();
            resolve(null);
          }
        };

        eventSource.onerror = (error) => {
          console.error('SSE error:', error);
          eventSource.close();
          resolve(null);
        };
      });
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