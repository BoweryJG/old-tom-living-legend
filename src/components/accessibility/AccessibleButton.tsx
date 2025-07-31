// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import { Button, ButtonProps, Box, useTheme, alpha } from '@mui/material';
import { useAccessibility } from './AccessibilityProvider';

interface AccessibleButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDwellActivate?: () => void; // For users who can't click
  dwellTimeMs?: number;
  magicalEffect?: boolean;
  soundEffect?: string;
  hapticFeedback?: boolean;
  confirmationRequired?: boolean;
  loadingState?: boolean;
  errorState?: boolean;
  successState?: boolean;
  childFriendlyLabel?: string;
  educationalContext?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  onClick,
  onDwellActivate,
  dwellTimeMs,
  magicalEffect = false,
  soundEffect,
  hapticFeedback = false,
  confirmationRequired = false,
  loadingState = false,
  errorState = false,
  successState = false,
  childFriendlyLabel,
  educationalContext,
  children,
  disabled,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const theme = useTheme();
  const { settings, announceToScreenReader } = useAccessibility();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dwellProgress, setDwellProgress] = useState(0);
  const [isDwelling, setIsDwelling] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const dwellTimerRef = useRef<NodeJS.Timeout>();
  const progressTimerRef = useRef<NodeJS.Timeout>();

  const effectiveDwellTime = dwellTimeMs || settings.dwellTime;
  const isDisabled = disabled || loadingState;

  // Handle dwell activation for motor accessibility
  useEffect(() => {
    if (!settings.largeTargets && !onDwellActivate) return;

    const button = buttonRef.current;
    if (!button) return;

    const startDwell = () => {
      if (isDisabled || isConfirming) return;
      
      setIsDwelling(true);
      setDwellProgress(0);
      
      // Start progress animation
      const startTime = Date.now();
      progressTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / effectiveDwellTime, 1);
        setDwellProgress(progress);
      }, 16);
      
      // Set activation timer
      dwellTimerRef.current = setTimeout(() => {
        setIsDwelling(false);
        setDwellProgress(0);
        if (onDwellActivate) {
          onDwellActivate();
        } else if (onClick) {
          onClick({} as React.MouseEvent<HTMLButtonElement>);
        }
        playFeedback();
        announceToScreenReader(`${ariaLabel || childFriendlyLabel || 'Button'} activated by dwell`);
      }, effectiveDwellTime);
    };

    const stopDwell = () => {
      setIsDwelling(false);
      setDwellProgress(0);
      if (dwellTimerRef.current) {
        clearTimeout(dwellTimerRef.current);
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };

    const handleMouseEnter = () => {
      if (settings.largeTargets || onDwellActivate) {
        startDwell();
      }
    };

    const handleMouseLeave = stopDwell;
    const handleFocus = () => {
      setFocusVisible(true);
      if (settings.pauseOnFocus) {
        announceToScreenReader(`Focused on ${ariaLabel || childFriendlyLabel || 'button'}. ${educationalContext || ''}`);
      }
    };
    const handleBlur = () => {
      setFocusVisible(false);
      stopDwell();
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('focus', handleFocus);
    button.addEventListener('blur', handleBlur);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('focus', handleFocus);
      button.removeEventListener('blur', handleBlur);
      stopDwell();
    };
  }, [settings, onDwellActivate, onClick, effectiveDwellTime, isDisabled, isConfirming, ariaLabel, childFriendlyLabel, educationalContext, announceToScreenReader]);

  const playFeedback = () => {
    // Play sound effect
    if (soundEffect && settings.soundEffectsEnabled) {
      const audio = new Audio(soundEffect);
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore if audio can't play
    }

    // Haptic feedback
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;

    // Confirmation flow for destructive actions
    if (confirmationRequired && !isConfirming) {
      setIsConfirming(true);
      announceToScreenReader('Press again to confirm this action');
      
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => {
        setIsConfirming(false);
      }, 3000);
      
      return;
    }

    setIsConfirming(false);
    playFeedback();
    
    if (onClick) {
      onClick(event);
    }

    // Announce action completion
    if (settings.screenReaderOptimized) {
      const actionName = ariaLabel || childFriendlyLabel || 'Action';
      announceToScreenReader(`${actionName} completed`);
    }
  };

  // Handle keyboard navigation with enhanced accessibility
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event as any);
    }
    
    if (event.key === 'Escape' && isConfirming) {
      setIsConfirming(false);
      announceToScreenReader('Action cancelled');
    }
  };

  // Get button state styling
  const getButtonState = () => {
    if (errorState) return { color: theme.palette.error.main, icon: '❌' };
    if (successState) return { color: theme.palette.success.main, icon: '✅' };
    if (loadingState) return { color: theme.palette.info.main, icon: '⏳' };
    if (isConfirming) return { color: theme.palette.warning.main, icon: '❓' };
    return { color: theme.palette.primary.main, icon: null };
  };

  const buttonState = getButtonState();

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Button
        ref={buttonRef}
        {...props}
        disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || childFriendlyLabel}
        aria-describedby={ariaDescribedBy}
        aria-pressed={isConfirming ? 'true' : undefined}
        aria-busy={loadingState}
        role="button"
        sx={{
          minHeight: settings.largeTargets ? 48 : 44,
          minWidth: settings.largeTargets ? 48 : 44,
          fontSize: settings.largeText ? '1.2rem' : '1rem',
          position: 'relative',
          overflow: 'hidden',
          transition: settings.reduceMotion ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: settings.highContrast ? '2px solid currentColor' : undefined,
          
          // Enhanced focus styles
          '&:focus-visible': {
            outline: `3px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
            boxShadow: `0 0 0 6px ${alpha(theme.palette.primary.main, 0.2)}`
          },
          
          // State-specific styling
          backgroundColor: buttonState.color,
          color: theme.palette.getContrastText(buttonState.color),
          
          // Magical hover effect (if enabled and not reduced motion)
          ...(!settings.reduceMotion && magicalEffect && {
            '&:hover': {
              transform: 'translateY(-2px) scale(1.02)',
              boxShadow: `0 8px 25px ${alpha(buttonState.color, 0.3)}`,
              filter: 'brightness(1.1)'
            }
          }),
          
          // High contrast mode adjustments
          ...(settings.highContrast && {
            backgroundColor: 'transparent',
            color: theme.palette.text.primary,
            border: `3px solid ${theme.palette.text.primary}`,
            '&:hover': {
              backgroundColor: theme.palette.text.primary,
              color: theme.palette.background.default
            }
          }),
          
          ...props.sx
        }}
      >
        {/* State icon */}
        {buttonState.icon && (
          <Box component="span" sx={{ mr: children ? 1 : 0 }}>
            {buttonState.icon}
          </Box>
        )}
        
        {/* Button content */}
        {children || childFriendlyLabel}
        
        {/* Dwell progress indicator */}
        {isDwelling && !settings.reduceMotion && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              backgroundColor: alpha(theme.palette.secondary.main, 0.8),
              width: `${dwellProgress * 100}%`,
              transition: 'width 0.1s linear',
              borderRadius: '0 0 4px 4px'
            }}
            aria-hidden="true"
          />
        )}
        
        {/* Magical sparkle effect */}
        {magicalEffect && !settings.reduceMotion && focusVisible && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.2)} 0%, transparent 70%)`,
              borderRadius: 'inherit',
              animation: 'sparkle 2s infinite',
              '@keyframes sparkle': {
                '0%, 100%': { opacity: 0 },
                '50%': { opacity: 1 }
              }
            }}
            aria-hidden="true"
          />
        )}
      </Button>
      
      {/* Confirmation overlay */}
      {isConfirming && (
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText,
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '100%',
              left: '50%',
              marginLeft: '-5px',
              borderWidth: '5px',
              borderStyle: 'solid',
              borderColor: `${theme.palette.warning.main} transparent transparent transparent`
            }
          }}
          role="tooltip"
          aria-live="polite"
        >
          Press again to confirm
        </Box>
      )}
      
      {/* Educational context tooltip */}
      {educationalContext && settings.verboseDescriptions && focusVisible && (
        <Box
          sx={{
            position: 'absolute',
            bottom: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            color: theme.palette.text.primary,
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            maxWidth: '200px',
            textAlign: 'center',
            boxShadow: theme.shadows[4],
            zIndex: 1000,
            border: settings.highContrast ? '1px solid currentColor' : undefined
          }}
          role="tooltip"
          aria-live="polite"
        >
          {educationalContext}
        </Box>
      )}
    </Box>
  );
};

export default AccessibleButton;