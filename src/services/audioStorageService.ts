/**
 * Audio Storage Service
 * Handles audio generation, caching, and storage in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { higgsAudioService } from './higgsAudioService';
import { captainTomNarration } from '../content/story/captainTomNarration';

// Initialize Supabase client with error handling
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Only create client if we have valid credentials
let supabase: any = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
  }
} else {
  console.warn('Supabase credentials not found - audio storage will be disabled');
}

const STORAGE_BUCKET = 'old-tom-audio';
const AUDIO_SCHEMA = 'old_tom';
const SCRIPTS_TABLE = 'narration_scripts';
const AUDIO_TABLE = 'audio_files';
const CACHE_TABLE = 'audio_cache';

interface AudioCacheEntry {
  segment_id: string;
  audio_url: string;
  generated_at: string;
  duration?: number;
}

class AudioStorageService {
  private localCache: Map<string, string> = new Map();
  private generationQueue: Map<string, Promise<string | null>> = new Map();

  /**
   * Initialize the service - create bucket and table if needed
   */
  async initialize() {
    if (!supabase) {
      console.warn('AudioStorageService: Skipping initialization - no Supabase client');
      return;
    }
    
    try {
      // Create storage bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some((b: { name: string }) => b.name === STORAGE_BUCKET);
      
      if (!bucketExists) {
        await supabase.storage.createBucket(STORAGE_BUCKET, {
          public: true,
          fileSizeLimit: 10485760, // 10MB limit per audio file
        });
        console.log('✅ Created storage bucket:', STORAGE_BUCKET);
      }

      // Verify schema and tables exist
      const { data: scripts } = await supabase
        .from(`${AUDIO_SCHEMA}.${SCRIPTS_TABLE}`)
        .select('count')
        .limit(1);
      
      if (!scripts) {
        console.log('ℹ️ Run the SQL setup script to create tables in Supabase');
      }

      console.log('✅ Audio storage service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize audio storage:', error);
    }
  }

  /**
   * Get audio URL for a segment - generate if needed
   */
  async getAudioForSegment(segmentId: string): Promise<string | null> {
    console.log(`🎵 Getting audio for segment: ${segmentId}`);

    // Check local cache first
    if (this.localCache.has(segmentId)) {
      console.log('✅ Found in local cache');
      return this.localCache.get(segmentId)!;
    }

    // Check if already generating
    if (this.generationQueue.has(segmentId)) {
      console.log('⏳ Already generating, waiting...');
      return this.generationQueue.get(segmentId)!;
    }

    // Check Supabase cache
    const cachedUrl = await this.checkSupabaseCache(segmentId);
    if (cachedUrl) {
      console.log('✅ Found in Supabase cache');
      this.localCache.set(segmentId, cachedUrl);
      return cachedUrl;
    }

    // Generate new audio
    const generationPromise = this.generateAndStore(segmentId);
    this.generationQueue.set(segmentId, generationPromise);

    try {
      const url = await generationPromise;
      this.generationQueue.delete(segmentId);
      return url;
    } catch (error) {
      this.generationQueue.delete(segmentId);
      throw error;
    }
  }

  /**
   * Check if audio exists in Supabase cache
   */
  private async checkSupabaseCache(segmentId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from(`${AUDIO_SCHEMA}.${AUDIO_TABLE}`)
        .select('public_url, storage_path')
        .eq('segment_id', segmentId)
        .single();

      if (error || !data) return null;

      // Verify the file still exists
      const { data: file } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(data.storage_path);

      if (file) {
        // Update last accessed timestamp
        await supabase
          .from(`${AUDIO_SCHEMA}.${AUDIO_TABLE}`)
          .update({ last_accessed: new Date().toISOString() })
          .eq('segment_id', segmentId);
          
        return data.public_url;
      } else {
        // File was deleted, remove from cache
        await supabase
          .from(`${AUDIO_SCHEMA}.${AUDIO_TABLE}`)
          .delete()
          .eq('segment_id', segmentId);
        return null;
      }
    } catch (error) {
      console.error('Cache check error:', error);
      return null;
    }
  }

  /**
   * Generate audio and store in Supabase
   */
  private async generateAndStore(segmentId: string): Promise<string | null> {
    console.log(`🎙️ Generating audio for: ${segmentId}`);
    const startTime = Date.now();

    // Find the segment
    const segment = captainTomNarration.find(s => s.id === segmentId);
    if (!segment) {
      console.error('❌ Segment not found:', segmentId);
      return null;
    }

    try {
      // Generate audio using Higgs
      const audioUrl = await higgsAudioService.generateOldTomVoice(segment.text);
      if (!audioUrl) {
        throw new Error('Failed to generate audio');
      }

      // Download the audio
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      
      // Upload to Supabase Storage with organized path
      const storagePath = `narration/${segmentId}.mp3`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, blob, {
          contentType: 'audio/mpeg',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(storagePath);

      // Calculate file size
      const fileSize = blob.size;

      // Save to audio files table
      await supabase.from(`${AUDIO_SCHEMA}.${AUDIO_TABLE}`).upsert({
        segment_id: segmentId,
        storage_path: storagePath,
        public_url: publicUrl,
        file_size_bytes: fileSize,
        generation_method: 'higgs',
        generation_time_ms: Date.now() - startTime,
        voice_settings: {
          voice: 'en_man',
          temperature: 0.8,
          style: 'elderly_australian_captain'
        },
        generated_at: new Date().toISOString(),
      });

      // Update local cache
      this.localCache.set(segmentId, publicUrl);

      console.log(`✅ Audio generated and stored: ${publicUrl}`);
      return publicUrl;

    } catch (error) {
      console.error(`❌ Failed to generate/store audio for ${segmentId}:`, error);
      return null;
    }
  }

  /**
   * Preload audio for upcoming segments
   */
  async preloadSegments(segmentIds: string[]) {
    console.log(`📥 Preloading ${segmentIds.length} segments...`);
    
    // Load in parallel but limit concurrency
    const batchSize = 3;
    for (let i = 0; i < segmentIds.length; i += batchSize) {
      const batch = segmentIds.slice(i, i + batchSize);
      await Promise.all(batch.map(id => this.getAudioForSegment(id)));
    }
  }

  /**
   * Get all cached audio URLs
   */
  async getAllCachedAudio(): Promise<Record<string, string>> {
    try {
      const { data, error } = await supabase
        .from(`${AUDIO_SCHEMA}.${AUDIO_TABLE}`)
        .select('segment_id, public_url');

      if (error) throw error;

      const audioMap: Record<string, string> = {};
      data?.forEach((entry: { segment_id: string; public_url: string }) => {
        audioMap[entry.segment_id] = entry.public_url;
      });

      return audioMap;
    } catch (error) {
      console.error('Failed to get cached audio:', error);
      return {};
    }
  }

  /**
   * Create the cache table
   */
  private async createCacheTable() {
    // This would normally be done via Supabase migrations
    // For now, we'll handle missing table gracefully
    console.log('Note: audio_cache table should be created in Supabase:');
    console.log(`
      CREATE TABLE audio_cache (
        segment_id TEXT PRIMARY KEY,
        audio_url TEXT NOT NULL,
        generated_at TIMESTAMP DEFAULT NOW(),
        duration FLOAT
      );
    `);
  }

  /**
   * Clear all cached audio (admin function)
   */
  async clearCache() {
    try {
      // Delete all files from storage
      const { data: files } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list();

      if (files) {
        const filePaths = files.map((f: { name: string }) => f.name);
        await supabase.storage
          .from(STORAGE_BUCKET)
          .remove(filePaths);
      }

      // Clear cache table
      await supabase.from(CACHE_TABLE).delete().neq('segment_id', '');

      // Clear local cache
      this.localCache.clear();

      console.log('✅ Cache cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
}

export const audioStorageService = new AudioStorageService();