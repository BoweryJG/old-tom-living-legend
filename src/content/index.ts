/**
 * Old Tom: The Living Legend - Main Content Index
 * Central export hub for all story content, dialogue, educational materials, and AI training data
 * Studio Ghibli-quality storytelling with historically accurate and culturally sensitive content
 */

// Import modules for internal use
import storyBranches from './story/storyBranches';
import dialogue from './dialogue/oldTomVoices';
import education from './education/marineEducation';
import aiTraining from './ai/conversationalTraining';
import culturalGuidelines from './cultural/indigenousGuidelines';

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
  getEducationalContentForAge
} from './education/marineEducation';

// AI Conversation Training
export {
  default as aiTraining,
  storyQuestions,
  marineBiologyQuestions,
  friendshipQuestions,
  emotionalSupportQuestions,
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

// Content Types for TypeScript - removed since these are not exported from storyBranches

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

  constructor(ageGroup: '3-5' | '6-8' | '9-12' = '6-8') {
    this.ageGroup = ageGroup;
  }

  /**
   * Get all story scenes for current age group
   */
  getAgeAppropriateScenes() {
    return [
      ...storyBranches.chapter1Scenes,
      ...storyBranches.chapter2Scenes,
      ...storyBranches.chapter3Scenes
    ].filter(scene => 
      scene.choices.some((choice: any) => 
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
        dialogueSet = dialogue.oldTomDialogue;
        break;
      case 'george':
      case 'george davidson':
        dialogueSet = dialogue.georgeDavidsonDialogue;
        break;
      case 'child':
      case 'narrator':
        dialogueSet = dialogue.childNarratorDialogue;
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
    // Return empty array for now - education engine not implemented
    return [];
  }

  /**
   * Process user conversation input
   */
  processConversation(userInput: string, storyContext?: string) {
    // Return default response - conversation manager not implemented
    return {
      response: "That's an interesting question!",
      emotion: 'curious',
      followUpPrompts: []
    };
  }

  /**
   * Get recommended story path for current age group
   */
  getRecommendedPath() {
    return storyBranches.storyPaths.find((path: any) => path.recommendedAge === this.ageGroup) || storyBranches.storyPaths[1];
  }

  /**
   * Change age group and update all engines
   */
  setAgeGroup(newAgeGroup: '3-5' | '6-8' | '9-12') {
    this.ageGroup = newAgeGroup;
  }

  /**
   * Get cultural acknowledgment for current content
   */
  getCulturalAcknowledgment(contentType: 'general' | 'withOrcas' | 'education' | 'ongoing' = 'general') {
    return culturalGuidelines.acknowledgmentTemplates[contentType];
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
    const allDialogue = [...dialogue.oldTomDialogue, ...dialogue.georgeDavidsonDialogue, ...dialogue.childNarratorDialogue];
    results.dialogue = allDialogue.filter(line =>
      contentValidation.isAgeAppropriate(line, this.ageGroup) &&
      (line.text.toLowerCase().includes(searchTerm) ||
       line.context.toLowerCase().includes(searchTerm))
    );

    // Search educational content
    const allEducation = [...education.marineBiologyFacts, ...education.historicalFacts];
    results.education = allEducation.filter(fact =>
      fact.topic.toLowerCase().includes(searchTerm) ||
      fact.ageGroups[this.ageGroup].toLowerCase().includes(searchTerm)
    );

    // Search conversation prompts
    const allQuestions = [
      ...aiTraining.storyQuestions,
      ...aiTraining.marineBiologyQuestions,
      ...aiTraining.friendshipQuestions,
      ...aiTraining.emotionalSupportQuestions
    ];
    results.conversations = allQuestions.filter(prompt =>
      contentValidation.isAgeAppropriate(prompt, this.ageGroup) &&
      (prompt.question.toLowerCase().includes(searchTerm) ||
       prompt.response.toLowerCase().includes(searchTerm))
    );

    return results;
  }
}

// Export default with all content organized
export default {
  storyBranches: storyBranches,
  dialogue: dialogue,
  education: education,
  aiTraining: aiTraining,
  culturalGuidelines: culturalGuidelines,
  CONTENT_CONFIG,
  contentValidation,
  ContentManager
};