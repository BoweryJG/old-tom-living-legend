// Upload all 18 narration segments to Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://alkzliirqdofpygknsij.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsa3psaWlycWRvZnB5Z2tuc2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3OTE4NDQsImV4cCI6MjAyOTM2Nzg0NH0.fJJtKzj2k7i9XLLAwCT5GEH1E3Kpqs_odGts9Vpp7lE';
const supabase = createClient(supabaseUrl, supabaseKey);

const allSegments = [
  // Already uploaded 6, adding the remaining 12
  {
    segment_id: 'chapter3_communication',
    chapter: 'old_toms_signal',
    sequence_number: 7,
    text_content: `Day after day, Tom and I met at the boundary between two worlds. But how do you talk to someone who doesn't speak your language? Tom figured it out - he'd slap his mighty tail on the water. SPLASH! One slap meant "hello friend!" Two slaps meant "whales coming into the bay!" Three meant "storm coming, be careful!" We created our own language, proving that when hearts want to connect, they'll find a way.`,
    visual_description: `Montage of Tom's tail creating different splash patterns, each splash sending up water droplets that form shapes - a smile, a fish, storm clouds. George on deck taking notes, learning.`,
    emotional_tone: 'heartwarming',
    soundscape: ["tail_splashes_rhythmic", "george_laughter", "pencil_writing", "building_music"],
    special_effects: ["water_sculpture_formations", "translation_overlay", "friendship_montage"]
  },
  {
    segment_id: 'chapter3_spreading_change',
    chapter: 'old_toms_signal',
    sequence_number: 8,
    text_content: `Something beautiful began to happen. Other whales saw Tom's friendship with me and thought, "Maybe... maybe we were wrong about humans." Other whalers saw my success working WITH the whales instead of against them and wondered, "Maybe there's a better way." Like ink dropping in water, the change spread. One whale, one human at a time. Soon, my whole family - the Davidsons of Eden - were working alongside Tom's pod.`,
    visual_description: `Aerial view showing multiple boats and whale pods starting to interact peacefully. The dark, angry ocean gradually transforms to brilliant turquoise, spreading outward from where Tom and George meet.`,
    emotional_tone: 'inspiring',
    soundscape: ["orchestra_building", "multiple_whale_songs", "human_voices_harmonizing", "ocean_calming"],
    special_effects: ["color_transformation_wave", "connection_threads_spreading", "light_network_forming"]
  },
  {
    segment_id: 'chapter4_working_together',
    chapter: 'the_great_partnership',
    sequence_number: 9,
    text_content: `Tom and his pod began helping the Davidsons in the most extraordinary way. When Tom spotted whales that were already dying or very old, he'd guide the boats to them. The whalers got what they needed without hurting healthy whales, and Tom's family got to share in the food. It wasn't taking - it was sharing. It wasn't fighting - it was dancing. Together, they rewrote the rules of the ocean.`,
    visual_description: `Cinematic shot of Tom's pod and whaling boats moving in synchronized formation, like a choreographed dance. The ocean sparkles with mutual respect.`,
    emotional_tone: 'exciting',
    soundscape: ["triumphant_music", "synchronized_splashing", "cooperative_calls", "harmony_theme"],
    special_effects: ["synchronized_movement_trails", "partnership_glow", "formation_patterns"]
  },
  {
    segment_id: 'chapter4_tom_aging',
    chapter: 'the_great_partnership',
    sequence_number: 10,
    text_content: `Years passed, and Tom grew from that curious young whale into a magnificent leader with a distinctly tall dorsal fin. The Davidsons and Tom's pod became like one big, strange family. Tom would bring his calves to meet my children. Can you imagine? Whale babies and human babies, learning from the very start that being different doesn't mean being enemies. But all that helping, all that pulling ropes in his teeth to guide our boats... it was wearing down Tom's teeth to stumps.`,
    visual_description: `Time-lapse showing Tom aging gracefully, his teeth becoming worn but his eyes growing wiser. Split scenes of whale calves playing near human children on the dock.`,
    emotional_tone: 'bittersweet',
    soundscape: ["passing_time_music", "children_laughter", "gentle_whale_calls", "wear_sounds_subtle"],
    special_effects: ["time_lapse_aging", "tooth_wear_visualization", "generational_connections"]
  },
  {
    segment_id: 'chapter5_stranger_arrives',
    chapter: 'the_broken_promise',
    sequence_number: 11,
    text_content: `But then... darkness crept back into Eden. It was our neighbor, J.R. Logan, with his motor launch "White Heather." He didn't understand the sacred friendship. One day, after a whale chase, Logan fought Old Tom for the carcass, playing tug of war with his boat. In that terrible struggle, he ripped out some of Tom's teeth. The trust we'd built over decades... it started to crack. The ocean itself seemed to weep.`,
    visual_description: `Dark storm clouds gather. A sinister boat appears with a cruel captain. The scene turns dark and frightening as trust breaks. The ocean turns black with sorrow.`,
    emotional_tone: 'mysterious',
    soundscape: ["ominous_music", "storm_building", "whale_distress", "trust_breaking_sound"],
    special_effects: ["darkness_creeping", "trust_threads_snapping", "ocean_turning_black"]
  },
  {
    segment_id: 'chapter5_tom_leaves',
    chapter: 'the_broken_promise',
    sequence_number: 12,
    text_content: `Tom's great heart was hurt that day. He looked at me with those wise eyes, pain visible even from the boat. Those missing teeth... they told a story of betrayal. But you know what? Tom didn't leave. He was hurt, but he didn't abandon us completely. He became more careful, more distant. The easy friendship we'd shared... it was different now. Logan felt terrible about what he'd done - the guilt ate at him every day.`,
    visual_description: `Heartbreaking scene of Tom's last look at George. Tom's pod disappearing into dark waters. George standing alone on empty ocean, calling out with no answer.`,
    emotional_tone: 'bittersweet',
    soundscape: ["sorrowful_violin", "fading_whale_songs", "george_calling", "empty_ocean"],
    special_effects: ["fading_into_darkness", "broken_heart_visualization", "empty_horizon"]
  },
  {
    segment_id: 'chapter6_georges_funeral',
    chapter: 'the_last_gift',
    sequence_number: 13,
    text_content: `Years passed. I grew old, always watching for Tom's tall dorsal fin. We still worked together sometimes, but it was never quite the same. Then came September 17, 1930. Word spread through Eden like wildfire - Old Tom had been found dead in Twofold Bay. The whole town mourned. This whale who'd helped us for over 40 years, who'd worn his teeth to stumps pulling our boats... he was gone.`,
    visual_description: `Funeral scene at sunset on the wharf. Suddenly, Tom breaches in the distance, his worn teeth visible, creating a splash that catches the dying light.`,
    emotional_tone: 'bittersweet',
    soundscape: ["funeral_bells", "grieving_crowd", "sudden_splash", "collective_gasp"],
    special_effects: ["sunset_rays", "tom_breach_silhouette", "tears_and_light"]
  },
  {
    segment_id: 'chapter6_final_respect',
    chapter: 'the_last_gift',
    sequence_number: 14,
    text_content: `But here's the remarkable thing - Logan, the man who'd hurt Tom, he couldn't live with his guilt. He paid for Tom's skeleton to be preserved. He said it was the least he could do. He even funded a small museum to protect it. Can you imagine? The man who'd broken trust trying to make amends, even after death. It showed that people can change, that guilt can lead to good deeds. Tom's body would teach future generations.`,
    visual_description: `Close-up of Tom's wise, ancient eye, a tear seeming to form. His worn teeth visible as he sings. The crowd watches in awe as he pays his respects.`,
    emotional_tone: 'heartwarming',
    soundscape: ["deep_whale_lament", "crying_crowd", "wind_through_flags", "respectful_silence"],
    special_effects: ["tear_from_whale_eye", "sound_waves_visible", "spiritual_connection"]
  },
  {
    segment_id: 'chapter7_museum',
    chapter: 'the_eternal_story',
    sequence_number: 15,
    text_content: `Today, you can visit the Eden Killer Whale Museum and see Old Tom. Look closely at his teeth - worn down to stumps from all those years of helping, of pulling ropes to guide our boats. Every worn tooth tells a story of partnership. Every missing tooth from Logan's boat speaks of how fragile trust can be. But Tom's skeleton stands tall, 22 feet of proof that the impossible is possible when we choose understanding over fear.`,
    visual_description: `Museum scene with Tom's skeleton, children looking up in awe. His worn teeth gleam under the lights. Ghost images of Tom and George appear, smiling.`,
    emotional_tone: 'inspiring',
    soundscape: ["museum_echoes", "children_whispers", "inspirational_music", "ghostly_whale_song"],
    special_effects: ["skeleton_coming_alive", "memory_projections", "worn_teeth_glowing"]
  },
  {
    segment_id: 'chapter7_your_ripple',
    chapter: 'the_eternal_story',
    sequence_number: 16,
    text_content: `You see, little mate, Old Tom and I proved something magnificent: One act of kindness can change the world. One fish tossed in friendship created a partnership that lasted decades. Tom's worn teeth remind us that true friendship means sacrifice. His story reminds us that we should never, EVER think we know everything about someone - because a "killer" whale became our greatest helper. So here's my question for you: What will YOUR ripple be? What kindness will YOU toss into the ocean of life? Because I promise you - just like Tom and me - your one small act of courage, of thinking differently, of choosing love over fear... it can change everything. The ocean is waiting for your splash, little one. Make it count.`,
    visual_description: `Camera pulls back to show child listener surrounded by magical ocean imagery. Ripples spread from them, transforming into scenes of kindness across the world. Tom and George appear as constellations in the sky.`,
    emotional_tone: 'inspiring',
    soundscape: ["swelling_orchestra", "children_choir", "whale_song_triumphant", "ocean_eternal"],
    special_effects: ["ripple_transformation_global", "constellation_formation", "future_vision_overlay"]
  },
  {
    segment_id: 'spot_difference',
    chapter: 'interactive_moments',
    sequence_number: 17,
    text_content: `Can you spot what makes Tom special? Look at his tall dorsal fin!`,
    visual_description: `Interactive moment where children identify Tom's unique features`,
    emotional_tone: 'exciting',
    soundscape: ["playful_music"],
    special_effects: ["highlight_effect"]
  },
  {
    segment_id: 'your_ripple',
    chapter: 'interactive_moments',
    sequence_number: 18,
    text_content: `What kind thing will you do tomorrow to start your ripple?`,
    visual_description: `Text input moment for children to make their promise`,
    emotional_tone: 'inspiring',
    soundscape: ["gentle_waves"],
    special_effects: ["ripple_effect"]
  }
];

async function uploadAllSegments() {
  console.log('📚 Uploading all remaining narration segments...');
  
  for (const segment of allSegments) {
    try {
      const { data, error } = await supabase
        .from('old_tom.narration_scripts')
        .upsert({
          ...segment,
          soundscape: JSON.stringify(segment.soundscape),
          special_effects: JSON.stringify(segment.special_effects)
        }, { onConflict: 'segment_id' });
      
      if (error) {
        console.error(`❌ Error uploading ${segment.segment_id}:`, error);
      } else {
        console.log(`✅ Uploaded: ${segment.segment_id}`);
      }
    } catch (err) {
      console.error(`❌ Failed on ${segment.segment_id}:`, err);
    }
  }
  
  // Check final count
  const { data: count } = await supabase
    .from('old_tom.narration_scripts')
    .select('segment_id');
  
  console.log(`\n✅ Total segments in database: ${count?.length || 0}/18`);
}

uploadAllSegments();