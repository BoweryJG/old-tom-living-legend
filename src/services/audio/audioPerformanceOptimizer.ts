/**
 * Audio Performance Optimizer for Old Tom: The Living Legend
 * 
 * Dynamically optimizes audio processing based on device capabilities,
 * battery level, and performance requirements while maintaining
 * Studio Ghibli audio quality standards
 */

export interface DeviceCapabilities {
  audioContextSampleRate: number;
  maxAudioSources: number;
  memoryLimit: number; // MB
  processingPower: 'low' | 'medium' | 'high' | 'ultra';
  batteryAPI: boolean;
  webAudioSupport: boolean;
  spatialAudioSupport: boolean;
  realtimeAnalysisCapable: boolean;
  hardwareAcceleration: boolean;
}

export interface PerformanceMetrics {
  audioLatency: number; // ms
  cpuUsage: number; // 0-1
  memoryUsage: number; // MB
  batteryLevel: number; // 0-1
  frameRate: number; // fps
  audioDropouts: number;
  loadingTime: number; // ms
  userInteractionDelay: number; // ms
}

export interface OptimizationProfile {
  id: string;
  name: string;
  maxSpatialSources: number;
  reverbQuality: 'none' | 'basic' | 'standard' | 'high';
  frequencyAnalysisRate: number; // Hz
  audioBufferSize: number;
  compressionLevel: number; // 0-1
  backgroundProcessing: boolean;
  adaptiveQuality: boolean;
  preloadingStrategy: 'minimal' | 'balanced' | 'aggressive';
  spatialUpdateRate: number; // Hz
  effectProcessingComplexity: 'simple' | 'moderate' | 'complex';
}

export interface AdaptiveQualitySettings {
  audioQuality: number; // 0-1
  spatialComplexity: number; // 0-1
  realtimeProcessing: boolean;
  backgroundAudioEnabled: boolean;
  visualIndicatorDetail: number; // 0-1
  hapticFeedbackEnabled: boolean;
}

export class AudioPerformanceOptimizer {
  private deviceCapabilities: DeviceCapabilities;
  private currentMetrics: PerformanceMetrics;
  private optimizationProfile: OptimizationProfile;
  private adaptiveSettings: AdaptiveQualitySettings;
  private performanceHistory: PerformanceMetrics[] = [];
  private optimizationCallbacks: Map<string, (settings: AdaptiveQualitySettings) => void> = new Map();
  
  private batteryMonitor: any = null;
  private performanceMonitor: any = null;
  private lastOptimizationTime: number = 0;
  private optimizationCooldown: number = 5000; // 5 seconds between optimizations
  
  constructor() {
    this.deviceCapabilities = this.detectDeviceCapabilities();
    this.currentMetrics = this.initializeMetrics();
    this.optimizationProfile = this.selectOptimizationProfile();
    this.adaptiveSettings = this.initializeAdaptiveSettings();
    
    this.startPerformanceMonitoring();
    this.setupBatteryMonitoring();
    this.setupVisibilityHandling();
  }

  /**
   * Detect device capabilities for audio processing
   */
  private detectDeviceCapabilities(): DeviceCapabilities {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Detect processing power based on various indicators
    const getProcessingPower = (): DeviceCapabilities['processingPower'] => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const renderer = gl ? gl.getParameter(gl.RENDERER) : '';
      
      // Basic heuristics for processing power
      if (navigator.hardwareConcurrency >= 8) return 'ultra';
      if (navigator.hardwareConcurrency >= 4) return 'high';
      if (navigator.hardwareConcurrency >= 2) return 'medium';
      return 'low';
    };

    // Estimate memory limit
    const getMemoryLimit = (): number => {
      // @ts-ignore - deviceMemory is experimental
      if (navigator.deviceMemory) {
        // @ts-ignore
        return navigator.deviceMemory * 1024; // Convert GB to MB
      }
      
      // Fallback estimation
      const processingPower = getProcessingPower();
      const memoryMap = {
        low: 1024,    // 1GB
        medium: 2048, // 2GB
        high: 4096,   // 4GB
        ultra: 8192   // 8GB
      };
      return memoryMap[processingPower];
    };

    const capabilities: DeviceCapabilities = {
      audioContextSampleRate: audioContext.sampleRate,
      maxAudioSources: this.estimateMaxAudioSources(),
      memoryLimit: getMemoryLimit(),
      processingPower: getProcessingPower(),
      batteryAPI: 'getBattery' in navigator,
      webAudioSupport: !!(window.AudioContext || (window as any).webkitAudioContext),
      spatialAudioSupport: this.detectSpatialAudioSupport(audioContext),
      realtimeAnalysisCapable: this.detectRealtimeAnalysisCapability(),
      hardwareAcceleration: this.detectHardwareAcceleration()
    };

    audioContext.close();
    return capabilities;
  }

  /**
   * Estimate maximum simultaneous audio sources device can handle
   */
  private estimateMaxAudioSources(): number {
    const { processingPower } = this.deviceCapabilities || { processingPower: 'medium' };
    
    const sourceMap = {
      low: 8,
      medium: 16,
      high: 32,
      ultra: 64
    };
    
    return sourceMap[processingPower];
  }

  /**
   * Detect spatial audio support capabilities
   */
  private detectSpatialAudioSupport(audioContext: AudioContext): boolean {
    try {
      const panner = audioContext.createPanner();
      return !!(panner.positionX && panner.orientationX);
    } catch {
      return false;
    }
  }

  /**
   * Detect real-time analysis capability
   */
  private detectRealtimeAnalysisCapability(): boolean {
    // Test if device can handle real-time frequency analysis
    return this.deviceCapabilities?.processingPower !== 'low';
  }

  /**
   * Detect hardware acceleration support
   */
  private detectHardwareAcceleration(): boolean {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) return false;
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return false;
    
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return !renderer.includes('SwiftShader'); // Software renderer
  }

  /**
   * Initialize performance metrics
   */
  private initializeMetrics(): PerformanceMetrics {
    return {
      audioLatency: 0,
      cpuUsage: 0,
      memoryUsage: 0,
      batteryLevel: 1.0,
      frameRate: 60,
      audioDropouts: 0,
      loadingTime: 0,
      userInteractionDelay: 0
    };
  }

  /**
   * Select appropriate optimization profile based on device capabilities
   */
  private selectOptimizationProfile(): OptimizationProfile {
    const { processingPower, maxAudioSources, spatialAudioSupport } = this.deviceCapabilities;
    
    // Ultra performance profile
    if (processingPower === 'ultra') {
      return {
        id: 'ultra_quality',
        name: 'Ultra Quality',
        maxSpatialSources: Math.min(maxAudioSources, 32),
        reverbQuality: 'high',
        frequencyAnalysisRate: 60,
        audioBufferSize: 256,
        compressionLevel: 0.1,
        backgroundProcessing: true,
        adaptiveQuality: true,
        preloadingStrategy: 'aggressive',
        spatialUpdateRate: 60,
        effectProcessingComplexity: 'complex'
      };
    }
    
    // High performance profile
    if (processingPower === 'high') {
      return {
        id: 'high_quality',
        name: 'High Quality',
        maxSpatialSources: Math.min(maxAudioSources, 24),
        reverbQuality: 'high',
        frequencyAnalysisRate: 30,
        audioBufferSize: 512,
        compressionLevel: 0.2,
        backgroundProcessing: true,
        adaptiveQuality: true,
        preloadingStrategy: 'balanced',
        spatialUpdateRate: 30,
        effectProcessingComplexity: 'complex'
      };
    }
    
    // Medium performance profile
    if (processingPower === 'medium') {
      return {
        id: 'balanced',
        name: 'Balanced Quality',
        maxSpatialSources: Math.min(maxAudioSources, 16),
        reverbQuality: spatialAudioSupport ? 'standard' : 'basic',
        frequencyAnalysisRate: 20,
        audioBufferSize: 1024,
        compressionLevel: 0.4,
        backgroundProcessing: true,
        adaptiveQuality: true,
        preloadingStrategy: 'balanced',
        spatialUpdateRate: 20,
        effectProcessingComplexity: 'moderate'
      };
    }
    
    // Low performance profile
    return {
      id: 'performance',
      name: 'Performance Optimized',
      maxSpatialSources: Math.min(maxAudioSources, 8),
      reverbQuality: 'basic',
      frequencyAnalysisRate: 10,
      audioBufferSize: 2048,
      compressionLevel: 0.6,
      backgroundProcessing: false,
      adaptiveQuality: true,
      preloadingStrategy: 'minimal',
      spatialUpdateRate: 10,
      effectProcessingComplexity: 'simple'
    };
  }

  /**
   * Initialize adaptive quality settings
   */
  private initializeAdaptiveSettings(): AdaptiveQualitySettings {
    const profile = this.optimizationProfile;
    
    return {
      audioQuality: 1.0 - profile.compressionLevel,
      spatialComplexity: profile.maxSpatialSources / 32,
      realtimeProcessing: profile.frequencyAnalysisRate > 15,
      backgroundAudioEnabled: profile.backgroundProcessing,
      visualIndicatorDetail: profile.reverbQuality === 'high' ? 1.0 : 0.6,
      hapticFeedbackEnabled: this.deviceCapabilities.processingPower !== 'low'
    };
  }

  /**
   * Start continuous performance monitoring
   */
  private startPerformanceMonitoring(): void {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const monitor = () => {
      const currentTime = performance.now();
      frameCount++;
      
      // Calculate FPS every second
      if (currentTime - lastTime >= 1000) {
        this.currentMetrics.frameRate = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Update other metrics
        this.updatePerformanceMetrics();
        
        // Check if optimization is needed
        this.checkOptimizationNeeded();
      }
      
      this.performanceMonitor = requestAnimationFrame(monitor);
    };
    
    monitor();
  }

  /**
   * Setup battery monitoring if available
   */
  private async setupBatteryMonitoring(): Promise<void> {
    if (!this.deviceCapabilities.batteryAPI) return;
    
    try {
      // @ts-ignore - getBattery is experimental
      const battery = await navigator.getBattery();
      
      const updateBatteryStatus = () => {
        this.currentMetrics.batteryLevel = battery.level;
        this.adaptToBatteryLevel(battery.level, battery.charging);
      };
      
      battery.addEventListener('levelchange', updateBatteryStatus);
      battery.addEventListener('chargingchange', updateBatteryStatus);
      
      updateBatteryStatus();
    } catch (error) {
      console.warn('Battery API not available:', error);
    }
  }

  /**
   * Setup visibility change handling for performance optimization
   */
  private setupVisibilityHandling(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.adaptToBackground();
      } else {
        this.adaptToForeground();
      }
    });
  }

  /**
   * Update current performance metrics
   */
  private updatePerformanceMetrics(): void {
    // Memory usage (if available)
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      this.currentMetrics.memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // MB
    }
    
    // Audio latency estimation
    this.currentMetrics.audioLatency = this.estimateAudioLatency();
    
    // Store metrics history
    this.performanceHistory.push({ ...this.currentMetrics });
    if (this.performanceHistory.length > 60) { // Keep 1 minute of history
      this.performanceHistory.shift();
    }
  }

  /**
   * Estimate current audio latency
   */
  private estimateAudioLatency(): number {
    // Basic estimation based on buffer size and sample rate
    const bufferSize = this.optimizationProfile.audioBufferSize;
    const sampleRate = this.deviceCapabilities.audioContextSampleRate;
    return (bufferSize / sampleRate) * 1000; // Convert to milliseconds
  }

  /**
   * Check if optimization adjustments are needed
   */
  private checkOptimizationNeeded(): void {
    const now = Date.now();
    if (now - this.lastOptimizationTime < this.optimizationCooldown) return;
    
    const needsOptimization = this.analyzePerformanceIssues();
    if (needsOptimization) {
      this.optimizePerformance();
      this.lastOptimizationTime = now;
    }
  }

  /**
   * Analyze performance data to identify issues
   */
  private analyzePerformanceIssues(): boolean {
    const metrics = this.currentMetrics;
    
    // Check frame rate
    if (metrics.frameRate < 30) return true;
    
    // Check memory usage
    const memoryThreshold = this.deviceCapabilities.memoryLimit * 0.8; // 80% threshold
    if (metrics.memoryUsage > memoryThreshold) return true;
    
    // Check audio dropouts
    if (metrics.audioDropouts > 0) return true;
    
    // Check battery level
    if (metrics.batteryLevel < 0.2 && this.currentMetrics.batteryLevel < 1.0) return true;
    
    // Check user interaction delay
    if (metrics.userInteractionDelay > 100) return true;
    
    return false;
  }

  /**
   * Perform optimization adjustments
   */
  private optimizePerformance(): void {
    const metrics = this.currentMetrics;
    let optimizationApplied = false;
    
    // Reduce spatial sources if frame rate is low
    if (metrics.frameRate < 30 && this.adaptiveSettings.spatialComplexity > 0.3) {
      this.adaptiveSettings.spatialComplexity *= 0.8;
      optimizationApplied = true;
    }
    
    // Reduce audio quality if memory usage is high
    if (metrics.memoryUsage > this.deviceCapabilities.memoryLimit * 0.8) {
      this.adaptiveSettings.audioQuality *= 0.9;
      optimizationApplied = true;
    }
    
    // Disable real-time processing if performance is poor
    if (metrics.frameRate < 20 && this.adaptiveSettings.realtimeProcessing) {
      this.adaptiveSettings.realtimeProcessing = false;
      optimizationApplied = true;
    }
    
    // Reduce visual indicator detail if needed
    if (metrics.frameRate < 25 && this.adaptiveSettings.visualIndicatorDetail > 0.4) {
      this.adaptiveSettings.visualIndicatorDetail *= 0.7;
      optimizationApplied = true;
    }
    
    if (optimizationApplied) {
      this.notifyOptimizationCallbacks();
      console.log('Performance optimization applied:', this.adaptiveSettings);
    }
  }

  /**
   * Adapt audio processing to battery level
   */
  private adaptToBatteryLevel(level: number, charging: boolean): void {
    if (charging) return; // Don't optimize when charging
    
    if (level < 0.15) { // Critical battery
      this.adaptiveSettings.audioQuality = Math.min(this.adaptiveSettings.audioQuality, 0.6);
      this.adaptiveSettings.spatialComplexity = Math.min(this.adaptiveSettings.spatialComplexity, 0.4);
      this.adaptiveSettings.realtimeProcessing = false;
      this.adaptiveSettings.hapticFeedbackEnabled = false;
      this.notifyOptimizationCallbacks();
    } else if (level < 0.3) { // Low battery
      this.adaptiveSettings.audioQuality = Math.min(this.adaptiveSettings.audioQuality, 0.8);
      this.adaptiveSettings.spatialComplexity = Math.min(this.adaptiveSettings.spatialComplexity, 0.6);
      this.notifyOptimizationCallbacks();
    }
  }

  /**
   * Adapt to background/inactive state
   */
  private adaptToBackground(): void {
    this.adaptiveSettings.realtimeProcessing = false;
    this.adaptiveSettings.visualIndicatorDetail = 0.2;
    this.adaptiveSettings.spatialComplexity *= 0.5;
    this.notifyOptimizationCallbacks();
  }

  /**
   * Adapt to foreground/active state
   */
  private adaptToForeground(): void {
    // Restore settings gradually
    setTimeout(() => {
      this.adaptiveSettings.realtimeProcessing = this.optimizationProfile.frequencyAnalysisRate > 15;
      this.adaptiveSettings.visualIndicatorDetail = this.optimizationProfile.reverbQuality === 'high' ? 1.0 : 0.6;
      this.adaptiveSettings.spatialComplexity = this.optimizationProfile.maxSpatialSources / 32;
      this.notifyOptimizationCallbacks();
    }, 1000); // 1 second delay for smooth transition
  }

  /**
   * Register callback for optimization updates
   */
  onOptimizationUpdate(id: string, callback: (settings: AdaptiveQualitySettings) => void): void {
    this.optimizationCallbacks.set(id, callback);
  }

  /**
   * Unregister optimization callback
   */
  offOptimizationUpdate(id: string): void {
    this.optimizationCallbacks.delete(id);
  }

  /**
   * Notify all registered callbacks of optimization changes
   */
  private notifyOptimizationCallbacks(): void {
    this.optimizationCallbacks.forEach(callback => {
      try {
        callback(this.adaptiveSettings);
      } catch (error) {
        console.error('Error in optimization callback:', error);
      }
    });
  }

  /**
   * Manually trigger performance analysis and optimization
   */
  optimizeNow(): void {
    this.optimizePerformance();
  }

  /**
   * Set custom optimization profile
   */
  setOptimizationProfile(profile: OptimizationProfile): void {
    this.optimizationProfile = profile;
    this.adaptiveSettings = this.initializeAdaptiveSettings();
    this.notifyOptimizationCallbacks();
  }

  /**
   * Get current device capabilities
   */
  getDeviceCapabilities(): DeviceCapabilities {
    return { ...this.deviceCapabilities };
  }

  /**
   * Get current performance metrics
   */
  getCurrentMetrics(): PerformanceMetrics {
    return { ...this.currentMetrics };
  }

  /**
   * Get current optimization profile
   */
  getOptimizationProfile(): OptimizationProfile {
    return { ...this.optimizationProfile };
  }

  /**
   * Get current adaptive settings
   */
  getAdaptiveSettings(): AdaptiveQualitySettings {
    return { ...this.adaptiveSettings };
  }

  /**
   * Get performance history
   */
  getPerformanceHistory(): PerformanceMetrics[] {
    return [...this.performanceHistory];
  }

  /**
   * Update user interaction delay metric
   */
  reportUserInteractionDelay(delay: number): void {
    this.currentMetrics.userInteractionDelay = delay;
  }

  /**
   * Report audio dropout occurrence
   */
  reportAudioDropout(): void {
    this.currentMetrics.audioDropouts++;
    
    // Reset dropout counter every minute
    setTimeout(() => {
      this.currentMetrics.audioDropouts = Math.max(0, this.currentMetrics.audioDropouts - 1);
    }, 60000);
  }

  /**
   * Cleanup and stop monitoring
   */
  dispose(): void {
    if (this.performanceMonitor) {
      cancelAnimationFrame(this.performanceMonitor);
    }
    this.optimizationCallbacks.clear();
  }

  /**
   * Get recommended settings for external audio components
   */
  getRecommendedAudioSettings(): {
    maxSpatialSources: number;
    updateRate: number;
    reverbEnabled: boolean;
    realtimeAnalysis: boolean;
    compressionLevel: number;
  } {
    return {
      maxSpatialSources: Math.floor(this.adaptiveSettings.spatialComplexity * this.optimizationProfile.maxSpatialSources),
      updateRate: this.adaptiveSettings.realtimeProcessing ? this.optimizationProfile.spatialUpdateRate : 5,
      reverbEnabled: this.optimizationProfile.reverbQuality !== 'none',
      realtimeAnalysis: this.adaptiveSettings.realtimeProcessing,
      compressionLevel: 1.0 - this.adaptiveSettings.audioQuality
    };
  }
}