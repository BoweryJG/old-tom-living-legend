import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { theme as baseTheme } from '@/styles/theme';

interface AccessibilitySettings {
  // Visual Accessibility
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  focusVisible: boolean;
  colorBlindnessMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  
  // Motor Accessibility
  largeTargets: boolean;
  reduceGestures: boolean;
  stickyKeys: boolean;
  dwellTime: number; // in milliseconds
  
  // Cognitive Accessibility
  simplifiedLanguage: boolean;
  readingSpeed: 'slow' | 'normal' | 'fast';
  memoryAids: boolean;
  pauseOnFocus: boolean;
  
  // Audio Accessibility
  audioDescriptions: boolean;
  captionsEnabled: boolean;
  soundEffectsEnabled: boolean;
  backgroundMusicVolume: number;
  voiceSpeed: number;
  
  // Screen Reader
  screenReaderOptimized: boolean;
  verboseDescriptions: boolean;
  announcementFrequency: 'minimal' | 'normal' | 'frequent';
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  registerFocusTrap: (element: HTMLElement) => () => void;
  skipToMainContent: () => void;
  emergencyStop: () => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reduceMotion: false,
  focusVisible: true,
  colorBlindnessMode: 'none',
  largeTargets: false,
  reduceGestures: false,
  stickyKeys: false,
  dwellTime: 1000,
  simplifiedLanguage: false,
  readingSpeed: 'normal',
  memoryAids: true,
  pauseOnFocus: false,
  audioDescriptions: false,
  captionsEnabled: false,
  soundEffectsEnabled: true,
  backgroundMusicVolume: 0.5,
  voiceSpeed: 1.0,
  screenReaderOptimized: false,
  verboseDescriptions: false,
  announcementFrequency: 'normal'
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [focusTraps, setFocusTraps] = useState<Set<HTMLElement>>(new Set());

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('oldtom-accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse accessibility settings:', error);
      }
    }

    // Detect user preferences
    detectUserPreferences();
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('oldtom-accessibility-settings', JSON.stringify(settings));
    applyGlobalAccessibilitySettings();
  }, [settings]);

  const detectUserPreferences = useCallback(() => {
    // Detect system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    const prefersLargeText = window.matchMedia('(min-resolution: 144dpi)').matches;

    if (prefersReducedMotion || prefersHighContrast || prefersLargeText) {
      setSettings(prev => ({
        ...prev,
        reduceMotion: prefersReducedMotion,
        highContrast: prefersHighContrast,
        largeText: prefersLargeText
      }));
    }

    // Detect screen reader
    const isScreenReader = window.navigator.userAgent.includes('NVDA') || 
                          window.navigator.userAgent.includes('JAWS') ||
                          window.speechSynthesis?.getVoices().length > 0;
    
    if (isScreenReader) {
      setSettings(prev => ({
        ...prev,
        screenReaderOptimized: true,
        verboseDescriptions: true,
        audioDescriptions: true
      }));
    }
  }, []);

  const applyGlobalAccessibilitySettings = useCallback(() => {
    const root = document.documentElement;
    
    // Apply CSS custom properties for accessibility
    root.style.setProperty('--font-size-scale', settings.largeText ? '1.2' : '1');
    root.style.setProperty('--motion-scale', settings.reduceMotion ? '0' : '1');
    root.style.setProperty('--target-size-min', settings.largeTargets ? '48px' : '44px');
    
    // Apply high contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply color blindness filters
    const filters = {
      'protanopia': 'url(#protanopia-filter)',
      'deuteranopia': 'url(#deuteranopia-filter)',
      'tritanopia': 'url(#tritanopia-filter)',
      'none': 'none'
    };
    root.style.filter = filters[settings.colorBlindnessMode];
    
    // Configure focus visibility
    if (settings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.screenReaderOptimized) return;
    
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [settings.screenReaderOptimized]);

  const registerFocusTrap = useCallback((element: HTMLElement) => {
    setFocusTraps(prev => new Set([...prev, element]));
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusableElements = element.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
      
      if (e.key === 'Escape') {
        emergencyStop();
      }
    };
    
    element.addEventListener('keydown', handleKeyDown);
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      setFocusTraps(prev => {
        const newSet = new Set(prev);
        newSet.delete(element);
        return newSet;
      });
    };
  }, []);

  const skipToMainContent = useCallback(() => {
    const mainContent = document.querySelector('main') || document.querySelector('[role="main"]') || document.querySelector('#main-content');
    if (mainContent) {
      (mainContent as HTMLElement).focus();
      announceToScreenReader('Skipped to main content');
    }
  }, [announceToScreenReader]);

  const emergencyStop = useCallback(() => {
    // Stop all animations and audio
    document.querySelectorAll('*').forEach(el => {
      (el as HTMLElement).style.animationPlayState = 'paused';
    });
    
    // Stop all audio
    document.querySelectorAll('audio, video').forEach(media => {
      (media as HTMLMediaElement).pause();
    });
    
    announceToScreenReader('All animations and audio stopped', 'assertive');
  }, [announceToScreenReader]);

  // Create accessible theme
  const accessibleTheme = createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      mode: settings.highContrast ? 'dark' : 'light',
      // Override colors for high contrast
      ...(settings.highContrast && {
        primary: {
          main: '#ffffff',
          contrastText: '#000000'
        },
        background: {
          default: '#000000',
          paper: '#000000'
        },
        text: {
          primary: '#ffffff',
          secondary: '#ffffff'
        }
      })
    },
    typography: {
      ...baseTheme.typography,
      fontSize: settings.largeText ? 16 : 14,
      // Increase font sizes for large text mode
      ...(settings.largeText && {
        h1: { fontSize: '4.2rem' },
        h2: { fontSize: '3.3rem' },
        h3: { fontSize: '2.7rem' },
        h4: { fontSize: '2.1rem' },
        h5: { fontSize: '1.8rem' },
        h6: { fontSize: '1.5rem' },
        body1: { fontSize: '1.35rem' },
        body2: { fontSize: '1.2rem' }
      })
    },
    components: {
      ...baseTheme.components,
      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: settings.largeTargets ? 48 : 44,
            minWidth: settings.largeTargets ? 48 : 44,
            fontSize: settings.largeText ? '1.2rem' : '1rem',
            transition: settings.reduceMotion ? 'none' : baseTheme.components?.MuiButton?.styleOverrides?.root?.transition,
            '&:focus-visible': {
              outline: '3px solid #005fcc',
              outlineOffset: '2px'
            }
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              minHeight: settings.largeTargets ? 48 : 44,
              fontSize: settings.largeText ? '1.2rem' : '1rem'
            }
          }
        }
      }
    }
  });

  const contextValue: AccessibilityContextType = {
    settings,
    updateSettings,
    announceToScreenReader,
    registerFocusTrap,
    skipToMainContent,
    emergencyStop
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      <ThemeProvider theme={accessibleTheme}>
        {/* Color blindness filters */}
        <svg style={{ display: 'none' }}>
          <defs>
            <filter id="protanopia-filter">
              <feColorMatrix values="0.567, 0.433, 0,     0, 0
                                   0.558, 0.442, 0,     0, 0
                                   0,     0.242, 0.758, 0, 0
                                   0,     0,     0,     1, 0"/>
            </filter>
            <filter id="deuteranopia-filter">
              <feColorMatrix values="0.625, 0.375, 0,   0, 0
                                   0.7,   0.3,   0,   0, 0
                                   0,     0.3,   0.7, 0, 0
                                   0,     0,     0,   1, 0"/>
            </filter>
            <filter id="tritanopia-filter">
              <feColorMatrix values="0.95, 0.05,  0,     0, 0
                                   0,    0.433, 0.567, 0, 0
                                   0,    0.475, 0.525, 0, 0
                                   0,    0,     0,     1, 0"/>
            </filter>
          </defs>
        </svg>
        
        {/* Skip to main content link */}
        <a
          href="#main-content"
          onClick={(e) => {
            e.preventDefault();
            skipToMainContent();
          }}
          style={{
            position: 'absolute',
            left: '-9999px',
            zIndex: 10000,
            background: '#000',
            color: '#fff',
            padding: '8px 16px',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
          onFocus={(e) => {
            e.target.style.left = '10px';
            e.target.style.top = '10px';
          }}
          onBlur={(e) => {
            e.target.style.left = '-9999px';
          }}
        >
          Skip to main content
        </a>
        
        {/* Emergency stop button - always accessible */}
        <button
          onClick={emergencyStop}
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 10001,
            background: '#d32f2f',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: settings.screenReaderOptimized ? 'block' : 'none'
          }}
          aria-label="Emergency stop - pause all animations and audio"
        >
          ⏹ Stop
        </button>
        
        {children}
      </ThemeProvider>
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;