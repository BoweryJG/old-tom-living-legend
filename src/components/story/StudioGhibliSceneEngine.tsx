import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Text, 
  Float, 
  Environment, 
  Stars, 
  Cloud,
  Sparkles,
  useTexture,
  shaderMaterial,
  Plane
} from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { NarrationSegment } from '../../content/story/captainTomNarration';

// Custom shader for water effects
const WaterShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0x0066cc),
    uOpacity: 0.8,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      float elevation = sin(pos.x * 2.0 + uTime) * 0.1;
      elevation += sin(pos.y * 3.0 + uTime * 0.8) * 0.05;
      
      pos.z += elevation;
      vElevation = elevation;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      float strength = vElevation * 2.0 + 0.5;
      vec3 color = mix(uColor, vec3(1.0), strength * 0.3);
      
      gl_FragColor = vec4(color, uOpacity);
    }
  `
);

extend({ WaterShaderMaterial });

// TypeScript declaration for the custom shader material
declare global {
  namespace JSX {
    interface IntrinsicElements {
      waterShaderMaterial: any;
    }
  }
}

// Scene Components for different story moments
interface SceneProps {
  segment: NarrationSegment;
  emotionalState: string;
}

// Underwater Cathedral Scene
const UnderwaterCathedralScene: React.FC<SceneProps> = ({ segment, emotionalState }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* God rays */}
      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[
          Math.sin(i * 0.5) * 10,
          10,
          Math.cos(i * 0.5) * 10
        ]}>
          <cylinderGeometry args={[0.5, 2, 30, 8]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      
      {/* Floating particles */}
      <Sparkles
        count={200}
        scale={20}
        size={2}
        speed={0.2}
        color="#00ccff"
        opacity={0.5}
      />
      
      {/* Underwater ambience */}
      <fog attach="fog" color="#002244" near={5} far={50} />
    </group>
  );
};

// Fish Arc Scene
const FishArcScene: React.FC<SceneProps> = ({ segment }) => {
  const fishRef = useRef<THREE.Mesh>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);
  
  useFrame(() => {
    if (fishRef.current && animationPhase < 50) {
      const t = animationPhase / 50;
      // Parabolic arc
      fishRef.current.position.x = -5 + t * 10;
      fishRef.current.position.y = 2 + 4 * t * (1 - t);
      fishRef.current.rotation.z = Math.atan2(4 * (1 - 2 * t), 10);
    }
  });
  
  return (
    <group>
      {/* The fish */}
      <mesh ref={fishRef} position={[-5, 2, 0]}>
        <coneGeometry args={[0.3, 1, 8]} />
        <meshStandardMaterial
          color="#silver"
          metalness={0.8}
          roughness={0.2}
          emissive="#ffffff"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Water droplets */}
      {animationPhase > 25 && animationPhase < 75 && [...Array(10)].map((_, i) => (
        <mesh
          key={i}
          position={[
            fishRef.current?.position.x || 0 + (Math.random() - 0.5),
            fishRef.current?.position.y || 0 + (Math.random() - 0.5),
            (Math.random() - 0.5) * 2
          ]}
        >
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#00ccff"
            transparent
            opacity={0.8}
            roughness={0}
            metalness={1}
          />
        </mesh>
      ))}
      
      {/* Time freeze effect */}
      {animationPhase === 50 && (
        <Sparkles
          count={100}
          scale={10}
          size={3}
          speed={0}
          color="#ffffff"
          opacity={1}
        />
      )}
    </group>
  );
};

// Captain George Ghost Scene
const CaptainGeorgeScene: React.FC<SceneProps> = ({ emotionalState }) => {
  const ghostRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ghostRef.current) {
      ghostRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });
  
  return (
    <group>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        <group ref={ghostRef}>
          {/* Ghost form made of particles */}
          <Sparkles
            count={50}
            scale={[2, 4, 2]}
            size={2}
            speed={0.5}
            color="#b3d9ff"
            opacity={0.6}
          />
          
          {/* Ethereal glow */}
          <mesh>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial
              color="#b3d9ff"
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

// Main Scene Engine Component
interface StudioGhibliSceneEngineProps {
  segment: NarrationSegment;
  emotionalState: string;
  onSceneReady?: () => void;
}

export const StudioGhibliSceneEngine: React.FC<StudioGhibliSceneEngineProps> = ({
  segment,
  emotionalState,
  onSceneReady
}) => {
  const [currentScene, setCurrentScene] = useState<React.ReactNode>(null);
  
  useEffect(() => {
    // Select appropriate scene based on segment
    let scene: React.ReactNode = null;
    
    if (segment.id.includes('young_tom') || segment.id.includes('underwater')) {
      scene = <UnderwaterCathedralScene segment={segment} emotionalState={emotionalState} />;
    } else if (segment.id.includes('the_moment') || segment.id.includes('fish')) {
      scene = <FishArcScene segment={segment} emotionalState={emotionalState} />;
    } else if (segment.id.includes('opening') || segment.id.includes('george')) {
      scene = <CaptainGeorgeScene segment={segment} emotionalState={emotionalState} />;
    } else {
      // Default ocean scene
      scene = <DefaultOceanScene segment={segment} emotionalState={emotionalState} />;
    }
    
    setCurrentScene(scene);
    onSceneReady?.();
  }, [segment, emotionalState, onSceneReady]);
  
  return (
    <div className="studio-ghibli-scene-engine">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.7} />
        
        {/* Dynamic environment based on emotional state */}
        <Environment
          preset={emotionalState === 'mysterious' ? 'night' : 'sunset'}
          background
          blur={0.5}
        />
        
        {/* Background stars */}
        <Stars
          radius={100}
          depth={50}
          count={emotionalState === 'wonder' ? 5000 : 2000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        {/* Render current scene */}
        {currentScene}
        
        {/* Ocean surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[100, 100, 128, 128]} />
          <waterShaderMaterial
            uTime={0}
            uColor={new THREE.Color(emotionalState === 'mysterious' ? 0x001a33 : 0x0066cc)}
            uOpacity={0.8}
          />
        </mesh>
      </Canvas>
    </div>
  );
};

// Default Ocean Scene
const DefaultOceanScene: React.FC<SceneProps> = ({ segment, emotionalState }) => {
  return (
    <group>
      <Sparkles
        count={100}
        scale={20}
        size={1}
        speed={0.5}
        color={emotionalState === 'heartwarming' ? '#ff9999' : '#00ccff'}
        opacity={0.4}
      />
    </group>
  );
};