-- Supabase Setup for Old Tom Narration Audio Storage

-- Create the audio cache table
CREATE TABLE IF NOT EXISTS audio_cache (
    segment_id TEXT PRIMARY KEY,
    audio_url TEXT NOT NULL,
    generated_at TIMESTAMP DEFAULT NOW(),
    duration FLOAT,
    file_size INTEGER,
    generation_time_ms INTEGER
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_audio_cache_generated_at ON audio_cache(generated_at);

-- Create a view for audio statistics
CREATE VIEW audio_generation_stats AS
SELECT 
    COUNT(*) as total_segments,
    COUNT(CASE WHEN audio_url IS NOT NULL THEN 1 END) as generated_segments,
    AVG(generation_time_ms) as avg_generation_time_ms,
    SUM(file_size) as total_storage_bytes,
    MAX(generated_at) as last_generated_at
FROM audio_cache;

-- Storage bucket policy (run in Supabase dashboard)
-- This makes the bucket publicly readable
/*
INSERT INTO storage.buckets (id, name, public)
VALUES ('old-tom-narration', 'old-tom-narration', true)
ON CONFLICT (id) DO UPDATE SET public = true;
*/

-- RLS policies for audio_cache table
ALTER TABLE audio_cache ENABLE ROW LEVEL SECURITY;

-- Anyone can read audio URLs
CREATE POLICY "Anyone can read audio cache" ON audio_cache
    FOR SELECT USING (true);

-- Only service role can insert/update (for security)
CREATE POLICY "Service role can insert audio cache" ON audio_cache
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update audio cache" ON audio_cache
    FOR UPDATE USING (auth.role() = 'service_role');

-- Function to get audio generation progress
CREATE OR REPLACE FUNCTION get_audio_generation_progress()
RETURNS JSON AS $$
BEGIN
    RETURN json_build_object(
        'total_segments', 18,
        'generated_segments', (SELECT COUNT(*) FROM audio_cache),
        'percentage', ROUND((SELECT COUNT(*)::numeric FROM audio_cache) / 18 * 100, 2),
        'missing_segments', (
            SELECT array_agg(segment_id)
            FROM unnest(ARRAY[
                'opening_wonder', 'chapter1_stereotypes', 'chapter1_young_tom',
                'chapter2_george_intro', 'chapter2_the_moment', 'chapter2_first_trust',
                'chapter3_communication', 'chapter3_spreading_change',
                'chapter4_working_together', 'chapter4_tom_aging',
                'chapter5_stranger_arrives', 'chapter5_tom_leaves',
                'chapter6_georges_funeral', 'chapter6_final_respect',
                'chapter7_museum', 'chapter7_your_ripple'
            ]) AS segment_id
            WHERE segment_id NOT IN (SELECT segment_id FROM audio_cache)
        )
    );
END;
$$ LANGUAGE plpgsql;