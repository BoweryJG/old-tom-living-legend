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
      const removedMemory = contextualMemory.shortTerm.shift()!;\n      if (this.isImportantMemory(removedMemory)) {\n        this.moveToLongTermMemory(contextualMemory, removedMemory);\n      }\n    }\n\n    // Update session summary\n    this.updateSessionSummary(contextualMemory, memory);\n\n    // Update personal preferences\n    this.updatePersonalPreferences(contextualMemory, memory);\n\n    // Update relationship levels\n    this.updateRelationshipLevel(contextualMemory, memory);\n  }\n\n  private createNewContextualMemory(firstMemory: ConversationMemory): ContextualMemory {\n    return {\n      shortTerm: [firstMemory],\n      sessionSummary: {\n        startTime: Date.now(),\n        totalInteractions: 1,\n        dominantTopics: [firstMemory.sessionData.topicsDiscussed[0] || 'general'],\n        emotionalJourney: [firstMemory.userInput.emotion || 'neutral'],\n        learningProgress: {},\n        relationshipGrowth: 0\n      },\n      personalPreferences: {\n        favoriteTopics: [],\n        communicationStyle: firstMemory.userInput.inputMethod === 'voice' ? 'auditory' : 'visual',\n        attentionSpan: 'medium',\n        curiosityAreas: []\n      },\n      longTermMemory: {\n        importantMoments: [],\n        characterRelationships: { [firstMemory.characterId]: 1 },\n        knowledgeRetained: {},\n        personalGrowth: []\n      }\n    };\n  }\n\n  private updateSessionSummary(contextualMemory: ContextualMemory, memory: ConversationMemory): void {\n    const summary = contextualMemory.sessionSummary;\n    \n    summary.totalInteractions++;\n    \n    // Track topics\n    memory.sessionData.topicsDiscussed.forEach(topic => {\n      if (!summary.dominantTopics.includes(topic)) {\n        summary.dominantTopics.push(topic);\n      }\n    });\n    \n    // Track emotional journey\n    if (memory.userInput.emotion && !summary.emotionalJourney.includes(memory.userInput.emotion)) {\n      summary.emotionalJourney.push(memory.userInput.emotion);\n    }\n    \n    // Update learning progress\n    if (memory.learningObjectives) {\n      const topic = memory.learningObjectives.topic;\n      if (!summary.learningProgress[topic]) {\n        summary.learningProgress[topic] = 0;\n      }\n      if (memory.learningObjectives.achieved) {\n        summary.learningProgress[topic]++;\n      }\n    }\n    \n    summary.relationshipGrowth = memory.sessionData.relationshipLevel;\n  }\n\n  private updatePersonalPreferences(contextualMemory: ContextualMemory, memory: ConversationMemory): void {\n    const preferences = contextualMemory.personalPreferences;\n    \n    // Track favorite topics\n    memory.sessionData.topicsDiscussed.forEach(topic => {\n      if (!preferences.favoriteTopics.includes(topic)) {\n        preferences.favoriteTopics.push(topic);\n      }\n    });\n    \n    // Limit favorite topics to most recent/frequent\n    if (preferences.favoriteTopics.length > 10) {\n      preferences.favoriteTopics = preferences.favoriteTopics.slice(-10);\n    }\n    \n    // Update communication style based on usage patterns\n    const recentInteractions = contextualMemory.shortTerm.slice(-5);\n    const voiceCount = recentInteractions.filter(m => m.userInput.inputMethod === 'voice').length;\n    \n    if (voiceCount >= 3) {\n      preferences.communicationStyle = 'auditory';\n    } else if (voiceCount <= 1) {\n      preferences.communicationStyle = 'visual';\n    } else {\n      preferences.communicationStyle = 'interactive';\n    }\n    \n    // Estimate attention span based on interaction length\n    const avgResponseTime = recentInteractions.reduce((sum, m) => \n      sum + m.characterResponse.responseTime, 0) / recentInteractions.length;\n    \n    if (avgResponseTime < 2000) {\n      preferences.attentionSpan = 'short';\n    } else if (avgResponseTime > 5000) {\n      preferences.attentionSpan = 'long';\n    } else {\n      preferences.attentionSpan = 'medium';\n    }\n  }\n\n  private updateRelationshipLevel(contextualMemory: ContextualMemory, memory: ConversationMemory): void {\n    const characterId = memory.characterId;\n    const relationships = contextualMemory.longTermMemory.characterRelationships;\n    \n    if (!relationships[characterId]) {\n      relationships[characterId] = 0;\n    }\n    \n    // Increase relationship based on positive interactions\n    const positiveEmotions = ['happy', 'excited', 'curious', 'amazed'];\n    if (memory.userInput.emotion && positiveEmotions.includes(memory.userInput.emotion)) {\n      relationships[characterId] += 0.5;\n    }\n    \n    // Increase for educational achievement\n    if (memory.learningObjectives?.achieved) {\n      relationships[characterId] += 1;\n    }\n    \n    // Regular interaction bonus\n    relationships[characterId] += 0.1;\n    \n    // Cap at reasonable maximum\n    relationships[characterId] = Math.min(100, relationships[characterId]);\n  }\n\n  private isImportantMemory(memory: ConversationMemory): boolean {\n    // Criteria for important memories\n    return (\n      memory.learningObjectives?.achieved === true ||\n      memory.sessionData.relationshipLevel > 50 ||\n      memory.userInput.emotion === 'amazed' ||\n      memory.userInput.emotion === 'excited' ||\n      memory.sessionData.topicsDiscussed.some(topic => \n        ['friendship', 'ocean', 'whales', 'conservation'].includes(topic)\n      )\n    );\n  }\n\n  private moveToLongTermMemory(contextualMemory: ContextualMemory, memory: ConversationMemory): void {\n    contextualMemory.longTermMemory.importantMoments.push(memory);\n    \n    // Keep only most important long-term memories\n    if (contextualMemory.longTermMemory.importantMoments.length > this.maxLongTermMemory) {\n      contextualMemory.longTermMemory.importantMoments.sort((a, b) => {\n        return this.calculateMemoryImportance(b) - this.calculateMemoryImportance(a);\n      });\n      contextualMemory.longTermMemory.importantMoments = \n        contextualMemory.longTermMemory.importantMoments.slice(0, this.maxLongTermMemory);\n    }\n  }\n\n  private calculateMemoryImportance(memory: ConversationMemory): number {\n    let score = 0;\n    \n    // Learning achievement\n    if (memory.learningObjectives?.achieved) score += 10;\n    \n    // High relationship level\n    score += memory.sessionData.relationshipLevel * 0.1;\n    \n    // Positive emotions\n    const positiveEmotions = ['amazed', 'excited', 'happy', 'curious'];\n    if (memory.userInput.emotion && positiveEmotions.includes(memory.userInput.emotion)) {\n      score += 5;\n    }\n    \n    // Important topics\n    const importantTopics = ['friendship', 'ocean', 'whales', 'conservation', 'history'];\n    memory.sessionData.topicsDiscussed.forEach(topic => {\n      if (importantTopics.includes(topic)) score += 3;\n    });\n    \n    // Recency (more recent = slightly more important)\n    const ageInDays = (Date.now() - memory.timestamp) / (1000 * 60 * 60 * 24);\n    score += Math.max(0, 5 - ageInDays);\n    \n    return score;\n  }\n\n  private validateContentSafety(memory: ConversationMemory): boolean {\n    // Check for age-appropriate content\n    if (!memory.safetyFlags.contentAppropriate) {\n      return false;\n    }\n    \n    // Ensure educational value\n    if (!memory.safetyFlags.educationalValue) {\n      console.warn('Memory lacks educational value');\n    }\n    \n    // Check for emotional support\n    if (!memory.safetyFlags.emotionalSupport) {\n      console.warn('Memory may need emotional support review');\n    }\n    \n    // Validate response time (ensure not too quick or slow)\n    if (memory.characterResponse.responseTime < 500 || memory.characterResponse.responseTime > 30000) {\n      console.warn('Unusual response time detected');\n    }\n    \n    return true;\n  }\n\n  // Public API methods\n  public getConversationContext(participantId: string, characterId: string): any {\n    const contextualMemory = this.memories.get(participantId);\n    if (!contextualMemory) {\n      return this.getDefaultContext(characterId);\n    }\n\n    const characterRelationship = contextualMemory.longTermMemory.characterRelationships[characterId] || 0;\n    const recentTopics = contextualMemory.shortTerm.slice(-5)\n      .flatMap(m => m.sessionData.topicsDiscussed)\n      .filter((topic, index, arr) => arr.indexOf(topic) === index); // unique topics\n\n    return {\n      relationshipLevel: this.getRelationshipLabel(characterRelationship),\n      previousTopics: recentTopics,\n      personalPreferences: contextualMemory.personalPreferences,\n      emotionalState: contextualMemory.sessionSummary.emotionalJourney.slice(-3),\n      learningProgress: contextualMemory.sessionSummary.learningProgress,\n      conversationHistory: this.formatConversationHistory(contextualMemory.shortTerm.slice(-10)),\n      sessionInfo: {\n        startTime: contextualMemory.sessionSummary.startTime,\n        totalInteractions: contextualMemory.sessionSummary.totalInteractions,\n        sessionDuration: Date.now() - contextualMemory.sessionSummary.startTime\n      }\n    };\n  }\n\n  private getDefaultContext(characterId: string): any {\n    return {\n      relationshipLevel: 'stranger',\n      previousTopics: [],\n      personalPreferences: {\n        favoriteTopics: [],\n        communicationStyle: 'interactive',\n        attentionSpan: 'medium',\n        curiosityAreas: []\n      },\n      emotionalState: ['curious'],\n      learningProgress: {},\n      conversationHistory: [],\n      sessionInfo: {\n        startTime: Date.now(),\n        totalInteractions: 0,\n        sessionDuration: 0\n      }\n    };\n  }\n\n  private getRelationshipLabel(level: number): string {\n    if (level < 5) return 'stranger';\n    if (level < 15) return 'acquaintance';\n    if (level < 40) return 'friend';\n    return 'trusted_friend';\n  }\n\n  private formatConversationHistory(memories: ConversationMemory[]): any[] {\n    return memories.map(memory => ({\n      role: 'user',\n      content: memory.userInput.text,\n      emotion: memory.userInput.emotion,\n      timestamp: memory.timestamp\n    })).concat(\n      memories.map(memory => ({\n        role: 'assistant',\n        content: memory.characterResponse.text,\n        emotion: memory.characterResponse.emotion,\n        timestamp: memory.timestamp\n      }))\n    ).sort((a, b) => a.timestamp - b.timestamp);\n  }\n\n  public getPersonalizedRecommendations(participantId: string): {\n    suggestedTopics: string[];\n    learningObjectives: string[];\n    characterRecommendations: string[];\n  } {\n    const contextualMemory = this.memories.get(participantId);\n    if (!contextualMemory) {\n      return {\n        suggestedTopics: ['ocean basics', 'whale facts', 'friendship'],\n        learningObjectives: ['learn about marine life', 'understand cooperation'],\n        characterRecommendations: ['old-tom']\n      };\n    }\n\n    const preferences = contextualMemory.personalPreferences;\n    const learningProgress = contextualMemory.sessionSummary.learningProgress;\n\n    // Suggest new topics based on interests\n    const suggestedTopics = this.generateTopicRecommendations(preferences.favoriteTopics);\n    \n    // Learning objectives based on progress\n    const learningObjectives = this.generateLearningObjectives(learningProgress);\n    \n    // Character recommendations based on relationships\n    const characterRecommendations = this.generateCharacterRecommendations(\n      contextualMemory.longTermMemory.characterRelationships\n    );\n\n    return {\n      suggestedTopics,\n      learningObjectives,\n      characterRecommendations\n    };\n  }\n\n  private generateTopicRecommendations(favoriteTopics: string[]): string[] {\n    const topicExpansions: Record<string, string[]> = {\n      'whales': ['marine ecosystems', 'whale migration', 'whale communication'],\n      'ocean': ['tides', 'marine life', 'ocean conservation', 'underwater exploration'],\n      'friendship': ['teamwork', 'loyalty', 'trust', 'helping others'],\n      'history': ['maritime traditions', 'coastal communities', 'historical figures'],\n      'conservation': ['environmental protection', 'sustainable practices', 'wildlife preservation']\n    };\n\n    const suggestions: string[] = [];\n    favoriteTopics.forEach(topic => {\n      const expansions = topicExpansions[topic];\n      if (expansions) {\n        suggestions.push(...expansions);\n      }\n    });\n\n    return suggestions.slice(0, 5); // Return top 5 suggestions\n  }\n\n  private generateLearningObjectives(progress: Record<string, number>): string[] {\n    const objectives: string[] = [];\n    \n    // Basic objectives if just starting\n    if (Object.keys(progress).length === 0) {\n      return [\n        'Learn about Old Tom and George\\'s friendship',\n        'Discover marine life basics',\n        'Understand cooperation and teamwork'\n      ];\n    }\n\n    // Advanced objectives based on progress\n    Object.entries(progress).forEach(([topic, level]) => {\n      if (level < 3) {\n        objectives.push(`Continue exploring ${topic}`);\n      } else if (level >= 3) {\n        objectives.push(`Master advanced concepts in ${topic}`);\n      }\n    });\n\n    return objectives.slice(0, 4);\n  }\n\n  private generateCharacterRecommendations(relationships: Record<string, number>): string[] {\n    // Sort characters by relationship strength\n    const sortedRelationships = Object.entries(relationships)\n      .sort(([,a], [,b]) => b - a);\n\n    const recommendations: string[] = [];\n    \n    // Always include Old Tom as primary character\n    if (!relationships['old-tom'] || relationships['old-tom'] < 20) {\n      recommendations.push('old-tom');\n    }\n    \n    // Suggest George Davidson for historical context\n    if (!relationships['george-davidson'] || relationships['george-davidson'] < 15) {\n      recommendations.push('george-davidson');\n    }\n    \n    // Add child narrator for peer learning\n    if (!relationships['child-narrator'] || relationships['child-narrator'] < 10) {\n      recommendations.push('child-narrator');\n    }\n\n    return recommendations;\n  }\n\n  // Privacy and data management\n  public exportUserData(participantId: string): any {\n    const contextualMemory = this.memories.get(participantId);\n    if (!contextualMemory) {\n      return null;\n    }\n\n    return {\n      sessionSummary: contextualMemory.sessionSummary,\n      personalPreferences: contextualMemory.personalPreferences,\n      learningProgress: contextualMemory.sessionSummary.learningProgress,\n      relationshipLevels: contextualMemory.longTermMemory.characterRelationships,\n      exportDate: new Date().toISOString(),\n      dataRetentionInfo: this.privacySettings.dataRetention\n    };\n  }\n\n  public deleteUserData(participantId: string): boolean {\n    if (this.memories.has(participantId)) {\n      this.memories.delete(participantId);\n      \n      // Remove from session cache\n      for (const [sessionId, memories] of this.sessionCache.entries()) {\n        const filteredMemories = memories.filter(m => m.participantId !== participantId);\n        if (filteredMemories.length === 0) {\n          this.sessionCache.delete(sessionId);\n        } else {\n          this.sessionCache.set(sessionId, filteredMemories);\n        }\n      }\n      \n      return true;\n    }\n    return false;\n  }\n\n  private startCleanupScheduler(): void {\n    // Clean up expired data every hour\n    setInterval(() => {\n      this.cleanupExpiredData();\n    }, 60 * 60 * 1000); // 1 hour\n\n    // Initial cleanup\n    this.cleanupExpiredData();\n  }\n\n  private cleanupExpiredData(): void {\n    const now = Date.now();\n    const sessionRetentionMs = this.privacySettings.dataRetention.sessionMemory * 60 * 60 * 1000;\n    const personalDataRetentionMs = this.privacySettings.dataRetention.personalData * 24 * 60 * 60 * 1000;\n\n    // Clean session cache\n    for (const [sessionId, memories] of this.sessionCache.entries()) {\n      const validMemories = memories.filter(memory => \n        (now - memory.timestamp) < sessionRetentionMs\n      );\n      \n      if (validMemories.length === 0) {\n        this.sessionCache.delete(sessionId);\n      } else {\n        this.sessionCache.set(sessionId, validMemories);\n      }\n    }\n\n    // Clean personal data\n    for (const [participantId, contextualMemory] of this.memories.entries()) {\n      // Remove old short-term memories\n      contextualMemory.shortTerm = contextualMemory.shortTerm.filter(memory => \n        (now - memory.timestamp) < sessionRetentionMs\n      );\n      \n      // Remove old long-term memories based on personal data retention\n      contextualMemory.longTermMemory.importantMoments = \n        contextualMemory.longTermMemory.importantMoments.filter(memory => \n          (now - memory.timestamp) < personalDataRetentionMs\n        );\n      \n      // Remove entire contextual memory if empty\n      if (contextualMemory.shortTerm.length === 0 && \n          contextualMemory.longTermMemory.importantMoments.length === 0) {\n        this.memories.delete(participantId);\n      }\n    }\n  }\n\n  private generateMemoryId(): string {\n    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;\n  }\n\n  // Analytics and insights (aggregated, privacy-safe)\n  public getAggregatedInsights(): {\n    totalSessions: number;\n    averageSessionLength: number;\n    popularTopics: string[];\n    learningEffectiveness: number;\n    characterPopularity: Record<string, number>;\n  } {\n    const allMemories = Array.from(this.memories.values());\n    \n    if (allMemories.length === 0) {\n      return {\n        totalSessions: 0,\n        averageSessionLength: 0,\n        popularTopics: [],\n        learningEffectiveness: 0,\n        characterPopularity: {}\n      };\n    }\n\n    const totalSessions = allMemories.length;\n    const averageSessionLength = allMemories.reduce((sum, memory) => \n      sum + (Date.now() - memory.sessionSummary.startTime), 0\n    ) / totalSessions;\n\n    // Aggregate popular topics\n    const topicCounts: Record<string, number> = {};\n    allMemories.forEach(memory => {\n      memory.sessionSummary.dominantTopics.forEach(topic => {\n        topicCounts[topic] = (topicCounts[topic] || 0) + 1;\n      });\n    });\n    \n    const popularTopics = Object.entries(topicCounts)\n      .sort(([,a], [,b]) => b - a)\n      .slice(0, 5)\n      .map(([topic]) => topic);\n\n    // Calculate learning effectiveness\n    const totalLearningAchievements = allMemories.reduce((sum, memory) => \n      sum + Object.values(memory.sessionSummary.learningProgress).reduce((a, b) => a + b, 0), 0\n    );\n    const learningEffectiveness = totalLearningAchievements / totalSessions;\n\n    // Character popularity\n    const characterCounts: Record<string, number> = {};\n    allMemories.forEach(memory => {\n      Object.keys(memory.longTermMemory.characterRelationships).forEach(character => {\n        characterCounts[character] = (characterCounts[character] || 0) + 1;\n      });\n    });\n\n    return {\n      totalSessions,\n      averageSessionLength: averageSessionLength / 1000 / 60, // Convert to minutes\n      popularTopics,\n      learningEffectiveness,\n      characterPopularity: characterCounts\n    };\n  }\n}\n\nexport const conversationMemoryService = new ConversationMemoryService();\nexport default ConversationMemoryService;