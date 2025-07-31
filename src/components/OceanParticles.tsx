import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Optimized marine particle system
const MarineParticles: React.FC<{ count: number }> = ({ count }) => {
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

  // Simplified animation
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      pointsRef.current.rotation.y = time * 0.02;
      pointsRef.current.position.y = Math.sin(time * 0.5) * 0.5;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#4FC3F7"
        size={0.08}
        sizeAttenuation={true}
        opacity={0.4}
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
}

const OceanParticles: React.FC<OceanParticlesProps> = ({ intensity = 'medium' }) => {
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
        <MarineParticles count={counts.marine} />
        <WhaleSongParticles count={counts.whaleSong} />
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#0a1a2e', 10, 40]} />
      </Canvas>
    </div>
  );
};

export default OceanParticles;