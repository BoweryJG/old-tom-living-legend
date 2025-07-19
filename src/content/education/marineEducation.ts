/**
 * Old Tom: The Living Legend - Educational Content Integration
 * Marine biology, history, and conservation delivered through Old Tom's wisdom
 * Age-appropriate learning woven seamlessly into the narrative
 */

export interface EducationalFact {
  id: string;
  topic: string;
  category: 'marine_biology' | 'history' | 'geography' | 'conservation' | 'culture';
  level: 'basic' | 'intermediate' | 'advanced';
  ageGroups: {
    '3-5': string;
    '6-8': string;
    '9-12': string;
  };
  storyContext: string; // How it relates to Old Tom's story
  interactiveElement?: string; // Optional hands-on activity
  wonderMoment: string; // The "wow" factor that captivates children
}

export interface ConservationMessage {
  id: string;
  theme: string;
  currentRelevance: string;
  ageAppropriate: {
    '3-5': string;
    '6-8': string;
    '9-12': string;
  };
  actionableSteps: string[];
  tieToStory: string;
}

// MARINE BIOLOGY EDUCATION
export const marineBiologyFacts: EducationalFact[] = [
  {
    id: 'orca_family_structure',
    topic: 'Orca Family Pods',
    category: 'marine_biology',
    level: 'basic',
    ageGroups: {
      '3-5': 'Orcas live in big families called pods, just like you live with your family! The mommy orca is usually the leader.',
      '6-8': 'Orca pods are led by the oldest grandmother whale. All the children and grandchildren stay together their whole lives, sharing food and protecting each other.',
      '9-12': 'Orcas live in matriarchal societies where the eldest female leads a multi-generational pod. These complex social structures involve cooperative hunting, shared child-rearing, and sophisticated communication systems.'
    },
    storyContext: 'Old Tom lived with his pod family in Twofold Bay, and they all worked together to help George Davidson',
    interactiveElement: 'Draw your family tree and compare it to an orca pod family tree',
    wonderMoment: 'Orcas have grandmothers who are the bosses of the whole family, just like some human families!'
  },
  {
    id: 'orca_intelligence',
    topic: 'Orca Intelligence and Problem-Solving',
    category: 'marine_biology',
    level: 'intermediate',
    ageGroups: {
      '3-5': 'Orcas are super smart! They can learn new things and remember them forever, just like how you remember your favorite songs.',
      '6-8': 'Orcas have huge brains and can solve problems, use tools, and even teach other orcas new skills. They\'re some of the smartest animals on Earth!',
      '9-12': 'Orcas possess highly developed cognitive abilities including self-awareness, complex problem-solving, cultural transmission of knowledge, and sophisticated social cognition comparable to great apes and elephants.'
    },
    storyContext: 'Old Tom figured out how to communicate with George using tail signals - that took serious whale brainpower!',
    interactiveElement: 'Try to solve a puzzle using only gestures, no words - like Tom had to do',
    wonderMoment: 'Orcas can recognize themselves in mirrors and have been seen using tools to catch fish!'
  },
  {
    id: 'whale_migration',
    topic: 'Whale Migration Patterns',
    category: 'marine_biology',
    level: 'intermediate',
    ageGroups: {
      '3-5': 'Big whales take very long trips in the ocean, like going on the longest vacation ever! They swim thousands of miles.',
      '6-8': 'Whales migrate along the coast following ancient underwater highways. They travel from feeding areas in cold water to warm water where they have their babies.',
      '9-12': 'Humpback and southern right whales follow the Eastern Australian migration route, traveling over 5,000km between Antarctic feeding grounds and subtropical breeding areas, using magnetic fields and ocean currents for navigation.'
    },
    storyContext: 'Old Tom helped George know when the migrating whales were coming to Twofold Bay - he was like a whale traffic reporter!',
    interactiveElement: 'Track a whale migration route on a map and calculate how long it would take you to walk that far',
    wonderMoment: 'Some whales don\'t eat anything for 6 months while they\'re traveling - they live off their stored blubber!'
  },
  {
    id: 'echolocation',
    topic: 'How Whales "See" with Sound',
    category: 'marine_biology',
    level: 'advanced',
    ageGroups: {
      '3-5': 'Whales can see in the dark water by making special sounds that bounce back to them, like playing echo in a big room!',
      '6-8': 'Orcas use echolocation - they make clicking sounds that travel through the water and bounce back, creating a sound picture of everything around them.',
      '9-12': 'Echolocation involves producing biosonar clicks that reflect off objects, allowing cetaceans to navigate, hunt, and communicate in conditions where vision is limited, with precision comparable to human-made sonar systems.'
    },
    storyContext: 'Old Tom used his amazing hearing to detect whales from miles away, then signaled George about their approach',
    interactiveElement: 'Close your eyes and try to navigate a room using only sound - clap your hands and listen to the echoes',
    wonderMoment: 'Orcas can echolocate a fish the size of a goldfish from 100 meters away in murky water!'
  },
  {
    id: 'ocean_food_chain',
    topic: 'Ocean Food Webs and the Law of the Tongue',
    category: 'marine_biology',
    level: 'intermediate',
    ageGroups: {
      '3-5': 'In the ocean, everyone eats different things. The Law of the Tongue meant Tom and his family got to eat their favorite parts first!',
      '6-8': 'The Law of the Tongue was a fair sharing agreement - orcas ate the tongue and lips of caught whales while humans took the blubber and oil. Everyone got what they needed most.',
      '9-12': 'The Law of the Tongue represented a sustainable resource-sharing agreement based on different nutritional needs - orcas required the protein-rich organs while humans needed the oil-rich blubber for industrial purposes.'
    },
    storyContext: 'This special agreement between Old Tom\'s family and the whalers made sure nobody went hungry and everyone was treated fairly',
    interactiveElement: 'Design a fair sharing system for your classroom snacks based on different preferences',
    wonderMoment: 'This might be the first recorded example of a formal agreement between humans and wild animals!'
  }
];

// HISTORICAL EDUCATION
export const historicalFacts: EducationalFact[] = [
  {
    id: 'whaling_industry',
    topic: '1840s Australian Whaling Industry',
    category: 'history',
    level: 'intermediate',
    ageGroups: {
      '3-5': 'Long ago, people caught whales to make oil for their lamps because they didn\'t have electricity yet.',
      '6-8': 'In the 1840s, whale oil was like electricity is today - it powered lamps, machines, and was used to make soap and candles. Whaling towns like Eden were very important.',
      '9-12': 'The 19th-century whaling industry was crucial for illumination, lubrication, and manufacturing before petroleum products. Eden\'s whaling station processed southern right and humpback whales along the Eastern Australian migration route.'
    },
    storyContext: 'George Davidson\'s family were part of this important industry, but they found a better way to work with nature instead of against it',
    interactiveElement: 'Compare what whale oil was used for then vs. what we use electricity for now',
    wonderMoment: 'Whale oil was so valuable it was called "liquid gold" - one whale could light a whole town for months!'
  },
  {
    id: 'davidson_family',
    topic: 'Three Generations of Davidson Whalers',
    category: 'history',
    level: 'basic',
    ageGroups: {
      '3-5': 'George\'s family worked with whales for grandpa, daddy, and George - that\'s three whole families!',
      '6-8': 'The Davidson family worked as whalers in Twofold Bay for over 60 years. George learned from his father, who learned from his father.',
      '9-12': 'The Davidson whaling dynasty spanned three generations from the 1840s to early 1900s, with John Davidson Sr., John Davidson Jr., and George Davidson each contributing to the unique orca-human partnership.'
    },
    storyContext: 'George inherited not just the whaling knowledge, but also the special relationship with Old Tom that his family had built',
    interactiveElement: 'Interview grandparents or older relatives about jobs that ran in your family',
    wonderMoment: 'George\'s friendship with Old Tom lasted so long that Tom worked with three generations of the same family!'
  },
  {
    id: 'twofold_bay_geography',
    topic: 'Twofold Bay as a Natural Harbor',
    category: 'geography',
    level: 'intermediate',
    ageGroups: {
      '3-5': 'Twofold Bay is a special shaped piece of ocean that makes a perfect home for whales and a safe place for boats.',
      '6-8': 'Twofold Bay\'s deep, protected waters and narrow entrance made it an ideal whaling station and a natural resting place for migrating whales.',
      '9-12': 'Twofold Bay\'s geographical features - including its deep channel, protective headlands, and position on the whale migration route - created optimal conditions for both cetacean behavior and maritime operations.'
    },
    storyContext: 'The shape of Twofold Bay helped Old Tom and George work together - whales naturally came into the protected waters',
    interactiveElement: 'Draw a map of your neighborhood and mark the best places for different activities',
    wonderMoment: 'Twofold Bay is so perfectly shaped for whales that it\'s still a popular whale watching spot today!'
  }
];

// CONSERVATION EDUCATION
export const conservationMessages: ConservationMessage[] = [
  {
    id: 'modern_whale_protection',
    theme: 'From Hunting to Protection',
    currentRelevance: 'Today whales are protected by international laws, and whale watching has replaced whale hunting',
    ageAppropriate: {
      '3-5': 'Now we protect whales instead of hunting them. People go on boats just to watch whales and take pictures!',
      '6-8': 'Modern whale watching lets us enjoy whales like Old Tom without hurting them. Scientists study whales to learn more about helping them.',
      '9-12': 'International whaling moratoriums and marine protected areas now safeguard whale populations, while eco-tourism and research have replaced extractive industries as primary human-whale interactions.'
    },
    actionableSteps: [
      'Support whale watching tourism instead of marine parks with captive whales',
      'Reduce plastic use to protect ocean environments',
      'Learn about and support marine conservation organizations'
    ],
    tieToStory: 'Old Tom\'s story shows us that humans and whales can be partners - today we partner to protect them instead of hunt them'
  },
  {
    id: 'ocean_health',
    theme: 'Healthy Oceans for All Sea Life',
    currentRelevance: 'Climate change, plastic pollution, and noise pollution threaten modern whales',
    ageAppropriate: {
      '3-5': 'We need to keep the ocean clean and healthy so whales like Old Tom can have good homes.',
      '6-8': 'Modern whales face new challenges like plastic pollution and loud ship noises that make it hard for them to communicate and find food.',
      '9-12': 'Contemporary threats to cetaceans include ocean acidification, microplastics, ship strikes, and acoustic pollution that disrupts echolocation and communication systems.'
    },
    actionableSteps: [
      'Participate in beach cleanups to remove plastic from whale habitats',
      'Choose sustainable seafood to protect whale food sources',
      'Support quiet ocean initiatives that reduce noise pollution'
    ],
    tieToStory: 'Just like Old Tom needed clean, healthy waters to help George, modern whales need us to keep their ocean home safe'
  },
  {
    id: 'human_wildlife_coexistence',
    theme: 'Building Bridges Between Species',
    currentRelevance: 'Learning from Old Tom\'s example for modern conservation partnerships',
    ageAppropriate: {
      '3-5': 'Old Tom teaches us that people and animals can be friends when we\'re kind and patient with each other.',
      '6-8': 'Old Tom\'s partnership with George shows us how humans and wildlife can work together when we respect and understand each other.',
      '9-12': 'The Old Tom partnership provides a historical model for contemporary human-wildlife management strategies based on mutual benefit, respect, and scientific understanding.'
    },
    actionableSteps: [
      'Create wildlife-friendly spaces in your community',
      'Learn about local wildlife and their needs',
      'Support conservation programs that involve local communities'
    ],
    tieToStory: 'Old Tom proved that the best conservation happens when humans and animals become partners instead of competitors'
  }
];

// CULTURAL SENSITIVITY FRAMEWORK
export interface CulturalContent {
  id: string;
  topic: string;
  indigenousConnection: string;
  respectfulApproach: string;
  educationalValue: string;
  consultationNotes: string;
}

export const indigenousCulturalContent: CulturalContent[] = [
  {
    id: 'yuin_orca_connection',
    topic: 'Yuin People and Orca Relationships',
    indigenousConnection: 'The Yuin/Thaua people have ancient spiritual connections to orcas, viewing them as family members and guides',
    respectfulApproach: 'Acknowledge the prior relationship and ongoing connection without appropriating or oversimplifying sacred beliefs',
    educationalValue: 'Teaches that Old Tom\'s partnership builds on thousands of years of respectful human-orca relationships',
    consultationNotes: 'Requires consultation with Yuin elders and cultural advisors before implementation'
  },
  {
    id: 'traditional_knowledge',
    topic: 'Indigenous Maritime Knowledge',
    indigenousConnection: 'Traditional ecological knowledge informed sustainable relationships with marine life for millennia',
    respectfulApproach: 'Present as foundational wisdom that enabled later partnerships, not as historical curiosity',
    educationalValue: 'Shows how traditional knowledge systems supported Old Tom\'s success',
    consultationNotes: 'Must be reviewed and approved by appropriate Indigenous cultural authorities'
  }
];

// WONDER MOMENTS GENERATOR
export function generateWonderMoments(): string[] {
  return [
    'Old Tom\'s brain was bigger than a human\'s whole torso!',
    'Orcas can live over 100 years - Old Tom might have great-great-great grandchildren still swimming today!',
    'The tail-slap signals Tom used could be heard underwater for miles!',
    'Old Tom\'s skeleton is still on display in the Eden Museum - you can visit him!',
    'Whales have belly buttons just like humans!',
    'A single whale song can travel across entire ocean basins!',
    'Orcas learn different "languages" depending on which pod they\'re born into!',
    'Old Tom\'s partnership lasted longer than most human friendships!'
  ];
}

// AGE-APPROPRIATE CONTENT SELECTOR
export function getEducationalContentForAge(
  content: EducationalFact | ConservationMessage, 
  ageGroup: '3-5' | '6-8' | '9-12'
): string {
  if ('ageGroups' in content) {
    return content.ageGroups[ageGroup];
  } else {
    return content.ageAppropriate[ageGroup];
  }
}

// EDUCATIONAL CONTENT INTEGRATION ENGINE
export class EducationalContentEngine {
  private currentAge: '3-5' | '6-8' | '9-12';
  private viewedContent: Set<string> = new Set();

  constructor(ageGroup: '3-5' | '6-8' | '9-12') {
    this.currentAge = ageGroup;
  }

  getContextualContent(storyMoment: string, category?: string): EducationalFact[] {
    return marineBiologyFacts
      .concat(historicalFacts)
      .filter(fact => {
        const isRelevant = fact.storyContext.toLowerCase().includes(storyMoment.toLowerCase());
        const isRightCategory = !category || fact.category === category;
        const notViewed = !this.viewedContent.has(fact.id);
        return isRelevant && isRightCategory && notViewed;
      })
      .slice(0, 2); // Limit to 2 facts per moment to avoid overwhelm
  }

  markContentViewed(contentId: string): void {
    this.viewedContent.add(contentId);
  }

  getWonderMoment(): string {
    const moments = generateWonderMoments();
    return moments[Math.floor(Math.random() * moments.length)];
  }

  getConservationMessage(storyTheme: string): ConservationMessage | null {
    return conservationMessages.find(msg => 
      msg.theme.toLowerCase().includes(storyTheme.toLowerCase())
    ) || null;
  }
}

export default {
  marineBiologyFacts,
  historicalFacts,
  conservationMessages,
  indigenousCulturalContent,
  generateWonderMoments,
  getEducationalContentForAge,
  EducationalContentEngine
};