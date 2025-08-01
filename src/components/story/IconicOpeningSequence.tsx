import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import './IconicOpeningSequence.css';

// Old Tom's Eye Component - The Hook
const OldTomsEye: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const eyeRef = useRef<THREE.Group>(null);
  const [eyeOpen, setEyeOpen] = useState(false);
  
  useEffect(() => {
    // Start opening the eye after 0.01 seconds
    const timer = setTimeout(() => {
      setEyeOpen(true);
      // Signal completion after eye opens
      setTimeout(onComplete, 3000);
    }, 10);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  useFrame((state) => {
    if (eyeRef.current && eyeOpen) {
      // Subtle movement to make the eye feel alive
      eyeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      eyeRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.01;
    }
  });

  return (
    <group ref={eyeRef}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Eye structure */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial
            color="#001a33"
            roughness={0.3}
            metalness={0.7}
            emissive="#003366"
            emissiveIntensity={eyeOpen ? 0.3 : 0}
          />
        </mesh>
        
        {/* Iris */}
        <mesh position={[0, 0, 1.8]} scale={[0.7, 0.7, 0.1]}>
          <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
          <meshStandardMaterial
            color="#0066cc"
            emissive="#0099ff"
            emissiveIntensity={eyeOpen ? 0.5 : 0}
          />
        </mesh>
        
        {/* Pupil with universe reflection */}
        <mesh position={[0, 0, 1.9]} scale={[0.3, 0.3, 0.1]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
          <meshStandardMaterial
            color="#000000"
            roughness={0}
            metalness={1}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Eyelid animation */}
        <mesh position={[0, eyeOpen ? 4 : 0, 0]}>
          <boxGeometry args={[5, 4, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </Float>
      
      {/* Bioluminescent particles */}
      {eyeOpen && (
        <BioluminescentParticles />
      )}
    </group>
  );
};

// Bioluminescent Particles
const BioluminescentParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particlesCount = 1000;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    
    colors[i * 3] = 0.2 + Math.random() * 0.3;
    colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
    colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
  }
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Main Opening Sequence Component
interface IconicOpeningSequenceProps {
  onComplete: () => void;
}

export const IconicOpeningSequence: React.FC<IconicOpeningSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'darkness' | 'eye' | 'pullback' | 'text' | 'fadeout' | 'complete'>('darkness');
  
  useEffect(() => {
    // Start with darkness, then immediately show the eye
    const timer = setTimeout(() => setPhase('eye'), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleEyeComplete = () => {
    setPhase('pullback');
    setTimeout(() => setPhase('text'), 2000);
    setTimeout(() => setPhase('fadeout'), 6000);
    setTimeout(() => {
      setPhase('complete');
      onComplete();
    }, 8000);
  };

  return (
    <AnimatePresence>
      {phase !== 'complete' && (
        <motion.div
          className="iconic-opening-sequence"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            
            {/* Background stars */}
            <Stars
              radius={100}
              depth={50}
              count={5000}
              factor={4}
              saturation={0}
              fade
              speed={1}
            />
            
            {/* The Eye Scene */}
            {(phase === 'eye' || phase === 'pullback') && (
              <group
                scale={phase === 'pullback' ? 0.3 : 1}
                position={[0, 0, phase === 'pullback' ? -10 : 0]}
              >
                <OldTomsEye onComplete={handleEyeComplete} />
              </group>
            )}
            
            {/* Environment for reflections */}
            <Environment preset="night" />
          </Canvas>
          
          {/* Text Overlays */}
          <AnimatePresence>
            {phase === 'text' && (
              <motion.div
                className="opening-text-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
              >
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1.5 }}
                  className="opening-title"
                >
                  Some friendships change the world forever...
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1.5 }}
                  className="opening-subtitle"
                >
                  This is the true story of Old Tom
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Fade to black overlay */}
          {phase === 'fadeout' && (
            <motion.div
              className="fade-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};