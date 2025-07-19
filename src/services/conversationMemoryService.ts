interface ConversationMemory {
  id: string;
  timestamp: number;
  participantId: string; // Child's session ID
  characterId: string;
  userInput: {
    text: string;
    emotion?: string;
    context: string;
    inputMethod: 'voice' | 'text' | 'gesture';
  };
  characterResponse: {
    text: string;
    emotion: string;
    voiceSettings?: any;
    responseTime: number;
  };
  sessionData: {
    sessionId: string;
    childAge?: number;
    relationshipLevel: number;
    topicsDiscussed: string[];
    emotionalState: string[];
  };
  learningObjectives?: {
    topic: string;
    complexity: 'simple' | 'intermediate' | 'advanced';
    achieved: boolean;
  };
  safetyFlags: {
    contentAppropriate: boolean;
    emotionalSupport: boolean;
    educationalValue: boolean;
  };
}

interface ContextualMemory {
  shortTerm: ConversationMemory[]; // Last 10-20 interactions
  sessionSummary: {
    startTime: number;
    totalInteractions: number;
    dominantTopics: string[];
    emotionalJourney: string[];
    learningProgress: Record<string, number>;
    relationshipGrowth: number;
  };
  personalPreferences: {
    favoriteTopics: string[];
    communicationStyle: 'visual' | 'auditory' | 'interactive';
    attentionSpan: 'short' | 'medium' | 'long';
    curiosityAreas: string[];
  };
  longTermMemory: {
    importantMoments: ConversationMemory[];
    characterRelationships: Record<string, number>;
    knowledgeRetained: Record<string, string[]>;
    personalGrowth: Array<{
      date: number;
      milestone: string;
      context: string;
    }>;
  };
}

interface PrivacySettings {
  dataRetention: {
    sessionMemory: number; // hours
    personalData: number; // days
    learningProgress: number; // days
  };
  anonymization: {
    removePersonalIdentifiers: boolean;
    hashSensitiveData: boolean;
    aggregateOnly: boolean;
  };
  parental: {
    consentRequired: boolean;
    dataExportAvailable: boolean;
    deletionOnRequest: boolean;
  };
}

class ConversationMemoryService {
  private memories: Map<string, ContextualMemory> = new Map();
  private sessionCache: Map<string, ConversationMemory[]> = new Map();
  private privacySettings: PrivacySettings;
  private maxShortTermMemory: number = 20;
  private maxLongTermMemory: number = 100;

  constructor() {
    this.privacySettings = {
      dataRetention: {
        sessionMemory: 24, // 24 hours
        personalData: 7,   // 7 days
        learningProgress: 30 // 30 days
      },
      anonymization: {
        removePersonalIdentifiers: true,
        hashSensitiveData: true,
        aggregateOnly: false
      },
      parental: {
        consentRequired: true,
        dataExportAvailable: true,
        deletionOnRequest: true
      }
    };

    // Set up cleanup intervals
    this.startCleanupScheduler();
  }

  public async addConversationMemory(memory: Omit<ConversationMemory, 'id' | 'timestamp'>): Promise<string> {
    const memoryId = this.generateMemoryId();
    const fullMemory: ConversationMemory = {
      ...memory,
      id: memoryId,
      timestamp: Date.now()
    };

    // Validate content safety
    if (!this.validateContentSafety(fullMemory)) {
      console.warn('Content safety validation failed for memory:', memoryId);
      return memoryId; // Still return ID but don't store unsafe content
    }

    // Add to session cache first
    const sessionId = memory.sessionData.sessionId;
    if (!this.sessionCache.has(sessionId)) {
      this.sessionCache.set(sessionId, []);
    }
    this.sessionCache.get(sessionId)!.push(fullMemory);

    // Update contextual memory
    await this.updateContextualMemory(memory.participantId, fullMemory);

    return memoryId;
  }

  private async updateContextualMemory(participantId: string, memory: ConversationMemory): Promise<void> {
    let contextualMemory = this.memories.get(participantId);
    
    if (!contextualMemory) {
      contextualMemory = this.createNewContextualMemory(memory);
      this.memories.set(participantId, contextualMemory);
      return;
    }

    // Update short-term memory
    contextualMemory.shortTerm.push(memory);
    if (contextualMemory.shortTerm.length > this.maxShortTermMemory) {
      // Move important memories to long-term before removing
      const removedMemory = contextualMemory.shortTerm.shift()!;
      if (this.isImportantMemory(removedMemory)) {
        this.moveToLongTermMemory(contextualMemory, removedMemory);
      }
    }

    // Update session summary
    this.updateSessionSummary(contextualMemory, memory);

    // Update personal preferences
    this.updatePersonalPreferences(contextualMemory, memory);

    // Update relationship levels
    this.updateRelationshipLevel(contextualMemory, memory);
  }

  private createNewContextualMemory(firstMemory: ConversationMemory): ContextualMemory {
    return {
      shortTerm: [firstMemory],
      sessionSummary: {
        startTime: Date.now(),
        totalInteractions: 1,
        dominantTopics: [firstMemory.sessionData.topicsDiscussed[0] || 'general'],
        emotionalJourney: [firstMemory.userInput.emotion || 'neutral'],
        learningProgress: {},
        relationshipGrowth: 0
      },
      personalPreferences: {
        favoriteTopics: [],
        communicationStyle: firstMemory.userInput.inputMethod === 'voice' ? 'auditory' : 'visual',
        attentionSpan: 'medium',
        curiosityAreas: []
      },
      longTermMemory: {
        importantMoments: [],
        characterRelationships: { [firstMemory.characterId]: 1 },
        knowledgeRetained: {},
        personalGrowth: []
      }
    };
  }

  private updateSessionSummary(contextualMemory: ContextualMemory, memory: ConversationMemory): void {
    const summary = contextualMemory.sessionSummary;
    
    summary.totalInteractions++;
    
    // Track topics
    memory.sessionData.topicsDiscussed.forEach(topic => {
      if (!summary.dominantTopics.includes(topic)) {
        summary.dominantTopics.push(topic);
      }
    });
    
    // Track emotional journey
    if (memory.userInput.emotion && !summary.emotionalJourney.includes(memory.userInput.emotion)) {
      summary.emotionalJourney.push(memory.userInput.emotion);
    }
    
    // Update learning progress
    if (memory.learningObjectives) {
      const topic = memory.learningObjectives.topic;
      if (!summary.learningProgress[topic]) {
        summary.learningProgress[topic] = 0;
      }
      if (memory.learningObjectives.achieved) {
        summary.learningProgress[topic]++;
      }
    }
    
    summary.relationshipGrowth = memory.sessionData.relationshipLevel;
  }

  private updatePersonalPreferences(contextualMemory: ContextualMemory, memory: ConversationMemory): void {
    const preferences = contextualMemory.personalPreferences;
    
    // Track favorite topics
    memory.sessionData.topicsDiscussed.forEach(topic => {
      if (!preferences.favoriteTopics.includes(topic)) {
        preferences.favoriteTopics.push(topic);
      }
    });
    
    // Limit favorite topics to most recent/frequent
    if (preferences.favoriteTopics.length > 10) {
      preferences.favoriteTopics = preferences.favoriteTopics.slice(-10);
    }
    
    // Update communication style based on usage patterns
    const recentInteractions = contextualMemory.shortTerm.slice(-5);
    const voiceCount = recentInteractions.filter(m => m.userInput.inputMethod === 'voice').length;
    
    if (voiceCount >= 3) {
      preferences.communicationStyle = 'auditory';
    } else if (voiceCount <= 1) {
      preferences.communicationStyle = 'visual';
    } else {
      preferences.communicationStyle = 'interactive';
    }
    
    // Estimate attention span based on interaction length
    const avgResponseTime = recentInteractions.reduce((sum, m) => 
      sum + m.characterResponse.responseTime, 0) / recentInteractions.length;
    
    if (avgResponseTime < 2000) {
      preferences.attentionSpan = 'short';
    } else if (avgResponseTime > 5000) {
      preferences.attentionSpan = 'long';
    } else {
      preferences.attentionSpan = 'medium';
    }
  }

  private updateRelationshipLevel(contextualMemory: ContextualMemory, memory: ConversationMemory): void {
    const characterId = memory.characterId;
    const relationships = contextualMemory.longTermMemory.characterRelationships;
    
    if (!relationships[characterId]) {
      relationships[characterId] = 0;
    }
    
    // Increase relationship based on positive interactions
    const positiveEmotions = ['happy', 'excited', 'curious', 'amazed'];
    if (memory.userInput.emotion && positiveEmotions.includes(memory.userInput.emotion)) {
      relationships[characterId] += 0.5;
    }
    
    // Increase for educational achievement
    if (memory.learningObjectives?.achieved) {
      relationships[characterId] += 1;
    }
    
    // Regular interaction bonus
    relationships[characterId] += 0.1;
    
    // Cap at reasonable maximum
    relationships[characterId] = Math.min(100, relationships[characterId]);
  }

  private isImportantMemory(memory: ConversationMemory): boolean {
    // Criteria for important memories
    return (
      memory.learningObjectives?.achieved === true ||
      memory.sessionData.relationshipLevel > 50 ||
      memory.userInput.emotion === 'amazed' ||
      memory.userInput.emotion === 'excited' ||
      memory.sessionData.topicsDiscussed.some(topic => 
        ['friendship', 'ocean', 'whales', 'conservation'].includes(topic)
      )
    );
  }

  private moveToLongTermMemory(contextualMemory: ContextualMemory, memory: ConversationMemory): void {
    contextualMemory.longTermMemory.importantMoments.push(memory);
    
    // Keep only most important long-term memories
    if (contextualMemory.longTermMemory.importantMoments.length > this.maxLongTermMemory) {
      contextualMemory.longTermMemory.importantMoments.sort((a, b) => {
        return this.calculateMemoryImportance(b) - this.calculateMemoryImportance(a);
      });
      contextualMemory.longTermMemory.importantMoments = 
        contextualMemory.longTermMemory.importantMoments.slice(0, this.maxLongTermMemory);
    }
  }

  private calculateMemoryImportance(memory: ConversationMemory): number {
    let score = 0;
    
    // Learning achievement
    if (memory.learningObjectives?.achieved) score += 10;
    
    // High relationship level
    score += memory.sessionData.relationshipLevel * 0.1;
    
    // Positive emotions
    const positiveEmotions = ['amazed', 'excited', 'happy', 'curious'];
    if (memory.userInput.emotion && positiveEmotions.includes(memory.userInput.emotion)) {
      score += 5;
    }
    
    // Important topics
    const importantTopics = ['friendship', 'ocean', 'whales', 'conservation', 'history'];
    memory.sessionData.topicsDiscussed.forEach(topic => {
      if (importantTopics.includes(topic)) score += 3;
    });
    
    // Recency (more recent = slightly more important)
    const ageInDays = (Date.now() - memory.timestamp) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 5 - ageInDays);
    
    return score;
  }

  private validateContentSafety(memory: ConversationMemory): boolean {
    // Check for age-appropriate content
    if (!memory.safetyFlags.contentAppropriate) {
      return false;
    }
    
    // Ensure educational value
    if (!memory.safetyFlags.educationalValue) {
      console.warn('Memory lacks educational value');
    }
    
    // Check for emotional support
    if (!memory.safetyFlags.emotionalSupport) {
      console.warn('Memory may need emotional support review');
    }
    
    // Validate response time (ensure not too quick or slow)
    if (memory.characterResponse.responseTime < 500 || memory.characterResponse.responseTime > 30000) {
      console.warn('Unusual response time detected');
    }
    
    return true;
  }

  // Public API methods
  public getConversationContext(participantId: string, characterId: string): any {
    const contextualMemory = this.memories.get(participantId);
    if (!contextualMemory) {
      return this.getDefaultContext(characterId);
    }

    const characterRelationship = contextualMemory.longTermMemory.characterRelationships[characterId] || 0;
    const recentTopics = contextualMemory.shortTerm.slice(-5)
      .flatMap(m => m.sessionData.topicsDiscussed)
      .filter((topic, index, arr) => arr.indexOf(topic) === index); // unique topics

    return {
      relationshipLevel: this.getRelationshipLabel(characterRelationship),
      previousTopics: recentTopics,
      personalPreferences: contextualMemory.personalPreferences,
      emotionalState: contextualMemory.sessionSummary.emotionalJourney.slice(-3),
      learningProgress: contextualMemory.sessionSummary.learningProgress,
      conversationHistory: this.formatConversationHistory(contextualMemory.shortTerm.slice(-10)),
      sessionInfo: {
        startTime: contextualMemory.sessionSummary.startTime,
        totalInteractions: contextualMemory.sessionSummary.totalInteractions,
        sessionDuration: Date.now() - contextualMemory.sessionSummary.startTime
      }
    };
  }

  private getDefaultContext(characterId: string): any {
    return {
      relationshipLevel: 'stranger',
      previousTopics: [],
      personalPreferences: {
        favoriteTopics: [],
        communicationStyle: 'interactive',
        attentionSpan: 'medium',
        curiosityAreas: []
      },
      emotionalState: ['curious'],
      learningProgress: {},
      conversationHistory: [],
      sessionInfo: {
        startTime: Date.now(),
        totalInteractions: 0,
        sessionDuration: 0
      }
    };
  }

  private getRelationshipLabel(level: number): string {
    if (level < 5) return 'stranger';
    if (level < 15) return 'acquaintance';
    if (level < 40) return 'friend';
    return 'trusted_friend';
  }

  private formatConversationHistory(memories: ConversationMemory[]): any[] {
    return memories.map(memory => ({
      role: 'user',
      content: memory.userInput.text,
      emotion: memory.userInput.emotion,
      timestamp: memory.timestamp
    })).concat(
      memories.map(memory => ({
        role: 'assistant',
        content: memory.characterResponse.text,
        emotion: memory.characterResponse.emotion,
        timestamp: memory.timestamp
      }))
    ).sort((a, b) => a.timestamp - b.timestamp);
  }

  public getPersonalizedRecommendations(participantId: string): {
    suggestedTopics: string[];
    learningObjectives: string[];
    characterRecommendations: string[];
  } {
    const contextualMemory = this.memories.get(participantId);
    if (!contextualMemory) {
      return {
        suggestedTopics: ['ocean basics', 'whale facts', 'friendship'],
        learningObjectives: ['learn about marine life', 'understand cooperation'],
        characterRecommendations: ['old-tom']
      };
    }

    const preferences = contextualMemory.personalPreferences;
    const learningProgress = contextualMemory.sessionSummary.learningProgress;

    // Suggest new topics based on interests
    const suggestedTopics = this.generateTopicRecommendations(preferences.favoriteTopics);
    
    // Learning objectives based on progress
    const learningObjectives = this.generateLearningObjectives(learningProgress);
    
    // Character recommendations based on relationships
    const characterRecommendations = this.generateCharacterRecommendations(
      contextualMemory.longTermMemory.characterRelationships
    );

    return {
      suggestedTopics,
      learningObjectives,
      characterRecommendations
    };
  }

  private generateTopicRecommendations(favoriteTopics: string[]): string[] {
    const topicExpansions: Record<string, string[]> = {
      'whales': ['marine ecosystems', 'whale migration', 'whale communication'],
      'ocean': ['tides', 'marine life', 'ocean conservation', 'underwater exploration'],
      'friendship': ['teamwork', 'loyalty', 'trust', 'helping others'],
      'history': ['maritime traditions', 'coastal communities', 'historical figures'],
      'conservation': ['environmental protection', 'sustainable practices', 'wildlife preservation']
    };

    const suggestions: string[] = [];
    favoriteTopics.forEach(topic => {
      const expansions = topicExpansions[topic];
      if (expansions) {
        suggestions.push(...expansions);
      }
    });

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  private generateLearningObjectives(progress: Record<string, number>): string[] {
    const objectives: string[] = [];
    
    // Basic objectives if just starting
    if (Object.keys(progress).length === 0) {
      return [
        'Learn about Old Tom and George\'s friendship',
        'Discover marine life basics',
        'Understand cooperation and teamwork'
      ];
    }

    // Advanced objectives based on progress
    Object.entries(progress).forEach(([topic, level]) => {
      if (level < 3) {
        objectives.push(`Continue exploring ${topic}`);
      } else if (level >= 3) {
        objectives.push(`Master advanced concepts in ${topic}`);
      }
    });

    return objectives.slice(0, 4);
  }

  private generateCharacterRecommendations(relationships: Record<string, number>): string[] {
    // Sort characters by relationship strength
    const sortedRelationships = Object.entries(relationships)
      .sort(([,a], [,b]) => b - a);

    const recommendations: string[] = [];
    
    // Always include Old Tom as primary character
    if (!relationships['old-tom'] || relationships['old-tom'] < 20) {
      recommendations.push('old-tom');
    }
    
    // Suggest George Davidson for historical context
    if (!relationships['george-davidson'] || relationships['george-davidson'] < 15) {
      recommendations.push('george-davidson');
    }
    
    // Add child narrator for peer learning
    if (!relationships['child-narrator'] || relationships['child-narrator'] < 10) {
      recommendations.push('child-narrator');
    }

    return recommendations;
  }

  // Privacy and data management
  public exportUserData(participantId: string): any {
    const contextualMemory = this.memories.get(participantId);
    if (!contextualMemory) {
      return null;
    }

    return {
      sessionSummary: contextualMemory.sessionSummary,
      personalPreferences: contextualMemory.personalPreferences,
      learningProgress: contextualMemory.sessionSummary.learningProgress,
      relationshipLevels: contextualMemory.longTermMemory.characterRelationships,
      exportDate: new Date().toISOString(),
      dataRetentionInfo: this.privacySettings.dataRetention
    };
  }

  public deleteUserData(participantId: string): boolean {
    if (this.memories.has(participantId)) {
      this.memories.delete(participantId);
      
      // Remove from session cache
      for (const [sessionId, memories] of this.sessionCache.entries()) {
        const filteredMemories = memories.filter(m => m.participantId !== participantId);
        if (filteredMemories.length === 0) {
          this.sessionCache.delete(sessionId);
        } else {
          this.sessionCache.set(sessionId, filteredMemories);
        }
      }
      
      return true;
    }
    return false;
  }

  private startCleanupScheduler(): void {
    // Clean up expired data every hour
    setInterval(() => {
      this.cleanupExpiredData();
    }, 60 * 60 * 1000); // 1 hour

    // Initial cleanup
    this.cleanupExpiredData();
  }

  private cleanupExpiredData(): void {
    const now = Date.now();
    const sessionRetentionMs = this.privacySettings.dataRetention.sessionMemory * 60 * 60 * 1000;
    const personalDataRetentionMs = this.privacySettings.dataRetention.personalData * 24 * 60 * 60 * 1000;

    // Clean session cache
    for (const [sessionId, memories] of this.sessionCache.entries()) {
      const validMemories = memories.filter(memory => 
        (now - memory.timestamp) < sessionRetentionMs
      );
      
      if (validMemories.length === 0) {
        this.sessionCache.delete(sessionId);
      } else {
        this.sessionCache.set(sessionId, validMemories);
      }
    }

    // Clean personal data
    for (const [participantId, contextualMemory] of this.memories.entries()) {
      // Remove old short-term memories
      contextualMemory.shortTerm = contextualMemory.shortTerm.filter(memory => 
        (now - memory.timestamp) < sessionRetentionMs
      );
      
      // Remove old long-term memories based on personal data retention
      contextualMemory.longTermMemory.importantMoments = 
        contextualMemory.longTermMemory.importantMoments.filter(memory => 
          (now - memory.timestamp) < personalDataRetentionMs
        );
      
      // Remove entire contextual memory if empty
      if (contextualMemory.shortTerm.length === 0 && 
          contextualMemory.longTermMemory.importantMoments.length === 0) {
        this.memories.delete(participantId);
      }
    }
  }

  private generateMemoryId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Analytics and insights (aggregated, privacy-safe)
  public getAggregatedInsights(): {
    totalSessions: number;
    averageSessionLength: number;
    popularTopics: string[];
    learningEffectiveness: number;
    characterPopularity: Record<string, number>;
  } {
    const allMemories = Array.from(this.memories.values());
    
    if (allMemories.length === 0) {
      return {
        totalSessions: 0,
        averageSessionLength: 0,
        popularTopics: [],
        learningEffectiveness: 0,
        characterPopularity: {}
      };
    }

    const totalSessions = allMemories.length;
    const averageSessionLength = allMemories.reduce((sum, memory) => 
      sum + (Date.now() - memory.sessionSummary.startTime), 0
    ) / totalSessions;

    // Aggregate popular topics
    const topicCounts: Record<string, number> = {};
    allMemories.forEach(memory => {
      memory.sessionSummary.dominantTopics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });
    
    const popularTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);

    // Calculate learning effectiveness
    const totalLearningAchievements = allMemories.reduce((sum, memory) => 
      sum + Object.values(memory.sessionSummary.learningProgress).reduce((a, b) => a + b, 0), 0
    );
    const learningEffectiveness = totalLearningAchievements / totalSessions;

    // Character popularity
    const characterCounts: Record<string, number> = {};
    allMemories.forEach(memory => {
      Object.keys(memory.longTermMemory.characterRelationships).forEach(character => {
        characterCounts[character] = (characterCounts[character] || 0) + 1;
      });
    });

    return {
      totalSessions,
      averageSessionLength: averageSessionLength / 1000 / 60, // Convert to minutes
      popularTopics,
      learningEffectiveness,
      characterPopularity: characterCounts
    };
  }
}

export const conversationMemoryService = new ConversationMemoryService();
export default ConversationMemoryService;