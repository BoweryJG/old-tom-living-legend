import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AudioTrack {
  id: string;
  name: string;
  src: string;
  type: 'background' | 'effect' | 'voice' | 'ambient';
  volume: number;
  loop: boolean;
  fadeIn: number;
  fadeOut: number;
}

interface AudioState {
  tracks: Record<string, AudioTrack>;
  activeTracks: string[];
  masterVolume: number;
  backgroundVolume: number;
  effectsVolume: number;
  voiceVolume: number;
  isMuted: boolean;
  isRecording: boolean;
  voiceRecognition: {
    isActive: boolean;
    isListening: boolean;
    lastCommand: string | null;
    confidence: number;
  };
  audioContext: AudioContext | null;
  spatialAudio: {
    enabled: boolean;
    listenerPosition: { x: number; y: number; z: number };
    sources: Record<string, { x: number; y: number; z: number }>;
  };
}

const initialState: AudioState = {
  tracks: {},
  activeTracks: [],
  masterVolume: 0.8,
  backgroundVolume: 0.6,
  effectsVolume: 0.8,
  voiceVolume: 1.0,
  isMuted: false,
  isRecording: false,
  voiceRecognition: {
    isActive: false,
    isListening: false,
    lastCommand: null,
    confidence: 0,
  },
  audioContext: null,
  spatialAudio: {
    enabled: true,
    listenerPosition: { x: 0, y: 0, z: 0 },
    sources: {},
  },
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    loadTrack: (state, action: PayloadAction<AudioTrack>) => {
      const track = action.payload;
      state.tracks[track.id] = track;
    },
    playTrack: (state, action: PayloadAction<string>) => {
      const trackId = action.payload;
      if (state.tracks[trackId] && !state.activeTracks.includes(trackId)) {
        state.activeTracks.push(trackId);
      }
    },
    stopTrack: (state, action: PayloadAction<string>) => {
      const trackId = action.payload;
      state.activeTracks = state.activeTracks.filter(id => id !== trackId);
    },
    stopAllTracks: (state) => {
      state.activeTracks = [];
    },
    setMasterVolume: (state, action: PayloadAction<number>) => {
      state.masterVolume = Math.max(0, Math.min(1, action.payload));
    },
    setBackgroundVolume: (state, action: PayloadAction<number>) => {
      state.backgroundVolume = Math.max(0, Math.min(1, action.payload));
    },
    setEffectsVolume: (state, action: PayloadAction<number>) => {
      state.effectsVolume = Math.max(0, Math.min(1, action.payload));
    },
    setVoiceVolume: (state, action: PayloadAction<number>) => {
      state.voiceVolume = Math.max(0, Math.min(1, action.payload));
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    startRecording: (state) => {
      state.isRecording = true;
    },
    stopRecording: (state) => {
      state.isRecording = false;
    },
    setVoiceRecognition: (state, action: PayloadAction<Partial<AudioState['voiceRecognition']>>) => {
      state.voiceRecognition = { ...state.voiceRecognition, ...action.payload };
    },
    setAudioContext: (state, action: PayloadAction<AudioContext | null>) => {
      // Note: AudioContext is not serializable, handled by middleware
      state.audioContext = action.payload;
    },
    setSpatialAudioEnabled: (state, action: PayloadAction<boolean>) => {
      state.spatialAudio.enabled = action.payload;
    },
    setListenerPosition: (state, action: PayloadAction<{ x: number; y: number; z: number }>) => {
      state.spatialAudio.listenerPosition = action.payload;
    },
    setSpatialSource: (state, action: PayloadAction<{ id: string; x: number; y: number; z: number }>) => {
      const { id, x, y, z } = action.payload;
      state.spatialAudio.sources[id] = { x, y, z };
    },
    removeSpatialSource: (state, action: PayloadAction<string>) => {
      delete state.spatialAudio.sources[action.payload];
    },
    updateTrackVolume: (state, action: PayloadAction<{ trackId: string; volume: number }>) => {
      const { trackId, volume } = action.payload;
      if (state.tracks[trackId]) {
        state.tracks[trackId].volume = Math.max(0, Math.min(1, volume));
      }
    },
  },
});

export const {
  loadTrack,
  playTrack,
  stopTrack,
  stopAllTracks,
  setMasterVolume,
  setBackgroundVolume,
  setEffectsVolume,
  setVoiceVolume,
  toggleMute,
  setMuted,
  startRecording,
  stopRecording,
  setVoiceRecognition,
  setAudioContext,
  setSpatialAudioEnabled,
  setListenerPosition,
  setSpatialSource,
  removeSpatialSource,
  updateTrackVolume,
} = audioSlice.actions;

export default audioSlice.reducer;