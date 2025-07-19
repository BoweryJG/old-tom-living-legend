import { openaiService } from './openaiService';
import { characterPersonalityService, CharacterPersonality } from './characterPersonalityService';
import { conversationMemoryService } from './conversationMemoryService';
import { emotionalAIService } from './emotionalAIService';
import { elevenlabsService } from './elevenlabsService';

interface AskOldTomRequest {
  question: string;
  childAge?: number;
  sessionId: string;
  context?: {
    currentEmotion?: string;
    previousTopics?: string[];
    learningLevel?: 'beginner' | 'intermediate' | 'advanced';
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
  };
  inputMethod: 'voice' | 'text';
  voiceData?: any;
}

interface AskOldTomResponse {
  textResponse: string;
  audioResponse?: string;
  emotion: string;
  character: CharacterPersonality;
  educationalContent: {
    topic: string;
    learningObjectives: string[];
    ageAppropriate: boolean;
    difficultyLevel: 'simple' | 'moderate' | 'complex';
    relatedTopics: string[];
  };
  followUpSuggestions: string[];
  safetyValidation: {
    appropriate: boolean;
    concerns: string[];
    recommendations: string[];
  };
  conversationContext: {
    updated: boolean;
    relationshipLevel: string;
    newMemories: string[];
  };
}

interface KnowledgeArea {
  id: string;
  name: string;
  ageRanges: {
    '3-5': {
      vocabulary: string[];
      concepts: string[];
      examples: string[];
    };
    '6-8': {
      vocabulary: string[];
      concepts: string[];
      examples: string[];
    };
    '9-12': {
      vocabulary: string[];
      concepts: string[];
      examples: string[];
    };
  };
  safetyGuidelines: string[];
  educationalObjectives: string[];
}

class AskOldTomService {
  private knowledgeBase: Map<string, KnowledgeArea> = new Map();
  private responseTemplates: Map<string, any> = new Map();
  private safetyFilters: Map<string, RegExp[]> = new Map();
  private conversationStarters: string[] = [];

  constructor() {
    this.initializeKnowledgeBase();
    this.initializeResponseTemplates();
    this.initializeSafetyFilters();
    this.initializeConversationStarters();
  }

  private initializeKnowledgeBase() {
    // Marine Biology Knowledge
    this.knowledgeBase.set('marine_biology', {
      id: 'marine_biology',
      name: 'Marine Biology and Ocean Life',
      ageRanges: {
        '3-5': {
          vocabulary: ['fish', 'whale', 'big', 'swim', 'water', 'ocean', 'friendly', 'family'],
          concepts: ['Fish live in the ocean', 'Whales are very big', 'Ocean animals are friends'],
          examples: ['Old Tom is a big whale who lives in the ocean and helps people']
        },
        '6-8': {
          vocabulary: ['marine animals', 'ecosystem', 'habitat', 'species', 'cooperation', 'behavior'],
          concepts: ['Ocean ecosystems support many species', 'Animals cooperate for survival', 'Each species has unique behaviors'],
          examples: ['Orcas like Old Tom hunt in groups and can learn to work with humans']
        },
        '9-12': {
          vocabulary: ['biodiversity', 'symbiotic relationships', 'apex predator', 'marine conservation', 'cetacean intelligence'],
          concepts: ['Marine biodiversity supports ocean health', 'Orcas are highly intelligent apex predators', 'Human-wildlife partnerships can benefit both species'],
          examples: ['Old Tom\'s pack demonstrated advanced cognitive abilities by developing hunting partnerships with whalers']
        }
      },
      safetyGuidelines: [
        'Focus on positive human-animal relationships',
        'Emphasize respect for marine life',
        'Avoid graphic details about predation',
        'Promote ocean conservation'
      ],
      educationalObjectives: [
        'Understand marine ecosystems',
        'Appreciate animal intelligence',
        'Learn about conservation',
        'Develop respect for nature'
      ]
    });

    // Friendship and Cooperation
    this.knowledgeBase.set('friendship_cooperation', {
      id: 'friendship_cooperation',
      name: 'Friendship, Loyalty, and Cooperation',
      ageRanges: {
        '3-5': {
          vocabulary: ['friend', 'help', 'kind', 'share', 'care', 'together', 'nice'],
          concepts: ['Friends help each other', 'Being kind is important', 'We can work together'],
          examples: ['Old Tom and George were best friends who helped each other every day']
        },
        '6-8': {
          vocabulary: ['cooperation', 'trust', 'loyalty', 'partnership', 'teamwork', 'respect'],
          concepts: ['Trust builds strong friendships', 'Cooperation helps everyone succeed', 'Loyalty means staying faithful to friends'],
          examples: ['Old Tom showed loyalty by always coming when George needed help with whaling']
        },
        '9-12': {
          vocabulary: ['mutual respect', 'interdependence', 'commitment', 'reciprocity', 'alliance'],
          concepts: ['Successful partnerships require mutual respect', 'Interdependence creates stronger communities', 'Commitment builds lasting relationships'],
          examples: ['The partnership between Old Tom and the whalers created a unique alliance that benefited both species']
        }
      },
      safetyGuidelines: [
        'Emphasize healthy friendship boundaries',
        'Promote kindness and empathy',
        'Encourage inclusive friendships',
        'Teach conflict resolution'
      ],
      educationalObjectives: [
        'Develop social skills',
        'Understand cooperation',
        'Build empathy',
        'Learn about loyalty'
      ]
    });

    // Historical Context
    this.knowledgeBase.set('maritime_history', {
      id: 'maritime_history',
      name: 'Maritime History and Coastal Life',
      ageRanges: {
        '3-5': {
          vocabulary: ['boat', 'sailor', 'long ago', 'work', 'ocean', 'fishing'],
          concepts: ['People used to work on boats', 'Long ago, life was different', 'People worked hard by the ocean'],
          examples: ['George was a sailor who worked on boats near the ocean long, long ago']
        },
        '6-8': {
          vocabulary: ['whaling', 'maritime', 'coastal community', 'tradition', 'historical', 'livelihood'],
          concepts: ['Coastal communities depended on the ocean', 'Maritime traditions shaped culture', 'Historical practices evolved over time'],
          examples: ['In the early 1900s, Eden was a whaling town where people like George made their living from the sea']
        },
        '9-12': {
          vocabulary: ['sustainable practices', 'maritime heritage', 'economic dependence', 'technological advancement', 'cultural evolution'],
          concepts: ['Historical maritime practices provide lessons for modern conservation', 'Economic dependence on natural resources requires balance', 'Cultural traditions can evolve with understanding'],
          examples: ['The Eden whaling station represents a unique chapter in maritime history where humans and orcas developed an unprecedented working relationship']
        }
      },
      safetyGuidelines: [
        'Present historical context age-appropriately',
        'Focus on positive aspects of human-nature relationships',
        'Avoid graphic details about historical practices',
        'Connect historical lessons to modern conservation'
      ],
      educationalObjectives: [
        'Understand historical context',
        'Learn about cultural traditions',
        'Appreciate historical figures',
        'Connect past to present'
      ]
    });

    // Ocean Science and Geography
    this.knowledgeBase.set('ocean_science', {
      id: 'ocean_science',
      name: 'Ocean Science and Geography',
      ageRanges: {
        '3-5': {
          vocabulary: ['water', 'deep', 'waves', 'fish', 'blue', 'big', 'cold', 'warm'],
          concepts: ['The ocean is very big and deep', 'Ocean water moves in waves', 'Different ocean areas have different temperatures'],
          examples: ['Old Tom lived in the deep blue ocean where the water was sometimes warm and sometimes cold']
        },
        '6-8': {
          vocabulary: ['currents', 'tides', 'temperature', 'depth', 'marine zones', 'weather patterns'],
          concepts: ['Ocean currents move water around the world', 'Tides change throughout the day', 'Ocean depth affects marine life'],
          examples: ['Old Tom knew how to use ocean currents and tides to help the whalers find other whales']
        },
        '9-12': {
          vocabulary: ['oceanography', 'thermoclines', 'pelagic zones', 'continental shelf', 'marine productivity'],
          concepts: ['Oceanographic conditions affect marine ecosystems', 'Different ocean zones support different life forms', 'Ocean science helps us understand marine behavior'],
          examples: ['Old Tom\'s knowledge of local oceanographic conditions made him an invaluable partner to the Eden whalers']
        }
      },
      safetyGuidelines: [
        'Emphasize ocean safety and respect',
        'Promote scientific curiosity',
        'Encourage environmental awareness',
        'Connect science to conservation'
      ],
      educationalObjectives: [
        'Understand ocean systems',
        'Develop scientific thinking',
        'Learn about geography',
        'Appreciate natural systems'
      ]
    });
  }

  private initializeResponseTemplates() {
    // Old Tom's response templates based on topics and age groups
    this.responseTemplates.set('marine_biology_3-5', {
      intro: ["Let me tell you about my ocean friends, little one!", "Oh, the ocean is full of wonderful creatures!"],
      explanation: ["You see, {concept} because {reason}. It's quite magical!"],
      connection: ["Just like how I {example}, ocean animals {behavior}."],
      encouragement: ["You're such a curious explorer! What else would you like to know?"]
    });

    this.responseTemplates.set('friendship_3-5', {
      intro: ["Friendship is one of the most beautiful things in the ocean and on land!"],
      explanation: ["George and I were the very best of friends because {reason}."],
      connection: ["Just like how you might {child_example}, friends {action}."],
      encouragement: ["Being a good friend is something you can practice every day!"]
    });

    this.responseTemplates.set('learning_encouragement', {
      curious: ["What a wonderful question! Your curiosity makes my old heart happy."],
      confused: ["That's quite alright, young explorer. Even I had to learn these things slowly."],
      excited: ["I can feel your excitement from here! Let me share something amazing with you."],
      thoughtful: ["You're thinking deeply about this, just like a true ocean scholar."]
    });
  }

  private initializeSafetyFilters() {
    // Inappropriate content filters
    this.safetyFilters.set('violence', [
      /kill/gi, /death/gi, /hurt/gi, /pain/gi, /blood/gi, /attack/gi, /fight/gi
    ]);

    this.safetyFilters.set('scary_content', [
      /scary/gi, /frightening/gi, /terrifying/gi, /horrible/gi, /nightmare/gi
    ]);

    this.safetyFilters.set('inappropriate_topics', [
      /dating/gi, /romance/gi, /adult/gi, /grown.?up.?stuff/gi
    ]);
  }

  private initializeConversationStarters() {
    this.conversationStarters = [
      "What would you like to know about the ocean today?",
      "Have you ever wondered how whales talk to each other?",
      "Would you like to hear about the time George and I worked together?",
      "What's your favorite thing about the ocean?",
      "Do you have any questions about friendship and helping others?",
      "Would you like to learn about the amazing creatures I've met in the deep sea?"
    ];
  }

  public async askOldTom(request: AskOldTomRequest): Promise<AskOldTomResponse> {
    try {
      // Step 1: Safety validation
      const safetyValidation = this.validateQuestionSafety(request.question, request.childAge);
      if (!safetyValidation.appropriate) {
        return this.createSafeRedirectResponse(request, safetyValidation);
      }

      // Step 2: Emotion analysis
      const emotionalAnalysis = await emotionalAIService.processChildInteraction(
        {
          text: request.question,
          voiceData: request.voiceData,
          sessionData: {
            childAge: request.childAge,
            sessionDuration: 0, // Will be calculated by memory service
            responseTime: 1000, // Average response time
            interactionCount: 1
          }
        },
        'old-tom',
        this.extractTopicFromQuestion(request.question)
      );

      // Step 3: Determine knowledge area and age-appropriate content
      const knowledgeArea = this.identifyKnowledgeArea(request.question);
      const ageGroup = this.determineAgeGroup(request.childAge || 7);
      const educationalContent = this.generateEducationalContent(knowledgeArea, ageGroup, request.question);

      // Step 4: Get conversation context
      const conversationContext = conversationMemoryService.getConversationContext(
        request.sessionId,
        'old-tom'
      );

      // Step 5: Generate Old Tom's response
      const characterResponse = await this.generateOldTomResponse(
        request,
        emotionalAnalysis,
        knowledgeArea,
        ageGroup,
        conversationContext
      );

      // Step 6: Generate audio if requested
      let audioResponse: string | undefined;
      if (request.inputMethod === 'voice') {
        audioResponse = await this.generateAudioResponse(
          characterResponse,
          emotionalAnalysis.recommendedCharacterResponse.emotion,
          ageGroup
        );
      }

      // Step 7: Update conversation memory
      const memoryResult = await this.updateConversationMemory(
        request,
        characterResponse,
        emotionalAnalysis,
        educationalContent
      );

      // Step 8: Generate follow-up suggestions
      const followUpSuggestions = this.generateFollowUpSuggestions(
        knowledgeArea,
        ageGroup,
        emotionalAnalysis.detectedEmotion.primary
      );

      return {
        textResponse: characterResponse,
        audioResponse,
        emotion: emotionalAnalysis.recommendedCharacterResponse.emotion,
        character: 'old-tom',
        educationalContent,
        followUpSuggestions,
        safetyValidation,
        conversationContext: {
          updated: memoryResult.updated,
          relationshipLevel: conversationContext.relationshipLevel,
          newMemories: memoryResult.newMemories
        }
      };

    } catch (error) {
      console.error('Error in askOldTom:', error);
      return this.createErrorResponse(request);
    }
  }

  private validateQuestionSafety(question: string, childAge?: number): {
    appropriate: boolean;
    concerns: string[];
    recommendations: string[];
  } {
    const concerns: string[] = [];
    const recommendations: string[] = [];
    let appropriate = true;

    // Check against safety filters
    for (const [category, patterns] of this.safetyFilters.entries()) {
      for (const pattern of patterns) {
        if (pattern.test(question)) {
          concerns.push(`Contains ${category.replace('_', ' ')} content`);
          appropriate = false;
        }
      }
    }

    // Age-specific checks
    if (childAge && childAge < 6) {
      const complexWords = ['death', 'violence', 'scary', 'dangerous', 'frightening'];
      complexWords.forEach(word => {
        if (question.toLowerCase().includes(word)) {
          concerns.push(`Topic may be too complex for age ${childAge}`);
          recommendations.push('Redirect to gentler, age-appropriate topics');
        }
      });
    }

    // Educational value check
    const educationalKeywords = ['learn', 'teach', 'explain', 'show', 'tell', 'how', 'what', 'why', 'where'];
    const hasEducationalValue = educationalKeywords.some(keyword => 
      question.toLowerCase().includes(keyword)
    );

    if (!hasEducationalValue && question.length < 10) {
      recommendations.push('Encourage more specific questions to enhance learning');
    }

    return {
      appropriate,
      concerns,
      recommendations
    };
  }

  private identifyKnowledgeArea(question: string): string {
    const questionLower = question.toLowerCase();
    
    // Marine biology keywords
    const marineKeywords = ['whale', 'ocean', 'fish', 'sea', 'marine', 'swim', 'underwater', 'creature', 'animal'];
    if (marineKeywords.some(keyword => questionLower.includes(keyword))) {
      return 'marine_biology';
    }
    
    // Friendship keywords
    const friendshipKeywords = ['friend', 'help', 'cooperation', 'together', 'loyalty', 'trust', 'partnership'];
    if (friendshipKeywords.some(keyword => questionLower.includes(keyword))) {
      return 'friendship_cooperation';
    }
    
    // History keywords
    const historyKeywords = ['george', 'whaling', 'old days', 'history', 'past', 'long ago', 'before'];
    if (historyKeywords.some(keyword => questionLower.includes(keyword))) {
      return 'maritime_history';
    }
    
    // Ocean science keywords
    const scienceKeywords = ['current', 'tide', 'deep', 'temperature', 'wave', 'depth', 'geography'];
    if (scienceKeywords.some(keyword => questionLower.includes(keyword))) {
      return 'ocean_science';
    }
    
    return 'general';
  }

  private determineAgeGroup(age: number): '3-5' | '6-8' | '9-12' {
    if (age <= 5) return '3-5';
    if (age <= 8) return '6-8';
    return '9-12';
  }

  private generateEducationalContent(knowledgeArea: string, ageGroup: string, question: string): AskOldTomResponse['educationalContent'] {
    const knowledge = this.knowledgeBase.get(knowledgeArea);
    
    if (!knowledge) {
      return {
        topic: 'General Ocean Knowledge',
        learningObjectives: ['Explore curiosity about the ocean'],
        ageAppropriate: true,
        difficultyLevel: 'simple',
        relatedTopics: ['marine life', 'friendship', 'ocean exploration']
      };
    }

    const ageContent = knowledge.ageRanges[ageGroup as keyof typeof knowledge.ageRanges];
    
    return {
      topic: knowledge.name,
      learningObjectives: knowledge.educationalObjectives,
      ageAppropriate: true,
      difficultyLevel: ageGroup === '3-5' ? 'simple' : ageGroup === '6-8' ? 'moderate' : 'complex',
      relatedTopics: this.generateRelatedTopics(knowledgeArea, question)
    };
  }

  private generateRelatedTopics(knowledgeArea: string, question: string): string[] {
    const topicMap: Record<string, string[]> = {
      'marine_biology': ['whale families', 'ocean food chains', 'marine conservation', 'ocean exploration'],
      'friendship_cooperation': ['teamwork', 'helping others', 'trust building', 'communication'],
      'maritime_history': ['sailing ships', 'coastal communities', 'ocean traditions', 'historical figures'],
      'ocean_science': ['ocean currents', 'marine geography', 'weather patterns', 'underwater exploration'],
      'general': ['ocean wonders', 'marine animals', 'friendship stories', 'ocean adventures']
    };

    return topicMap[knowledgeArea] || topicMap['general'];
  }

  private async generateOldTomResponse(
    request: AskOldTomRequest,
    emotionalAnalysis: any,
    knowledgeArea: string,
    ageGroup: string,
    conversationContext: any
  ): Promise<string> {
    const knowledge = this.knowledgeBase.get(knowledgeArea);
    const ageContent = knowledge?.ageRanges[ageGroup as keyof typeof knowledge.ageRanges];
    
    // Build context for character response
    const characterContext = {
      characterPersonality: [
        'Wise and ancient ocean dweller',
        'Patient teacher and protector',
        'Loyal friend with deep ocean knowledge',
        'Gentle giant with infinite compassion'
      ],
      memories: [
        'Partnership with George Davidson',
        'Years of cooperation with whalers',
        'Protecting other whales and humans',
        'Witnessing ocean changes over decades'
      ],
      conversationHistory: conversationContext.conversationHistory || [],
      currentMood: emotionalAnalysis.recommendedCharacterResponse.emotion,
      backstory: 'Old Tom, the legendary orca of Eden, with decades of wisdom and friendship with humans'
    };

    // Generate response using character personality service
    const baseResponse = await characterPersonalityService.generateCharacterResponse(
      'old-tom',
      request.question,
      {
        topic: this.extractTopicFromQuestion(request.question),
        childAge: request.childAge,
        emotionalNeeds: emotionalAnalysis.safetyAlerts,
        previousInteractions: conversationContext.sessionInfo?.totalInteractions || 0,
        relationshipLevel: conversationContext.relationshipLevel || 'stranger',
        currentSession: {
          startTime: conversationContext.sessionInfo?.startTime || Date.now(),
          messageCount: 1,
          dominantEmotions: [emotionalAnalysis.detectedEmotion.primary]
        }
      },
      emotionalAnalysis.recommendedCharacterResponse.emotion
    );

    // Enhance response with age-appropriate knowledge
    const enhancedResponse = this.enhanceResponseWithKnowledge(
      baseResponse,
      knowledgeArea,
      ageGroup,
      request.question,
      ageContent
    );

    return enhancedResponse;
  }

  private enhanceResponseWithKnowledge(
    baseResponse: string,
    knowledgeArea: string,
    ageGroup: string,
    question: string,
    ageContent: any
  ): string {
    if (!ageContent) return baseResponse;

    // Add relevant vocabulary and concepts naturally
    let enhancedResponse = baseResponse;
    
    // For younger children, ensure simple vocabulary
    if (ageGroup === '3-5') {
      // Replace complex words with simpler ones
      enhancedResponse = enhancedResponse.replace(/ecosystem/g, 'ocean home');
      enhancedResponse = enhancedResponse.replace(/cooperation/g, 'working together');
      enhancedResponse = enhancedResponse.replace(/marine/g, 'ocean');
    }
    
    // Add educational examples if appropriate
    if (ageContent.examples && ageContent.examples.length > 0) {
      const relevantExample = ageContent.examples[0];
      if (!enhancedResponse.includes(relevantExample.substring(0, 20))) {
        enhancedResponse += ` For example, ${relevantExample}.`;
      }
    }
    
    return enhancedResponse;
  }

  private async generateAudioResponse(
    textResponse: string,
    emotion: string,
    ageGroup: string
  ): Promise<string> {
    try {
      return await elevenlabsService.generateContextualSpeech(
        textResponse,
        {
          character: 'old-tom',
          emotion: emotion,
          situation: 'educational',
          childAge: ageGroup === '3-5' ? 4 : ageGroup === '6-8' ? 7 : 10,
          urgency: 'low'
        }
      );
    } catch (error) {
      console.error('Error generating audio response:', error);
      return '';
    }
  }

  private async updateConversationMemory(
    request: AskOldTomRequest,
    response: string,
    emotionalAnalysis: any,
    educationalContent: any
  ): Promise<{ updated: boolean; newMemories: string[] }> {
    try {
      const memoryId = await conversationMemoryService.addConversationMemory({
        participantId: request.sessionId,
        characterId: 'old-tom',
        userInput: {
          text: request.question,
          emotion: emotionalAnalysis.detectedEmotion.primary,
          context: educationalContent.topic,
          inputMethod: request.inputMethod
        },
        characterResponse: {
          text: response,
          emotion: emotionalAnalysis.recommendedCharacterResponse.emotion,
          responseTime: 2000 // Approximate response time
        },
        sessionData: {
          sessionId: request.sessionId,
          childAge: request.childAge,
          relationshipLevel: 5, // Base relationship level
          topicsDiscussed: [educationalContent.topic],
          emotionalState: [emotionalAnalysis.detectedEmotion.primary]
        },
        learningObjectives: {
          topic: educationalContent.topic,
          complexity: educationalContent.difficultyLevel,
          achieved: true
        },
        safetyFlags: {
          contentAppropriate: true,
          emotionalSupport: emotionalAnalysis.safetyAlerts.length === 0,
          educationalValue: true
        }
      });

      return {
        updated: true,
        newMemories: [`Learned about ${educationalContent.topic}`, `Expressed ${emotionalAnalysis.detectedEmotion.primary} emotion`]
      };
    } catch (error) {
      console.error('Error updating conversation memory:', error);
      return { updated: false, newMemories: [] };
    }
  }

  private generateFollowUpSuggestions(
    knowledgeArea: string,
    ageGroup: string,
    emotion: string
  ): string[] {
    const suggestions: string[] = [];
    
    // Base suggestions by knowledge area
    const areaSuggestions: Record<string, string[]> = {
      'marine_biology': [
        'Would you like to learn about whale families?',
        'Shall I tell you about other ocean creatures I know?',
        'Would you like to hear about how whales talk to each other?'
      ],
      'friendship_cooperation': [
        'Would you like to hear about a time George and I helped each other?',
        'Shall I tell you about other friendships in the ocean?',
        'Would you like to learn about working together as a team?'
      ],
      'maritime_history': [
        'Would you like to hear more stories about the old days?',
        'Shall I tell you about life in coastal towns long ago?',
        'Would you like to learn about ships and sailing?'
      ],
      'ocean_science': [
        'Would you like to explore the deepest parts of the ocean?',
        'Shall I tell you about ocean currents and how they work?',
        'Would you like to learn about ocean weather?'
      ]
    };
    
    suggestions.push(...(areaSuggestions[knowledgeArea] || areaSuggestions['marine_biology']));
    
    // Emotion-based suggestions
    if (emotion === 'excited') {
      suggestions.push('I can tell you\'re excited! What interests you most?');
    } else if (emotion === 'curious') {
      suggestions.push('You have such wonderful questions! What else would you like to explore?');
    } else if (emotion === 'confused') {
      suggestions.push('Would you like me to explain that in a different way?');
    }
    
    // Age-appropriate suggestions
    if (ageGroup === '3-5') {
      suggestions.push('Would you like to hear a gentle ocean story?');
    } else if (ageGroup === '9-12') {
      suggestions.push('Would you like to explore some advanced ocean science?');
    }
    
    return suggestions.slice(0, 4); // Return up to 4 suggestions
  }

  private createSafeRedirectResponse(
    request: AskOldTomRequest,
    safetyValidation: any
  ): AskOldTomResponse {
    const redirectResponse = "That's an interesting question, young explorer! But let me tell you about something even more wonderful - the amazing friendships in the ocean. Would you like to hear about how I became friends with George?";
    
    return {
      textResponse: redirectResponse,
      emotion: 'gentle',
      character: 'old-tom',
      educationalContent: {
        topic: 'Friendship and Ocean Life',
        learningObjectives: ['Learn about positive relationships', 'Explore ocean friendships'],
        ageAppropriate: true,
        difficultyLevel: 'simple',
        relatedTopics: ['friendship', 'cooperation', 'ocean animals']
      },
      followUpSuggestions: this.conversationStarters.slice(0, 3),
      safetyValidation,
      conversationContext: {
        updated: false,
        relationshipLevel: 'stranger',
        newMemories: []
      }
    };
  }

  private createErrorResponse(request: AskOldTomRequest): AskOldTomResponse {
    const errorResponse = "Oh my, it seems the ocean currents are a bit choppy today! Let me try to help you in a different way. What would you like to learn about the ocean?";
    
    return {
      textResponse: errorResponse,
      emotion: 'gentle',
      character: 'old-tom',
      educationalContent: {
        topic: 'General Ocean Exploration',
        learningObjectives: ['Encourage continued exploration'],
        ageAppropriate: true,
        difficultyLevel: 'simple',
        relatedTopics: ['ocean exploration', 'marine life']
      },
      followUpSuggestions: this.conversationStarters.slice(0, 3),
      safetyValidation: {
        appropriate: true,
        concerns: [],
        recommendations: []
      },
      conversationContext: {
        updated: false,
        relationshipLevel: 'stranger',
        newMemories: []
      }
    };
  }

  private extractTopicFromQuestion(question: string): string {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('whale') || questionLower.includes('ocean')) return 'marine life';
    if (questionLower.includes('friend') || questionLower.includes('help')) return 'friendship';
    if (questionLower.includes('george') || questionLower.includes('history')) return 'history';
    if (questionLower.includes('deep') || questionLower.includes('current')) return 'ocean science';
    
    return 'general';
  }

  // Public utility methods
  public getRandomConversationStarter(): string {
    return this.conversationStarters[Math.floor(Math.random() * this.conversationStarters.length)];
  }

  public getKnowledgeAreas(): string[] {
    return Array.from(this.knowledgeBase.keys());
  }

  public getAgeAppropriateTopics(age: number): string[] {
    const ageGroup = this.determineAgeGroup(age);
    const topics: string[] = [];
    
    this.knowledgeBase.forEach((knowledge, key) => {
      const ageContent = knowledge.ageRanges[ageGroup];
      if (ageContent && ageContent.concepts.length > 0) {
        topics.push(knowledge.name);
      }
    });
    
    return topics;
  }

  public validateTopicAppropriateForAge(topic: string, age: number): boolean {
    const ageGroup = this.determineAgeGroup(age);
    const knowledge = this.knowledgeBase.get(topic);
    
    if (!knowledge) return true; // Default to appropriate if unknown
    
    const ageContent = knowledge.ageRanges[ageGroup];
    return ageContent && ageContent.concepts.length > 0;
  }
}

export const askOldTomService = new AskOldTomService();
export default AskOldTomService;