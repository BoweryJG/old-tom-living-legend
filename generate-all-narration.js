// Script to generate ALL Captain George Davidson narration segments
const fs = require('fs');
const path = require('path');

// Import the narration segments
const narrationData = require('./src/content/story/captainTomNarration.ts');

const HIGGS_URL = 'https://smola-higgs-audio-v2.hf.space';
const OUTPUT_DIR = './src/assets/audio/narration';

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateAudioSegment(segment, index) {
    console.log(`\n🎙️ Generating audio ${index + 1}/18: ${segment.id}`);
    console.log(`📝 Text preview: ${segment.text.substring(0, 80)}...`);
    
    try {
        const response = await fetch(`${HIGGS_URL}/run/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fn_index: 2,
                data: [
                    `Generate audio following instruction.\n\n<|scene_desc_start|>\nAudio is an elderly Australian sea captain, weathered voice, 80 years old, speaking slowly and deliberately with wisdom and warmth. Deep, gravelly voice with Australian accent.\n<|scene_desc_end|>`,
                    segment.text,
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
            }),
        });

        if (response.ok) {
            const result = await response.json();
            
            if (result.data && result.data[1]) {
                const audioPath = result.data[1];
                const audioUrl = typeof audioPath === 'object' && audioPath.path 
                    ? `${HIGGS_URL}/file=${audioPath.path}`
                    : `${HIGGS_URL}/file=${audioPath}`;
                
                // Download and save the audio file
                const audioResponse = await fetch(audioUrl);
                const buffer = await audioResponse.arrayBuffer();
                const outputPath = path.join(OUTPUT_DIR, `${segment.id}.mp3`);
                
                fs.writeFileSync(outputPath, Buffer.from(buffer));
                console.log(`✅ Saved: ${outputPath}`);
                
                return { id: segment.id, path: outputPath, url: audioUrl };
            }
        }
        
        throw new Error('Failed to generate audio');
    } catch (error) {
        console.error(`❌ Error for ${segment.id}:`, error.message);
        return null;
    }
}

async function generateAllNarration() {
    console.log('🚀 Starting full narration generation...');
    console.log('📊 Total segments: 18');
    
    // This would need the actual narration data imported properly
    // For now, showing the structure
    const segments = [
        { id: 'opening_wonder', text: "G'day there, little mate..." },
        // ... all 18 segments
    ];
    
    const audioMap = {};
    
    for (let i = 0; i < segments.length; i++) {
        const result = await generateAudioSegment(segments[i], i);
        
        if (result) {
            audioMap[result.id] = result.path;
        }
        
        // Wait 3 seconds between requests to avoid rate limits
        if (i < segments.length - 1) {
            console.log('⏳ Waiting 3 seconds...');
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
    
    // Save audio map
    const mapPath = path.join(OUTPUT_DIR, 'audioMap.json');
    fs.writeFileSync(mapPath, JSON.stringify(audioMap, null, 2));
    
    console.log('\n✅ Generation complete!');
    console.log(`📁 Audio files saved to: ${OUTPUT_DIR}`);
    console.log(`🗺️ Audio map saved to: ${mapPath}`);
}

// Check if fetch is available
if (typeof fetch === 'undefined') {
    console.log('❌ This script requires Node.js 18+ or node-fetch');
    console.log('Run: npm install node-fetch');
} else {
    generateAllNarration();
}