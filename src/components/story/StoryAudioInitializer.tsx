/**
 * Story Audio Initializer Component
 * Handles initial setup and loading of audio system
 */

import React, { useEffect, useState } from 'react';
import { audioStorageService } from '../../services/audioStorageService';
import { captainTomNarration } from '../../content/story/captainTomNarration';
import './StoryAudioInitializer.css';

interface StoryAudioInitializerProps {
  onReady: () => void;
  autoPreload?: boolean;
}

const StoryAudioInitializer: React.FC<StoryAudioInitializerProps> = ({ 
  onReady, 
  autoPreload = true 
}) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing audio system...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAudioSystem();
  }, []);

  const initializeAudioSystem = async () => {
    try {
      // Initialize storage service
      setStatus('Setting up audio storage...');
      await audioStorageService.initialize();
      setProgress(20);

      if (autoPreload) {
        // Check what's already cached
        setStatus('Checking cached audio...');
        const cachedAudio = await audioStorageService.getAllCachedAudio();
        const cachedCount = Object.keys(cachedAudio).length;
        setProgress(30);

        if (cachedCount < captainTomNarration.length) {
          setStatus(`Found ${cachedCount}/${captainTomNarration.length} audio files cached`);
          
          // Preload first chapter
          const firstChapterSegments = captainTomNarration
            .filter(s => s.chapter === 'introduction')
            .map(s => s.id);
          
          setStatus('Loading introduction audio...');
          await audioStorageService.preloadSegments(firstChapterSegments);
          setProgress(60);

          // Preload next few segments in background
          const nextSegments = captainTomNarration
            .slice(firstChapterSegments.length, firstChapterSegments.length + 3)
            .map(s => s.id);
          
          setStatus('Preparing story experience...');
          audioStorageService.preloadSegments(nextSegments); // Don't await
          setProgress(90);
        } else {
          setStatus('All audio ready!');
          setProgress(90);
        }
      }

      setProgress(100);
      setStatus('Ready to begin!');
      
      // Small delay for smooth transition
      setTimeout(() => {
        setIsInitializing(false);
        onReady();
      }, 500);

    } catch (err) {
      console.error('Audio initialization error:', err);
      setError('Failed to initialize audio. Please refresh and try again.');
      setIsInitializing(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsInitializing(true);
    setProgress(0);
    initializeAudioSystem();
  };

  if (!isInitializing && !error) {
    return null;
  }

  return (
    <div className="story-audio-initializer">
      <div className="initializer-content">
        <div className="ocean-wave-animation" />
        
        <h2>Preparing Captain George's Story...</h2>
        
        {error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button onClick={handleRetry} className="retry-button">
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="progress-container">
              <div 
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <p className="status-text">{status}</p>
            
            <div className="loading-animation">
              <div className="whale-silhouette">
                <svg viewBox="0 0 100 50" className="whale-svg">
                  <path d="M10,25 Q30,10 50,25 T90,25 L85,30 Q50,35 15,30 Z" 
                        fill="currentColor" />
                  <circle cx="35" cy="22" r="2" fill="white" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoryAudioInitializer;