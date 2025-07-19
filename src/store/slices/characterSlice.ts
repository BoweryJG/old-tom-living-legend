import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Character {
  id: string;
  name: string;
  displayName: string;
  description: string;
  age: number;
  species: string;
  personality: string[];
  voiceId: string;
  avatarImage: string;
  animations: {
    idle: string;
    talking: string;
    happy: string;
    sad: string;
    surprised: string;
    thoughtful: string;
  };
  backstory: string;
  relationships: Record<string, string>;
  memories: string[];
  currentMood: 'happy' | 'sad' | 'excited' | 'calm' | 'mysterious' | 'wise';
  conversationHistory: Array<{
    id: string;
    timestamp: number;
    userMessage: string;
    characterResponse: string;
    emotion: string;
    context: string;
  }>;
}

interface CharacterState {
  characters: Record<string, Character>;
  activeCharacter: string | null;
  isCharacterSpeaking: boolean;
  currentDialogue: string | null;
  conversationContext: {
    topic: string | null;
    mood: string;
    previousTopics: string[];
    relationshipLevel: number;
  };
  aiSettings: {
    temperature: number;
    maxTokens: number;
    personalityStrength: number;
    memoryRetention: number;
  };
}

const initialState: CharacterState = {
  characters: {
    'old-tom': {
      id: 'old-tom',
      name: 'Old Tom',
      displayName: 'Old Tom',
      description: 'A wise and ancient character with deep connections to the ocean',
      age: 150,
      species: 'Mystical Being',
      personality: ['wise', 'patient', 'storyteller', 'mysterious', 'kind'],
      voiceId: 'old-tom-voice',
      avatarImage: '/images/characters/old-tom-avatar.png',
      animations: {
        idle: '/animations/old-tom-idle.json',
        talking: '/animations/old-tom-talking.json',
        happy: '/animations/old-tom-happy.json',
        sad: '/animations/old-tom-sad.json',
        surprised: '/animations/old-tom-surprised.json',
        thoughtful: '/animations/old-tom-thoughtful.json',
      },
      backstory: 'Old Tom has lived by the ocean for over a century, witnessing the changing tides and collecting stories from the depths.',
      relationships: {},
      memories: [
        'The great storm of 1892',
        'First meeting with the whales',
        'The lighthouse keeper\'s daughter',
        'Discovery of the time portal',
      ],
      currentMood: 'wise',
      conversationHistory: [],
    },
  },
  activeCharacter: 'old-tom',
  isCharacterSpeaking: false,
  currentDialogue: null,
  conversationContext: {
    topic: null,
    mood: 'neutral',
    previousTopics: [],
    relationshipLevel: 0,
  },
  aiSettings: {
    temperature: 0.8,
    maxTokens: 150,
    personalityStrength: 0.9,
    memoryRetention: 0.7,
  },
};

const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    addCharacter: (state, action: PayloadAction<Character>) => {
      const character = action.payload;
      state.characters[character.id] = character;
    },
    updateCharacter: (state, action: PayloadAction<{ id: string; updates: Partial<Character> }>) => {
      const { id, updates } = action.payload;
      if (state.characters[id]) {
        state.characters[id] = { ...state.characters[id], ...updates };
      }
    },
    setActiveCharacter: (state, action: PayloadAction<string>) => {
      const characterId = action.payload;
      if (state.characters[characterId]) {
        state.activeCharacter = characterId;
      }
    },
    setCharacterMood: (state, action: PayloadAction<{ characterId: string; mood: Character['currentMood'] }>) => {
      const { characterId, mood } = action.payload;
      if (state.characters[characterId]) {
        state.characters[characterId].currentMood = mood;
      }
    },
    addConversation: (state, action: PayloadAction<{
      characterId: string;
      userMessage: string;
      characterResponse: string;
      emotion: string;
      context: string;
    }>) => {
      const { characterId, userMessage, characterResponse, emotion, context } = action.payload;
      if (state.characters[characterId]) {
        const conversation = {
          id: `conv_${Date.now()}_${Math.random()}`,
          timestamp: Date.now(),
          userMessage,
          characterResponse,
          emotion,
          context,
        };
        state.characters[characterId].conversationHistory.push(conversation);
        
        // Keep only last 50 conversations for performance
        if (state.characters[characterId].conversationHistory.length > 50) {
          state.characters[characterId].conversationHistory = 
            state.characters[characterId].conversationHistory.slice(-50);
        }
      }
    },
    addMemory: (state, action: PayloadAction<{ characterId: string; memory: string }>) => {
      const { characterId, memory } = action.payload;
      if (state.characters[characterId] && !state.characters[characterId].memories.includes(memory)) {
        state.characters[characterId].memories.push(memory);
      }
    },
    updateRelationship: (state, action: PayloadAction<{
      characterId: string;
      targetId: string;
      relationship: string;
    }>) => {
      const { characterId, targetId, relationship } = action.payload;
      if (state.characters[characterId]) {
        state.characters[characterId].relationships[targetId] = relationship;
      }
    },
    setCharacterSpeaking: (state, action: PayloadAction<boolean>) => {
      state.isCharacterSpeaking = action.payload;
    },
    setCurrentDialogue: (state, action: PayloadAction<string | null>) => {
      state.currentDialogue = action.payload;
    },
    updateConversationContext: (state, action: PayloadAction<Partial<CharacterState['conversationContext']>>) => {
      state.conversationContext = { ...state.conversationContext, ...action.payload };
    },
    addConversationTopic: (state, action: PayloadAction<string>) => {
      const topic = action.payload;
      if (!state.conversationContext.previousTopics.includes(topic)) {
        state.conversationContext.previousTopics.push(topic);
        // Keep only last 10 topics
        if (state.conversationContext.previousTopics.length > 10) {
          state.conversationContext.previousTopics = state.conversationContext.previousTopics.slice(-10);
        }
      }
      state.conversationContext.topic = topic;
    },
    updateAISettings: (state, action: PayloadAction<Partial<CharacterState['aiSettings']>>) => {
      state.aiSettings = { ...state.aiSettings, ...action.payload };
    },
    incrementRelationshipLevel: (state) => {
      state.conversationContext.relationshipLevel = Math.min(
        100, 
        state.conversationContext.relationshipLevel + 1
      );
    },
    clearConversationHistory: (state, action: PayloadAction<string>) => {
      const characterId = action.payload;
      if (state.characters[characterId]) {
        state.characters[characterId].conversationHistory = [];
      }
    },
  },
});

export const {
  addCharacter,
  updateCharacter,
  setActiveCharacter,
  setCharacterMood,
  addConversation,
  addMemory,
  updateRelationship,
  setCharacterSpeaking,
  setCurrentDialogue,
  updateConversationContext,
  addConversationTopic,
  updateAISettings,
  incrementRelationshipLevel,
  clearConversationHistory,
} = characterSlice.actions;

export default characterSlice.reducer;