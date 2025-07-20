import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AIState {
  isProcessing: boolean;
  currentResponse: string | null;
  error: string | null;
  speechRecognition: {
    supported: boolean;
    listening: boolean;
    transcript: string;
  };
  voiceSynthesis: {
    speaking: boolean;
    enabled: boolean;
  };
}

const initialState: AIState = {
  isProcessing: false,
  currentResponse: null,
  error: null,
  speechRecognition: {
    supported: false,
    listening: false,
    transcript: ''
  },
  voiceSynthesis: {
    speaking: false,
    enabled: true
  }
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setResponse: (state, action: PayloadAction<string>) => {
      state.currentResponse = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isProcessing = false;
    },
    setSpeechTranscript: (state, action: PayloadAction<string>) => {
      state.speechRecognition.transcript = action.payload;
    },
    setSpeechListening: (state, action: PayloadAction<boolean>) => {
      state.speechRecognition.listening = action.payload;
    },
    setVoiceSpeaking: (state, action: PayloadAction<boolean>) => {
      state.voiceSynthesis.speaking = action.payload;
    },
    reset: (state) => {
      state.isProcessing = false;
      state.currentResponse = null;
      state.error = null;
    }
  }
});

export const { 
  setProcessing, 
  setResponse, 
  setError, 
  setSpeechTranscript, 
  setSpeechListening, 
  setVoiceSpeaking, 
  reset 
} = aiSlice.actions;

export default aiSlice.reducer;