/**
 * Script to generate audio files for Captain Tom's narration
 * This can be run to pre-generate all audio files or generate them on-demand
 */

import { captainTomNarration } from '../src/content/story/captainTomNarration';
import { higgsAudioService } from '../src/services/higgsAudioService';
import { elevenLabsService } from '../src/services/elevenLabsService';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const USE_ELEVENLABS = process.env.USE_ELEVENLABS === 'true';
const OUTPUT_DIR = path.join(__dirname, '../src/assets/audio/narration');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Generate audio for a single narration segment
 */
async function generateAudioForSegment(segment: typeof captainTomNarration[0], index: number) {
  console.log(`\n🎙️ Generating audio for segment ${index + 1}/${captainTomNarration.length}`);
  console.log(`📝 Chapter: ${segment.chapter}`);
  console.log(`🆔 ID: ${segment.id}`);
  console.log(`📄 Text preview: ${segment.text.substring(0, 100)}...`);

  try {
    let audioUrl: string | null = null;

    if (USE_ELEVENLABS) {
      console.log('🎯 Using ElevenLabs...');
      audioUrl = await elevenLabsService.generateOldTomVoice(segment.text);
    } else {
      console.log('🎯 Using Higgs Audio...');
      audioUrl = await higgsAudioService.generateOldTomVoice(segment.text);
    }

    if (audioUrl) {
      console.log('✅ Audio generated successfully!');
      
      // If it's a blob URL, we need to fetch and save it
      if (audioUrl.startsWith('blob:')) {
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();
        const outputPath = path.join(OUTPUT_DIR, `${segment.id}.mp3`);
        fs.writeFileSync(outputPath, Buffer.from(buffer));
        console.log(`💾 Saved to: ${outputPath}`);
      } else {
        // It's a regular URL, save the reference
        const audioMapPath = path.join(OUTPUT_DIR, 'audioMap.json');
        let audioMap: Record<string, string> = {};
        
        if (fs.existsSync(audioMapPath)) {
          audioMap = JSON.parse(fs.readFileSync(audioMapPath, 'utf-8'));
        }
        
        audioMap[segment.id] = audioUrl;
        fs.writeFileSync(audioMapPath, JSON.stringify(audioMap, null, 2));
        console.log(`🔗 URL saved to audioMap.json`);
      }
    } else {
      console.error('❌ Failed to generate audio for segment:', segment.id);
    }
  } catch (error) {
    console.error('❌ Error generating audio:', error);
  }
}

/**
 * Generate audio for all narration segments
 */
async function generateAllAudio() {
  console.log('🚀 Starting audio generation for Captain Tom narration...');
  console.log(`📊 Total segments: ${captainTomNarration.length}`);
  console.log(`🎯 Using: ${USE_ELEVENLABS ? 'ElevenLabs' : 'Higgs Audio'}`);

  // Generate audio for each segment with a delay to avoid rate limits
  for (let i = 0; i < captainTomNarration.length; i++) {
    await generateAudioForSegment(captainTomNarration[i], i);
    
    // Wait between requests to avoid rate limits
    if (i < captainTomNarration.length - 1) {
      console.log('⏳ Waiting 2 seconds before next request...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n✅ Audio generation complete!');
  console.log(`📁 Audio files saved to: ${OUTPUT_DIR}`);
}

/**
 * Generate audio for specific segments only
 */
async function generateAudioForChapter(chapter: string) {
  const segments = captainTomNarration.filter(s => s.chapter === chapter);
  console.log(`🎯 Generating audio for chapter: ${chapter}`);
  console.log(`📊 Found ${segments.length} segments`);

  for (let i = 0; i < segments.length; i++) {
    await generateAudioForSegment(segments[i], i);
    if (i < segments.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

if (command === 'all') {
  generateAllAudio();
} else if (command === 'chapter' && args[1]) {
  generateAudioForChapter(args[1]);
} else if (command === 'segment' && args[1]) {
  const segment = captainTomNarration.find(s => s.id === args[1]);
  if (segment) {
    generateAudioForSegment(segment, 0);
  } else {
    console.error('❌ Segment not found:', args[1]);
  }
} else {
  console.log(`
🎙️ Captain Tom Narration Audio Generator

Usage:
  npm run generate-audio all              - Generate audio for all segments
  npm run generate-audio chapter <name>   - Generate audio for specific chapter
  npm run generate-audio segment <id>     - Generate audio for specific segment

Available chapters:
${[...new Set(captainTomNarration.map(s => s.chapter))].map(c => `  - ${c}`).join('\n')}

Environment variables:
  USE_ELEVENLABS=true  - Use ElevenLabs instead of Higgs Audio
  `);
}

export { generateAudioForSegment, generateAllAudio, generateAudioForChapter };