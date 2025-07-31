/**
 * Old Tom: The Living Legend - Cultural Sensitivity Guidelines for Indigenous Content
 * Respectful acknowledgment and integration of Yuin/Thaua peoples' relationships with orcas
 * Historical accuracy verification and cultural consultation framework
 */

export interface CulturalConsultationRequirement {
  contentType: string;
  consultationLevel: 'required' | 'recommended' | 'advisory';
  stakeholders: string[];
  approvalProcess: string;
  timeline: string;
  considerations: string[];
}

export interface IndigenousContentGuideline {
  principle: string;
  description: string;
  doThis: string[];
  avoidThis: string[];
  examples: {
    appropriate: string;
    inappropriate: string;
    explanation: string;
  };
}

export interface HistoricalAccuracyCheck {
  source: string;
  type: 'primary' | 'secondary' | 'oral_tradition' | 'academic' | 'museum';
  verification: string;
  dateRange: string;
  reliability: 'high' | 'medium' | 'requires_verification';
  culturalSensitivity: 'cleared' | 'needs_review' | 'problematic';
}

// CULTURAL SENSITIVITY PRINCIPLES
export const culturalSensitivityGuidelines: IndigenousContentGuideline[] = [
  {
    principle: 'Acknowledge Prior Relationships',
    description: 'Recognize that Indigenous peoples had relationships with orcas long before European settlement',
    doThis: [
      'Acknowledge Yuin/Thaua peoples as traditional custodians of Twofold Bay',
      'Reference that orca relationships existed for thousands of years before Old Tom',
      'Present Old Tom\'s story as building upon existing Indigenous knowledge',
      'Use respectful language like "traditional owners" and "first peoples"'
    ],
    avoidThis: [
      'Presenting Old Tom\'s partnership as the "first" human-orca relationship',
      'Ignoring Indigenous presence in the area',
      'Using outdated or inappropriate terminology',
      'Treating Indigenous knowledge as "primitive" compared to European approaches'
    ],
    examples: {
      appropriate: 'Old Tom\'s partnership with George Davidson built upon thousands of years of respectful relationships between the Yuin people and orcas in these waters.',
      inappropriate: 'Old Tom was the first whale to ever work with humans.',
      explanation: 'The first example acknowledges prior Indigenous relationships while the second erases them entirely.'
    }
  },
  {
    principle: 'Respect Sacred Knowledge',
    description: 'Some Indigenous knowledge about orcas may be sacred or restricted',
    doThis: [
      'Consult with appropriate cultural authorities before including any traditional knowledge',
      'Focus on publicly shared information and general respectful relationships',
      'Ask permission before referencing specific cultural practices or beliefs',
      'Provide proper attribution when sharing Indigenous perspectives'
    ],
    avoidThis: [
      'Appropriating sacred stories or spiritual beliefs',
      'Making assumptions about Indigenous beliefs without consultation',
      'Using Indigenous knowledge without permission or attribution',
      'Oversimplifying complex cultural relationships'
    ],
    examples: {
      appropriate: 'The Yuin people have long-standing relationships with marine life that inform sustainable practices (with specific details only included with community permission).',
      inappropriate: 'The Aboriginal people believed orcas were their spirit ancestors who guided them.',
      explanation: 'The first respects boundaries while the second makes specific spiritual claims without authorization.'
    }
  },
  {
    principle: 'Contemporary Relevance',
    description: 'Acknowledge that Indigenous peoples and their relationships with country continue today',
    doThis: [
      'Use present tense when discussing Indigenous connection to country',
      'Reference ongoing Indigenous involvement in marine conservation',
      'Acknowledge continuing cultural practices and knowledge systems',
      'Connect historical events to contemporary Indigenous rights and recognition'
    ],
    avoidThis: [
      'Using past tense as if Indigenous peoples no longer exist',
      'Treating Indigenous culture as historical artifact',
      'Ignoring contemporary Indigenous voices in conservation',
      'Presenting colonization as inevitable or beneficial'
    ],
    examples: {
      appropriate: 'Yuin people continue to care for country and work with marine biologists to protect whale migration routes.',
      inappropriate: 'The Aborigines used to live along this coast before the whalers arrived.',
      explanation: 'Present tense acknowledges continuing existence and active participation in conservation.'
    }
  }
];

// CONSULTATION REQUIREMENTS
export const consultationRequirements: CulturalConsultationRequirement[] = [
  {
    contentType: 'Direct references to Indigenous spiritual beliefs about orcas',
    consultationLevel: 'required',
    stakeholders: ['Yuin-Monaro Elders', 'Local Aboriginal Land Council', 'Cultural heritage advisors'],
    approvalProcess: 'Formal written approval required before content development',
    timeline: '6-8 weeks for consultation process',
    considerations: [
      'May involve sacred or restricted knowledge',
      'Requires understanding of complex spiritual relationships',
      'Must respect intellectual property rights',
      'May not be appropriate for general public sharing'
    ]
  },
  {
    contentType: 'Traditional ecological knowledge about marine life',
    consultationLevel: 'required',
    stakeholders: ['Indigenous knowledge holders', 'Environmental/Cultural liaisons', 'Marine science collaborators'],
    approvalProcess: 'Collaborative development with Indigenous experts',
    timeline: '4-6 weeks for joint development',
    considerations: [
      'Combines traditional and scientific knowledge systems',
      'Requires proper attribution and benefit-sharing agreements',
      'Must avoid misrepresentation of traditional practices',
      'Should enhance rather than appropriate Indigenous knowledge'
    ]
  },
  {
    contentType: 'General acknowledgment of Indigenous presence and rights',
    consultationLevel: 'recommended',
    stakeholders: ['Local Indigenous representatives', 'Cultural advisors'],
    approvalProcess: 'Review and feedback on draft content',
    timeline: '2-3 weeks for review process',
    considerations: [
      'Ensures respectful and accurate language',
      'Confirms appropriate acknowledgment protocols',
      'Verifies historical accuracy from Indigenous perspective',
      'Builds positive community relationships'
    ]
  }
];

// HISTORICAL ACCURACY VERIFICATION
export const historicalSources: HistoricalAccuracyCheck[] = [
  {
    source: 'Oswald Brierly Diary Entries (1840s)',
    type: 'primary',
    verification: 'Original diary entries held by National Library of Australia',
    dateRange: '1840-1850',
    reliability: 'high',
    culturalSensitivity: 'needs_review'
  },
  {
    source: 'Davidson Family Records and Photographs',
    type: 'primary',
    verification: 'Family archives and Eden Museum collections',
    dateRange: '1860-1930',
    reliability: 'high',
    culturalSensitivity: 'cleared'
  },
  {
    source: 'Eden Killer Whale Museum Documentation',
    type: 'secondary',
    verification: 'Curated museum collection with documented provenance',
    dateRange: '1840-1930',
    reliability: 'high',
    culturalSensitivity: 'cleared'
  },
  {
    source: 'Yuin Oral Traditions about Orcas',
    type: 'oral_tradition',
    verification: 'Requires consultation with appropriate knowledge holders',
    dateRange: 'Pre-contact to present',
    reliability: 'high',
    culturalSensitivity: 'needs_review'
  },
  {
    source: 'Academic Research on Human-Orca Interactions',
    type: 'academic',
    verification: 'Peer-reviewed publications and dissertations',
    dateRange: '1980-present',
    reliability: 'medium',
    culturalSensitivity: 'cleared'
  }
];

// CONTENT DEVELOPMENT FRAMEWORK
export interface ContentDevelopmentStage {
  stage: string;
  description: string;
  culturalConsiderations: string[];
  checkpoints: string[];
  stakeholderInvolvement: string[];
}

export const contentDevelopmentStages: ContentDevelopmentStage[] = [
  {
    stage: 'Research and Planning',
    description: 'Initial research gathering and content planning phase',
    culturalConsiderations: [
      'Identify all content touching on Indigenous themes',
      'Map consultation requirements for each content type',
      'Establish relationships with cultural advisors',
      'Review existing cultural protocols and guidelines'
    ],
    checkpoints: [
      'Cultural consultation plan approved',
      'Historical sources verified for accuracy and sensitivity',
      'Stakeholder contact list established',
      'Timeline and budget for consultations confirmed'
    ],
    stakeholderInvolvement: [
      'Cultural heritage advisors',
      'Local Indigenous representatives',
      'Museum curators and historians'
    ]
  },
  {
    stage: 'Content Creation',
    description: 'Development of story content, dialogue, and educational materials',
    culturalConsiderations: [
      'Regular check-ins with cultural advisors during development',
      'Iterative review of content for cultural appropriateness',
      'Collaborative development where Indigenous knowledge is involved',
      'Documentation of all cultural consultation processes'
    ],
    checkpoints: [
      'Draft content reviewed by cultural advisors',
      'Historical accuracy verified by multiple sources',
      'Language and tone approved for cultural sensitivity',
      'Educational content balanced between perspectives'
    ],
    stakeholderInvolvement: [
      'Indigenous knowledge holders',
      'Cultural liaisons',
      'Historical accuracy reviewers',
      'Community representatives'
    ]
  },
  {
    stage: 'Review and Approval',
    description: 'Final review and approval process before implementation',
    culturalConsiderations: [
      'Formal approval process for all Indigenous-related content',
      'Final cultural sensitivity review',
      'Community feedback incorporation',
      'Legal and ethical compliance verification'
    ],
    checkpoints: [
      'All required approvals obtained',
      'Community feedback addressed',
      'Legal clearances confirmed',
      'Implementation guidelines finalized'
    ],
    stakeholderInvolvement: [
      'Elder approval where required',
      'Community representatives',
      'Legal and cultural compliance reviewers',
      'Project leadership team'
    ]
  }
];

// RESPECTFUL LANGUAGE GUIDE
export const respectfulLanguageGuide = {
  preferred: {
    'Indigenous peoples': 'Use specific group names when known (e.g., Yuin people)',
    'Traditional owners': 'Acknowledges ongoing relationship to country',
    'First Nations': 'Recognizes sovereignty and prior occupation',
    'Country': 'Indigenous concept encompassing land, water, and spiritual relationships',
    'Traditional knowledge': 'Acknowledges sophisticated knowledge systems',
    'Cultural protocols': 'Respects formal cultural processes'
  },
  avoid: {
    'Aborigines': 'Outdated term, prefer specific group names or Indigenous peoples',
    'Primitive': 'Implies hierarchy and lack of sophistication',
    'Stone age': 'Implies technological determinism and cultural ranking',
    'Discovered': 'Ignores Indigenous presence and prior relationships',
    'Settled': 'Euphemism that obscures colonization impacts',
    'Traditional beliefs': 'Can imply outdated rather than ongoing worldviews'
  }
};

// IMPLEMENTATION CHECKLIST
export const implementationChecklist = {
  beforeDevelopment: [
    '☐ Identify all Indigenous-related content in project scope',
    '☐ Map consultation requirements for each content type',
    '☐ Establish contact with appropriate cultural advisors',
    '☐ Budget time and resources for consultation processes',
    '☐ Review existing cultural protocols and guidelines',
    '☐ Confirm legal and ethical requirements'
  ],
  duringDevelopment: [
    '☐ Regular cultural sensitivity reviews of content',
    '☐ Documented consultation processes',
    '☐ Iterative feedback incorporation',
    '☐ Respectful language verification',
    '☐ Historical accuracy cross-checking',
    '☐ Community engagement where appropriate'
  ],
  beforeRelease: [
    '☐ Final cultural sensitivity review completed',
    '☐ All required approvals obtained',
    '☐ Community feedback addressed',
    '☐ Legal clearances confirmed',
    '☐ Attribution and acknowledgments verified',
    '☐ Ongoing relationship maintenance plan established'
  ]
};

// ACKNOWLEDGMENT TEMPLATES
export const acknowledgmentTemplates = {
  general: 'We acknowledge the Yuin people as the Traditional Owners of the land and waters of Twofold Bay, and recognize their continuing connection to country, culture, and community.',
  
  withOrcas: 'We acknowledge that the relationships between the Yuin people and orcas in these waters span thousands of years, and that Old Tom\'s story builds upon this foundation of respect and understanding.',
  
  education: 'This educational content seeks to honor both traditional Indigenous knowledge and historical European experiences in Twofold Bay, recognizing the value of multiple perspectives in understanding our shared marine heritage.',
  
  ongoing: 'We recognize the ongoing role of Yuin people in caring for country and marine environments, and acknowledge their continuing contributions to conservation and cultural preservation.'
};

// MONITORING AND EVALUATION
export interface CulturalSensitivityMetric {
  aspect: string;
  measurement: string;
  target: string;
  reviewFrequency: string;
}

export const culturalSensitivityMetrics: CulturalSensitivityMetric[] = [
  {
    aspect: 'Community Feedback',
    measurement: 'Feedback from Indigenous community members',
    target: 'Positive reception and no major concerns raised',
    reviewFrequency: 'Quarterly'
  },
  {
    aspect: 'Educational Accuracy',
    measurement: 'Historical and cultural accuracy assessments',
    target: 'No factual errors or cultural misrepresentations',
    reviewFrequency: 'Annual'
  },
  {
    aspect: 'Relationship Quality',
    measurement: 'Ongoing consultation relationships',
    target: 'Maintained positive relationships with cultural advisors',
    reviewFrequency: 'Bi-annual'
  },
  {
    aspect: 'Content Updates',
    measurement: 'Incorporation of new guidance or feedback',
    target: 'Regular updates based on community input',
    reviewFrequency: 'As needed'
  }
];

export default {
  culturalSensitivityGuidelines,
  consultationRequirements,
  historicalSources,
  contentDevelopmentStages,
  respectfulLanguageGuide,
  implementationChecklist,
  acknowledgmentTemplates,
  culturalSensitivityMetrics
};