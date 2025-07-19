/**
 * Old Tom: The Living Legend - Main Content Index
 * Central export hub for all story content, dialogue, educational materials, and AI training data
 * Studio Ghibli-quality storytelling with historically accurate and culturally sensitive content
 */

// Core Story Content
export {
  default as storyBranches,
  chapter1Scenes,
  chapter2Scenes,
  chapter3Scenes,
  filterChoicesForAge,
  emotionalLearningMoments,
  storyPaths
} from './story/storyBranches';

// Character Dialogue and Voice Content
export {
  default as dialogue,
  oldTomDialogue,
  georgeDavidsonDialogue,
  childNarratorDialogue,
  voiceConfigurations
} from './dialogue/oldTomVoices';

// Educational Content Integration
export {
  default as education,
  marineBiologyFacts,
  historicalFacts,
  conservationMessages,
  indigenousCulturalContent,
  generateWonderMoments,
  getEducationalContentForAge,
  EducationalContentEngine
} from './education/marineEducation';

// AI Conversation Training
export {
  default as aiTraining,
  storyQuestions,
  marineBiologyQuestions,
  friendshipQuestions,
  emotionalSupportQuestions,
  ConversationManager,
  aiPromptTemplates
} from './ai/conversationalTraining';

// Cultural Sensitivity Guidelines
export {
  default as culturalGuidelines,
  culturalSensitivityGuidelines,
  consultationRequirements,
  historicalSources,
  contentDevelopmentStages,
  respectfulLanguageGuide,
  implementationChecklist,
  acknowledgmentTemplates,
  culturalSensitivityMetrics
} from './cultural/indigenousGuidelines';

// Content Types for TypeScript
export type {
  DialogueLine,
  StoryChoice,
  StoryScene,
  StoryPath,
  EducationalFact,
  ConservationMessage,
  ConversationPrompt,
  ContextualResponse,
  CulturalConsultationRequirement,
  IndigenousContentGuideline,
  HistoricalAccuracyCheck
} from './story/storyBranches';

// Content Configuration and Constants
export const CONTENT_CONFIG = {
  // Story Structure
  totalChapters: 6,
  chaptersImplemented: 3, // Chapters 1-3 fully implemented
  averageSceneLength: 5, // minutes
  
  // Age Groups
  ageGroups: ['3-5', '6-8', '9-12'] as const,
  defaultAgeGroup: '6-8' as const,
  
  // Voice Synthesis Settings
  defaultVoiceSettings: {
    oldTom: {
      pace: 'slow',
      pitch: 'low',
      warmth: 85,
      stability: 0.75,
      similarityBoost: 0.85
    },
    georgeDavidson: {
      pace: 'normal',
      pitch: 'normal',
      warmth: 85,
      stability: 0.80,
      similarityBoost: 0.80
    },
    childNarrator: {
      pace: 'normal',
      pitch: 'high',
      warmth: 90,
      stability: 0.70,
      similarityBoost: 0.75
    }
  },
  
  // Educational Content Categories
  educationCategories: [
    'marine_biology',
    'history',
    'geography',
    'conservation',
    'culture'
  ] as const,
  
  // Cultural Sensitivity Levels
  culturalSensitivityLevels: [
    'cleared',
    'needs_review',
    'required_consultation'
  ] as const,
  
  // Story Themes
  coreThemes: [
    'friendship',
    'cooperation',
    'sacrifice',
    'understanding',
    'respect_for_nature',
    'historical_significance',
    'legacy'
  ] as const
};

// Content Validation Functions
export const contentValidation = {
  /**
   * Validates if content is appropriate for specified age group
   */
  isAgeAppropriate: (content: any, ageGroup: '3-5' | '6-8' | '9-12'): boolean => {
    if (!content.ageGroup) return false;
    return content.ageGroup === 'all' || content.ageGroup === ageGroup;
  },

  /**
   * Checks if content has required cultural sensitivity clearance
   */
  hasCulturalClearance: (content: any): boolean => {
    if (!content.culturalSensitivity) return true; // No sensitivity requirements
    return content.culturalSensitivity === 'cleared';
  },

  /**
   * Validates historical accuracy based on source verification
   */
  isHistoricallyAccurate: (content: any): boolean => {
    if (!content.historicalSources) return true; // No historical claims
    return content.historicalSources.every((source: any) => 
      source.reliability === 'high' || source.reliability === 'medium'
    );
  }
};

// Content Discovery and Search
export class ContentManager {
  private ageGroup: '3-5' | '6-8' | '9-12';
  private educationEngine: EducationalContentEngine;
  private conversationManager: ConversationManager;

  constructor(ageGroup: '3-5' | '6-8' | '9-12' = '6-8') {
    this.ageGroup = ageGroup;
    this.educationEngine = new EducationalContentEngine(ageGroup);
    this.conversationManager = new ConversationManager(ageGroup);
  }

  /**
   * Get all story scenes for current age group
   */
  getAgeAppropriateScenes() {
    return [
      ...chapter1Scenes,
      ...chapter2Scenes,
      ...chapter3Scenes
    ].filter(scene => 
      scene.choices.some(choice => 
        contentValidation.isAgeAppropriate(choice, this.ageGroup)
      )
    );
  }

  /**
   * Get dialogue lines for a specific character and context
   */
  getCharacterDialogue(character: string, context?: string) {
    let dialogueSet: any[] = [];
    
    switch (character.toLowerCase()) {
      case 'old tom':
      case 'tom':
        dialogueSet = oldTomDialogue;
        break;
      case 'george':
      case 'george davidson':
        dialogueSet = georgeDavidsonDialogue;
        break;
      case 'child':
      case 'narrator':
        dialogueSet = childNarratorDialogue;
        break;
      default:
        return [];
    }

    return dialogueSet.filter(line =>
      contentValidation.isAgeAppropriate(line, this.ageGroup) &&
      (!context || line.context.toLowerCase().includes(context.toLowerCase()))
    );
  }

  /**
   * Get educational content for current story context
   */
  getContextualEducation(storyMoment: string, category?: string) {
    return this.educationEngine.getContextualContent(storyMoment, category);
  }

  /**
   * Process user conversation input
   */
  processConversation(userInput: string, storyContext?: string) {
    return this.conversationManager.generateContextualResponse(userInput, storyContext);
  }

  /**
   * Get recommended story path for current age group
   */
  getRecommendedPath() {
    return storyPaths.find(path => path.recommendedAge === this.ageGroup) || storyPaths[1];
  }

  /**
   * Change age group and update all engines
   */
  setAgeGroup(newAgeGroup: '3-5' | '6-8' | '9-12') {
    this.ageGroup = newAgeGroup;
    this.educationEngine = new EducationalContentEngine(newAgeGroup);
    this.conversationManager = new ConversationManager(newAgeGroup);
  }

  /**
   * Get cultural acknowledgment for current content
   */
  getCulturalAcknowledgment(contentType: 'general' | 'withOrcas' | 'education' | 'ongoing' = 'general') {
    return acknowledgmentTemplates[contentType];
  }

  /**
   * Search all content by keyword
   */
  searchContent(keyword: string) {
    const results = {
      scenes: [] as any[],
      dialogue: [] as any[],
      education: [] as any[],
      conversations: [] as any[]
    };

    const searchTerm = keyword.toLowerCase();

    // Search scenes
    results.scenes = this.getAgeAppropriateScenes().filter(scene =>
      scene.title.toLowerCase().includes(searchTerm) ||
      scene.description.toLowerCase().includes(searchTerm) ||
      scene.narrativeText.toLowerCase().includes(searchTerm)
    );

    // Search dialogue
    const allDialogue = [...oldTomDialogue, ...georgeDavidsonDialogue, ...childNarratorDialogue];
    results.dialogue = allDialogue.filter(line =>
      contentValidation.isAgeAppropriate(line, this.ageGroup) &&
      (line.text.toLowerCase().includes(searchTerm) ||
       line.context.toLowerCase().includes(searchTerm))
    );

    // Search educational content
    const allEducation = [...marineBiologyFacts, ...historicalFacts];
    results.education = allEducation.filter(fact =>
      fact.topic.toLowerCase().includes(searchTerm) ||
      fact.ageGroups[this.ageGroup].toLowerCase().includes(searchTerm)
    );

    // Search conversation prompts
    const allQuestions = [
      ...storyQuestions,
      ...marineBiologyQuestions,
      ...friendshipQuestions,
      ...emotionalSupportQuestions
    ];
    results.conversations = allQuestions.filter(prompt =>
      contentValidation.isAgeAppropriate(prompt, this.ageGroup) &&
      (prompt.question.toLowerCase().includes(searchTerm) ||
       prompt.response.toLowerCase().includes(searchTerm))
    );

    return results;
  }
}

// Export the main content manager
export { ContentManager };

// Export default with all content organized
export default {
  storyBranches,
  dialogue,
  education,
  aiTraining,
  culturalGuidelines,
  CONTENT_CONFIG,
  contentValidation,
  ContentManager
};