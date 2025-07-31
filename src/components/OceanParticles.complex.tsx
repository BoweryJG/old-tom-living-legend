// @ts-nocheck
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Marine particle system inspired by Studio Ghibli ocean scenes
const MarineParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 2000;

  // Generate random positions for marine particles
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Spread particles across ocean surface and depths
      positions[i * 3] = (Math.random() - 0.5) * 50; // x
      positions[i * 3 + 1] = Math.random() * 20 - 5; // y (mostly below surface)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
    }
    return positions;
  }, []);

  // Animate particles like floating marine debris and bubbles
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Gentle floating motion
        positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.002; // Slow vertical float
        positions[i3] += Math.cos(time * 0.5 + positions[i3 + 2]) * 0.001; // Slight horizontal drift
        positions[i3 + 2] += Math.sin(time * 0.3 + positions[i3]) * 0.001; // Ocean current drift
        
        // Reset particles that float too high (like bubbles reaching surface)
        if (positions[i3 + 1] > 15) {
          positions[i3 + 1] = -10;
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y = time * 0.05; // Very slow overall rotation
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#4FC3F7"
        size={0.05}
        sizeAttenuation={true}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Whale song visualization particles
const WhaleSongParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 500;

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Circular pattern for whale song emanations
      const radius = Math.random() * 15;
      const angle = (i / particleCount) * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const originalRadius = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
        
        // Pulsing emanation like whale song
        const pulseRadius = originalRadius + Math.sin(time * 2 + i * 0.1) * 2;
        const angle = Math.atan2(positions[i3 + 2], positions[i3]);
        
        positions[i3] = Math.cos(angle) * pulseRadius;
        positions[i3 + 2] = Math.sin(angle) * pulseRadius;
        positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.01;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#D4AF37"
        size={0.03}
        sizeAttenuation={true}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Ocean surface with gentle waves
const OceanSurface: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
      const position = geometry.attributes.position;
      
      // Create gentle wave motion
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const wave = Math.sin(x * 0.5 + time) * 0.5 + Math.cos(y * 0.3 + time * 0.7) * 0.3;
        position.setZ(i, wave);
      }
      
      position.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[100, 100, 50, 50]} />
      <meshStandardMaterial
        color="#1565C0"
        transparent
        opacity={0.3}
        wireframe={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Floating kelp strands
const FloatingKelp: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((child, index) => {
        child.rotation.z = Math.sin(time + index) * 0.2;
        child.position.y = Math.sin(time * 0.5 + index) * 2 - 8;
      });
    }
  });

  const kelpStrands = useMemo(() => {
    const strands = [];
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      const height = 5 + Math.random() * 5;
      strands.push({ x, z, height, key: i });
    }
    return strands;
  }, []);

  return (
    <group ref={groupRef}>
      {kelpStrands.map((strand) => (
        <mesh key={strand.key} position={[strand.x, -10, strand.z]}>
          <cylinderGeometry args={[0.05, 0.1, strand.height, 8]} />
          <meshStandardMaterial color="#2E7D32" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
};

// Main Ocean Particles component
interface OceanParticlesProps {
  intensity?: 'low' | 'medium' | 'high';
}

const OceanParticles: React.FC<OceanParticlesProps> = ({ intensity = 'medium' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Set canvas to be non-interactive
    if (canvasRef.current) {
      canvasRef.current.style.pointerEvents = 'none';
    }
  }, []);

  const renderComponents = () => {
    switch (intensity) {
      case 'low':
        return <MarineParticles />;
      case 'high':
        return (
          <>
            <MarineParticles />
            <WhaleSongParticles />
            <OceanSurface />
            <FloatingKelp />
          </>
        );
      default: // medium
        return (
          <>
            <MarineParticles />
            <WhaleSongParticles />
            <OceanSurface />
          </>
        );
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        ref={canvasRef}
        camera={{ 
          position: [0, 0, 15], 
          fov: 60,
          near: 0.1,
          far: 1000 
        }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance'
        }}
      >
        {/* Ambient lighting for gentle ocean atmosphere */}
        <ambientLight intensity={0.3} color="#4FC3F7" />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#FFF" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#1565C0" />
        
        {/* Ocean components */}
        {renderComponents()}
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#0a1a2e', 10, 50]} />
      </Canvas>
    </div>
  );
};

export default OceanParticles;