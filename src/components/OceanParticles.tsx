import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Optimized marine particle system
const MarineParticles: React.FC<{ count: number; mood: string }> = ({ count, mood }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate positions once
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30; // x
      positions[i * 3 + 1] = Math.random() * 10 - 3; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30; // z
    }
    return positions;
  }, [count]);

  // Get color based on mood
  const particleColor = useMemo(() => {
    switch (mood) {
      case 'dramatic': return '#B0B0B0'; // Stormy grey
      case 'mysterious': return '#6A5ACD'; // Mysterious purple-blue
      case 'adventurous': return '#00CED1'; // Bright turquoise
      case 'nostalgic': return '#FFB347'; // Warm sunset orange
      default: return '#4FC3F7'; // Peaceful blue
    }
  }, [mood]);

  // Mood-based animation
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      
      if (mood === 'dramatic') {
        // Turbulent motion for storm
        pointsRef.current.rotation.y = time * 0.1;
        pointsRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
        pointsRef.current.position.y = Math.sin(time * 2) * 1;
      } else if (mood === 'adventurous') {
        // Dynamic motion for action
        pointsRef.current.rotation.y = time * 0.05;
        pointsRef.current.position.y = Math.sin(time * 1) * 0.8;
      } else {
        // Gentle motion for peaceful/nostalgic
        pointsRef.current.rotation.y = time * 0.02;
        pointsRef.current.position.y = Math.sin(time * 0.5) * 0.5;
      }
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color={particleColor}
        size={mood === 'dramatic' ? 0.12 : 0.08}
        sizeAttenuation={true}
        opacity={mood === 'mysterious' ? 0.3 : 0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Simplified whale song particles
const WhaleSongParticles: React.FC<{ count: number }> = ({ count }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 10;
      const angle = (i / count) * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      pointsRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
      pointsRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#D4AF37"
        size={0.05}
        sizeAttenuation={true}
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Main Ocean Particles component
interface OceanParticlesProps {
  intensity?: 'low' | 'medium' | 'high';
  mood?: 'peaceful' | 'mysterious' | 'adventurous' | 'nostalgic' | 'dramatic';
}

const OceanParticles: React.FC<OceanParticlesProps> = ({ intensity = 'medium', mood = 'peaceful' }) => {
  // Reduced particle counts for better performance
  const particleCounts = {
    low: { marine: 300, whaleSong: 100 },
    medium: { marine: 500, whaleSong: 200 },
    high: { marine: 800, whaleSong: 300 },
  };

  const counts = particleCounts[intensity];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 15], 
          fov: 60,
        }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: false, // Disable for better performance
          powerPreference: 'high-performance'
        }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
      >
        {/* Simplified lighting */}
        <ambientLight intensity={0.3} color="#4FC3F7" />
        <pointLight position={[10, 10, 10]} intensity={0.4} color="#FFF" />
        
        {/* Particles */}
        <MarineParticles count={counts.marine} mood={mood} />
        <WhaleSongParticles count={counts.whaleSong} />
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#0a1a2e', 10, 40]} />
      </Canvas>
    </div>
  );
};

export default OceanParticles;