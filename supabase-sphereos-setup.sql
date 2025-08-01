-- Old Tom Audio Storage Setup for Sphere OS Supabase
-- Creates a separate schema to keep it organized from other projects

-- Create a dedicated schema for Old Tom project
CREATE SCHEMA IF NOT EXISTS old_tom;

-- Set search path to include the new schema
SET search_path TO old_tom, public;

-- 1. Table for storing narration scripts/text
CREATE TABLE IF NOT EXISTS old_tom.narration_scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_id TEXT UNIQUE NOT NULL, -- e.g., 'opening_wonder', 'chapter1_stereotypes'
    chapter TEXT NOT NULL,
    sequence_number INTEGER NOT NULL,
    narrator_name TEXT DEFAULT 'Captain George Davidson',
    text_content TEXT NOT NULL,
    visual_description TEXT,
    emotional_tone TEXT CHECK (emotional_tone IN ('wonder', 'exciting', 'gentle', 'mysterious', 'heartwarming', 'bittersweet', 'inspiring')),
    soundscape JSONB DEFAULT '[]'::jsonb, -- Array of sound effects
    special_effects JSONB DEFAULT '[]'::jsonb, -- Array of visual effects
    word_count INTEGER GENERATED ALWAYS AS (array_length(string_to_array(text_content, ' '), 1)) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table for audio file metadata and caching
CREATE TABLE IF NOT EXISTS old_tom.audio_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_id TEXT UNIQUE NOT NULL REFERENCES old_tom.narration_scripts(segment_id),
    storage_bucket TEXT DEFAULT 'old-tom-audio',
    storage_path TEXT NOT NULL, -- e.g., 'narration/opening_wonder.mp3'
    public_url TEXT NOT NULL,
    file_size_bytes INTEGER,
    duration_seconds FLOAT,
    audio_format TEXT DEFAULT 'mp3',
    generation_method TEXT, -- 'higgs', 'elevenlabs', 'manual'
    generation_time_ms INTEGER,
    voice_settings JSONB, -- Store voice configuration used
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table for user interactions/progress
CREATE TABLE IF NOT EXISTS old_tom.user_story_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_id UUID, -- Optional, if you add auth later
    current_segment_id TEXT REFERENCES old_tom.narration_scripts(segment_id),
    segments_completed JSONB DEFAULT '[]'::jsonb,
    user_choices JSONB DEFAULT '{}'::jsonb,
    total_time_spent_seconds INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table for interactive moments and choices
CREATE TABLE IF NOT EXISTS old_tom.interactive_moments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_id TEXT REFERENCES old_tom.narration_scripts(segment_id),
    moment_id TEXT UNIQUE NOT NULL,
    prompt TEXT NOT NULL,
    choice_type TEXT CHECK (choice_type IN ('button', 'text_input', 'gesture')),
    choices JSONB, -- Array of possible choices for button type
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_audio_files_segment_id ON old_tom.audio_files(segment_id);
CREATE INDEX idx_narration_scripts_chapter ON old_tom.narration_scripts(chapter);
CREATE INDEX idx_narration_scripts_sequence ON old_tom.narration_scripts(sequence_number);
CREATE INDEX idx_user_progress_session ON old_tom.user_story_progress(session_id);

-- Create views for easier querying
CREATE VIEW old_tom.story_segments_with_audio AS
SELECT 
    ns.*,
    af.public_url as audio_url,
    af.duration_seconds,
    af.generated_at as audio_generated_at,
    CASE WHEN af.id IS NOT NULL THEN true ELSE false END as has_audio
FROM old_tom.narration_scripts ns
LEFT JOIN old_tom.audio_files af ON ns.segment_id = af.segment_id
ORDER BY ns.sequence_number;

-- Enable RLS
ALTER TABLE old_tom.narration_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE old_tom.audio_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE old_tom.user_story_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE old_tom.interactive_moments ENABLE ROW LEVEL SECURITY;

-- Public read access for story content
CREATE POLICY "Public read access to narration scripts" ON old_tom.narration_scripts
    FOR SELECT USING (true);

CREATE POLICY "Public read access to audio files" ON old_tom.audio_files
    FOR SELECT USING (true);

CREATE POLICY "Public read access to interactive moments" ON old_tom.interactive_moments
    FOR SELECT USING (true);

-- User progress is session-based
CREATE POLICY "Users can manage their own progress" ON old_tom.user_story_progress
    FOR ALL USING (true); -- In production, you'd check session_id or user_id

-- Function to get audio generation stats
CREATE OR REPLACE FUNCTION old_tom.get_audio_generation_stats()
RETURNS JSON AS $$
BEGIN
    RETURN json_build_object(
        'total_segments', (SELECT COUNT(*) FROM old_tom.narration_scripts),
        'generated_segments', (SELECT COUNT(*) FROM old_tom.audio_files),
        'total_duration_minutes', (SELECT ROUND(SUM(duration_seconds)/60, 2) FROM old_tom.audio_files),
        'total_storage_mb', (SELECT ROUND(SUM(file_size_bytes)/1048576.0, 2) FROM old_tom.audio_files),
        'generation_methods', (
            SELECT json_object_agg(generation_method, count)
            FROM (
                SELECT generation_method, COUNT(*) as count
                FROM old_tom.audio_files
                GROUP BY generation_method
            ) t
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Insert the narration scripts (can be run separately)
/*
INSERT INTO old_tom.narration_scripts (segment_id, chapter, sequence_number, text_content, visual_description, emotional_tone, soundscape, special_effects) VALUES
('opening_wonder', 'introduction', 1, 'G''day there, little mate...', 'Camera sweeps over moonlit ocean...', 'wonder', '["gentle_waves", "distant_whale_song"]', '["floating_bioluminescent_particles"]'),
-- Add all 18 segments here
;
*/