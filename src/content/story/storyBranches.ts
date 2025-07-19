/**
 * Old Tom: The Living Legend - Interactive Story Branches
 * Studio Ghibli-quality branching narratives with age-appropriate choices
 * Educational decision points that teach through meaningful choices
 */

export interface StoryChoice {
  id: string;
  text: string;
  ageGroup: '3-5' | '6-8' | '9-12' | 'all';
  leadsTo: string; // Next scene ID
  educationalValue: string;
  emotionalImpact: 'gentle' | 'exciting' | 'thoughtful' | 'inspiring';
}

export interface StoryScene {
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  setting: string;
  timeOfDay: 'dawn' | 'morning' | 'afternoon' | 'sunset' | 'night';
  weatherMood: 'calm' | 'stormy' | 'misty' | 'bright' | 'dramatic';
  characters: string[];
  narrativeText: string;
  educationalContent: {
    topic: string;
    facts: string[];
    ageAppropriate: Record<string, string>; // Age group specific explanations
  };
  choices: StoryChoice[];
  visualElements: {
    backgroundType: 'ocean' | 'wharf' | 'underwater' | 'museum' | 'historical';
    animations: string[];
    soundscape: string[];
  };
  voiceLines: string[]; // References to dialogue IDs
}

// CHAPTER 1: THE ANGRY OCEAN
export const chapter1Scenes: StoryScene[] = [
  {
    id: 'ch1_opening',
    chapterNumber: 1,
    title: 'The Angry Ocean',
    description: 'The story begins in the turbulent waters of Twofold Bay, 1840s',
    setting: 'Twofold Bay, rough seas with whaling boats in distance',
    timeOfDay: 'dawn',
    weatherMood: 'stormy',
    characters: ['Old Tom', 'Child Narrator'],
    narrativeText: 'Long ago, when your great-great-grandparents were children, the waters of Twofold Bay were not the peaceful place they are today. Whaling ships dotted the horizon, and in the deep blue waters, something extraordinary was about to begin...',
    educationalContent: {
      topic: 'Historical Context of 1840s Whaling',
      facts: [
        'Twofold Bay was one of Australia\'s major whaling stations',
        'Whaling was essential for oil, used for lamps and machinery',
        'Orcas and humans initially had conflicts over whale hunting territory'
      ],
      ageAppropriate: {
        '3-5': 'Long ago, people and whales didn\'t understand each other very well.',
        '6-8': 'In the 1840s, people hunted whales for oil to light their lamps, but they didn\'t know how to work with the orcas.',
        '9-12': 'The 1840s whaling industry was crucial for lighting and machinery oil, but initial human-orca interactions were marked by misunderstanding and territorial conflicts.'
      }
    },
    choices: [
      {
        id: 'ch1_choice_1',
        text: 'Listen to Old Tom\'s memories',
        ageGroup: 'all',
        leadsTo: 'ch1_tom_memories',
        educationalValue: 'Builds empathy and historical perspective',
        emotionalImpact: 'thoughtful'
      },
      {
        id: 'ch1_choice_2',
        text: 'See what the whaling boats were doing',
        ageGroup: '6-8',
        leadsTo: 'ch1_whaling_scene',
        educationalValue: 'Learns about historical whaling practices',
        emotionalImpact: 'exciting'
      },
      {
        id: 'ch1_choice_3',
        text: 'Dive underwater to see the orcas',
        ageGroup: 'all',
        leadsTo: 'ch1_underwater_pod',
        educationalValue: 'Discovers orca family structure and behavior',
        emotionalImpact: 'gentle'
      }
    ],
    visualElements: {
      backgroundType: 'ocean',
      animations: ['stormy_waves', 'distant_ships', 'orca_silhouettes'],
      soundscape: ['ocean_waves', 'seagulls', 'distant_whale_calls']
    },
    voiceLines: ['tom_ch1_intro', 'child_wonder_1']
  },
  {
    id: 'ch1_tom_memories',
    chapterNumber: 1,
    title: 'Old Tom\'s First Memories',
    description: 'Old Tom shares his earliest memories of the conflicts',
    setting: 'Underwater perspective, young Tom swimming with his pod',
    timeOfDay: 'morning',
    weatherMood: 'misty',
    characters: ['Old Tom', 'Young Tom (memory)', 'Orca Pod'],
    narrativeText: 'In the shimmering depths of memory, Old Tom shows you his younger self - a curious orca learning the ways of the ocean. Back then, the appearance of human boats meant danger and confusion...',
    educationalContent: {
      topic: 'Orca Family Structure and Communication',
      facts: [
        'Orcas live in matriarchal pods led by the oldest female',
        'Young orcas learn from their mothers and aunts for years',
        'Orcas have complex vocalizations unique to each pod'
      ],
      ageAppropriate: {
        '3-5': 'Baby orcas stay close to their mommies and learn by watching.',
        '6-8': 'Young orcas like Tom learned everything from their mothers and lived in big family groups called pods.',
        '9-12': 'Orca pods are matriarchal societies where young whales receive extensive education from experienced females, developing complex social bonds and communication skills.'
      }
    },
    choices: [
      {
        id: 'ch1_memory_choice_1',
        text: 'Ask about Tom\'s family',
        ageGroup: 'all',
        leadsTo: 'ch1_family_bonds',
        educationalValue: 'Learns about orca family relationships',
        emotionalImpact: 'gentle'
      },
      {
        id: 'ch1_memory_choice_2',
        text: 'See what happened when boats came',
        ageGroup: '6-8',
        leadsTo: 'ch1_first_conflict',
        educationalValue: 'Understands historical human-wildlife conflicts',
        emotionalImpact: 'thoughtful'
      }
    ],
    visualElements: {
      backgroundType: 'underwater',
      animations: ['young_tom_swimming', 'pod_formation', 'memory_shimmer'],
      soundscape: ['underwater_ambience', 'orca_calls', 'gentle_currents']
    },
    voiceLines: ['tom_ch1_conflict', 'tom_ch1_wisdom']
  }
];

// CHAPTER 2: GEORGE'S FIRST FISH
export const chapter2Scenes: StoryScene[] = [
  {
    id: 'ch2_george_introduction',
    chapterNumber: 2,
    title: 'A Different Kind of Whaler',
    description: 'Meet young George Davidson and witness the pivotal moment',
    setting: 'Whaling boat deck, George looking out at the ocean with wonder',
    timeOfDay: 'morning',
    weatherMood: 'bright',
    characters: ['George Davidson', 'Old Tom', 'Child Narrator'],
    narrativeText: 'Among all the rough and weathered whalers, George Davidson stood apart. Where others saw only the hunt, George saw intelligence in the dark eyes watching from the waves...',
    educationalContent: {
      topic: 'Individual Differences and Empathy',
      facts: [
        'George Davidson was known for his unusual empathy toward sea creatures',
        'The Davidson family worked as whalers for three generations',
        'Individual choices can change the course of history'
      ],
      ageAppropriate: {
        '3-5': 'George was a kind person who cared about all the sea animals.',
        '6-8': 'Unlike other whalers, George Davidson looked at orcas and saw smart, feeling creatures who deserved respect.',
        '9-12': 'George Davidson\'s empathetic nature and willingness to see beyond traditional human-wildlife relationships set him apart from other whalers of his era.'
      }
    },
    choices: [
      {
        id: 'ch2_choice_1',
        text: 'Follow George as he makes his decision',
        ageGroup: 'all',
        leadsTo: 'ch2_decision_moment',
        educationalValue: 'Explores moral decision-making',
        emotionalImpact: 'inspiring'
      },
      {
        id: 'ch2_choice_2',
        text: 'See what Old Tom was thinking',
        ageGroup: 'all',
        leadsTo: 'ch2_tom_perspective',
        educationalValue: 'Develops perspective-taking skills',
        emotionalImpact: 'thoughtful'
      },
      {
        id: 'ch2_choice_3',
        text: 'Learn about what fish mean to orcas',
        ageGroup: '6-8',
        leadsTo: 'ch2_orca_nutrition',
        educationalValue: 'Marine biology and orca diet',
        emotionalImpact: 'gentle'
      }
    ],
    visualElements: {
      backgroundType: 'ocean',
      animations: ['george_on_deck', 'tom_watching', 'sunlight_on_water'],
      soundscape: ['boat_creaking', 'ocean_lapping', 'seabird_calls']
    },
    voiceLines: ['george_ch2_first_encounter', 'tom_ch2_george_meeting']
  },
  {
    id: 'ch2_decision_moment',
    chapterNumber: 2,
    title: 'The First Gift',
    description: 'The moment that changed everything - George\'s first act of sharing',
    setting: 'Boat deck, George holding a fish, Tom surfacing nearby',
    timeOfDay: 'afternoon',
    weatherMood: 'calm',
    characters: ['George Davidson', 'Old Tom', 'Other Whalers'],
    narrativeText: 'George\'s hand trembled slightly as he held the fresh-caught fish. The other whalers were busy with their work, but this massive orca was watching him with eyes that seemed almost... hopeful.',
    educationalContent: {
      topic: 'The Power of First Impressions and Trust-Building',
      facts: [
        'Trust between different species requires consistent positive interactions',
        'Food sharing is a universal sign of friendship across many cultures',
        'Small acts of kindness can have enormous consequences'
      ],
      ageAppropriate: {
        '3-5': 'Sharing food is one of the best ways to show you want to be friends.',
        '6-8': 'When George shared his fish with Tom, it was like saying "I trust you and I want to be your friend" in a language Tom could understand.',
        '9-12': 'Cross-species communication often begins with universally understood gestures like food sharing, which demonstrates non-threatening intentions and mutual benefit.'
      }
    },
    choices: [
      {
        id: 'ch2_share_choice_1',
        text: 'Encourage George to share the fish',
        ageGroup: 'all',
        leadsTo: 'ch2_first_sharing',
        educationalValue: 'Reinforces prosocial behavior',
        emotionalImpact: 'inspiring'
      },
      {
        id: 'ch2_share_choice_2',
        text: 'See what the other whalers think',
        ageGroup: '6-8',
        leadsTo: 'ch2_whaler_reactions',
        educationalValue: 'Explores social pressure and standing up for beliefs',
        emotionalImpact: 'thoughtful'
      },
      {
        id: 'ch2_share_choice_3',
        text: 'Watch Tom\'s reaction closely',
        ageGroup: 'all',
        leadsTo: 'ch2_tom_response',
        educationalValue: 'Observational skills and animal behavior',
        emotionalImpact: 'exciting'
      }
    ],
    visualElements: {
      backgroundType: 'ocean',
      animations: ['george_hesitating', 'fish_in_hand', 'tom_watching_intently'],
      soundscape: ['gentle_waves', 'boat_sounds', 'heartbeat_tension']
    },
    voiceLines: ['george_ch2_sharing_decision', 'child_question_1']
  }
];

// CHAPTER 3: OLD TOM'S SIGNAL
export const chapter3Scenes: StoryScene[] = [
  {
    id: 'ch3_communication_begins',
    chapterNumber: 3,
    title: 'Learning to Talk Without Words',
    description: 'The development of the famous tail-slapping communication system',
    setting: 'Open ocean, Tom demonstrating tail signals to George\'s boat',
    timeOfDay: 'morning',
    weatherMood: 'bright',
    characters: ['Old Tom', 'George Davidson', 'Tom\'s Pod'],
    narrativeText: 'Trust was just the beginning. Now Tom and George needed to learn how to really talk to each other. But how do you have a conversation when one of you lives underwater and speaks in splashes?',
    educationalContent: {
      topic: 'Animal Communication and Intelligence',
      facts: [
        'Orcas have sophisticated communication systems using clicks, calls, and body language',
        'Animals can learn to communicate with humans through training and mutual understanding',
        'Non-verbal communication often transcends species barriers'
      ],
      ageAppropriate: {
        '3-5': 'Animals and people can talk to each other using sounds and movements instead of words.',
        '6-8': 'Tom learned to use his powerful tail like a drum to send messages to George across the water.',
        '9-12': 'Interspecies communication requires understanding each species\' natural behaviors and adapting them for mutual comprehension.'
      }
    },
    choices: [
      {
        id: 'ch3_learn_choice_1',
        text: 'Watch Tom create the first signal',
        ageGroup: 'all',
        leadsTo: 'ch3_first_signal',
        educationalValue: 'Observes problem-solving and innovation',
        emotionalImpact: 'exciting'
      },
      {
        id: 'ch3_learn_choice_2',
        text: 'See how George figures out the meaning',
        ageGroup: '6-8',
        leadsTo: 'ch3_george_understanding',
        educationalValue: 'Pattern recognition and learning processes',
        emotionalImpact: 'thoughtful'
      },
      {
        id: 'ch3_learn_choice_3',
        text: 'Learn about other whale communication',
        ageGroup: '9-12',
        leadsTo: 'ch3_whale_communication',
        educationalValue: 'Marine biology and cetacean communication',
        emotionalImpact: 'gentle'
      }
    ],
    visualElements: {
      backgroundType: 'ocean',
      animations: ['tail_splash_sequence', 'sound_waves_visual', 'george_watching'],
      soundscape: ['whale_tail_splash', 'ocean_echo', 'recognition_music']
    },
    voiceLines: ['tom_ch3_communication', 'george_ch3_learning_signals']
  }
];

// AGE-APPROPRIATE CHOICE FILTERING
export function filterChoicesForAge(choices: StoryChoice[], ageGroup: '3-5' | '6-8' | '9-12'): StoryChoice[] {
  return choices.filter(choice => 
    choice.ageGroup === 'all' || choice.ageGroup === ageGroup
  );
}

// EMOTIONAL LEARNING FRAMEWORK
export const emotionalLearningMoments = {
  empathy: [
    'Understanding Old Tom\'s perspective when humans first arrived',
    'Feeling George\'s nervousness about reaching out to the orcas',
    'Recognizing the fear both species initially felt'
  ],
  courage: [
    'George\'s bravery in being the first to share with the orcas',
    'Old Tom\'s courage in trusting humans despite past conflicts',
    'Standing up for friendship even when others don\'t understand'
  ],
  sacrifice: [
    'Old Tom wearing down his teeth to help the partnership',
    'George sometimes going hungry to ensure the orcas were fed',
    'Both species giving up some independence for mutual benefit'
  ],
  legacy: [
    'How their friendship changed the bay forever',
    'The importance of telling stories to preserve memories',
    'How kindness ripples through generations'
  ]
};

// BRANCHING NARRATIVE FRAMEWORK
export interface StoryPath {
  id: string;
  name: string;
  description: string;
  recommendedAge: '3-5' | '6-8' | '9-12';
  focusThemes: string[];
  estimatedDuration: number; // minutes
  scenes: string[]; // Scene IDs in order
}

export const storyPaths: StoryPath[] = [
  {
    id: 'gentle_friendship',
    name: 'The Gentle Friendship Path',
    description: 'A tender journey focusing on kindness and understanding',
    recommendedAge: '3-5',
    focusThemes: ['friendship', 'sharing', 'kindness', 'trust'],
    estimatedDuration: 15,
    scenes: [
      'ch1_opening', 'ch1_tom_memories', 'ch1_family_bonds',
      'ch2_george_introduction', 'ch2_decision_moment', 'ch2_first_sharing',
      'ch3_communication_begins', 'ch3_first_signal'
    ]
  },
  {
    id: 'adventure_cooperation',
    name: 'The Great Adventure Path',
    description: 'An exciting journey highlighting teamwork and discovery',
    recommendedAge: '6-8',
    focusThemes: ['teamwork', 'adventure', 'problem-solving', 'communication'],
    estimatedDuration: 25,
    scenes: [
      'ch1_opening', 'ch1_whaling_scene', 'ch1_first_conflict',
      'ch2_george_introduction', 'ch2_whaler_reactions', 'ch2_tom_response',
      'ch3_communication_begins', 'ch3_george_understanding'
    ]
  },
  {
    id: 'historical_wisdom',
    name: 'The Wisdom and Legacy Path',
    description: 'A thoughtful exploration of history, sacrifice, and meaning',
    recommendedAge: '9-12',
    focusThemes: ['history', 'sacrifice', 'legacy', 'conservation', 'wisdom'],
    estimatedDuration: 35,
    scenes: [
      'ch1_opening', 'ch1_tom_memories', 'ch1_first_conflict',
      'ch2_george_introduction', 'ch2_orca_nutrition', 'ch2_whaler_reactions',
      'ch3_communication_begins', 'ch3_whale_communication'
    ]
  }
];

export default {
  chapter1Scenes,
  chapter2Scenes,
  chapter3Scenes,
  filterChoicesForAge,
  emotionalLearningMoments,
  storyPaths
};