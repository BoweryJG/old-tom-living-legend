// Global type definitions for Old Tom application

export interface Point {
  x: number;
  y: number;
}

export interface Point3D extends Point {
  z: number;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  loop?: boolean;
}

export interface TouchGesture {
  type: 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch';
  position: Point;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  scale?: number;
}

export interface AudioConfig {
  volume: number;
  loop: boolean;
  fadeIn?: number;
  fadeOut?: number;
  spatialPosition?: Point3D;
}

export interface SceneTransition {
  type: 'fade' | 'slide' | 'zoom' | 'portal' | 'wave';
  duration: number;
  direction?: 'in' | 'out';
  easing?: string;
}

export interface InteractiveElement {
  id: string;
  type: 'clickable' | 'draggable' | 'hoverable';
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  action: string;
  feedback?: {
    visual?: string;
    audio?: string;
    haptic?: boolean;
  };
}

export interface AssetMetadata {
  id: string;
  type: 'image' | 'audio' | 'animation' | 'model';
  url: string;
  size: number;
  format: string;
  quality?: 'low' | 'medium' | 'high' | '4k';
  preload?: boolean;
  progressive?: boolean;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  screenSize: Point;
  pixelRatio: number;
  touchSupport: boolean;
  orientation: 'portrait' | 'landscape';
  networkSpeed: 'slow' | 'medium' | 'fast';
}

export interface UserPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  soundEnabled: boolean;
  voiceEnabled: boolean;
  autoplayEnabled: boolean;
  subtitlesEnabled: boolean;
  language: string;
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}


// Animation and Effect types
export interface ParticleEffect {
  id: string;
  type: 'bubbles' | 'sparkles' | 'waves' | 'ripples';
  count: number;
  lifetime: number;
  spawn: {
    rate: number;
    area: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  movement: {
    velocity: Point;
    acceleration: Point;
    friction: number;
  };
  appearance: {
    size: {
      start: number;
      end: number;
    };
    opacity: {
      start: number;
      end: number;
    };
    color: {
      start: string;
      end: string;
    };
  };
}

export interface WaterEffect {
  id: string;
  type: 'ripple' | 'wave' | 'splash' | 'current';
  intensity: number;
  radius: number;
  position: Point;
  duration: number;
  decay: number;
}

// Error handling
export interface AppError {
  id: string;
  type: 'network' | 'api' | 'animation' | 'audio' | 'unknown';
  message: string;
  details?: any;
  timestamp: string;
  recoverable: boolean;
  retryAction?: string;
}

// Performance metrics
export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  networkLatency: number;
  batteryLevel?: number;
  thermalState?: 'normal' | 'fair' | 'serious' | 'critical';
}

// Accessibility
export interface AccessibilityOptions {
  screenReaderEnabled: boolean;
  keyboardNavigationEnabled: boolean;
  focusVisible: boolean;
  skipLinks: boolean;
  announceChanges: boolean;
}

export default {};