import React, { useEffect, useState } from 'react';
import { Box, keyframes } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Map generated images to appropriate chapters
const chapterImages = {
  1: null, // Could use a mysterious ocean image
  2: null, // Partnership image
  3: '/images/generated/2025-07-21_FLUX_1-schnell-infer_Image_2744d.webp', // The pirate could represent a whaler
  4: null, // Storm image
  5: null, // Sunset image  
  6: null, // Museum image
};

interface ChapterVisualsProps {
  chapter: number;
  mood: 'peaceful' | 'mysterious' | 'adventurous' | 'nostalgic' | 'dramatic';
}

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
`;

const swim = keyframes`
  0% { transform: translateX(-100vw) rotate(0deg); }
  100% { transform: translateX(100vw) rotate(-5deg); }
`;

const wave = keyframes`
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-10px) scaleY(1.1); }
`;

const storm = keyframes`
  0% { transform: rotate(-2deg) translateX(-5px); }
  25% { transform: rotate(2deg) translateX(5px); }
  50% { transform: rotate(-1deg) translateX(-3px); }
  75% { transform: rotate(1deg) translateX(3px); }
  100% { transform: rotate(0deg) translateX(0); }
`;

const ChapterVisuals: React.FC<ChapterVisualsProps> = ({ chapter, mood }) => {
  const [lightningFlash, setLightningFlash] = useState(false);

  // Lightning effect for storm chapter
  useEffect(() => {
    if (chapter === 4) {
      const interval = setInterval(() => {
        setLightningFlash(true);
        setTimeout(() => setLightningFlash(false), 200);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [chapter]);

  const renderChapterVisuals = () => {
    switch (chapter) {
      case 1: // The Legend Begins - Mysterious first meeting
        return (
          <>
            {/* Moonlit ocean */}
            <Box
              sx={{
                position: 'absolute',
                top: '10%',
                right: '15%',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #FFFACD 0%, #FFE4B5 50%, transparent 70%)',
                filter: 'blur(2px)',
                opacity: 0.8,
              }}
            />
            
            {/* Whaling station silhouette */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: '10%',
                width: '300px',
                height: '150px',
                background: 'linear-gradient(to top, #000000 0%, #1a1a1a 100%)',
                clipPath: 'polygon(0 100%, 10% 60%, 20% 40%, 30% 45%, 40% 30%, 50% 35%, 60% 25%, 70% 40%, 80% 35%, 90% 50%, 100% 100%)',
                opacity: 0.7,
              }}
            />

            {/* Old Tom approaching */}
            <motion.div
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
              style={{
                position: 'absolute',
                bottom: '20%',
                right: '20%',
                fontSize: '4rem',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
              }}
            >
              🐋
            </motion.div>

            {/* Mysterious fog */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40%',
                background: 'linear-gradient(to top, rgba(100, 100, 100, 0.3) 0%, transparent 100%)',
                animation: `${wave} 8s ease-in-out infinite`,
              }}
            />
          </>
        );

      case 2: // Law of the Tongue - Partnership established
        return (
          <>
            {/* Sunrise */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '30%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '100px',
                background: 'radial-gradient(ellipse, #FFA500 0%, #FF6347 50%, transparent 70%)',
                filter: 'blur(20px)',
                opacity: 0.6,
              }}
            />

            {/* Whaling boat */}
            <motion.div
              animate={{ x: [0, 30, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                bottom: '25%',
                left: '20%',
                fontSize: '2rem',
                transform: 'scaleX(-1)',
              }}
            >
              🛶
            </motion.div>

            {/* Pod of orcas */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  x: [-50, 50, -50],
                  y: [0, -20, 0]
                }}
                transition={{ 
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  bottom: `${15 + i * 10}%`,
                  right: `${30 + i * 15}%`,
                  fontSize: '2.5rem',
                  opacity: 0.8,
                }}
              >
                🐋
              </motion.div>
            ))}

            {/* Handshake symbol */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 1 }}
              style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '3rem',
                filter: 'drop-shadow(0 4px 8px rgba(255, 215, 0, 0.6))',
              }}
            >
              🤝
            </motion.div>
          </>
        );

      case 3: // The Hunt - Action and teamwork
        return (
          <>
            {/* Action waves */}
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  bottom: `${10 + i * 5}%`,
                  left: 0,
                  right: 0,
                  height: '60px',
                  background: `rgba(79, 195, 247, ${0.2 - i * 0.05})`,
                  borderRadius: '50% 50% 0 0',
                  animation: `${wave} ${2 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}

            {/* Old Tom leaping */}
            <motion.div
              animate={{
                y: [0, -100, 0],
                rotate: [0, 360, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeOut",
              }}
              style={{
                position: 'absolute',
                bottom: '30%',
                right: '25%',
                fontSize: '5rem',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
              }}
            >
              🐋
            </motion.div>

            {/* Water splash effects */}
            <motion.div
              animate={{
                scale: [0, 2, 0],
                opacity: [1, 0.5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              style={{
                position: 'absolute',
                bottom: '28%',
                right: '20%',
                fontSize: '4rem',
              }}
            >
              💦
            </motion.div>

            {/* Whaling boats following */}
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                animate={{ x: [-100, 300] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "linear",
                }}
                style={{
                  position: 'absolute',
                  bottom: `${20 + i * 10}%`,
                  left: 0,
                  fontSize: '2rem',
                  transform: 'scaleX(-1)',
                }}
              >
                🚣
              </motion.div>
            ))}
          </>
        );

      case 4: // The Storm - Dramatic rescue
        return (
          <>
            {/* Storm clouds */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '60%',
                background: 'linear-gradient(to bottom, #2C2C2C 0%, #4A4A4A 50%, transparent 100%)',
                opacity: 0.9,
                animation: `${storm} 0.5s ease-in-out infinite`,
              }}
            />

            {/* Lightning flash */}
            {lightningFlash && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(255, 255, 255, 0.7)',
                  zIndex: 100,
                }}
              />
            )}

            {/* Rain effect */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(255, 255, 255, 0.1) 2px,
                  rgba(255, 255, 255, 0.1) 3px
                )`,
                animation: `${wave} 0.3s linear infinite`,
              }}
            />

            {/* Capsized boat */}
            <motion.div
              animate={{ rotate: [170, 190, 170] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                position: 'absolute',
                bottom: '40%',
                left: '30%',
                fontSize: '2.5rem',
              }}
            >
              🛶
            </motion.div>

            {/* Old Tom saving Jackie */}
            <motion.div
              animate={{ 
                x: [0, 20, 0],
                y: [0, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: 'absolute',
                bottom: '35%',
                left: '35%',
                fontSize: '4rem',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))',
              }}
            >
              🐋
            </motion.div>

            {/* Person in water */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                position: 'absolute',
                bottom: '42%',
                left: '40%',
                fontSize: '1.5rem',
              }}
            >
              🏊
            </motion.div>
          </>
        );

      case 5: // Final Hunt - Nostalgic farewell
        return (
          <>
            {/* Sunset */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '300px',
                height: '150px',
                background: 'radial-gradient(ellipse, #FF6B6B 0%, #FFA500 30%, #FFD700 60%, transparent 80%)',
                filter: 'blur(30px)',
                opacity: 0.7,
              }}
            />

            {/* Old Tom with worn teeth, swimming slowly */}
            <motion.div
              animate={{ x: [0, 100, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                bottom: '30%',
                left: '20%',
                fontSize: '4rem',
                opacity: 0.7,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
              }}
            >
              🐋
            </motion.div>

            {/* Rope in mouth visual */}
            <motion.div
              animate={{ x: [0, 100, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                bottom: '32%',
                left: '25%',
                fontSize: '1.5rem',
                transform: 'rotate(-20deg)',
              }}
            >
              🪢
            </motion.div>

            {/* Fading into the deep */}
            <motion.div
              animate={{ 
                opacity: [1, 0],
                y: [0, 100],
              }}
              transition={{ 
                duration: 5,
                delay: 5,
                repeat: Infinity,
                repeatDelay: 5
              }}
              style={{
                position: 'absolute',
                bottom: '25%',
                right: '20%',
                fontSize: '3rem',
              }}
            >
              🐋
            </motion.div>
          </>
        );

      case 6: // Museum - Legacy preserved
        return (
          <>
            {/* Museum building */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '400px',
                height: '250px',
                background: 'linear-gradient(to top, #8B7355 0%, #A0826D 50%, #8B7355 100%)',
                clipPath: 'polygon(10% 100%, 10% 30%, 0 30%, 50% 0, 100% 30%, 90% 30%, 90% 100%)',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              }}
            />

            {/* Museum sign */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '35%',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '10px 20px',
                background: '#654321',
                color: '#FFFFFF',
                fontFamily: '"Cinzel", serif',
                fontSize: '1rem',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              EDEN KILLER WHALE MUSEUM
            </Box>

            {/* Skeleton display */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                position: 'absolute',
                bottom: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '3rem',
                filter: 'sepia(1) contrast(0.8)',
              }}
            >
              🦴
            </motion.div>

            {/* Visitors */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ x: [-50, 50, -50] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "linear",
                }}
                style={{
                  position: 'absolute',
                  bottom: '8%',
                  left: `${30 + i * 20}%`,
                  fontSize: '1.5rem',
                }}
              >
                {i % 2 === 0 ? '👨‍👩‍👧' : '👨‍👩‍👦'}
              </motion.div>
            ))}

            {/* Spirit of Old Tom */}
            <motion.div
              animate={{ 
                opacity: [0, 0.3, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
              }}
              style={{
                position: 'absolute',
                top: '20%',
                right: '20%',
                fontSize: '6rem',
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))',
              }}
            >
              🐋
            </motion.div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={chapter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        {renderChapterVisuals()}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChapterVisuals;