import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

// Import all UX components
import { AccessibilityProvider } from '../accessibility/AccessibilityProvider';
import { ChildFriendlyNavigation } from '../navigation/ChildFriendlyNavigation';
import { StoryBreadcrumbs } from '../navigation/StoryBreadcrumbs';
import { EmotionalFeedbackSystem } from '../emotional/EmotionalFeedbackSystem';
import { OldTomComfortCharacter } from '../emotional/OldTomComfortCharacter';
import { EducationalProgressTracker } from '../education/EducationalProgressTracker';
import { CelebrationAnimations } from '../education/CelebrationAnimations';
import { ParentalControlDashboard } from '../parental/ParentalControlDashboard';
import { PrivacyTransparencyModal } from '../parental/PrivacyTransparencyModal';
import { MagicalGestureRecognizer } from '../interactions/MagicalGestureRecognizer';
import { OceanSurfaceInteraction } from '../interactions/OceanSurfaceInteraction';

interface UXOrchestratorProps {
  children: React.ReactNode;
  userProfile: {
    name: string;
    age: number;
    accessibilityNeeds: string[];
    learningPreferences: string[];
  };
  currentProgress: {
    totalSteps: number;
    completedSteps: number;
    currentChapter: string;
  };
}

export const UXOrchestrator: React.FC<UXOrchestratorProps> = ({
  children,
  userProfile,
  currentProgress
}) => {
  const location = useLocation();
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  const [showParentalControls, setShowParentalControls] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [currentCelebration, setCurrentCelebration] = useState<{
    type: 'achievement' | 'learning' | 'discovery' | 'mastery' | 'friendship';
    visible: boolean;
  } | null>(null);

  // Emotional state management
  const [emotionalState, setEmotionalState] = useState({
    comfort: 5,
    engagement: 4,
    confidence: 4,
    needsSupport: false,
    preferredPace: 'normal' as 'slow' | 'normal' | 'fast',
    triggerWords: [],
    lastUpdate: new Date()
  });

  // Current content analysis for emotional feedback
  const [currentContent, setCurrentContent] = useState({
    type: 'exploration' as 'story' | 'conversation' | 'learning' | 'exploration',
    emotionalTone: 'calm' as 'happy' | 'sad' | 'scary' | 'exciting' | 'calm',
    intensityLevel: 2,
    potentialTriggers: [] as string[]
  });

  // Learning objectives and achievements
  const [learningObjectives, setLearningObjectives] = useState([
    {
      id: 'marine-biology-basics',
      title: 'Marine Biology Fundamentals',
      childFriendlyTitle: 'Ocean Friends',
      description: 'Learn about sea creatures and their homes',
      category: 'marine-biology' as const,
      difficulty: 'beginner' as const,
      progress: 75,
      completed: false,
      discovered: true,
      mastery: 60
    },
    {
      id: 'old-tom-history',
      title: 'Old Tom\'s Historical Story',
      childFriendlyTitle: 'Old Tom\'s Adventures',
      description: 'Discover the true story of the legendary whale',
      category: 'history' as const,
      difficulty: 'beginner' as const,
      progress: 100,
      completed: true,
      discovered: true,
      mastery: 85
    }
  ]);

  const [achievements, setAchievements] = useState([
    {
      id: 'first-friend',
      title: 'First Friend',
      childFriendlyTitle: 'Old Tom\'s New Friend',
      description: 'Made your first connection with Old Tom',
      icon: '🐋',
      rarity: 'common' as const,
      unlockedAt: new Date(),
      category: 'friendship'
    }
  ]);

  // Parental controls
  const [parentalSettings, setParentalSettings] = useState({
    contentFiltering: {
      maxEmotionalIntensity: 3,
      allowScaryContent: false,
      allowSadContent: true,
      requireParentalApproval: ['historical-tragedy', 'complex-emotions']
    },
    timeManagement: {
      dailyTimeLimit: 60,
      sessionTimeLimit: 30,
      allowedHours: { start: '07:00', end: '19:00' },
      breakReminders: true,
      breakInterval: 20
    },
    privacy: {
      voiceRecordingEnabled: false,
      dataCollectionMinimal: true,
      shareProgressWithEducators: false,
      allowAnalytics: false,
      parentalEmailUpdates: true
    },
    learning: {
      adaptiveDifficulty: true,
      focusAreas: ['marine-biology', 'history'],
      progressReportFrequency: 'weekly' as const,
      celebrationLevel: 'normal' as const
    },
    safety: {
      emergencyContactEnabled: true,
      comfortCheckFrequency: 15,
      autoModerationEnabled: true,
      safeWordEnabled: true,
      safeWord: 'dolphin'
    }
  });

  // Usage statistics for parental dashboard
  const [usageStats] = useState({
    todayMinutes: 25,
    weekMinutes: 180,
    averageSessionLength: 22,
    favoriteActivities: ['Ocean Exploration', 'Old Tom Stories', 'Whale Songs'],
    learningProgress: {
      subjectsExplored: 3,
      conceptsMastered: 8,
      achievementsUnlocked: 2
    },
    emotionalWellbeing: {
      averageComfortLevel: 4.2,
      supportRequestsToday: 0,
      positiveInteractions: 15
    }
  });

  // Ocean interaction state
  const [oceanState, setOceanState] = useState({
    timeOfDay: 'morning' as 'dawn' | 'morning' | 'afternoon' | 'sunset' | 'night',
    weather: 'calm' as 'calm' | 'gentle' | 'stormy',
    oldTomVisible: false,
    oldTomPosition: { x: 0, y: 0 }
  });

  // Story breadcrumbs for current path
  const storySteps = [
    {
      id: 'introduction',
      title: 'Meet Old Tom',
      childFriendlyTitle: 'Say Hello',
      description: 'First meeting with the legendary whale',
      status: 'completed' as const,
      estimatedMinutes: 5
    },
    {
      id: 'ocean-exploration',
      title: 'Explore Twofold Bay',
      childFriendlyTitle: 'Swim Around',
      description: 'Discover Old Tom\'s home waters',
      status: 'current' as const,
      estimatedMinutes: 10
    },
    {
      id: 'first-story',
      title: 'Old Tom\'s First Adventure',
      childFriendlyTitle: 'Story Time',
      description: 'Learn about Old Tom\'s early days',
      status: 'upcoming' as const,
      estimatedMinutes: 15
    }
  ];

  // Update content context based on current page
  useEffect(() => {
    const path = location.pathname;
    let newContent = { ...currentContent };

    switch (path) {
      case '/story':
        newContent = {
          type: 'story',
          emotionalTone: 'exciting',
          intensityLevel: 3,
          potentialTriggers: []
        };
        break;
      case '/chat':
        newContent = {
          type: 'conversation',
          emotionalTone: 'calm',
          intensityLevel: 1,
          potentialTriggers: []
        };
        break;
      case '/ocean':
        newContent = {
          type: 'exploration',
          emotionalTone: 'calm',
          intensityLevel: 2,
          potentialTriggers: []
        };
        break;
      default:
        newContent = {
          type: 'exploration',
          emotionalTone: 'calm',
          intensityLevel: 1,
          potentialTriggers: []
        };
    }

    setCurrentContent(newContent);
  }, [location.pathname]);

  // Handle emotional state changes
  const handleEmotionalStateChange = (newState: typeof emotionalState) => {
    setEmotionalState(newState);
    
    // Trigger comfort character if needed
    if (newState.comfort <= 2 && !newState.needsSupport) {
      setEmotionalState(prev => ({ ...prev, needsSupport: true }));
    }
  };

  // Handle comfort actions
  const handleComfortAction = (action: 'pause' | 'skip' | 'support' | 'adjust') => {
    switch (action) {
      case 'pause':
        // Implement pause functionality
        console.log('Pausing for comfort break');
        break;
      case 'skip':
        // Skip current content
        console.log('Skipping challenging content');
        break;
      case 'support':
        // Show additional support options
        setEmotionalState(prev => ({ ...prev, needsSupport: true }));
        break;
      case 'adjust':
        // Reduce content intensity
        setCurrentContent(prev => ({ ...prev, intensityLevel: Math.max(1, prev.intensityLevel - 1) }));
        break;
    }
  };

  // Handle Old Tom emergence in ocean
  const handleOldTomEmergence = (location: { x: number; y: number }) => {
    setOceanState(prev => ({
      ...prev,
      oldTomVisible: true,
      oldTomPosition: location
    }));
  };

  // Handle learning objective completion
  const handleObjectiveComplete = (objectiveId: string) => {
    setLearningObjectives(prev =>
      prev.map(obj =>
        obj.id === objectiveId
          ? { ...obj, completed: true, progress: 100 }
          : obj
      )
    );
    
    // Trigger celebration
    setCurrentCelebration({
      type: 'learning',
      visible: true
    });
    
    setTimeout(() => {
      setCurrentCelebration(null);
    }, 4000);
  };

  // Handle achievement unlock
  const handleAchievementUnlock = (achievementId: string) => {
    // Achievement is already in the list, just trigger celebration
    setCurrentCelebration({
      type: 'achievement',
      visible: true
    });
    
    setTimeout(() => {
      setCurrentCelebration(null);
    }, 5000);
  };

  return (
    <AccessibilityProvider>
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {/* Main Navigation */}
        <ChildFriendlyNavigation
          currentProgress={currentProgress}
          onSettingsOpen={() => setShowAccessibilitySettings(true)}
          onHelpOpen={() => setShowParentalControls(true)}
        />

        {/* Story Progress Breadcrumbs (context-sensitive) */}
        {location.pathname === '/story' && (
          <Box sx={{ p: 2 }}>
            <StoryBreadcrumbs
              steps={storySteps}
              currentStepId="ocean-exploration"
              showProgress={true}
              showTimeEstimates={true}
            />
          </Box>
        )}

        {/* Main Content with Gesture Recognition */}
        <Box sx={{ position: 'relative' }}>
          {location.pathname === '/ocean' ? (
            <OceanSurfaceInteraction
              onOldTomEmergence={handleOldTomEmergence}
              onTimeChange={(time) => setOceanState(prev => ({ ...prev, timeOfDay: time }))}
              onWeatherChange={(weather) => setOceanState(prev => ({ ...prev, weather }))}
              currentTimeOfDay={oceanState.timeOfDay}
              currentWeather={oceanState.weather}
              oldTomVisible={oceanState.oldTomVisible}
            />
          ) : (
            <MagicalGestureRecognizer
              onGesture={(gesture) => {
                console.log('Magical gesture detected:', gesture);
                // Handle gestures based on current context
              }}
              enableMagicalFeedback={true}
            >
              {children}
            </MagicalGestureRecognizer>
          )}
        </Box>

        {/* Emotional Feedback System */}
        <EmotionalFeedbackSystem
          currentContent={currentContent}
          onStateChange={handleEmotionalStateChange}
          onComfortAction={handleComfortAction}
          showControls={true}
        />

        {/* Old Tom Comfort Character */}
        <OldTomComfortCharacter
          emotionalState={emotionalState}
          onComfortProvided={() => {
            setEmotionalState(prev => ({ 
              ...prev, 
              needsSupport: false,
              comfort: Math.min(5, prev.comfort + 1)
            }));
          }}
          visible={emotionalState.needsSupport}
        />

        {/* Educational Progress Tracker */}
        {(location.pathname === '/story' || location.pathname === '/') && (
          <Box sx={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000 }}>
            <EducationalProgressTracker
              learningObjectives={learningObjectives}
              achievements={achievements}
              currentActivity={currentContent}
              onObjectiveComplete={handleObjectiveComplete}
              onAchievementUnlock={handleAchievementUnlock}
              showCelebration={true}
            />
          </Box>
        )}

        {/* Celebration Animations */}
        {currentCelebration && (
          <CelebrationAnimations
            type={currentCelebration.type}
            visible={currentCelebration.visible}
            onComplete={() => setCurrentCelebration(null)}
            intensity={parentalSettings.learning.celebrationLevel === 'minimal' ? 'gentle' : 
                     parentalSettings.learning.celebrationLevel === 'enthusiastic' ? 'enthusiastic' : 'moderate'}
          />
        )}

        {/* Parental Control Dashboard */}
        {showParentalControls && (
          <ParentalControlDashboard
            currentSettings={parentalSettings}
            onSettingsChange={setParentalSettings}
            usageStats={usageStats}
            childName={userProfile.name}
          />
        )}

        {/* Privacy Transparency Modal */}
        <PrivacyTransparencyModal
          open={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
          onExportData={() => {
            console.log('Exporting user data...');
            // Implement data export
          }}
          onDeleteData={() => {
            console.log('Deleting user data...');
            // Implement data deletion with confirmation
          }}
        />

        {/* Hidden accessibility helpers */}
        <div
          id="main-content"
          style={{ position: 'absolute', top: -1, left: -1, width: 1, height: 1 }}
          tabIndex={-1}
          aria-label="Main content area"
        />
      </Box>
    </AccessibilityProvider>
  );
};

export default UXOrchestrator;