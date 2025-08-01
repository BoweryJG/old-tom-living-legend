/**
 * Captain George Davidson's Narration Script
 * Pulitzer-level storytelling for children about the legendary Old Tom
 * Themes: Ripple effects, breaking stereotypes, respect, legacy
 * 
 * Note: The whale's name is "Old Tom"
 * The whalers were the Davidson family, led by George "Fearless" Davidson
 */

export interface NarrationSegment {
  id: string;
  chapter: string;
  text: string;
  visualDescription: string;
  emotionalTone: 'wonder' | 'exciting' | 'gentle' | 'mysterious' | 'heartwarming' | 'bittersweet' | 'inspiring';
  soundscape: string[];
  specialEffects: string[];
}

export const captainTomNarration: NarrationSegment[] = [
  // OPENING - THE HOOK
  {
    id: 'opening_wonder',
    chapter: 'introduction',
    text: `G'day there, little mate. Close your eyes for just a moment... Can you hear it? That's the sound of the ocean calling. My name's Captain George Davidson, and I'm going to tell you the most extraordinary true story you've ever heard. A story about a whale who changed the world with one flip of his mighty tail. A story about how being different isn't something to hide - it's your superpower. This is the story of Old Tom, the killer whale who became my family's best friend.`,
    visualDescription: 'Camera sweeps over moonlit ocean, stars reflecting like diamonds on the water. Captain George Davidson appears as a glowing, translucent figure made of sea foam and starlight, standing on the deck of an old whaling boat.',
    emotionalTone: 'wonder',
    soundscape: ['gentle_waves', 'distant_whale_song', 'wind_chimes', 'heartbeat_of_ocean'],
    specialEffects: ['floating_bioluminescent_particles', 'aurora_australis_in_sky', 'ghostly_ship_outline']
  },

  // CHAPTER 1 - THE WORLD BEFORE
  {
    id: 'chapter1_stereotypes',
    chapter: 'the_angry_ocean',
    text: `Back in my grandfather's time, everyone thought they knew everything about whales. "Dangerous beasts!" they'd shout. "Monsters of the deep!" And the whales? They thought all humans were cruel hunters. Both sides were SO SURE they were right. But here's a secret, little one - when you think you know everything about someone, that's exactly when the universe sends you a surprise.`,
    visualDescription: 'Split screen effect: Left side shows fearful whalers with harpoons, right side shows angry whales. The ocean between them churns with dark, stormy colors. Lightning splits the sky.',
    emotionalTone: 'mysterious',
    soundscape: ['thunder_rumble', 'angry_ocean', 'fearful_shouts', 'whale_warnings'],
    specialEffects: ['screen_split_effect', 'storm_clouds_forming', 'red_vs_blue_color_divide']
  },

  {
    id: 'chapter1_young_tom',
    chapter: 'the_angry_ocean',
    text: `In those wild waters lived a young orca - that's a killer whale, but don't let the name fool you. This particular whale was different. While his pod chased fish and stayed away from boats, he would float near the surface, watching the humans with curious eyes. The other whales thought he was bonkers! "Stay away from those land creatures," they'd warn. But this young whale - who would one day be known as Old Tom - he wondered. He dreamed. He dared to think differently.`,
    visualDescription: 'Underwater shot of a young orca silhouetted against sunbeams. Other whales swim away while he rises toward a boat's shadow above. His eye sparkles with intelligence and curiosity.',
    emotionalTone: 'gentle',
    soundscape: ['underwater_ambience', 'whale_pod_chatter', 'curious_whale_clicks', 'muffled_boat_sounds'],
    specialEffects: ['god_rays_underwater', 'bubble_trails', 'dream_sequence_overlay']
  },

  // CHAPTER 2 - THE MEETING
  {
    id: 'chapter2_george_intro',
    chapter: 'georges_first_fish',
    text: `Now, on one of those boats was a young fella - actually, it was me in my younger days! They called me "Fearless George Davidson" back then. While the other whalers saw only oil and money when they looked at whales, I saw something else. I saw families. I saw intelligence. I saw... possibility. The other men laughed at me. "Soft-hearted fool!" they'd tease. But I didn't care. I knew that being different was my strength, not my weakness.`,
    visualDescription: 'Young George on the boat deck, golden hour lighting. While rough whalers count money in the background, George leans over the rail, watching whales with wonder. His eyes reflect the same curiosity as young Tom.',
    emotionalTone: 'heartwarming',
    soundscape: ['creaking_boat', 'seabirds', 'gentle_wind', 'distant_laughter'],
    specialEffects: ['golden_hour_glow', 'parallel_reflection_effect', 'sparkles_in_eyes']
  },

  {
    id: 'chapter2_the_moment',
    chapter: 'georges_first_fish',
    text: `Then came THE moment. The moment that would ripple through time like a stone thrown in still water. I had caught a fish for dinner, but as I held it, I saw that curious young whale watching me. Our eyes met across the impossible divide between land and sea. And I did something that would have made my mates think I'd gone completely mad. I threw the fish to the whale. Not at him, mind you - TO him. Like you'd toss a ball to a friend.`,
    visualDescription: 'Slow motion shot of the fish arcing through the air, sunlight making it gleam like silver. The whale's eye widens. Time seems to stop. The fish creates ripples as it hits the water.',
    emotionalTone: 'exciting',
    soundscape: ['heartbeat_slowmo', 'fish_splash', 'gasp_of_wonder', 'time_suspension_effect'],
    specialEffects: ['time_freeze_effect', 'ripple_visualization_expanding', 'light_trail_following_fish']
  },

  {
    id: 'chapter2_first_trust',
    chapter: 'georges_first_fish',
    text: `The whale - the one we'd later call Old Tom - couldn't believe it. A human... sharing? Being kind? Without wanting anything back? He took that fish gently, like accepting a precious gift. And in that moment, something magical happened. The anger in the ocean... it took its first breath of peace. One small act of kindness, like a tiny pebble, started ripples that would grow into waves of change.`,
    visualDescription: 'Underwater view of Tom taking the fish, surrounded by swirling golden particles. Above water, George smiles. Between them, visible ripples of light connect their hearts.',
    emotionalTone: 'wonder',
    soundscape: ['magical_chimes', 'whale_song_gentle', 'ripple_sounds', 'harmony_building'],
    specialEffects: ['golden_particle_explosion', 'heart_light_connection', 'ripple_transformation']
  },

  // CHAPTER 3 - BUILDING FRIENDSHIP
  {
    id: 'chapter3_communication',
    chapter: 'old_toms_signal',
    text: `Day after day, Tom and I met at the boundary between two worlds. But how do you talk to someone who doesn't speak your language? Tom figured it out - he'd slap his mighty tail on the water. SPLASH! One slap meant "hello friend!" Two slaps meant "whales coming into the bay!" Three meant "storm coming, be careful!" We created our own language, proving that when hearts want to connect, they'll find a way.`,
    visualDescription: 'Montage of Tom's tail creating different splash patterns, each splash sending up water droplets that form shapes - a smile, a fish, storm clouds. George on deck taking notes, learning.',
    emotionalTone: 'heartwarming',
    soundscape: ['tail_splashes_rhythmic', 'george_laughter', 'pencil_writing', 'building_music'],
    specialEffects: ['water_sculpture_formations', 'translation_overlay', 'friendship_montage']
  },

  {
    id: 'chapter3_spreading_change',
    chapter: 'old_toms_signal',
    text: `Something beautiful began to happen. Other whales saw Tom's friendship with me and thought, "Maybe... maybe we were wrong about humans." Other whalers saw my success working WITH the whales instead of against them and wondered, "Maybe there's a better way." Like ink dropping in water, the change spread. One whale, one human at a time. Soon, my whole family - the Davidsons of Eden - were working alongside Tom's pod.`,
    visualDescription: 'Aerial view showing multiple boats and whale pods starting to interact peacefully. The dark, angry ocean gradually transforms to brilliant turquoise, spreading outward from where Tom and George meet.',
    emotionalTone: 'inspiring',
    soundscape: ['orchestra_building', 'multiple_whale_songs', 'human_voices_harmonizing', 'ocean_calming'],
    specialEffects: ['color_transformation_wave', 'connection_threads_spreading', 'light_network_forming']
  },

  // CHAPTER 4 - THE PARTNERSHIP
  {
    id: 'chapter4_working_together',
    chapter: 'the_great_partnership',
    text: `Tom and his pod began helping the Davidsons in the most extraordinary way. When Tom spotted whales that were already dying or very old, he'd guide the boats to them. The whalers got what they needed without hurting healthy whales, and Tom's family got to share in the food. It wasn't taking - it was sharing. It wasn't fighting - it was dancing. Together, they rewrote the rules of the ocean.`,
    visualDescription: 'Cinematic shot of Tom's pod and whaling boats moving in synchronized formation, like a choreographed dance. The ocean sparkles with mutual respect.',
    emotionalTone: 'exciting',
    soundscape: ['triumphant_music', 'synchronized_splashing', 'cooperative_calls', 'harmony_theme'],
    specialEffects: ['synchronized_movement_trails', 'partnership_glow', 'formation_patterns']
  },

  {
    id: 'chapter4_tom_aging',
    chapter: 'the_great_partnership',
    text: `Years passed, and Tom grew from that curious young whale into a magnificent leader with a distinctly tall dorsal fin. The Davidsons and Tom's pod became like one big, strange family. Tom would bring his calves to meet my children. Can you imagine? Whale babies and human babies, learning from the very start that being different doesn't mean being enemies. But all that helping, all that pulling ropes in his teeth to guide our boats... it was wearing down Tom's teeth to stumps.`,
    visualDescription: 'Time-lapse showing Tom aging gracefully, his teeth becoming worn but his eyes growing wiser. Split scenes of whale calves playing near human children on the dock.',
    emotionalTone: 'bittersweet',
    soundscape: ['passing_time_music', 'children_laughter', 'gentle_whale_calls', 'wear_sounds_subtle'],
    specialEffects: ['time_lapse_aging', 'tooth_wear_visualization', 'generational_connections']
  },

  // CHAPTER 5 - THE BROKEN TRUST
  {
    id: 'chapter5_stranger_arrives',
    chapter: 'the_broken_promise',
    text: `But then... darkness crept back into Eden. It was our neighbor, J.R. Logan, with his motor launch "White Heather." He didn't understand the sacred friendship. One day, after a whale chase, Logan fought Old Tom for the carcass, playing tug of war with his boat. In that terrible struggle, he ripped out some of Tom's teeth. The trust we'd built over decades... it started to crack. The ocean itself seemed to weep.`,
    visualDescription: 'Dark storm clouds gather. A sinister boat appears with a cruel captain. The scene turns dark and frightening as trust breaks. The ocean turns black with sorrow.',
    emotionalTone: 'mysterious',
    soundscape: ['ominous_music', 'storm_building', 'whale_distress', 'trust_breaking_sound'],
    specialEffects: ['darkness_creeping', 'trust_threads_snapping', 'ocean_turning_black']
  },

  {
    id: 'chapter5_tom_leaves',
    chapter: 'the_broken_promise',
    text: `Tom's great heart was hurt that day. He looked at me with those wise eyes, pain visible even from the boat. Those missing teeth... they told a story of betrayal. But you know what? Tom didn't leave. He was hurt, but he didn't abandon us completely. He became more careful, more distant. The easy friendship we'd shared... it was different now. Logan felt terrible about what he'd done - the guilt ate at him every day.`,
    visualDescription: 'Heartbreaking scene of Tom's last look at George. Tom's pod disappearing into dark waters. George standing alone on empty ocean, calling out with no answer.',
    emotionalTone: 'bittersweet',
    soundscape: ['sorrowful_violin', 'fading_whale_songs', 'george_calling', 'empty_ocean'],
    specialEffects: ['fading_into_darkness', 'broken_heart_visualization', 'empty_horizon']
  },

  // CHAPTER 6 - THE FINAL GOODBYE
  {
    id: 'chapter6_georges_funeral',
    chapter: 'the_last_gift',
    text: `Years passed. I grew old, always watching for Tom's tall dorsal fin. We still worked together sometimes, but it was never quite the same. Then came September 17, 1930. Word spread through Eden like wildfire - Old Tom had been found dead in Twofold Bay. The whole town mourned. This whale who'd helped us for over 40 years, who'd worn his teeth to stumps pulling our boats... he was gone.`,
    visualDescription: 'Funeral scene at sunset on the wharf. Suddenly, Tom breaches in the distance, his worn teeth visible, creating a splash that catches the dying light.',
    emotionalTone: 'bittersweet',
    soundscape: ['funeral_bells', 'grieving_crowd', 'sudden_splash', 'collective_gasp'],
    specialEffects: ['sunset_rays', 'tom_breach_silhouette', 'tears_and_light']
  },

  {
    id: 'chapter6_final_respect',
    chapter: 'the_last_gift',
    text: `But here's the remarkable thing - Logan, the man who'd hurt Tom, he couldn't live with his guilt. He paid for Tom's skeleton to be preserved. He said it was the least he could do. He even funded a small museum to protect it. Can you imagine? The man who'd broken trust trying to make amends, even after death. It showed that people can change, that guilt can lead to good deeds. Tom's body would teach future generations.`,
    visualDescription: 'Close-up of Tom's wise, ancient eye, a tear seeming to form. His worn teeth visible as he sings. The crowd watches in awe as he pays his respects.',
    emotionalTone: 'heartwarming',
    soundscape: ['deep_whale_lament', 'crying_crowd', 'wind_through_flags', 'respectful_silence'],
    specialEffects: ['tear_from_whale_eye', 'sound_waves_visible', 'spiritual_connection']
  },

  // CHAPTER 7 - THE LEGACY
  {
    id: 'chapter7_museum',
    chapter: 'the_eternal_story',
    text: `Today, you can visit the Eden Killer Whale Museum and see Old Tom. Look closely at his teeth - worn down to stumps from all those years of helping, of pulling ropes to guide our boats. Every worn tooth tells a story of partnership. Every missing tooth from Logan's boat speaks of how fragile trust can be. But Tom's skeleton stands tall, 22 feet of proof that the impossible is possible when we choose understanding over fear.`,
    visualDescription: 'Museum scene with Tom's skeleton, children looking up in awe. His worn teeth gleam under the lights. Ghost images of Tom and George appear, smiling.',
    emotionalTone: 'inspiring',
    soundscape: ['museum_echoes', 'children_whispers', 'inspirational_music', 'ghostly_whale_song'],
    specialEffects: ['skeleton_coming_alive', 'memory_projections', 'worn_teeth_glowing']
  },

  {
    id: 'chapter7_your_ripple',
    chapter: 'the_eternal_story',
    text: `You see, little mate, Old Tom and I proved something magnificent: One act of kindness can change the world. One fish tossed in friendship created a partnership that lasted decades. Tom's worn teeth remind us that true friendship means sacrifice. His story reminds us that we should never, EVER think we know everything about someone - because a "killer" whale became our greatest helper. So here's my question for you: What will YOUR ripple be? What kindness will YOU toss into the ocean of life? Because I promise you - just like Tom and me - your one small act of courage, of thinking differently, of choosing love over fear... it can change everything. The ocean is waiting for your splash, little one. Make it count.`,
    visualDescription: 'Camera pulls back to show child listener surrounded by magical ocean imagery. Ripples spread from them, transforming into scenes of kindness across the world. Tom and George appear as constellations in the sky.',
    emotionalTone: 'inspiring',
    soundscape: ['swelling_orchestra', 'children_choir', 'whale_song_triumphant', 'ocean_eternal'],
    specialEffects: ['ripple_transformation_global', 'constellation_formation', 'future_vision_overlay']
  }
];

// Key Emotional Moments for Voice Acting
export const emotionalBeats = {
  wonder: ['first meeting', 'language creation', 'museum revelation'],
  excitement: ['fish toss', 'tail signals', 'partnership forming'],
  sorrow: ['trust broken', 'Tom leaves', 'George funeral'],
  inspiration: ['ripple effect', 'legacy message', 'child empowerment'],
  humor: ['whale thinking human crazy', 'Georges mates reactions', 'baby meetings']
};

// Visual Spectacular Moments (Ghibli-level)
export const spectacularVisuals = [
  {
    id: 'opening_cosmos',
    description: 'Ocean surface becomes mirror to stars, Captain Tom emerges from seafoam'
  },
  {
    id: 'fish_arc',
    description: 'Slow-motion fish toss with rainbow light trails'
  },
  {
    id: 'trust_network',
    description: 'Visualization of trust spreading like neural network across ocean'
  },
  {
    id: 'time_passage',
    description: 'Seasons changing, Tom aging, teeth wearing, but friendship growing'
  },
  {
    id: 'funeral_breach',
    description: 'Tom breaches at sunset, creating splash that turns to golden tears'
  },
  {
    id: 'museum_alive',
    description: 'Skeleton transforms to living Tom, showing all his adventures'
  },
  {
    id: 'ripple_universe',
    description: 'Child\'s action creates ripples that spread across time and space'
  }
];

// Interactive Moments for Children
export const interactiveMoments = [
  {
    id: 'create_splash_pattern',
    prompt: 'Help Tom create a signal! What pattern should he splash?'
  },
  {
    id: 'choose_kindness',
    prompt: 'George has a fish. Should he keep it or share it with Tom?'
  },
  {
    id: 'spot_difference',
    prompt: 'Tom looks different from other whales. Can you spot what makes him special?'
  },
  {
    id: 'make_promise',
    prompt: 'Promise Tom you\'ll remember that everyone deserves a chance?'
  },
  {
    id: 'your_ripple',
    prompt: 'What kind thing will you do tomorrow to start your ripple?'
  }
];

export default {
  captainTomNarration,
  emotionalBeats,
  spectacularVisuals,
  interactiveMoments
};