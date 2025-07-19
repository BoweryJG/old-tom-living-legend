import React, { createContext, useContext, useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { setAudioContext } from '@/store/slices/audioSlice';

interface AudioProviderProps {
  children: React.ReactNode;
}

const AudioContext = createContext<AudioContext | null>(null);

export const useAudioContext = () => {
  return useContext(AudioContext);
};

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize Web Audio API
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    dispatch(setAudioContext(audioCtx));

    return () => {
      audioCtx.close();
    };
  }, [dispatch]);

  return (
    <AudioContext.Provider value={null}>
      {children}
    </AudioContext.Provider>
  );
};