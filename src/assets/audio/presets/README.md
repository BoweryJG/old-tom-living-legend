# Audio Presets and Configuration for Old Tom: The Living Legend

This directory contains pre-configured audio settings, spatial audio presets, and accessibility configurations to ensure optimal Studio Ghibli-quality audio experience across different devices and user needs.

## Directory Structure

### `/spatial/`
Contains spatial audio configuration presets for different environments and devices.

### `/mixing/`
Contains audio mixing presets for various emotional and story contexts.

### `/accessibility/`
Contains accessibility-focused audio configurations and alternative audio assets.

## Spatial Audio Presets

### Device-Specific Configurations

#### `mobile-spatial-config.json`
Optimized spatial audio settings for mobile devices with limited processing power:
- Reduced number of simultaneous spatial sources
- Simplified reverb processing
- Battery-optimized update rates
- Touch-optimized interaction responses

#### `desktop-spatial-config.json`
Full-featured spatial audio configuration for desktop/laptop devices:
- Maximum spatial audio quality
- Complex multi-layer environmental processing
- High-precision 3D positioning
- Advanced reverb and acoustic modeling

#### `tablet-spatial-config.json`
Balanced configuration for tablet devices:
- Moderate spatial complexity
- Optimized for both landscape and portrait orientations
- Balanced battery and performance considerations

### Environment Presets

#### `underwater-acoustics.json`
Realistic underwater sound propagation parameters:
```json
{
  "sound_speed": 1500,
  "absorption_coefficients": {
    "low_freq": 0.1,
    "mid_freq": 0.3,
    "high_freq": 0.7
  },
  "pressure_effects": {
    "depth_factor": 0.1,
    "compression_ratio": 1.5
  },
  "bubble_effects": {
    "density": 0.3,
    "size_variation": 0.8
  }
}
```

#### `surface-ocean.json`
Surface ocean environment with realistic wave acoustics:
```json
{
  "wave_reflection": 0.6,
  "wind_interference": 0.4,
  "atmospheric_absorption": 0.2,
  "distance_modeling": "inverse_square"
}
```

#### `coastal-environment.json`
Coastal environment with cliff reflections and vegetation:
```json
{
  "cliff_reflection": 0.8,
  "vegetation_absorption": 0.5,
  "beach_characteristics": {
    "sand_absorption": 0.7,
    "rock_reflection": 0.9
  }
}
```

## Mixing Presets

### Emotional Context Presets

#### `wonder-and-discovery.json`
Audio mixing configuration for wonder and discovery moments:
```json
{
  "orchestral_prominence": 0.8,
  "environmental_blend": 0.6,
  "whale_song_clarity": 0.9,
  "reverb_expansion": 1.2,
  "frequency_brightening": 0.3
}
```

#### `peaceful-contemplation.json`
Mixing for peaceful, contemplative scenes:
```json
{
  "overall_volume": 0.6,
  "high_frequency_rolloff": 0.4,
  "ambient_prominence": 0.8,
  "musical_subtlety": 0.5,
  "spatial_intimacy": 0.7
}
```

#### `exciting-adventure.json`
Dynamic mixing for adventure and excitement:
```json
{
  "dynamic_range_expansion": 1.5,
  "interaction_responsiveness": 0.9,
  "spatial_movement_intensity": 1.2,
  "musical_energy": 1.1,
  "effect_prominence": 0.8
}
```

### Story Context Presets

#### `first-encounter.json`
Audio configuration for Old Tom's first appearance:
```json
{
  "mystery_buildup": {
    "reverb_growth": 1.5,
    "frequency_filtering": "low_pass_sweep",
    "spatial_approach": "distant_to_close"
  },
  "revelation_moment": {
    "dynamic_expansion": 2.0,
    "harmonic_resolution": "major_revelation",
    "whale_call_prominence": 1.0
  }
}
```

#### `partnership-development.json`
Mixing for relationship building scenes:
```json
{
  "theme_interweaving": 0.8,
  "call_and_response": {
    "human_prominence": 0.7,
    "whale_prominence": 0.7,
    "interaction_delay": 0.3
  },
  "harmonic_convergence": 0.9
}
```

#### `sacrifice-and-legacy.json`
Emotional mixing for sacrifice and legacy themes:
```json
{
  "emotional_intensity": 1.0,
  "string_prominence": 0.9,
  "whale_song_integration": 0.8,
  "memorial_reverb": 1.8,
  "silence_usage": 0.6
}
```

## Accessibility Presets

### Hearing Accessibility

#### `hearing-impaired-enhanced.json`
Enhanced audio for users with hearing impairments:
```json
{
  "frequency_boost": {
    "low_boost": 6,
    "mid_boost": 3,
    "high_boost": 9
  },
  "compression_ratio": 3.0,
  "visual_indicator_sensitivity": 0.3,
  "haptic_intensity": 0.8,
  "caption_detail_level": "full"
}
```

#### `elderly-optimized.json`
Audio optimized for elderly users:
```json
{
  "high_frequency_boost": 12,
  "speech_clarity_enhancement": 1.5,
  "background_noise_reduction": 0.7,
  "slower_audio_transitions": 1.5,
  "larger_spatial_zones": 1.3
}
```

### Cognitive Accessibility

#### `simplified-audio.json`
Simplified audio experience for cognitive accessibility:
```json
{
  "reduced_simultaneous_sources": 0.5,
  "clearer_audio_separation": 1.4,
  "consistent_volume_levels": true,
  "reduced_spatial_complexity": 0.6,
  "extended_fade_times": 2.0
}
```

#### `attention-focused.json`
Configuration for users with attention difficulties:
```json
{
  "primary_audio_emphasis": 1.5,
  "background_minimization": 0.4,
  "clear_audio_cues": 1.2,
  "reduced_audio_variation": 0.7,
  "consistent_panning": true
}
```

## Performance Optimization Presets

### Low-End Device Configuration

#### `low-performance.json`
Optimized for older or low-performance devices:
```json
{
  "max_simultaneous_sources": 8,
  "simplified_reverb": true,
  "reduced_frequency_analysis": 0.5,
  "lower_sample_rate": 22050,
  "compressed_audio_assets": true,
  "minimal_spatial_processing": true
}
```

### Battery Optimization

#### `battery-saving.json`
Configuration to minimize battery usage:
```json
{
  "reduced_processing_frequency": 0.5,
  "simplified_spatial_calculations": true,
  "lower_quality_reverb": true,
  "reduced_real_time_analysis": 0.3,
  "background_pause_optimization": true
}
```

## Usage Guidelines

### Loading Presets

Presets are loaded dynamically based on:
1. **Device Detection**: Automatic detection of device capabilities
2. **User Preferences**: Saved accessibility and performance preferences
3. **Story Context**: Current narrative moment and emotional requirements
4. **Environmental Context**: Current scene location and atmosphere

### Preset Combination

Multiple presets can be combined using priority weighting:
- **Device Preset**: Base configuration (Priority 1)
- **Accessibility Preset**: User-specific modifications (Priority 2)
- **Story Context Preset**: Narrative-driven adjustments (Priority 3)
- **Real-time Adaptations**: Dynamic modifications (Priority 4)

### Custom Preset Creation

Users and developers can create custom presets by:
1. Starting with a base preset template
2. Modifying specific parameters
3. Testing across target devices
4. Validating accessibility compliance
5. Performance testing with target user groups

## Implementation Notes

### Preset Loading Strategy
- Critical presets are preloaded during app initialization
- Story-specific presets are loaded just-in-time
- User preference presets are cached locally
- Fallback presets ensure graceful degradation

### Quality Assurance
- All presets tested across minimum system requirements
- Accessibility presets validated with user groups
- Performance presets benchmarked on target devices
- Audio quality maintained within acceptable Studio Ghibli standards

### Future Extensibility
- Preset system designed for easy addition of new configurations
- Modular architecture allows selective preset application
- API available for runtime preset modification
- Analytics integration for preset effectiveness measurement

This preset system ensures that every user, regardless of device capability or accessibility needs, can experience the magical Studio Ghibli audio world of Old Tom: The Living Legend.