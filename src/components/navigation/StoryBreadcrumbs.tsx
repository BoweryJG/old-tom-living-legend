// @ts-nocheck
import React from 'react';
import {
  Box,
  Breadcrumbs,
  Typography,
  Chip,
  useTheme,
  alpha,
  LinearProgress
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as CurrentIcon,
  Lock as LockedIcon
} from '@mui/icons-material';
import { useSpring, animated } from '@react-spring/web';
import { useAccessibility } from '../accessibility/AccessibilityProvider';

interface StoryStep {
  id: string;
  title: string;
  childFriendlyTitle: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'locked';
  estimatedMinutes?: number;
  isOptional?: boolean;
}

interface StoryBreadcrumbsProps {
  steps: StoryStep[];
  currentStepId: string;
  onStepClick?: (stepId: string) => void;
  showProgress?: boolean;
  showTimeEstimates?: boolean;
  compact?: boolean;
}

export const StoryBreadcrumbs: React.FC<StoryBreadcrumbsProps> = ({
  steps,
  currentStepId,
  onStepClick,
  showProgress = true,
  showTimeEstimates = false,
  compact = false
}) => {
  const theme = useTheme();
  const { settings, announceToScreenReader } = useAccessibility();

  const currentIndex = steps.findIndex(step => step.id === currentStepId);
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;

  // Progress animation
  const progressAnimation = useSpring({
    width: `${(completedSteps / totalSteps) * 100}%`,
    config: { tension: 300, friction: 30 }
  });

  const getStepIcon = (step: StoryStep, index: number) => {
    switch (step.status) {
      case 'completed':
        return <CompletedIcon sx={{ color: theme.palette.success.main }} />;
      case 'current':
        return <CurrentIcon sx={{ color: theme.palette.primary.main }} />;
      case 'locked':
        return <LockedIcon sx={{ color: theme.palette.text.disabled }} />;
      default:
        return (
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: `2px solid ${theme.palette.text.secondary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: theme.palette.text.secondary
            }}
          >
            {index + 1}
          </Box>
        );
    }
  };

  const getStepColor = (step: StoryStep) => {
    switch (step.status) {
      case 'completed':
        return theme.palette.success.main;
      case 'current':
        return theme.palette.primary.main;
      case 'locked':
        return theme.palette.text.disabled;
      default:
        return theme.palette.text.secondary;
    }
  };

  const handleStepClick = (step: StoryStep) => {
    if (step.status === 'locked' || !onStepClick) return;
    
    if (step.status === 'upcoming') {
      announceToScreenReader(`${step.childFriendlyTitle} is not available yet. Complete the current step first.`);
      return;
    }

    onStepClick(step.id);
    announceToScreenReader(`Navigating to ${step.childFriendlyTitle}`);
  };

  if (compact) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          borderRadius: 2,
          backdropFilter: 'blur(10px)'
        }}
        role="navigation"
        aria-label="Story progress"
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Step {currentIndex + 1} of {totalSteps}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(completedSteps / totalSteps) * 100}
          sx={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.primary.main, 0.2)
          }}
        />
        <Typography variant="body2" color="text.secondary">
          {Math.round((completedSteps / totalSteps) * 100)}%
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        borderRadius: 3,
        backdropFilter: 'blur(10px)',
        border: settings.highContrast ? '2px solid currentColor' : `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
      }}
      role="navigation"
      aria-label="Story navigation and progress"
    >
      {/* Progress Header */}
      {showProgress && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" component="h2">
              {settings.simplifiedLanguage ? 'Your Story Journey' : 'Story Progress'}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {completedSteps} of {totalSteps}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'relative' }}>
            <LinearProgress
              variant="determinate"
              value={(completedSteps / totalSteps) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4
                }
              }}
            />
            {!settings.reduceMotion && (
              <animated.div
                style={{
                  ...progressAnimation,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  borderRadius: 4,
                  animation: 'shimmer 2s infinite'
                }}
              />
            )}
          </Box>
        </Box>
      )}

      {/* Story Steps */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="Story steps"
        sx={{
          flexWrap: 'wrap',
          '& .MuiBreadcrumbs-ol': {
            flexWrap: 'wrap',
            gap: 1
          }
        }}
      >
        {steps.map((step, index) => {
          const isClickable = step.status !== 'locked' && step.status !== 'upcoming' && onStepClick;
          const stepColor = getStepColor(step);
          
          return (
            <Box
              key={step.id}
              onClick={() => handleStepClick(step)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                cursor: isClickable ? 'pointer' : 'default',
                padding: 1,
                borderRadius: 2,
                minWidth: 120,
                backgroundColor: step.status === 'current' 
                  ? alpha(theme.palette.primary.main, 0.1)
                  : 'transparent',
                border: step.status === 'current'
                  ? `2px solid ${theme.palette.primary.main}`
                  : '2px solid transparent',
                transition: settings.reduceMotion ? 'none' : 'all 0.2s ease',
                '&:hover': isClickable ? {
                  backgroundColor: alpha(stepColor, 0.1),
                  transform: settings.reduceMotion ? 'none' : 'translateY(-2px)'
                } : {},
                opacity: step.status === 'locked' ? 0.5 : 1
              }}
              role="button"
              tabIndex={isClickable ? 0 : -1}
              aria-label={`Step ${index + 1}: ${step.childFriendlyTitle}. Status: ${step.status}${step.description ? `. ${step.description}` : ''}`}
              aria-current={step.status === 'current' ? 'step' : undefined}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
                  e.preventDefault();
                  handleStepClick(step);
                }
              }}
            >
              {/* Step Icon */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getStepIcon(step, index)}
              </Box>

              {/* Step Title */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: step.status === 'current' ? 600 : 400,
                  color: stepColor,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  fontSize: settings.largeText ? '0.9rem' : '0.8rem'
                }}
              >
                {settings.simplifiedLanguage ? step.childFriendlyTitle : step.title}
              </Typography>

              {/* Optional Badge */}
              {step.isOptional && (
                <Chip
                  label="Optional"
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.6rem',
                    height: 18,
                    color: theme.palette.text.secondary,
                    borderColor: theme.palette.text.secondary
                  }}
                />
              )}

              {/* Time Estimate */}
              {showTimeEstimates && step.estimatedMinutes && (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.7rem'
                  }}
                >
                  ~{step.estimatedMinutes} min
                </Typography>
              )}

              {/* Step Description (for screen readers and verbose mode) */}
              {settings.verboseDescriptions && step.description && (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    mt: 0.5,
                    maxWidth: 100
                  }}
                >
                  {step.description}
                </Typography>
              )}
            </Box>
          );
        })}
      </Breadcrumbs>

      {/* Current Step Details */}
      {currentIndex >= 0 && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, color: theme.palette.primary.main }}>
            {settings.simplifiedLanguage ? 'What You\'re Doing Now' : 'Current Step'}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
            {settings.simplifiedLanguage 
              ? steps[currentIndex].childFriendlyTitle 
              : steps[currentIndex].title
            }
          </Typography>
          {steps[currentIndex].description && (
            <Typography variant="body2" color="text.secondary">
              {steps[currentIndex].description}
            </Typography>
          )}
          
          {/* Next Step Preview */}
          {currentIndex < steps.length - 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                {settings.simplifiedLanguage ? 'Coming Next:' : 'Next Step:'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {settings.simplifiedLanguage 
                  ? steps[currentIndex + 1].childFriendlyTitle 
                  : steps[currentIndex + 1].title
                }
              </Typography>
            </Box>
          )}
        </Box>
      )}

      <style>
        {!settings.reduceMotion && `
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </Box>
  );
};

export default StoryBreadcrumbs;