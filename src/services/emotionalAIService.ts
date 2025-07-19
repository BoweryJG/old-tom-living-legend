interface EmotionalState {
  primary: string;
  secondary?: string;
  intensity: number; // 0-1 scale
  confidence: number; // 0-1 scale
  timestamp: number;
}

interface EmotionalContext {
  childAge?: number;
  previousEmotions: EmotionalState[];
  currentTopic: string;
  characterPresent: string;
  sessionDuration: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  environmentalFactors?: {
    noiseLevel: 'quiet' | 'moderate' | 'loud';
    distractionLevel: 'low' | 'medium' | 'high';
  };
}

interface EmotionalResponse {
  detectedEmotion: EmotionalState;
  recommendedCharacterResponse: {
    tone: string;
    emotion: string;
    pace: 'slow' | 'normal' | 'quick';
    supportLevel: 'minimal' | 'moderate' | 'high';
    techniques: string[];
  };
  adaptations: {
    voiceSettings: any;
    contentAdjustments: string[];
    interactionStyle: string;
  };
  safetyAlerts: string[];
  followUpSuggestions: string[];
}

interface VoiceEmotionAnalysis {
  tone: {
    pitch: 'high' | 'normal' | 'low';
    volume: 'quiet' | 'normal' | 'loud';
    pace: 'slow' | 'normal' | 'fast';
    stability: 'steady' | 'shaky' | 'excited';
  };
  emotionalIndicators: {
    excitement: number;
    nervousness: number;
    confidence: number;
    tiredness: number;
    curiosity: number;
  };
  linguisticPatterns: {
    questionFrequency: number;
    positiveWords: number;
    negativeWords: number;
    hesitationMarkers: number;
  };
}

class EmotionalAIService {
  private emotionHistory: Map<string, EmotionalState[]> = new Map();
  private emotionalPatterns: Map<string, any> = new Map();
  private responseStrategies: Map<string, any> = new Map();
  private safetyThresholds: Record<string, number>;

  constructor() {
    this.safetyThresholds = {
      distress: 0.7,
      fear: 0.6,
      overwhelm: 0.8,
      boredom: 0.7,
      frustration: 0.6
    };

    this.initializeResponseStrategies();
    this.initializeEmotionalPatterns();
  }

  private initializeResponseStrategies() {
    // Response strategies for different emotional states
    this.responseStrategies.set('excited', {
      characterEmotion: 'joyful',
      tone: 'enthusiastic',
      pace: 'normal',
      techniques: ['match_energy', 'channel_excitement', 'educational_engagement'],
      voiceAdjustments: {
        style: 0.3,
        similarity_boost: 0.8
      },
      contentStyle: 'Share in the excitement while guiding toward learning'
    });

    this.responseStrategies.set('curious', {
      characterEmotion: 'encouraging',
      tone: 'warm_and_inviting',
      pace: 'normal',
      techniques: ['encourage_questions', 'provide_gentle_guidance', 'scaffold_learning'],
      voiceAdjustments: {
        stability: 0.85,
        style: 0.2
      },
      contentStyle: 'Nurture curiosity with age-appropriate explanations'
    });

    this.responseStrategies.set('scared', {
      characterEmotion: 'protective',
      tone: 'gentle_and_reassuring',
      pace: 'slow',
      techniques: ['immediate_comfort', 'gentle_redirection', 'safety_assurance'],
      voiceAdjustments: {
        stability: 0.95,
        style: 0.05,
        similarity_boost: 0.9
      },
      contentStyle: 'Provide immediate comfort and gentle reassurance'
    });

    this.responseStrategies.set('confused', {
      characterEmotion: 'patient',
      tone: 'clear_and_supportive',
      pace: 'slow',
      techniques: ['simplify_explanation', 'use_examples', 'check_understanding'],
      voiceAdjustments: {
        stability: 0.9,
        style: 0.1
      },
      contentStyle: 'Break down concepts into simpler, more digestible parts'
    });

    this.responseStrategies.set('bored', {
      characterEmotion: 'engaging',
      tone: 'dynamic_and_interesting',
      pace: 'normal',
      techniques: ['change_topic', 'interactive_elements', 'surprise_factor'],
      voiceAdjustments: {
        style: 0.35,
        similarity_boost: 0.75
      },
      contentStyle: 'Introduce new, engaging elements to recapture interest'
    });

    this.responseStrategies.set('frustrated', {
      characterEmotion: 'understanding',
      tone: 'calm_and_supportive',
      pace: 'slow',
      techniques: ['acknowledge_feelings', 'offer_alternatives', 'reduce_pressure'],
      voiceAdjustments: {
        stability: 0.9,
        style: 0.1,
        similarity_boost: 0.85
      },
      contentStyle: 'Acknowledge difficulty and offer gentle alternatives'
    });

    this.responseStrategies.set('tired', {
      characterEmotion: 'gentle',
      tone: 'soothing_and_calm',
      pace: 'slow',
      techniques: ['lower_energy', 'shorter_responses', 'calming_content'],
      voiceAdjustments: {
        stability: 0.95,
        style: 0.05
      },
      contentStyle: 'Provide calming, less stimulating content'
    });
  }

  private initializeEmotionalPatterns() {
    // Common emotional patterns in children's learning
    this.emotionalPatterns.set('learning_excitement', {
      sequence: ['curious', 'excited', 'engaged', 'proud'],
      duration: 300000, // 5 minutes
      triggers: ['new_discovery', 'understanding_achieved', 'positive_feedback']
    });

    this.emotionalPatterns.set('overwhelm_pattern', {
      sequence: ['confused', 'frustrated', 'overwhelmed', 'withdrawn'],
      duration: 180000, // 3 minutes
      triggers: ['complex_content', 'rapid_pace', 'too_many_choices']
    });

    this.emotionalPatterns.set('comfort_seeking', {
      sequence: ['scared', 'uncertain', 'seeking_reassurance', 'comforted'],
      duration: 120000, // 2 minutes
      triggers: ['unknown_content', 'dark_themes', 'separation_anxiety']
    });
  }

  public async analyzeChildEmotion(
    input: {
      text?: string;
      voiceData?: any;
      behavioralCues?: {
        responseTime: number;
        interactionFrequency: number;
        sessionLength: number;
      };
    },
    context: EmotionalContext
  ): Promise<EmotionalResponse> {
    try {
      // Multi-modal emotion detection
      let detectedEmotion = await this.detectEmotionFromMultipleSources(input, context);
      
      // Apply contextual adjustments
      detectedEmotion = this.applyContextualAdjustments(detectedEmotion, context);
      
      // Store emotion in history
      this.storeEmotionalState(context.characterPresent, detectedEmotion);
      
      // Generate appropriate response
      const response = await this.generateEmotionalResponse(detectedEmotion, context);
      
      return response;
    } catch (error) {
      console.error('Error in emotion analysis:', error);
      return this.getDefaultEmotionalResponse();
    }
  }

  private async detectEmotionFromMultipleSources(
    input: any,
    context: EmotionalContext
  ): Promise<EmotionalState> {
    const emotionScores: Record<string, number> = {};
    
    // Text-based emotion detection
    if (input.text) {
      const textEmotions = this.analyzeTextEmotion(input.text);
      Object.entries(textEmotions).forEach(([emotion, score]) => {
        emotionScores[emotion] = (emotionScores[emotion] || 0) + score * 0.4;
      });
    }
    
    // Voice-based emotion detection
    if (input.voiceData) {
      const voiceEmotions = this.analyzeVoiceEmotion(input.voiceData);
      Object.entries(voiceEmotions).forEach(([emotion, score]) => {
        emotionScores[emotion] = (emotionScores[emotion] || 0) + score * 0.4;
      });
    }
    
    // Behavioral pattern analysis
    if (input.behavioralCues) {
      const behavioralEmotions = this.analyzeBehavioralCues(input.behavioralCues, context);
      Object.entries(behavioralEmotions).forEach(([emotion, score]) => {
        emotionScores[emotion] = (emotionScores[emotion] || 0) + score * 0.2;
      });
    }
    
    // Find primary emotion
    const sortedEmotions = Object.entries(emotionScores)
      .sort(([,a], [,b]) => b - a);
    
    if (sortedEmotions.length === 0) {
      return {
        primary: 'neutral',
        intensity: 0.5,
        confidence: 0.3,
        timestamp: Date.now()
      };
    }
    
    const [primaryEmotion, primaryScore] = sortedEmotions[0];
    const [secondaryEmotion] = sortedEmotions[1] || [undefined];
    
    return {
      primary: primaryEmotion,
      secondary: secondaryEmotion,
      intensity: Math.min(1, primaryScore),
      confidence: this.calculateConfidence(emotionScores, input),
      timestamp: Date.now()
    };
  }

  private analyzeTextEmotion(text: string): Record<string, number> {
    const emotions: Record<string, number> = {};
    const lowerText = text.toLowerCase();
    
    // Excitement indicators
    const excitementWords = ['wow', 'amazing', 'cool', 'awesome', 'love', 'excited', '!'];
    const excitementScore = excitementWords.reduce((score, word) => {
      const matches = (lowerText.match(new RegExp(word, 'g')) || []).length;
      return score + matches;
    }, 0);
    emotions.excited = Math.min(1, excitementScore * 0.2);
    
    // Curiosity indicators
    const curiosityWords = ['what', 'how', 'why', 'where', 'when', '?', 'tell me', 'show me'];
    const curiosityScore = curiosityWords.reduce((score, word) => {
      const matches = (lowerText.match(new RegExp(word, 'g')) || []).length;
      return score + matches;
    }, 0);
    emotions.curious = Math.min(1, curiosityScore * 0.15);
    
    // Fear/concern indicators
    const fearWords = ['scared', 'afraid', 'worried', 'frightened', 'nervous', 'anxious'];
    const fearScore = fearWords.reduce((score, word) => {
      return score + (lowerText.includes(word) ? 1 : 0);
    }, 0);
    emotions.scared = Math.min(1, fearScore * 0.3);
    
    // Confusion indicators
    const confusionWords = ['confused', 'don\'t understand', 'what does', 'i don\'t know', 'huh'];
    const confusionScore = confusionWords.reduce((score, phrase) => {
      return score + (lowerText.includes(phrase) ? 1 : 0);
    }, 0);
    emotions.confused = Math.min(1, confusionScore * 0.4);
    
    // Frustration indicators
    const frustrationWords = ['frustrated', 'annoyed', 'can\'t', 'won\'t work', 'stupid', 'hate'];
    const frustrationScore = frustrationWords.reduce((score, word) => {
      return score + (lowerText.includes(word) ? 1 : 0);
    }, 0);
    emotions.frustrated = Math.min(1, frustrationScore * 0.4);
    
    // Boredom indicators
    const boredomWords = ['bored', 'boring', 'tired', 'sleepy', 'done', 'finished'];
    const boredomScore = boredomWords.reduce((score, word) => {
      return score + (lowerText.includes(word) ? 1 : 0);
    }, 0);
    emotions.bored = Math.min(1, boredomScore * 0.3);
    
    return emotions;
  }

  private analyzeVoiceEmotion(voiceData: any): Record<string, number> {
    // Simplified voice emotion analysis
    // In a real implementation, this would use audio processing libraries
    const emotions: Record<string, number> = {};
    
    // Mock analysis based on voice characteristics
    if (voiceData.pitch) {
      if (voiceData.pitch > 0.7) {
        emotions.excited = 0.6;
        emotions.curious = 0.4;
      } else if (voiceData.pitch < 0.3) {
        emotions.tired = 0.5;
        emotions.sad = 0.3;
      }
    }
    
    if (voiceData.pace) {
      if (voiceData.pace > 0.8) {
        emotions.excited = (emotions.excited || 0) + 0.3;
        emotions.nervous = 0.4;
      } else if (voiceData.pace < 0.3) {
        emotions.tired = (emotions.tired || 0) + 0.4;
        emotions.confused = 0.3;
      }
    }
    
    if (voiceData.volume) {
      if (voiceData.volume < 0.3) {
        emotions.shy = 0.4;
        emotions.tired = (emotions.tired || 0) + 0.2;
      } else if (voiceData.volume > 0.8) {
        emotions.excited = (emotions.excited || 0) + 0.2;
      }
    }
    
    return emotions;
  }

  private analyzeBehavioralCues(
    cues: { responseTime: number; interactionFrequency: number; sessionLength: number },
    context: EmotionalContext
  ): Record<string, number> {
    const emotions: Record<string, number> = {};
    
    // Response time analysis
    if (cues.responseTime > 5000) {
      emotions.confused = 0.4;
      emotions.tired = 0.3;
    } else if (cues.responseTime < 1000) {
      emotions.excited = 0.3;
      emotions.impatient = 0.2;
    }
    
    // Interaction frequency
    if (cues.interactionFrequency > 10) {
      emotions.excited = (emotions.excited || 0) + 0.3;
      emotions.engaged = 0.4;
    } else if (cues.interactionFrequency < 2) {
      emotions.bored = 0.4;
      emotions.tired = 0.3;
    }
    
    // Session length considerations
    if (cues.sessionLength > 1800000) { // 30 minutes
      emotions.tired = (emotions.tired || 0) + 0.4;
      emotions.overwhelmed = 0.3;
    }
    
    // Age-based adjustments
    if (context.childAge && context.childAge < 6) {
      // Younger children have shorter attention spans
      if (cues.sessionLength > 600000) { // 10 minutes
        emotions.tired = (emotions.tired || 0) + 0.3;
      }
    }
    
    return emotions;
  }

  private applyContextualAdjustments(
    emotion: EmotionalState,
    context: EmotionalContext
  ): EmotionalState {
    let adjustedEmotion = { ...emotion };
    
    // Historical pattern analysis
    const emotionalHistory = this.emotionHistory.get(context.characterPresent) || [];
    if (emotionalHistory.length > 0) {
      const recentEmotions = emotionalHistory.slice(-3);
      
      // Check for emotional pattern escalation
      if (this.detectEmotionalEscalation(recentEmotions, emotion)) {
        adjustedEmotion.intensity = Math.min(1, adjustedEmotion.intensity + 0.2);
      }
      
      // Smooth out rapid emotional changes
      const lastEmotion = recentEmotions[recentEmotions.length - 1];
      if (lastEmotion && lastEmotion.primary !== emotion.primary) {
        adjustedEmotion.confidence = Math.max(0.3, adjustedEmotion.confidence - 0.1);
      }
    }
    
    // Time of day adjustments
    if (context.timeOfDay === 'evening') {
      if (emotion.primary === 'excited') {
        adjustedEmotion.intensity = Math.max(0.3, adjustedEmotion.intensity - 0.2);
      }
      if (!['tired', 'calm', 'sleepy'].includes(emotion.primary)) {
        adjustedEmotion.secondary = 'tired';
      }
    }
    
    // Environmental factor adjustments
    if (context.environmentalFactors) {
      if (context.environmentalFactors.noiseLevel === 'loud') {
        if (emotion.primary === 'confused') {
          adjustedEmotion.intensity = Math.min(1, adjustedEmotion.intensity + 0.1);
        }
      }
      
      if (context.environmentalFactors.distractionLevel === 'high') {
        if (emotion.primary === 'focused' || emotion.primary === 'engaged') {
          adjustedEmotion.intensity = Math.max(0.2, adjustedEmotion.intensity - 0.2);
        }
      }
    }
    
    return adjustedEmotion;
  }

  private detectEmotionalEscalation(
    recentEmotions: EmotionalState[],
    currentEmotion: EmotionalState
  ): boolean {
    const negativeEmotions = ['frustrated', 'confused', 'overwhelmed', 'scared', 'bored'];
    
    const recentNegative = recentEmotions.filter(e => negativeEmotions.includes(e.primary));
    const currentNegative = negativeEmotions.includes(currentEmotion.primary);
    
    return recentNegative.length >= 2 && currentNegative;
  }

  private calculateConfidence(
    emotionScores: Record<string, number>,
    input: any
  ): number {
    const scores = Object.values(emotionScores);
    if (scores.length === 0) return 0.3;
    
    const maxScore = Math.max(...scores);
    const secondMaxScore = scores.sort((a, b) => b - a)[1] || 0;
    
    // Higher confidence when there's a clear winner
    const separation = maxScore - secondMaxScore;
    let confidence = 0.5 + (separation * 0.5);
    
    // Adjust based on input richness
    if (input.text && input.voiceData) {
      confidence += 0.2;
    } else if (input.text || input.voiceData) {
      confidence += 0.1;
    }
    
    return Math.min(1, Math.max(0.2, confidence));
  }

  private storeEmotionalState(sessionId: string, emotion: EmotionalState): void {
    if (!this.emotionHistory.has(sessionId)) {
      this.emotionHistory.set(sessionId, []);
    }
    
    const history = this.emotionHistory.get(sessionId)!;
    history.push(emotion);
    
    // Keep only recent history
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }
  }

  private async generateEmotionalResponse(
    emotion: EmotionalState,
    context: EmotionalContext
  ): Promise<EmotionalResponse> {
    const strategy = this.responseStrategies.get(emotion.primary);
    if (!strategy) {
      return this.getDefaultEmotionalResponse();
    }
    
    // Check for safety concerns
    const safetyAlerts = this.checkSafetyThresholds(emotion, context);
    
    // Generate adaptations based on emotion and context
    const adaptations = this.generateAdaptations(emotion, strategy, context);
    
    // Generate follow-up suggestions
    const followUpSuggestions = this.generateFollowUpSuggestions(emotion, context);
    
    return {
      detectedEmotion: emotion,
      recommendedCharacterResponse: {
        tone: strategy.tone,
        emotion: strategy.characterEmotion,
        pace: strategy.pace,
        supportLevel: this.determineSupportLevel(emotion),
        techniques: strategy.techniques
      },
      adaptations,
      safetyAlerts,
      followUpSuggestions
    };
  }

  private checkSafetyThresholds(
    emotion: EmotionalState,
    context: EmotionalContext
  ): string[] {
    const alerts: string[] = [];
    
    // Check for distress levels
    if (emotion.primary === 'scared' && emotion.intensity > this.safetyThresholds.fear) {
      alerts.push('High fear level detected - provide immediate comfort');
    }
    
    if (emotion.primary === 'frustrated' && emotion.intensity > this.safetyThresholds.frustration) {
      alerts.push('High frustration - consider simplifying content or taking a break');
    }
    
    if (emotion.primary === 'overwhelmed' && emotion.intensity > this.safetyThresholds.overwhelm) {
      alerts.push('Child appears overwhelmed - reduce stimulation and provide calming support');
    }
    
    // Check for prolonged negative emotions
    const history = this.emotionHistory.get(context.characterPresent) || [];
    const recentNegative = history.slice(-5).filter(e => 
      ['scared', 'frustrated', 'overwhelmed', 'sad'].includes(e.primary)
    );
    
    if (recentNegative.length >= 4) {
      alerts.push('Prolonged negative emotional state - consider ending session or changing approach');
    }
    
    return alerts;
  }

  private generateAdaptations(
    emotion: EmotionalState,
    strategy: any,
    context: EmotionalContext
  ): EmotionalResponse['adaptations'] {
    const baseVoiceSettings = strategy.voiceAdjustments || {};
    
    // Intensity-based adjustments
    const intensityFactor = emotion.intensity;
    const adjustedVoiceSettings = {
      ...baseVoiceSettings,
      stability: Math.min(0.95, (baseVoiceSettings.stability || 0.8) + (1 - intensityFactor) * 0.1),
      style: Math.max(0.05, (baseVoiceSettings.style || 0.2) * intensityFactor)
    };
    
    // Age-based voice adjustments
    if (context.childAge && context.childAge < 6) {
      adjustedVoiceSettings.stability = Math.min(0.95, adjustedVoiceSettings.stability + 0.05);
      adjustedVoiceSettings.style = Math.max(0.05, adjustedVoiceSettings.style - 0.05);
    }
    
    // Content adjustments based on emotion
    const contentAdjustments: string[] = [];
    
    if (emotion.primary === 'scared') {
      contentAdjustments.push('Use gentle, reassuring language');
      contentAdjustments.push('Avoid scary or overwhelming topics');
      contentAdjustments.push('Focus on safety and comfort');
    }
    
    if (emotion.primary === 'confused') {
      contentAdjustments.push('Break information into smaller parts');
      contentAdjustments.push('Use simpler vocabulary');
      contentAdjustments.push('Provide concrete examples');
    }
    
    if (emotion.primary === 'excited') {
      contentAdjustments.push('Match enthusiasm appropriately');
      contentAdjustments.push('Channel excitement toward learning');
      contentAdjustments.push('Maintain engagement without overstimulation');
    }
    
    // Interaction style adjustments
    let interactionStyle = 'supportive';
    if (emotion.intensity > 0.7) {
      interactionStyle = emotion.primary === 'excited' ? 'enthusiastic' : 'calming';
    } else if (emotion.intensity < 0.3) {
      interactionStyle = 'gentle_encouragement';
    }
    
    return {
      voiceSettings: adjustedVoiceSettings,
      contentAdjustments,
      interactionStyle
    };
  }

  private determineSupportLevel(emotion: EmotionalState): 'minimal' | 'moderate' | 'high' {
    const supportiveEmotions = ['scared', 'frustrated', 'confused', 'overwhelmed', 'sad'];
    
    if (supportiveEmotions.includes(emotion.primary)) {
      if (emotion.intensity > 0.7) return 'high';
      if (emotion.intensity > 0.4) return 'moderate';
    }
    
    return 'minimal';
  }

  private generateFollowUpSuggestions(
    emotion: EmotionalState,
    context: EmotionalContext
  ): string[] {
    const suggestions: string[] = [];
    
    switch (emotion.primary) {
      case 'excited':
        suggestions.push('Ask what excites them most about this topic');
        suggestions.push('Suggest related topics they might enjoy');
        suggestions.push('Encourage them to share their excitement');
        break;
        
      case 'curious':
        suggestions.push('Encourage more questions');
        suggestions.push('Offer to explore the topic deeper');
        suggestions.push('Suggest hands-on exploration activities');
        break;
        
      case 'scared':
        suggestions.push('Offer reassurance and safety');
        suggestions.push('Redirect to comforting topics');
        suggestions.push('Check if they need a break');
        break;
        
      case 'confused':
        suggestions.push('Ask what specifically is confusing');
        suggestions.push('Offer to explain in a different way');
        suggestions.push('Provide visual or concrete examples');
        break;
        
      case 'bored':
        suggestions.push('Change topics or activities');
        suggestions.push('Ask what they\'d prefer to explore');
        suggestions.push('Introduce interactive elements');
        break;
        
      case 'tired':
        suggestions.push('Suggest a quiet activity');
        suggestions.push('Offer to take a break');
        suggestions.push('Move to calming content');
        break;
    }
    
    return suggestions;
  }

  private getDefaultEmotionalResponse(): EmotionalResponse {
    return {
      detectedEmotion: {
        primary: 'neutral',
        intensity: 0.5,
        confidence: 0.3,
        timestamp: Date.now()
      },
      recommendedCharacterResponse: {
        tone: 'gentle',
        emotion: 'kind',
        pace: 'normal',
        supportLevel: 'moderate',
        techniques: ['gentle_engagement']
      },
      adaptations: {
        voiceSettings: {
          stability: 0.8,
          style: 0.2,
          similarity_boost: 0.8
        },
        contentAdjustments: ['Maintain gentle, supportive tone'],
        interactionStyle: 'supportive'
      },
      safetyAlerts: [],
      followUpSuggestions: ['Ask how they\'re feeling', 'Offer engaging content options']
    };
  }

  // Public API methods
  public async processChildInteraction(
    input: {
      text?: string;
      voiceData?: any;
      sessionData: {
        childAge?: number;
        sessionDuration: number;
        responseTime: number;
        interactionCount: number;
      };
    },
    characterId: string,
    currentTopic: string
  ): Promise<EmotionalResponse> {
    const context: EmotionalContext = {
      childAge: input.sessionData.childAge,
      previousEmotions: this.emotionHistory.get(characterId) || [],
      currentTopic,
      characterPresent: characterId,
      sessionDuration: input.sessionData.sessionDuration,
      timeOfDay: this.determineTimeOfDay()
    };

    const behavioralCues = {
      responseTime: input.sessionData.responseTime,
      interactionFrequency: input.sessionData.interactionCount,
      sessionLength: input.sessionData.sessionDuration
    };

    return this.analyzeChildEmotion(
      {
        text: input.text,
        voiceData: input.voiceData,
        behavioralCues
      },
      context
    );
  }

  public getEmotionalHistory(sessionId: string): EmotionalState[] {
    return this.emotionHistory.get(sessionId) || [];
  }

  public getCurrentEmotionalState(sessionId: string): EmotionalState | null {
    const history = this.emotionHistory.get(sessionId);
    return history && history.length > 0 ? history[history.length - 1] : null;
  }

  public clearEmotionalHistory(sessionId: string): void {
    this.emotionHistory.delete(sessionId);
  }

  public updateSafetyThresholds(thresholds: Partial<Record<string, number>>): void {
    this.safetyThresholds = { ...this.safetyThresholds, ...thresholds };
  }

  private determineTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  // Analytics and insights
  public getEmotionalInsights(): {
    commonEmotions: Record<string, number>;
    emotionalPatterns: string[];
    safetyAlerts: number;
    positiveInteractions: number;
  } {
    const allEmotions: EmotionalState[] = [];
    let safetyAlerts = 0;
    let positiveInteractions = 0;

    this.emotionHistory.forEach(history => {
      allEmotions.push(...history);
    });

    const emotionCounts: Record<string, number> = {};
    const positiveEmotions = ['excited', 'curious', 'happy', 'amazed', 'joyful'];
    const concerningEmotions = ['scared', 'frustrated', 'overwhelmed'];

    allEmotions.forEach(emotion => {
      emotionCounts[emotion.primary] = (emotionCounts[emotion.primary] || 0) + 1;
      
      if (positiveEmotions.includes(emotion.primary)) {
        positiveInteractions++;
      }
      
      if (concerningEmotions.includes(emotion.primary) && emotion.intensity > 0.6) {
        safetyAlerts++;
      }
    });

    // Detect common patterns
    const patterns: string[] = [];
    Object.entries(emotionCounts).forEach(([emotion, count]) => {
      if (count > allEmotions.length * 0.3) {
        patterns.push(`Frequent ${emotion} emotions`);
      }
    });

    return {
      commonEmotions: emotionCounts,
      emotionalPatterns: patterns,
      safetyAlerts,
      positiveInteractions
    };
  }
}

export const emotionalAIService = new EmotionalAIService();
export default EmotionalAIService;