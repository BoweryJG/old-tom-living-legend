import React, { useMemo } from 'react';
import { Box, keyframes } from '@mui/material';

interface GhibliBackgroundProps {
  chapter: number;
  mood: 'peaceful' | 'mysterious' | 'adventurous' | 'nostalgic' | 'dramatic';
}

// Define Studio Ghibli style background images for each chapter
const chapterBackgrounds: Record<number, string> = {
  0: '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_75a07.webp', // Landing
  1: '/images/flux-ghibli/2025-07-21_FLUX_1-schnell-infer_Image_0bc26.webp', // First Light
  2: '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_92a3d.webp', // The Arrival
  3: '/images/flux-ghibli/2025-07-21_FLUX_1-schnell-infer_Image_9c8df.webp', // Recognition
  4: '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_8d9d2.webp', // The Proposal
  5: '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_c616d.webp', // The Law
  6: '/images/flux-ghibli/2025-07-21_FLUX_1-schnell-infer_Image_e4890.webp', // Brothers
  7: '/images/flux-ghibli/2025-07-21_FLUX_1-schnell-infer_Image_ef32a.webp', // Deep Trust
  8: '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_df7fb.webp', // Storm Rises
  9: '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_62411.webp', // Beneath
  10: '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_75a07.webp', // Carrying
  11: '/images/flux-ghibli/2025-07-21_FLUX_1-schnell-infer_Image_2744d.webp', // Worn Teeth
  12: '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_e00d0.webp', // Last Dance
  13: '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_c616d.webp', // Into Deep
  14: '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_62411.webp', // The Return
  15: '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_3b114.webp', // Museum
  16: '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_92a3d.webp', // Living Legend
};

// Subtle floating animation for dreamy effect
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0) scale(1.05); }
  50% { transform: translateY(-20px) scale(1.08); }
`;

// Ken Burns effect for cinematic feel
const kenBurnsAnimation = keyframes`
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.1) translate(-2%, -2%); }
`;

const GhibliBackgrounds: React.FC<GhibliBackgroundProps> = ({ chapter, mood }) => {
  const backgroundImage = chapterBackgrounds[chapter as keyof typeof chapterBackgrounds] || chapterBackgrounds[0];
  
  // Dynamic overlay based on mood
  const moodOverlay = useMemo(() => {
    switch (mood) {
      case 'peaceful':
        return 'linear-gradient(to bottom, rgba(135, 206, 235, 0.2), rgba(30, 144, 255, 0.3))';
      case 'mysterious':
        return 'linear-gradient(to bottom, rgba(75, 0, 130, 0.3), rgba(138, 43, 226, 0.2))';
      case 'adventurous':
        return 'linear-gradient(to bottom, rgba(255, 140, 0, 0.1), rgba(255, 69, 0, 0.2))';
      case 'nostalgic':
        return 'linear-gradient(to bottom, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.2))';
      case 'dramatic':
        return 'linear-gradient(to bottom, rgba(25, 25, 112, 0.4), rgba(0, 0, 0, 0.5))';
      default:
        return 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))';
    }
  }, [mood]);

  return (
    <>
      {/* Main background layer */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            right: '-10%',
            bottom: '-10%',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(0px)',
            animation: `${kenBurnsAnimation} 30s ease-in-out infinite alternate`,
            willChange: 'transform',
          }
        }}
      />

      {/* Mood overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: moodOverlay,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Animated particles overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3,
          pointerEvents: 'none',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                        radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)`,
            animation: `${floatAnimation} 20s ease-in-out infinite`,
          }
        }}
      />

      {/* Vignette effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 4,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />
    </>
  );
};

export default GhibliBackgrounds;