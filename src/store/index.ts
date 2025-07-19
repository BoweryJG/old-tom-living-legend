import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import storyReducer from './slices/storySlice';
import audioReducer from './slices/audioSlice';
import uiReducer from './slices/uiSlice';
import performanceReducer from './slices/performanceSlice';
import characterReducer from './slices/characterSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    story: storyReducer,
    audio: audioReducer,
    ui: uiReducer,
    performance: performanceReducer,
    character: characterReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'audio/setAudioContext', 
          'performance/setMetrics',
          'ai/processAIInteraction/fulfilled',
          'ai/processAIInteraction/pending',
          'ai/startSpeechRecognition/fulfilled'
        ],
        ignoredPaths: [
          'audio.audioContext', 
          'performance.metrics',
          'ai.voiceSynthesis.queue',
          'ai.emotionalAnalysis.adaptations.voiceSettings'
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;