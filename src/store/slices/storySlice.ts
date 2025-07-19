import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StoryScene {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  characters: string[];
  animations: string[];
  audioTracks: string[];
  interactiveElements: string[];
  nextScenes: string[];
  timeToComplete: number; // in seconds
}

export interface StoryProgress {
  currentSceneId: string;
  completedScenes: string[];
  unlockedScenes: string[];
  achievements: string[];
  totalTimeSpent: number;
  choicesMade: Record<string, string>;
}

interface StoryState {
  scenes: Record<string, StoryScene>;
  progress: StoryProgress;
  isLoading: boolean;
  isPlaying: boolean;
  currentNarration: string | null;
  voiceSettings: {
    speed: number;
    volume: number;
    voice: string;
  };
  preferences: {
    autoAdvance: boolean;
    showSubtitles: boolean;
    reducedMotion: boolean;
  };
}

const initialState: StoryState = {
  scenes: {},
  progress: {
    currentSceneId: 'home',
    completedScenes: [],
    unlockedScenes: ['home'],
    achievements: [],
    totalTimeSpent: 0,
    choicesMade: {},
  },
  isLoading: false,
  isPlaying: false,
  currentNarration: null,
  voiceSettings: {
    speed: 1.0,
    volume: 0.8,
    voice: 'old-tom',
  },
  preferences: {
    autoAdvance: false,
    showSubtitles: true,
    reducedMotion: false,
  },
};

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setScenes: (state, action: PayloadAction<Record<string, StoryScene>>) => {
      state.scenes = action.payload;
    },
    navigateToScene: (state, action: PayloadAction<string>) => {
      const sceneId = action.payload;
      if (state.scenes[sceneId] && state.progress.unlockedScenes.includes(sceneId)) {
        state.progress.currentSceneId = sceneId;
      }
    },
    completeScene: (state, action: PayloadAction<{ sceneId: string; timeSpent: number }>) => {
      const { sceneId, timeSpent } = action.payload;
      if (!state.progress.completedScenes.includes(sceneId)) {
        state.progress.completedScenes.push(sceneId);
        state.progress.totalTimeSpent += timeSpent;
        
        // Unlock next scenes
        const scene = state.scenes[sceneId];
        if (scene) {
          scene.nextScenes.forEach(nextSceneId => {
            if (!state.progress.unlockedScenes.includes(nextSceneId)) {
              state.progress.unlockedScenes.push(nextSceneId);
            }
          });
        }
      }
    },
    unlockAchievement: (state, action: PayloadAction<string>) => {
      const achievement = action.payload;
      if (!state.progress.achievements.includes(achievement)) {
        state.progress.achievements.push(achievement);
      }
    },
    makeChoice: (state, action: PayloadAction<{ sceneId: string; choice: string }>) => {
      const { sceneId, choice } = action.payload;
      state.progress.choicesMade[sceneId] = choice;
    },
    setNarration: (state, action: PayloadAction<string | null>) => {
      state.currentNarration = action.payload;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateVoiceSettings: (state, action: PayloadAction<Partial<StoryState['voiceSettings']>>) => {
      state.voiceSettings = { ...state.voiceSettings, ...action.payload };
    },
    updatePreferences: (state, action: PayloadAction<Partial<StoryState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    resetProgress: (state) => {
      state.progress = initialState.progress;
    },
  },
});

export const {
  setScenes,
  navigateToScene,
  completeScene,
  unlockAchievement,
  makeChoice,
  setNarration,
  setPlaying,
  setLoading,
  updateVoiceSettings,
  updatePreferences,
  resetProgress,
} = storySlice.actions;

export default storySlice.reducer;