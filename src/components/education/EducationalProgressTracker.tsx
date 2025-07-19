import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Badge,
  useTheme,
  alpha,
  Grow,
  Zoom
} from '@mui/material';
import {
  School,
  EmojiEvents,
  Star,
  Water,
  History,
  Science,
  LocalLibrary,
  Psychology,
  Groups,
  Nature
} from '@mui/icons-material';
import { useSpring, animated, config } from '@react-spring/web';
import { useAccessibility } from '../accessibility/AccessibilityProvider';

interface LearningObjective {
  id: string;
  title: string;
  childFriendlyTitle: string;
  description: string;
  category: 'marine-biology' | 'history' | 'science' | 'literature' | 'social-studies' | 'geography';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number; // 0-100
  completed: boolean;
  discovered: boolean;
  mastery: number; // 0-100
}

interface Achievement {
  id: string;
  title: string;
  childFriendlyTitle: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  unlockedAt?: Date;
  category: string;
}

interface EducationalProgressTrackerProps {
  learningObjectives: LearningObjective[];
  achievements: Achievement[];
  currentActivity?: {
    type: string;
    learningGoals: string[];
  };
  onObjectiveComplete: (objectiveId: string) => void;
  onAchievementUnlock: (achievementId: string) => void;
  showCelebration?: boolean;
}

export const EducationalProgressTracker: React.FC<EducationalProgressTrackerProps> = ({
  learningObjectives,
  achievements,
  currentActivity,
  onObjectiveComplete,
  onAchievementUnlock,
  showCelebration = true
}) => {
  const theme = useTheme();
  const { settings, announceToScreenReader } = useAccessibility();
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [progressAnimations, setProgressAnimations] = useState<{[key: string]: number}>({});

  // Category icons and colors
  const categoryConfig = {
    'marine-biology': { icon: Water, color: theme.palette.ocean.main, label: 'Marine Life' },
    'history': { icon: History, color: theme.palette.sunset.main, label: 'History' },
    'science': { icon: Science, color: theme.palette.forest.main, label: 'Science' },
    'literature': { icon: LocalLibrary, color: theme.palette.secondary.main, label: 'Stories' },
    'social-studies': { icon: Groups, color: theme.palette.primary.main, label: 'People & Culture' },
    'geography': { icon: Nature, color: theme.palette.forest.light, label: 'Geography' }
  };

  // Achievement rarity colors
  const rarityColors = {
    common: theme.palette.grey[500],
    uncommon: theme.palette.info.main,
    rare: theme.palette.secondary.main,
    legendary: theme.palette.warning.main
  };

  // Calculate overall progress
  const overallProgress = learningObjectives.length > 0 
    ? learningObjectives.reduce((sum, obj) => sum + obj.progress, 0) / learningObjectives.length
    : 0;

  const completedObjectives = learningObjectives.filter(obj => obj.completed).length;
  const unlockedAchievements = achievements.filter(ach => ach.unlockedAt).length;

  // Handle objective completion with celebration
  const handleObjectiveCompletion = useCallback((objective: LearningObjective) => {
    if (!objective.completed) return;

    // Trigger celebration animation
    if (showCelebration && !settings.reduceMotion) {
      setCelebrationVisible(true);
      setTimeout(() => setCelebrationVisible(false), 3000);
    }

    // Announce to screen reader
    announceToScreenReader(
      `Congratulations! You've learned about ${settings.simplifiedLanguage ? objective.childFriendlyTitle : objective.title}`
    );

    onObjectiveComplete(objective.id);
  }, [showCelebration, settings.reduceMotion, settings.simplifiedLanguage, announceToScreenReader, onObjectiveComplete]);

  // Handle achievement unlock
  const handleAchievementUnlock = useCallback((achievement: Achievement) => {
    setRecentAchievement(achievement);
    
    if (showCelebration && !settings.reduceMotion) {
      setCelebrationVisible(true);
      setTimeout(() => {
        setCelebrationVisible(false);
        setRecentAchievement(null);
      }, 5000);
    }

    announceToScreenReader(
      `Achievement unlocked: ${settings.simplifiedLanguage ? achievement.childFriendlyTitle : achievement.title}!`
    );

    onAchievementUnlock(achievement.id);
  }, [showCelebration, settings.reduceMotion, settings.simplifiedLanguage, announceToScreenReader, onAchievementUnlock]);

  // Monitor for objective completions
  useEffect(() => {
    learningObjectives.forEach(objective => {
      if (objective.completed && objective.progress === 100) {
        handleObjectiveCompletion(objective);
      }
    });
  }, [learningObjectives, handleObjectiveCompletion]);

  // Monitor for new achievements
  useEffect(() => {
    const newAchievement = achievements.find(ach => 
      ach.unlockedAt && 
      new Date(ach.unlockedAt).getTime() > Date.now() - 5000 // Unlocked in last 5 seconds
    );
    
    if (newAchievement && newAchievement.id !== recentAchievement?.id) {
      handleAchievementUnlock(newAchievement);
    }
  }, [achievements, recentAchievement, handleAchievementUnlock]);

  // Animate progress changes
  useEffect(() => {
    learningObjectives.forEach(objective => {
      if (progressAnimations[objective.id] !== objective.progress) {
        setProgressAnimations(prev => ({
          ...prev,
          [objective.id]: objective.progress
        }));
      }
    });
  }, [learningObjectives, progressAnimations]);

  // Overall progress animation
  const overallProgressAnimation = useSpring({
    width: `${overallProgress}%`,
    config: config.gentle
  });

  // Celebration animation
  const celebrationAnimation = useSpring({
    opacity: celebrationVisible ? 1 : 0,
    transform: celebrationVisible ? 'scale(1)' : 'scale(0.8)',
    config: config.wobbly
  });

  return (
    <Box>
      {/* Overall Progress Summary */}
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: settings.highContrast ? '2px solid currentColor' : 'none'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School color="primary" />
              {settings.simplifiedLanguage ? 'What You\'ve Learned' : 'Learning Progress'}
            </Typography>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              {Math.round(overallProgress)}%
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ position: 'relative', height: 12, backgroundColor: alpha(theme.palette.primary.main, 0.2), borderRadius: 6 }}>
              <animated.div
                style={{
                  ...overallProgressAnimation,
                  height: '100%',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: 6,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {!settings.reduceMotion && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'shimmer 2s infinite'
                    }}
                  />
                )}
              </animated.div>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Chip
              icon={<EmojiEvents />}
              label={`${completedObjectives} Topics Mastered`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<Star />}
              label={`${unlockedAchievements} Achievements`}
              color="secondary"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Learning Objectives by Category */}
      {Object.entries(categoryConfig).map(([category, config]) => {
        const categoryObjectives = learningObjectives.filter(obj => obj.category === category);
        if (categoryObjectives.length === 0) return null;

        const IconComponent = config.icon;
        const categoryProgress = categoryObjectives.reduce((sum, obj) => sum + obj.progress, 0) / categoryObjectives.length;

        return (
          <Card key={category} sx={{ mb: 2, border: settings.highContrast ? '1px solid currentColor' : 'none' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <IconComponent sx={{ color: config.color }} />
                <Typography variant="h6">
                  {settings.simplifiedLanguage ? config.label : config.label}
                </Typography>
                <Chip
                  label={`${Math.round(categoryProgress)}%`}
                  size="small"
                  sx={{ backgroundColor: alpha(config.color, 0.2), color: config.color }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {categoryObjectives.map(objective => (
                  <LearningObjectiveItem
                    key={objective.id}
                    objective={objective}
                    categoryColor={config.color}
                    onComplete={() => handleObjectiveCompletion(objective)}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        );
      })}

      {/* Recent Achievements */}
      {unlockedAchievements > 0 && (
        <Card sx={{ border: settings.highContrast ? '1px solid currentColor' : 'none' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmojiEvents color="secondary" />
              {settings.simplifiedLanguage ? 'Your Achievements' : 'Unlocked Achievements'}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {achievements
                .filter(ach => ach.unlockedAt)
                .slice(-6) // Show last 6 achievements
                .map(achievement => (
                  <Chip
                    key={achievement.id}
                    icon={achievement.icon as React.ReactElement}
                    label={settings.simplifiedLanguage ? achievement.childFriendlyTitle : achievement.title}
                    sx={{
                      backgroundColor: alpha(rarityColors[achievement.rarity], 0.2),
                      color: rarityColors[achievement.rarity],
                      fontWeight: 500
                    }}
                  />
                ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Celebration Overlay */}
      {celebrationVisible && recentAchievement && !settings.reduceMotion && (
        <animated.div style={celebrationAnimation}>
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10000,
              textAlign: 'center',
              maxWidth: 400,
              width: '90%'
            }}
          >
            <Card
              sx={{
                background: `linear-gradient(135deg, ${rarityColors[recentAchievement.rarity]}, ${alpha(rarityColors[recentAchievement.rarity], 0.7)})`,
                color: theme.palette.getContrastText(rarityColors[recentAchievement.rarity]),
                p: 3,
                borderRadius: 3,
                boxShadow: theme.shadows[12]
              }}
            >
              <Typography variant="h4" sx={{ mb: 2 }}>
                🎉 Achievement Unlocked! 🎉
              </Typography>
              
              <Box sx={{ fontSize: '3rem', mb: 2 }}>
                {recentAchievement.icon}
              </Box>
              
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                {settings.simplifiedLanguage ? recentAchievement.childFriendlyTitle : recentAchievement.title}
              </Typography>
              
              <Typography variant="body1">
                {recentAchievement.description}
              </Typography>
              
              <Chip
                label={recentAchievement.rarity.toUpperCase()}
                sx={{
                  mt: 2,
                  backgroundColor: alpha(theme.palette.common.white, 0.3),
                  color: 'inherit',
                  fontWeight: 'bold'
                }}
              />
            </Card>
          </Box>
        </animated.div>
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

// Individual Learning Objective Component
interface LearningObjectiveItemProps {
  objective: LearningObjective;
  categoryColor: string;
  onComplete: () => void;
}

const LearningObjectiveItem: React.FC<LearningObjectiveItemProps> = ({
  objective,
  categoryColor,
  onComplete
}) => {
  const theme = useTheme();
  const { settings } = useAccessibility();
  const [isAnimating, setIsAnimating] = useState(false);

  const progressAnimation = useSpring({
    width: `${objective.progress}%`,
    config: config.gentle,
    onRest: () => {
      if (objective.progress === 100 && !objective.completed) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
          onComplete();
        }, 1000);
      }
    }
  });

  const completionAnimation = useSpring({
    transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isAnimating 
      ? `0 0 20px ${alpha(categoryColor, 0.5)}`
      : '0 2px 4px rgba(0,0,0,0.1)',
    config: config.wobbly
  });

  return (
    <animated.div style={completionAnimation}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: objective.completed 
            ? alpha(theme.palette.success.main, 0.1)
            : alpha(categoryColor, 0.05),
          border: objective.completed 
            ? `2px solid ${theme.palette.success.main}`
            : `1px solid ${alpha(categoryColor, 0.2)}`,
          transition: settings.reduceMotion ? 'none' : 'all 0.3s ease'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: objective.completed ? 600 : 400,
              textDecoration: objective.completed ? 'none' : 'none'
            }}
          >
            {settings.simplifiedLanguage ? objective.childFriendlyTitle : objective.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {objective.completed && (
              <Zoom in={objective.completed}>
                <Star sx={{ color: theme.palette.success.main }} />
              </Zoom>
            )}
            <Typography variant="body2" color="text.secondary">
              {objective.progress}%
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', height: 6, backgroundColor: alpha(categoryColor, 0.2), borderRadius: 3 }}>
          <animated.div
            style={{
              ...progressAnimation,
              height: '100%',
              backgroundColor: objective.completed ? theme.palette.success.main : categoryColor,
              borderRadius: 3
            }}
          />
        </Box>

        {settings.verboseDescriptions && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.875rem' }}>
            {objective.description}
          </Typography>
        )}
      </Box>
    </animated.div>
  );
};

export default EducationalProgressTracker;