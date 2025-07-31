// @ts-nocheck
import React, { useEffect, useRef } from 'react';

interface AmbientSoundsProps {
  chapter: number;
  isPlaying: boolean;
}

const AmbientSounds: React.FC<AmbientSoundsProps> = ({ chapter, isPlaying }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!isPlaying || chapter === 0) {
      stopAmbientSound();
      return;
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    // Create white noise for ocean waves
    const bufferSize = audioContext.sampleRate * 10; // 10 seconds of noise
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = audioContext.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;
    
    // Create filters for different ocean moods
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    
    const gainNode = audioContext.createGain();
    gainNodeRef.current = gainNode;

    // Configure based on chapter
    switch (chapter) {
      case 1: // Mysterious
        filter.frequency.value = 400;
        gainNode.gain.value = 0.05;
        break;
      case 2: // Peaceful
        filter.frequency.value = 300;
        gainNode.gain.value = 0.03;
        break;
      case 3: // Adventurous
        filter.frequency.value = 600;
        gainNode.gain.value = 0.07;
        break;
      case 4: // Dramatic storm
        filter.frequency.value = 800;
        gainNode.gain.value = 0.1;
        // Add thunder effect
        createThunder(audioContext);
        break;
      case 5: // Nostalgic
        filter.frequency.value = 250;
        gainNode.gain.value = 0.02;
        break;
      case 6: // Museum quiet
        filter.frequency.value = 200;
        gainNode.gain.value = 0.01;
        break;
      default:
        filter.frequency.value = 350;
        gainNode.gain.value = 0.04;
    }

    // Connect nodes
    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start playing
    noiseNode.start();
    noiseNodeRef.current = noiseNode;

    // Add whale calls periodically
    if (chapter !== 6) {
      const whaleInterval = setInterval(() => {
        createWhaleCall(audioContext);
      }, 15000 + Math.random() * 10000);

      return () => {
        clearInterval(whaleInterval);
        stopAmbientSound();
      };
    }

    return () => {
      stopAmbientSound();
    };
  }, [chapter, isPlaying]);

  const stopAmbientSound = () => {
    if (noiseNodeRef.current) {
      noiseNodeRef.current.stop();
      noiseNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const createWhaleCall = (audioContext: AudioContext) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Whale call frequency sweep
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 1);
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 2.5);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 4);
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 3);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 4);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 4);
  };

  const createThunder = (audioContext: AudioContext) => {
    setTimeout(() => {
      const rumbleNode = audioContext.createBufferSource();
      const rumbleBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 3, audioContext.sampleRate);
      const rumbleData = rumbleBuffer.getChannelData(0);
      
      // Create rumbling thunder sound
      for (let i = 0; i < rumbleData.length; i++) {
        rumbleData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rumbleData.length, 2);
      }
      
      rumbleNode.buffer = rumbleBuffer;
      
      const rumbleFilter = audioContext.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.value = 100;
      
      const rumbleGain = audioContext.createGain();
      rumbleGain.gain.value = 0.3;
      
      rumbleNode.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(audioContext.destination);
      
      rumbleNode.start();
    }, Math.random() * 20000 + 10000); // Random thunder every 10-30 seconds
  };

  return null;
};

export default AmbientSounds;