import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  animationFrameCount: number;
  droppedFrames: number;
  networkLatency: number;
  assetLoadTimes: Record<string, number>;
  userInteractionDelay: number;
}

interface PerformanceState {
  metrics: PerformanceMetrics;
  isMonitoring: boolean;
  autoOptimize: boolean;
  qualitySettings: {
    animations: 'low' | 'medium' | 'high';
    particles: 'low' | 'medium' | 'high';
    shadows: boolean;
    antialiasing: boolean;
    textureQuality: 'low' | 'medium' | 'high';
    renderScale: number;
  };
  adaptiveQuality: {
    enabled: boolean;
    fpsThreshold: number;
    memoryThreshold: number;
    lastAdjustment: number;
  };
  deviceCapabilities: {
    maxTextureSize: number;
    webglVersion: number;
    hardwareConcurrency: number;
    deviceMemory: number;
    connection: string;
  };
}

const initialState: PerformanceState = {
  metrics: {
    fps: 60,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
    animationFrameCount: 0,
    droppedFrames: 0,
    networkLatency: 0,
    assetLoadTimes: {},
    userInteractionDelay: 0,
  },
  isMonitoring: true,
  autoOptimize: true,
  qualitySettings: {
    animations: 'high',
    particles: 'high',
    shadows: true,
    antialiasing: true,
    textureQuality: 'high',
    renderScale: 1.0,
  },
  adaptiveQuality: {
    enabled: true,
    fpsThreshold: 45,
    memoryThreshold: 500, // MB
    lastAdjustment: 0,
  },
  deviceCapabilities: {
    maxTextureSize: 2048,
    webglVersion: 1,
    hardwareConcurrency: 4,
    deviceMemory: 4,
    connection: 'unknown',
  },
};

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    updateMetrics: (state, action: PayloadAction<Partial<PerformanceMetrics>>) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
    setMonitoring: (state, action: PayloadAction<boolean>) => {
      state.isMonitoring = action.payload;
    },
    setAutoOptimize: (state, action: PayloadAction<boolean>) => {
      state.autoOptimize = action.payload;
    },
    updateQualitySettings: (state, action: PayloadAction<Partial<PerformanceState['qualitySettings']>>) => {
      state.qualitySettings = { ...state.qualitySettings, ...action.payload };
    },
    updateAdaptiveQuality: (state, action: PayloadAction<Partial<PerformanceState['adaptiveQuality']>>) => {
      state.adaptiveQuality = { ...state.adaptiveQuality, ...action.payload };
    },
    setDeviceCapabilities: (state, action: PayloadAction<Partial<PerformanceState['deviceCapabilities']>>) => {
      state.deviceCapabilities = { ...state.deviceCapabilities, ...action.payload };
    },
    recordAssetLoadTime: (state, action: PayloadAction<{ assetId: string; loadTime: number }>) => {
      const { assetId, loadTime } = action.payload;
      state.metrics.assetLoadTimes[assetId] = loadTime;
    },
    optimizeQualityForPerformance: (state) => {
      const { fps, memoryUsage } = state.metrics;
      const { fpsThreshold, memoryThreshold } = state.adaptiveQuality;
      
      if (!state.autoOptimize || !state.adaptiveQuality.enabled) return;
      
      const now = Date.now();
      const timeSinceLastAdjustment = now - state.adaptiveQuality.lastAdjustment;
      
      // Only adjust every 5 seconds to avoid thrashing
      if (timeSinceLastAdjustment < 5000) return;
      
      let needsOptimization = false;
      
      if (fps < fpsThreshold || memoryUsage > memoryThreshold) {
        needsOptimization = true;
        
        // Reduce quality settings progressively
        if (state.qualitySettings.animations === 'high') {
          state.qualitySettings.animations = 'medium';
        } else if (state.qualitySettings.animations === 'medium') {
          state.qualitySettings.animations = 'low';
        }
        
        if (state.qualitySettings.particles === 'high') {
          state.qualitySettings.particles = 'medium';
        } else if (state.qualitySettings.particles === 'medium') {
          state.qualitySettings.particles = 'low';
        }
        
        if (state.qualitySettings.shadows) {
          state.qualitySettings.shadows = false;
        }
        
        if (state.qualitySettings.antialiasing) {
          state.qualitySettings.antialiasing = false;
        }
        
        if (state.qualitySettings.renderScale > 0.75) {
          state.qualitySettings.renderScale = Math.max(0.5, state.qualitySettings.renderScale - 0.1);
        }
      }
      
      if (needsOptimization) {
        state.adaptiveQuality.lastAdjustment = now;
      }
    },
    resetQualitySettings: (state) => {
      state.qualitySettings = initialState.qualitySettings;
    },
    recordFrameDrop: (state) => {
      state.metrics.droppedFrames += 1;
    },
    incrementAnimationFrame: (state) => {
      state.metrics.animationFrameCount += 1;
    },
  },
});

export const {
  updateMetrics,
  setMonitoring,
  setAutoOptimize,
  updateQualitySettings,
  updateAdaptiveQuality,
  setDeviceCapabilities,
  recordAssetLoadTime,
  optimizeQualityForPerformance,
  resetQualitySettings,
  recordFrameDrop,
  incrementAnimationFrame,
} = performanceSlice.actions;

export default performanceSlice.reducer;