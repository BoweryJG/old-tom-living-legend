/**
 * Script to upload Captain George Davidson's narration scripts to Supabase
 * This populates the old_tom.narration_scripts table
 */

const { createClient } = require('@supabase/supabase-js');
const { captainTomNarration } = require('../src/content/story/captainTomNarration');

// Initialize Supabase client
const supabaseUrl = 'https://alkzliirqdofpygknsij.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsa3psaWlycWRvZnB5Z2tuc2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3OTE4NDQsImV4cCI6MjAyOTM2Nzg0NH0.fJJtKzj2k7i9XLLAwCT5GEH1E3Kpqs_odGts9Vpp7lE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadNarrationScripts() {
  console.log('📚 Uploading narration scripts to Supabase...');
  
  try {
    // First, check if scripts already exist
    const { data: existing } = await supabase
      .from('old_tom.narration_scripts')
      .select('segment_id');
    
    if (existing && existing.length > 0) {
      console.log(`ℹ️  Found ${existing.length} existing scripts`);
      const existingIds = existing.map(s => s.segment_id);
      
      // Filter out existing scripts
      const newScripts = captainTomNarration.filter(
        segment => !existingIds.includes(segment.id)
      );
      
      if (newScripts.length === 0) {
        console.log('✅ All scripts already uploaded!');
        return;
      }
      
      console.log(`📤 Uploading ${newScripts.length} new scripts...`);
    }
    
    // Prepare scripts for upload
    const scriptsToUpload = captainTomNarration.map((segment, index) => ({
      segment_id: segment.id,
      chapter: segment.chapter,
      sequence_number: index + 1,
      text_content: segment.text,
      visual_description: segment.visualDescription,
      emotional_tone: segment.emotionalTone,
      soundscape: segment.soundscape,
      special_effects: segment.specialEffects
    }));
    
    // Upload in batches of 5
    const batchSize = 5;
    for (let i = 0; i < scriptsToUpload.length; i += batchSize) {
      const batch = scriptsToUpload.slice(i, i + batchSize);
      
      console.log(`📤 Uploading batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(scriptsToUpload.length/batchSize)}...`);
      
      const { data, error } = await supabase
        .from('old_tom.narration_scripts')
        .upsert(batch, { onConflict: 'segment_id' });
      
      if (error) {
        console.error('❌ Error uploading batch:', error);
        throw error;
      }
      
      console.log(`✅ Uploaded ${batch.length} scripts`);
    }
    
    // Verify upload
    const { data: final, error: countError } = await supabase
      .from('old_tom.narration_scripts')
      .select('segment_id, chapter, sequence_number');
    
    if (final) {
      console.log(`\n✅ Successfully uploaded! Total scripts in database: ${final.length}`);
      console.log('\nChapters:');
      const chapters = [...new Set(final.map(s => s.chapter))];
      chapters.forEach(chapter => {
        const count = final.filter(s => s.chapter === chapter).length;
        console.log(`  - ${chapter}: ${count} segments`);
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to upload scripts:', error);
    process.exit(1);
  }
}

// Run the upload
uploadNarrationScripts();