// @ts-nocheck
import React from 'react';
import { Box } from '@mui/material';

// Simplified Ocean Particles for production deployment
const OceanParticles: React.FC<{ intensity?: string }> = ({ intensity = 'medium' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 80%, rgba(46, 139, 87, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(15, 52, 96, 0.4) 0%, transparent 50%)
        `,
        animation: intensity === 'high' ? 'oceanWaves 8s ease-in-out infinite' : 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 1000 1000\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3CclipPath id=\'shape\'%3E%3Cpath fill=\'currentColor\' d=\'m0 0h1000v1000h-1000z\'/%3E%3C/clipPath%3E%3C/defs%3E%3Cg clip-path=\'url(%23shape)\'%3E%3Cpath fill=\'%234fc3f740\' d=\'M0 200h1000L0 400z\'/%3E%3Cpath fill=\'%234fc3f720\' d=\'M0 600h1000L0 800z\'/%3E%3C/g%3E%3C/svg%3E") repeat',
          opacity: 0.3,
          animation: 'float 10s ease-in-out infinite',
        }
      }}
    >
      <style>{`
        @keyframes oceanWaves {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-0.5deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(20px); }
        }
      `}</style>
    </Box>
  );
};

export default OceanParticles;