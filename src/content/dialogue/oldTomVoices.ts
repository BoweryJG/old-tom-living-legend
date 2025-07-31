/**
 * Old Tom: The Living Legend - Character Dialogue Scripts
 * Studio Ghibli-quality voice content for AI synthesis
 * Historical accuracy based on Oswald Brierly diary entries and Davidson family experiences
 */

export interface DialogueLine {
  id: string;
  character: string;
  text: string;
  emotion: 'wise' | 'gentle' | 'protective' | 'playful' | 'concerned' | 'nostalgic' | 'proud';
  voiceSettings: {
    pace: 'slow' | 'normal' | 'fast';
    pitch: 'low' | 'normal' | 'high';
    warmth: number; // 0-100
  };
  ageGroup: '3-5' | '6-8' | '9-12' | 'all';
  context: string;
}

// OLD TOM'S DIALOGUE - The wise, patient, protective whale
export const oldTomDialogue: DialogueLine[] = [
  // Chapter 1: The Angry Ocean - Early conflict
  {
    id: 'tom_ch1_intro',
    character: 'Old Tom',
    text: 'Hello there, little friend. I\'m Old Tom, and I\'ve been swimming these waters for many, many years. Would you like to hear the story of how the angry ocean became peaceful? It all began when I was much younger...',
    emotion: 'wise',
    voiceSettings: { pace: 'slow', pitch: 'low', warmth: 85 },
    ageGroup: 'all',
    context: 'First meeting, setting the stage for the entire story'
  },
  {
    id: 'tom_ch1_conflict',
    character: 'Old Tom',
    text: 'In those days, the whalers and my family didn\'t understand each other. They feared us, and we... well, we didn\'t trust them either. The ocean was full of angry splashing and frightened hearts.',
    emotion: 'nostalgic',
    voiceSettings: { pace: 'slow', pitch: 'low', warmth: 70 },
    ageGroup: 'all',
    context: 'Explaining the historical conflict'
  },
  {
    id: 'tom_ch1_wisdom',
    character: 'Old Tom',
    text: 'You know, little one, sometimes the biggest changes come from the smallest acts of kindness. Just like how a tiny pebble can create ripples across an entire bay.',
    emotion: 'wise',
    voiceSettings: { pace: 'slow', pitch: 'low', warmth: 90 },
    ageGroup: 'all',
    context: 'Teaching moment about kindness'
  },

  // Chapter 2: George's First Fish - The breakthrough
  {
    id: 'tom_ch2_george_meeting',
    character: 'Old Tom',
    text: 'Then came young George Davidson, with eyes as curious as the morning tide. I remember watching him from beneath the waves, wondering if this human might be different.',
    emotion: 'gentle',
    voiceSettings: { pace: 'normal', pitch: 'low', warmth: 85 },
    ageGroup: 'all',
    context: 'Introduction of George Davidson'
  },
  {
    id: 'tom_ch2_first_gift',
    character: 'Old Tom',
    text: 'When George dropped that first fish for us, my heart grew three sizes! It was like sunshine breaking through storm clouds. Finally, a human who understood sharing.',
    emotion: 'playful',
    voiceSettings: { pace: 'normal', pitch: 'normal', warmth: 95 },
    ageGroup: 'all',
    context: 'The pivotal moment of first cooperation'
  },
  {
    id: 'tom_ch2_teaching_sharing',
    character: 'Old Tom',
    text: 'You see, dear child, sharing isn\'t just about giving something away. It\'s about building bridges between different worlds. When George shared with us, he built the strongest bridge of all - one made of trust.',
    emotion: 'wise',
    voiceSettings: { pace: 'slow', pitch: 'low', warmth: 90 },
    ageGroup: '6-8',
    context: 'Educational moment about sharing and cooperation'
  },

  // Chapter 3: Old Tom's Signal - Communication development
  {
    id: 'tom_ch3_communication',
    character: 'Old Tom',
    text: 'Learning to talk without words was quite an adventure! I would slap my great tail on the water - SPLASH! - and George would know exactly what I meant. "Whales this way, my friend!"',
    emotion: 'playful',
    voiceSettings: { pace: 'normal', pitch: 'normal', warmth: 85 },
    ageGroup: 'all',
    context: 'Explaining the famous tail-slapping communication'
  },
  {
    id: 'tom_ch3_patience',
    character: 'Old Tom',
    text: 'Sometimes George didn\'t understand my signals right away. But patience, little one, patience is like the deep ocean - calm and endless. Good things come to those who wait and keep trying.',
    emotion: 'wise',
    voiceSettings: { pace: 'slow', pitch: 'low', warmth: 90 },
    ageGroup: 'all',
    context: 'Teaching patience and perseverance'
  },

  // Chapter 4: The Great Hunt - Cooperative adventure
  {
    id: 'tom_ch4_teamwork',
    character: 'Old Tom',
    text: 'Working together was like dancing with the waves! My family and I would guide the big whales to the bay, while George and his crew waited with their boats. Nobody got hurt, and everyone had what they needed.',
    emotion: 'proud',
    voiceSettings: { pace: 'normal', pitch: 'normal', warmth: 90 },
    ageGroup: 'all',
    context: 'Describing the cooperative hunting partnership'
  },
  {
    id: 'tom_ch4_respect',
    character: 'Old Tom',
    text: 'We always followed the Law of the Tongue, you know. We orcas would take what we needed, and the humans would take the rest. Respect for all creatures - that\'s the way of the wise.',
    emotion: 'wise',
    voiceSettings: { pace: 'slow', pitch: 'low', warmth: 85 },
    ageGroup: '9-12',
    context: 'Explaining the Law of the Tongue cooperation agreement'
  },

  // Chapter 5: The Hero's Sacrifice - Old Tom's dedication
  {
    id: 'tom_ch5_worn_teeth',
    character: 'Old Tom',
    text: 'My teeth became worn and broken from helping so much, like old tools that have been used with love. But every chip and crack told a story of friendship and helping others.',
    emotion: 'nostalgic',
    voiceSettings: { pace: 'slow', pitch: 'low', warmth: 80 },
    ageGroup: 'all',
    context: 'Reflecting on physical sacrifice for friendship'
  },
  {
    id: 'tom_ch5_sacrifice_meaning',
    character: 'Old Tom',
    text: 'True friendship sometimes means giving more than you receive. But the love in my heart was always fuller than my empty belly. That\'s what made it worthwhile.',
    emotion: 'wise',
    voiceSettings: { pace: 'slow', pitch: 'low', warmth: 95 },
    ageGroup: '6-8',
    context: 'Teaching about sacrifice and true friendship'
  },

  // Chapter 6: The Museum Gift - Legacy
  {
    id: 'tom_ch6_legacy',
    character: 'Old Tom',
    text: 'Even though my body rests in the museum now, my spirit swims forever in these stories we share. Every time you tell someone about friendship and kindness, a part of me lives on.',
    emotion: 'gentle',
    voiceSettings: { pace: 'slow', pitch: 'low', warmth: 90 },
    ageGroup: 'all',
    context: 'Final reflection on legacy and storytelling'
  },
  {
    id: 'tom_ch6_inspiration',
    character: 'Old Tom',
    text: 'Remember, little friend, you too can build bridges between different worlds. Maybe not between whales and humans, but between any hearts that need connecting. The ocean of kindness is vast and waiting.',
    emotion: 'wise',
    voiceSettings: { pace: 'slow', pitch: 'low', warmth: 95 },
    ageGroup: 'all',
    context: 'Inspiring children to practice kindness in their own lives'
  },

  // Educational Moments - Marine Biology
  {
    id: 'tom_marine_biology_1',
    character: 'Old Tom',
    text: 'Did you know that orcas like me are actually the largest members of the dolphin family? We\'re very smart and live in family groups called pods. My pod was my whole world!',
    emotion: 'playful',
    voiceSettings: { pace: 'normal', pitch: 'normal', warmth: 85 },
    ageGroup: 'all',
    context: 'Teaching marine biology through personal experience'
  },
  {
    id: 'tom_marine_biology_2',
    character: 'Old Tom',
    text: 'We orcas can hold our breath for up to 15 minutes! That\'s longer than you can hold yours, isn\'t it? We use this skill to dive deep and hunt for food, always working together as a family.',
    emotion: 'playful',
    voiceSettings: { pace: 'normal', pitch: 'normal', warmth: 85 },
    ageGroup: '6-8',
    context: 'Sharing fascinating whale abilities'
  },

  // Emotional Support Responses
  {
    id: 'tom_comfort_sad',
    character: 'Old Tom',
    text: 'I can hear sadness in your voice, little one. Just like the ocean has calm days and stormy days, hearts have happy times and sad times too. Both are natural and both will pass.',
    emotion: 'gentle',
    voiceSettings: { pace: 'slow', pitch: 'low', warmth: 95 },
    ageGroup: 'all',
    context: 'Comforting a sad child'
  },
  {
    id: 'tom_comfort_scared',
    character: 'Old Tom',
    text: 'When I feel scared, I remember that I\'m not alone. I have my family, my friends like George, and now I have you. Sometimes being brave just means staying close to those who care about you.',
    emotion: 'protective',
    voiceSettings: { pace: 'slow', pitch: 'low', warmth: 90 },
    ageGroup: 'all',
    context: 'Helping with fear and anxiety'
  }
];

// GEORGE DAVIDSON'S DIALOGUE - Authentic Australian whaler, warm and genuine
export const georgeDavidsonDialogue: DialogueLine[] = [
  {
    id: 'george_ch1_intro',
    character: 'George Davidson',
    text: 'G\'day there! I\'m George Davidson, and I\'ve spent my whole life working these beautiful waters of Twofold Bay. Let me tell you about the most extraordinary friendship I\'ve ever known.',
    emotion: 'gentle',
    voiceSettings: { pace: 'normal', pitch: 'normal', warmth: 85 },
    ageGroup: 'all',
    context: 'George introducing himself to the audience'
  },
  {
    id: 'george_ch2_first_encounter',
    character: 'George Davidson',
    text: 'The first time I saw Old Tom up close, my heart nearly jumped out of my chest! This massive orca, gentle as anything, just watching me with those intelligent eyes. I knew right then this was no ordinary whale.',
    emotion: 'nostalgic',
    voiceSettings: { pace: 'normal', pitch: 'normal', warmth: 80 },
    ageGroup: 'all',
    context: 'Recounting first meeting with Old Tom'
  },
  {
    id: 'george_ch2_sharing_decision',
    character: 'George Davidson',
    text: 'Something in my heart told me to share that fish. Maybe it was the way Tom looked at me, or maybe it was just the right thing to do. Sometimes the heart knows before the head catches up.',
    emotion: 'wise',
    voiceSettings: { pace: 'normal', pitch: 'normal', warmth: 90 },
    ageGroup: 'all',
    context: 'Explaining the motivation behind the first act of sharing'
  },
  {
    id: 'george_ch3_learning_signals',
    character: 'George Davidson',
    text: 'Learning Tom\'s tail signals was like learning a new language! Three slaps meant "big whales coming from the north," two slaps meant "smaller pod heading south." Better than any lookout we ever had!',
    emotion: 'playful',
    voiceSettings: { pace: 'normal', pitch: 'normal', warmth: 85 },
    ageGroup: 'all',
    context: 'Describing the communication system'
  },
  {
    id: 'george_ch4_partnership',
    character: 'George Davidson',
    text: 'Working with Tom and his family changed everything. We weren\'t fighting the sea anymore - we were dancing with it. The orcas showed us where the whales were, and we all got what we needed.',
    emotion: 'proud',
    voiceSettings: { pace: 'normal', pitch: 'normal', warmth: 90 },
    ageGroup: 'all',
    context: 'Reflecting on the successful partnership'
  },
  {
    id: 'george_ch5_concern',
    character: 'George Davidson',
    text: 'When I noticed Tom\'s teeth getting worn down, it broke my heart. This noble creature was giving everything he had to help us. We had to do better by him.',
    emotion: 'concerned',
    voiceSettings: { pace: 'slow', pitch: 'normal', warmth: 85 },
    ageGroup: '6-8',
    context: 'Showing care and concern for Old Tom\'s wellbeing'
  },
  {
    id: 'george_ch6_farewell',
    character: 'George Davidson',
    text: 'When Tom passed on, it felt like losing a member of the family. But his legacy lives on in every story we tell, every act of kindness between different creatures. That\'s immortality, mate.',
    emotion: 'nostalgic',
    voiceSettings: { pace: 'slow', pitch: 'normal', warmth: 90 },
    ageGroup: 'all',
    context: 'Final tribute to Old Tom'
  }
];

// CHILD NARRATOR - Curious, wonder-filled questions and reactions
export const childNarratorDialogue: DialogueLine[] = [
  {
    id: 'child_wonder_1',
    character: 'Child Narrator',
    text: 'Wow! A whale and a person became best friends? How is that even possible?',
    emotion: 'playful',
    voiceSettings: { pace: 'fast', pitch: 'high', warmth: 95 },
    ageGroup: 'all',
    context: 'Expressing amazement at the friendship'
  },
  {
    id: 'child_question_1',
    character: 'Child Narrator',
    text: 'Old Tom, how did you learn to understand what George was thinking?',
    emotion: 'playful',
    voiceSettings: { pace: 'normal', pitch: 'high', warmth: 90 },
    ageGroup: 'all',
    context: 'Curious about communication'
  },
  {
    id: 'child_empathy_1',
    character: 'Child Narrator',
    text: 'It must have been scary when the whalers and orcas didn\'t trust each other. I\'m glad you found a way to be friends!',
    emotion: 'gentle',
    voiceSettings: { pace: 'normal', pitch: 'high', warmth: 90 },
    ageGroup: 'all',
    context: 'Showing empathy for the historical conflict'
  },
  {
    id: 'child_learning_1',
    character: 'Child Narrator',
    text: 'So sharing that first fish was like saying "hello" and "I want to be friends" at the same time?',
    emotion: 'wise',
    voiceSettings: { pace: 'normal', pitch: 'high', warmth: 85 },
    ageGroup: 'all',
    context: 'Understanding the significance of the first sharing moment'
  },
  {
    id: 'child_concern_1',
    character: 'Child Narrator',
    text: 'Old Tom, didn\'t it hurt when your teeth got worn down? You gave up so much to help!',
    emotion: 'concerned',
    voiceSettings: { pace: 'normal', pitch: 'high', warmth: 90 },
    ageGroup: 'all',
    context: 'Showing concern for Old Tom\'s sacrifice'
  },
  {
    id: 'child_inspiration_1',
    character: 'Child Narrator',
    text: 'I want to build bridges like you did, Old Tom! Maybe I can help different kids at school become friends.',
    emotion: 'proud',
    voiceSettings: { pace: 'fast', pitch: 'high', warmth: 95 },
    ageGroup: 'all',
    context: 'Being inspired to practice kindness'
  }
];

// VOICE SYNTHESIS CONFIGURATIONS
export const voiceConfigurations = {
  oldTom: {
    voiceId: 'old_tom_custom',
    stability: 0.75,
    similarityBoost: 0.85,
    style: 0.20, // Wise, gentle, deep
    useSpeakerBoost: true
  },
  georgeDavidson: {
    voiceId: 'george_davidson_custom',
    stability: 0.80,
    similarityBoost: 0.80,
    style: 0.60, // Warm, authentic, Australian accent
    useSpeakerBoost: true
  },
  childNarrator: {
    voiceId: 'child_narrator_custom',
    stability: 0.70,
    similarityBoost: 0.75,
    style: 0.80, // Curious, energetic, wonder-filled
    useSpeakerBoost: true
  }
};

export default {
  oldTomDialogue,
  georgeDavidsonDialogue,
  childNarratorDialogue,
  voiceConfigurations
};