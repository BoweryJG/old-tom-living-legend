/**
 * Spatial Audio Engine for Old Tom: The Living Legend
 * 
 * Creates immersive 3D soundscapes using Web Audio API with realistic
 * underwater acoustics and Studio Ghibli-quality environmental audio
 */

export interface SpatialAudioSource {
  id: string;
  name: string;
  position: Vector3D;
  velocity: Vector3D;
  audioBuffer: AudioBuffer | null;
  audioNode: AudioBufferSourceNode | null;
  pannerNode: PannerNode | null;
  gainNode: GainNode | null;
  isPlaying: boolean;
  loop: boolean;
  volume: number;
  maxDistance: number;
  rolloffFactor: number;
  coneInnerAngle: number;
  coneOuterAngle: number;
  coneOuterGain: number;
  distanceModel: DistanceModelType;
  panningModel: PanningModelType;
  refDistance: number;
  environmentType: EnvironmentType;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface AudioListener {
  position: Vector3D;
  forward: Vector3D;
  up: Vector3D;
  velocity: Vector3D;
}

export type EnvironmentType = 
  | 'underwater' 
  | 'surface' 
  | 'coastal' 
  | 'whaling_station' 
  | 'open_ocean' 
  | 'cave' 
  | 'boat_interior';

export interface EnvironmentSettings {
  reverbType: 'none' | 'room' | 'hall' | 'cathedral' | 'underwater' | 'cave';
  dampening: number;
  echoes: boolean;
  echoDelay: number;
  echoDecay: number;
  lowPassCutoff: number;
  highPassCutoff: number;
  compressionRatio: number;
  atmosphericDensity: number; // Affects sound transmission
}

export interface UnderwaterAcoustics {
  enabled: boolean;
  depth: number; // meters below surface
  salinity: number; // affects sound speed
  temperature: number; // affects sound speed
  pressure: number; // affects sound transmission
  currentStrength: number; // affects sound direction
  currentDirection: Vector3D;
  bubbles: boolean; // bubble effects
  thermalLayers: boolean; // temperature-based sound bending
}

export class SpatialAudioEngine {
  private audioContext: AudioContext;
  private sources: Map<string, SpatialAudioSource> = new Map();
  private listener: AudioListener;
  private convolver: ConvolverNode | null = null;
  private masterGain: GainNode;
  private environmentSettings: EnvironmentSettings;
  private underwaterAcoustics: UnderwaterAcoustics;
  private reverbBuffers: Map<string, AudioBuffer> = new Map();
  private currentEnvironment: EnvironmentType = 'surface';
  private isUnderwater: boolean = false;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.masterGain = audioContext.createGain();
    this.masterGain.connect(audioContext.destination);

    // Initialize listener at origin
    this.listener = {
      position: { x: 0, y: 0, z: 0 },
      forward: { x: 0, y: 0, z: -1 },
      up: { x: 0, y: 1, z: 0 },
      velocity: { x: 0, y: 0, z: 0 }
    };

    // Default environment settings
    this.environmentSettings = {
      reverbType: 'none',
      dampening: 0.2,
      echoes: false,
      echoDelay: 0.3,
      echoDecay: 0.5,
      lowPassCutoff: 22050,
      highPassCutoff: 20,
      compressionRatio: 1.0,
      atmosphericDensity: 1.0
    };

    // Default underwater acoustics
    this.underwaterAcoustics = {
      enabled: false,
      depth: 0,
      salinity: 35, // typical ocean salinity in PSU
      temperature: 15, // typical ocean temperature in Celsius
      pressure: 1.0, // atmospheric pressure at surface
      currentStrength: 0,
      currentDirection: { x: 0, y: 0, z: 0 },
      bubbles: false,
      thermalLayers: false
    };

    this.initializeEnvironmentPresets();
    this.updateListener();
  }

  /**
   * Create and configure a spatial audio source
   */
  async createSource(
    id: string,
    audioUrl: string,
    position: Vector3D,
    options: Partial<SpatialAudioSource> = {}
  ): Promise<SpatialAudioSource> {
    try {
      // Load audio buffer
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      // Create audio nodes
      const sourceNode = this.audioContext.createBufferSource();
      const pannerNode = this.audioContext.createPanner();
      const gainNode = this.audioContext.createGain();

      // Configure panner node for realistic 3D audio
      pannerNode.panningModel = options.panningModel || 'HRTF';
      pannerNode.distanceModel = options.distanceModel || 'inverse';
      pannerNode.refDistance = options.refDistance || 1;
      pannerNode.maxDistance = options.maxDistance || 10000;
      pannerNode.rolloffFactor = options.rolloffFactor || 1;
      pannerNode.coneInnerAngle = options.coneInnerAngle || 360;
      pannerNode.coneOuterAngle = options.coneOuterAngle || 360;
      pannerNode.coneOuterGain = options.coneOuterGain || 0;

      // Set position
      pannerNode.positionX.setValueAtTime(position.x, this.audioContext.currentTime);
      pannerNode.positionY.setValueAtTime(position.y, this.audioContext.currentTime);
      pannerNode.positionZ.setValueAtTime(position.z, this.audioContext.currentTime);

      // Configure gain
      gainNode.gain.setValueAtTime(options.volume || 1.0, this.audioContext.currentTime);

      // Connect nodes: source -> gain -> panner -> effects -> master
      sourceNode.connect(gainNode);
      gainNode.connect(pannerNode);
      this.connectToEnvironmentEffects(pannerNode);

      // Set up source
      sourceNode.buffer = audioBuffer;
      sourceNode.loop = options.loop || false;

      const source: SpatialAudioSource = {
        id,
        name: options.name || id,
        position,
        velocity: options.velocity || { x: 0, y: 0, z: 0 },
        audioBuffer,
        audioNode: sourceNode,
        pannerNode,
        gainNode,
        isPlaying: false,
        loop: options.loop || false,
        volume: options.volume || 1.0,
        maxDistance: options.maxDistance || 10000,
        rolloffFactor: options.rolloffFactor || 1,
        coneInnerAngle: options.coneInnerAngle || 360,
        coneOuterAngle: options.coneOuterAngle || 360,
        coneOuterGain: options.coneOuterGain || 0,
        distanceModel: options.distanceModel || 'inverse',
        panningModel: options.panningModel || 'HRTF',
        refDistance: options.refDistance || 1,
        environmentType: options.environmentType || this.currentEnvironment
      };

      this.sources.set(id, source);

      // Apply environment-specific processing
      this.applyEnvironmentProcessing(source);

      return source;
    } catch (error) {
      console.error(`Failed to create spatial audio source ${id}:`, error);
      throw error;
    }
  }

  /**
   * Play a spatial audio source
   */
  playSource(id: string, when: number = 0, offset: number = 0, duration?: number): void {
    const source = this.sources.get(id);
    if (!source || !source.audioNode) {
      console.warn(`Audio source not found or not ready: ${id}`);
      return;
    }

    if (source.isPlaying) {
      this.stopSource(id);
      // Recreate source node for replay
      this.recreateSourceNode(source);
    }

    try {
      source.audioNode!.start(when, offset, duration);
      source.isPlaying = true;
      
      // Handle source ended event
      source.audioNode!.onended = () => {
        source.isPlaying = false;
        if (source.loop) {
          this.playSource(id); // Restart for looping
        }
      };
    } catch (error) {
      console.error(`Failed to play source ${id}:`, error);
    }
  }

  /**
   * Stop a spatial audio source
   */
  stopSource(id: string): void {
    const source = this.sources.get(id);
    if (!source || !source.audioNode) return;

    try {
      source.audioNode.stop();
      source.isPlaying = false;
    } catch (error) {
      // Source might already be stopped
      source.isPlaying = false;
    }
  }

  /**
   * Update source position with optional velocity
   */
  updateSourcePosition(id: string, position: Vector3D, velocity?: Vector3D): void {
    const source = this.sources.get(id);
    if (!source || !source.pannerNode) return;

    const currentTime = this.audioContext.currentTime;
    
    // Smooth position transition
    source.pannerNode.positionX.linearRampToValueAtTime(position.x, currentTime + 0.1);
    source.pannerNode.positionY.linearRampToValueAtTime(position.y, currentTime + 0.1);
    source.pannerNode.positionZ.linearRampToValueAtTime(position.z, currentTime + 0.1);

    source.position = position;

    // Update velocity for Doppler effect
    if (velocity) {
      source.velocity = velocity;
      this.updateDopplerEffect(source);
    }

    // Apply underwater distance effects
    if (this.isUnderwater) {
      this.applyUnderwaterDistanceEffects(source);
    }
  }

  /**
   * Update listener position and orientation
   */
  updateListener(
    position?: Vector3D,
    forward?: Vector3D,
    up?: Vector3D,
    velocity?: Vector3D
  ): void {
    if (position) this.listener.position = position;
    if (forward) this.listener.forward = forward;
    if (up) this.listener.up = up;
    if (velocity) this.listener.velocity = velocity;

    const currentTime = this.audioContext.currentTime;
    const listener = this.audioContext.listener;

    // Update position
    if (listener.positionX) {
      listener.positionX.linearRampToValueAtTime(
        this.listener.position.x, currentTime + 0.1
      );
      listener.positionY.linearRampToValueAtTime(
        this.listener.position.y, currentTime + 0.1
      );
      listener.positionZ.linearRampToValueAtTime(
        this.listener.position.z, currentTime + 0.1
      );
    }

    // Update orientation
    if (listener.forwardX) {
      listener.forwardX.linearRampToValueAtTime(
        this.listener.forward.x, currentTime + 0.1
      );
      listener.forwardY.linearRampToValueAtTime(
        this.listener.forward.y, currentTime + 0.1
      );
      listener.forwardZ.linearRampToValueAtTime(
        this.listener.forward.z, currentTime + 0.1
      );
    }

    if (listener.upX) {
      listener.upX.linearRampToValueAtTime(
        this.listener.up.x, currentTime + 0.1
      );
      listener.upY.linearRampToValueAtTime(
        this.listener.up.y, currentTime + 0.1
      );
      listener.upZ.linearRampToValueAtTime(
        this.listener.up.z, currentTime + 0.1
      );
    }

    // Check if listener moved underwater/surface
    this.checkUnderwaterTransition();
  }

  /**
   * Set environment type and apply corresponding acoustics
   */
  setEnvironment(environment: EnvironmentType): void {
    this.currentEnvironment = environment;
    this.applyEnvironmentSettings(environment);
    
    // Update all existing sources
    this.sources.forEach(source => {
      source.environmentType = environment;
      this.applyEnvironmentProcessing(source);
    });
  }

  /**
   * Enable/disable underwater acoustics with realistic parameters
   */
  setUnderwater(
    enabled: boolean,
    depth: number = 10,
    options: Partial<UnderwaterAcoustics> = {}
  ): void {
    this.isUnderwater = enabled;
    this.underwaterAcoustics = {
      ...this.underwaterAcoustics,
      enabled,
      depth,
      ...options
    };

    if (enabled) {
      this.calculateUnderwaterParameters();
      this.applyUnderwaterEffects();
    } else {
      this.removeUnderwaterEffects();
    }
  }

  /**
   * Create whale swimming around listener effect
   */
  animateWhaleSwimming(
    whaleSourceId: string,
    radius: number = 20,
    speed: number = 2,
    duration: number = 30
  ): void {
    const source = this.sources.get(whaleSourceId);
    if (!source) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= duration) return;

      const angle = (elapsed * speed) % (Math.PI * 2);
      const position: Vector3D = {
        x: Math.cos(angle) * radius,
        y: Math.sin(elapsed * 0.3) * 5, // Gentle vertical movement
        z: Math.sin(angle) * radius
      };

      const velocity: Vector3D = {
        x: -Math.sin(angle) * speed,
        y: Math.cos(elapsed * 0.3) * 1.5,
        z: Math.cos(angle) * speed
      };

      this.updateSourcePosition(whaleSourceId, position, velocity);
      
      requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Create realistic whale echolocation effect
   */
  createEcholocationEffect(
    whalePosition: Vector3D,
    targetPosition: Vector3D,
    echolocationSourceId: string
  ): void {
    const distance = this.calculateDistance(whalePosition, targetPosition);
    const travelTime = distance / 1500; // Underwater sound speed ~1500 m/s
    
    // Play echolocation click
    this.playSource(echolocationSourceId);
    
    // Schedule echo return
    setTimeout(() => {
      // Create echo source at target position
      const echoId = `echo-${Date.now()}`;
      this.createSource(
        echoId,
        '/assets/audio/sounds/whale-songs/echolocation-return.wav',
        targetPosition,
        { volume: 0.3, maxDistance: distance * 2 }
      ).then(() => {
        this.playSource(echoId);
        
        // Clean up echo after playing
        setTimeout(() => {
          this.removeSource(echoId);
        }, 2000);
      });
    }, travelTime * 1000);
  }

  private initializeEnvironmentPresets(): void {
    const presets: Record<EnvironmentType, EnvironmentSettings> = {
      underwater: {
        reverbType: 'underwater',
        dampening: 0.7,
        echoes: true,
        echoDelay: 0.8,
        echoDecay: 0.3,
        lowPassCutoff: 3000,
        highPassCutoff: 100,
        compressionRatio: 1.5,
        atmosphericDensity: 4.0
      },
      surface: {
        reverbType: 'none',
        dampening: 0.1,
        echoes: false,
        echoDelay: 0.2,
        echoDecay: 0.8,
        lowPassCutoff: 22050,
        highPassCutoff: 20,
        compressionRatio: 1.0,
        atmosphericDensity: 1.0
      },
      coastal: {
        reverbType: 'room',
        dampening: 0.3,
        echoes: true,
        echoDelay: 0.5,
        echoDecay: 0.6,
        lowPassCutoff: 18000,
        highPassCutoff: 30,
        compressionRatio: 1.1,
        atmosphericDensity: 1.2
      },
      whaling_station: {
        reverbType: 'hall',
        dampening: 0.4,
        echoes: true,
        echoDelay: 0.4,
        echoDecay: 0.7,
        lowPassCutoff: 16000,
        highPassCutoff: 40,
        compressionRatio: 1.2,
        atmosphericDensity: 1.1
      },
      open_ocean: {
        reverbType: 'cathedral',
        dampening: 0.2,
        echoes: true,
        echoDelay: 1.0,
        echoDecay: 0.9,
        lowPassCutoff: 20000,
        highPassCutoff: 25,
        compressionRatio: 1.0,
        atmosphericDensity: 1.0
      },
      cave: {
        reverbType: 'cave',
        dampening: 0.6,
        echoes: true,
        echoDelay: 0.6,
        echoDecay: 0.4,
        lowPassCutoff: 8000,
        highPassCutoff: 80,
        compressionRatio: 2.0,
        atmosphericDensity: 1.5
      },
      boat_interior: {
        reverbType: 'room',
        dampening: 0.5,
        echoes: false,
        echoDelay: 0.1,
        echoDecay: 0.5,
        lowPassCutoff: 12000,
        highPassCutoff: 60,
        compressionRatio: 1.3,
        atmosphericDensity: 1.0
      }
    };

    // Store presets for easy access
    (this as any).environmentPresets = presets;
  }

  private applyEnvironmentSettings(environment: EnvironmentType): void {
    const presets = (this as any).environmentPresets;
    this.environmentSettings = presets[environment] || presets.surface;
    
    // Apply reverb
    this.setupReverb(this.environmentSettings.reverbType);
    
    // Apply filtering and effects
    this.applyEnvironmentFiltering();
  }

  private applyEnvironmentProcessing(source: SpatialAudioSource): void {
    if (!source.pannerNode || !source.gainNode) return;

    // Adjust parameters based on environment
    const settings = this.environmentSettings;
    
    // Modify distance model for environment
    if (source.environmentType === 'underwater') {
      source.pannerNode.rolloffFactor = 0.5; // Sound travels farther underwater
      source.pannerNode.refDistance = 2;
    } else {
      source.pannerNode.rolloffFactor = source.rolloffFactor;
      source.pannerNode.refDistance = source.refDistance;
    }

    // Apply environment-specific gain adjustments
    const environmentGain = this.getEnvironmentGainMultiplier(source.environmentType);
    const currentTime = this.audioContext.currentTime;
    source.gainNode.gain.linearRampToValueAtTime(
      source.volume * environmentGain,
      currentTime + 0.1
    );
  }

  private connectToEnvironmentEffects(node: AudioNode): void {
    if (this.convolver) {
      // Connect through reverb/convolver
      node.connect(this.convolver);
      this.convolver.connect(this.masterGain);
    } else {
      // Direct connection
      node.connect(this.masterGain);
    }
  }

  private setupReverb(reverbType: string): void {
    // Remove existing convolver
    if (this.convolver) {
      this.convolver.disconnect();
    }

    if (reverbType === 'none') {
      this.convolver = null;
      return;
    }

    // Create new convolver
    this.convolver = this.audioContext.createConvolver();
    
    // Load appropriate impulse response
    this.loadImpulseResponse(reverbType).then(buffer => {
      if (this.convolver && buffer) {
        this.convolver.buffer = buffer;
      }
    });
  }

  private async loadImpulseResponse(reverbType: string): Promise<AudioBuffer | null> {
    try {
      const url = `/assets/audio/presets/reverb/${reverbType}-impulse.wav`;
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.warn(`Failed to load impulse response for ${reverbType}:`, error);
      return null;
    }
  }

  private applyEnvironmentFiltering(): void {
    // Implementation would apply low-pass and high-pass filters
    // based on environment settings
  }

  private calculateUnderwaterParameters(): void {
    const { depth, salinity, temperature } = this.underwaterAcoustics;
    
    // Calculate pressure based on depth
    this.underwaterAcoustics.pressure = 1.0 + (depth * 0.1); // Rough approximation
    
    // Sound speed calculation (simplified Chen-Millero equation)
    const soundSpeed = 1449.2 + 4.6 * temperature - 0.055 * Math.pow(temperature, 2) 
                     + 0.00029 * Math.pow(temperature, 3) + (1.34 - 0.01 * temperature) * (salinity - 35);
    
    // Store calculated sound speed for distance effects
    (this.underwaterAcoustics as any).soundSpeed = soundSpeed;
  }

  private applyUnderwaterEffects(): void {
    // Apply underwater acoustic effects to all sources
    this.sources.forEach(source => {
      this.applyUnderwaterDistanceEffects(source);
    });
  }

  private removeUnderwaterEffects(): void {
    // Remove underwater-specific effects
    this.sources.forEach(source => {
      if (source.pannerNode) {
        source.pannerNode.rolloffFactor = source.rolloffFactor;
        source.pannerNode.refDistance = source.refDistance;
      }
    });
  }

  private applyUnderwaterDistanceEffects(source: SpatialAudioSource): void {
    if (!this.isUnderwater || !source.pannerNode) return;

    const distance = this.calculateDistance(source.position, this.listener.position);
    const { depth, pressure } = this.underwaterAcoustics;
    
    // Underwater sound absorption (frequency-dependent)
    const absorptionFactor = Math.exp(-distance * depth * 0.0001);
    
    // Apply absorption as gain reduction
    if (source.gainNode) {
      const currentTime = this.audioContext.currentTime;
      const underwaterGain = source.volume * absorptionFactor * pressure * 0.1;
      source.gainNode.gain.linearRampToValueAtTime(underwaterGain, currentTime + 0.1);
    }
  }

  private updateDopplerEffect(source: SpatialAudioSource): void {
    if (!source.audioNode) return;

    // Calculate relative velocity
    const relativeVelocity = {
      x: source.velocity.x - this.listener.velocity.x,
      y: source.velocity.y - this.listener.velocity.y,
      z: source.velocity.z - this.listener.velocity.z
    };

    // Calculate Doppler shift
    const soundSpeed = this.isUnderwater 
      ? (this.underwaterAcoustics as any).soundSpeed || 1500
      : 343; // Air sound speed

    const velocityMagnitude = Math.sqrt(
      relativeVelocity.x ** 2 + relativeVelocity.y ** 2 + relativeVelocity.z ** 2
    );

    const dopplerFactor = soundSpeed / (soundSpeed + velocityMagnitude);
    
    // Apply Doppler effect as playback rate change
    if (Math.abs(dopplerFactor - 1) > 0.01) { // Only apply significant changes
      source.audioNode.playbackRate.linearRampToValueAtTime(
        dopplerFactor,
        this.audioContext.currentTime + 0.1
      );
    }
  }

  private checkUnderwaterTransition(): void {
    const wasUnderwater = this.isUnderwater;
    const isNowUnderwater = this.listener.position.y < 0; // Negative Y = underwater

    if (wasUnderwater !== isNowUnderwater) {
      this.setUnderwater(isNowUnderwater, Math.abs(this.listener.position.y));
    }
  }

  private recreateSourceNode(source: SpatialAudioSource): void {
    if (!source.audioBuffer || !source.pannerNode || !source.gainNode) return;

    // Create new source node
    const newSourceNode = this.audioContext.createBufferSource();
    newSourceNode.buffer = source.audioBuffer;
    newSourceNode.loop = source.loop;
    
    // Connect to existing chain
    newSourceNode.connect(source.gainNode);
    
    // Update reference
    source.audioNode = newSourceNode;
  }

  private calculateDistance(pos1: Vector3D, pos2: Vector3D): number {
    return Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) +
      Math.pow(pos1.y - pos2.y, 2) +
      Math.pow(pos1.z - pos2.z, 2)
    );
  }

  private getEnvironmentGainMultiplier(environment: EnvironmentType): number {
    const multipliers: Record<EnvironmentType, number> = {
      underwater: 0.3,
      surface: 1.0,
      coastal: 0.8,
      whaling_station: 0.9,
      open_ocean: 1.1,
      cave: 0.6,
      boat_interior: 0.7
    };
    return multipliers[environment] || 1.0;
  }

  /**
   * Remove a spatial audio source
   */
  removeSource(id: string): void {
    const source = this.sources.get(id);
    if (!source) return;

    if (source.isPlaying) {
      this.stopSource(id);
    }

    // Disconnect and cleanup nodes
    if (source.audioNode) source.audioNode.disconnect();
    if (source.gainNode) source.gainNode.disconnect();
    if (source.pannerNode) source.pannerNode.disconnect();

    this.sources.delete(id);
  }

  /**
   * Get current listener state
   */
  getListener(): AudioListener {
    return { ...this.listener };
  }

  /**
   * Get all active sources
   */
  getSources(): Map<string, SpatialAudioSource> {
    return new Map(this.sources);
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.masterGain.gain.linearRampToValueAtTime(
      Math.max(0, Math.min(1, volume)),
      this.audioContext.currentTime + 0.1
    );
  }
}

// Export singleton instance
export const spatialAudioEngine = new SpatialAudioEngine();