// Quick test script to generate Captain Tom narration with Higgs Audio
const fetch = require('node-fetch');

const testNarration = `G'day there, little mate. Close your eyes for just a moment... Can you hear it? That's the sound of the ocean calling. My name's Captain Tom Davidson, and I'm going to tell you the most extraordinary true story you've ever heard.`;

async function testHiggsAudio() {
  console.log('🎙️ Testing Higgs Audio with Captain Tom narration...');
  
  const baseUrl = 'https://smola-higgs-audio-v2.hf.space';
  const sessionHash = Math.random().toString(36).substring(7);
  
  const requestData = {
    data: [
      `Generate audio following instruction.

<|scene_desc_start|>
Audio is an elderly Australian sea captain, weathered voice, 80 years old, speaking slowly and deliberately with wisdom and warmth. Deep, gravelly voice with Australian accent.
<|scene_desc_end|>`,
      testNarration,
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

  try {
    console.log('📤 Sending request to Higgs Audio...');
    
    const response = await fetch(`${baseUrl}/queue/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('📥 Response status:', response.status);
    const result = await response.text();
    console.log('📥 Response:', result);

    if (response.ok) {
      console.log('✅ Request sent! Waiting for audio generation...');
      console.log(`🔗 Session hash: ${sessionHash}`);
      console.log(`📡 Listen to SSE at: ${baseUrl}/queue/data?session_hash=${sessionHash}`);
    } else {
      console.error('❌ Failed to queue audio generation');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testHiggsAudio();