// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Alert,
  Tabs,
  Tab,
  useTheme,
  alpha,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Security,
  Schedule,
  ExpandMore,
  Visibility,
  VolumeUp,
  Psychology,
  Assessment,
  Settings,
  Info,
  Lock,
  Person,
  School,
  Shield
} from '@mui/icons-material';
import { useAccessibility } from '../accessibility/AccessibilityProvider';

interface ParentalSettings {
  contentFiltering: {
    maxEmotionalIntensity: number; // 1-5
    allowScaryContent: boolean;
    allowSadContent: boolean;
    requireParentalApproval: string[]; // content types requiring approval
  };
  timeManagement: {
    dailyTimeLimit: number; // minutes
    sessionTimeLimit: number; // minutes
    allowedHours: { start: string; end: string };
    breakReminders: boolean;
    breakInterval: number; // minutes
  };
  privacy: {
    voiceRecordingEnabled: boolean;
    dataCollectionMinimal: boolean;
    shareProgressWithEducators: boolean;
    allowAnalytics: boolean;
    parentalEmailUpdates: boolean;
  };
  learning: {
    adaptiveDifficulty: boolean;
    focusAreas: string[];
    progressReportFrequency: 'daily' | 'weekly' | 'monthly';
    celebrationLevel: 'minimal' | 'normal' | 'enthusiastic';
  };
  safety: {
    emergencyContactEnabled: boolean;
    comfortCheckFrequency: number; // minutes
    autoModerationEnabled: boolean;
    safeWordEnabled: boolean;
    safeWord?: string;
  };
}

interface UsageStats {
  todayMinutes: number;
  weekMinutes: number;
  averageSessionLength: number;
  favoriteActivities: string[];
  learningProgress: {
    subjectsExplored: number;
    conceptsMastered: number;
    achievementsUnlocked: number;
  };
  emotionalWellbeing: {
    averageComfortLevel: number;
    supportRequestsToday: number;
    positiveInteractions: number;
  };
}

interface ParentalControlDashboardProps {
  onSettingsChange: (settings: ParentalSettings) => void;
  currentSettings: ParentalSettings;
  usageStats: UsageStats;
  childName: string;
}

export const ParentalControlDashboard: React.FC<ParentalControlDashboardProps> = ({
  onSettingsChange,
  currentSettings,
  usageStats,
  childName
}) => {
  const theme = useTheme();
  const { settings: accessibilitySettings } = useAccessibility();
  const [activeTab, setActiveTab] = useState(0);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [localSettings, setLocalSettings] = useState(currentSettings);

  // Update local settings when props change
  useEffect(() => {
    setLocalSettings(currentSettings);
    setHasUnsavedChanges(false);
  }, [currentSettings]);

  const handleSettingChange = (category: keyof ParentalSettings, key: string, value: any) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category],
        [key]: value
      }
    };
    setLocalSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const saveSettings = () => {
    onSettingsChange(localSettings);
    setHasUnsavedChanges(false);
  };

  const resetToDefaults = () => {
    const defaultSettings: ParentalSettings = {
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
        progressReportFrequency: 'weekly',
        celebrationLevel: 'normal'
      },
      safety: {
        emergencyContactEnabled: true,
        comfortCheckFrequency: 15,
        autoModerationEnabled: true,
        safeWordEnabled: true,
        safeWord: 'dolphin'
      }
    };
    setLocalSettings(defaultSettings);
    setHasUnsavedChanges(true);
  };

  const TabPanel: React.FC<{ children: React.ReactNode; value: number; index: number }> = ({
    children,
    value,
    index
  }) => (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Shield color="primary" />
            Parental Controls - {childName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage safety, privacy, and learning settings for your child's Old Tom experience
          </Typography>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Today's Activity Summary</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary">{usageStats.todayMinutes}</Typography>
              <Typography variant="body2">Minutes Today</Typography>
              <LinearProgress
                variant="determinate"
                value={(usageStats.todayMinutes / localSettings.timeManagement.dailyTimeLimit) * 100}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main">{usageStats.learningProgress.conceptsMastered}</Typography>
              <Typography variant="body2">Concepts Learned</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="info.main">{usageStats.emotionalWellbeing.averageComfortLevel.toFixed(1)}</Typography>
              <Typography variant="body2">Comfort Level (1-5)</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Settings Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab icon={<Security />} label="Content & Safety" />
            <Tab icon={<Schedule />} label="Time Management" />
            <Tab icon={<Lock />} label="Privacy Controls" />
            <Tab icon={<School />} label="Learning Settings" />
            <Tab icon={<Assessment />} label="Reports & Analytics" />
          </Tabs>
        </Box>

        {/* Content & Safety Tab */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" sx={{ mb: 3 }}>Content Filtering & Safety</Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Emotional Content Limits</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  Maximum Emotional Intensity: {localSettings.contentFiltering.maxEmotionalIntensity}
                </Typography>
                <Slider
                  value={localSettings.contentFiltering.maxEmotionalIntensity}
                  onChange={(_, value) => handleSettingChange('contentFiltering', 'maxEmotionalIntensity', value)}
                  min={1}
                  max={5}
                  step={1}
                  marks={[
                    { value: 1, label: 'Very Gentle' },
                    { value: 3, label: 'Moderate' },
                    { value: 5, label: 'Full Range' }
                  ]}
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.contentFiltering.allowScaryContent}
                    onChange={(e) => handleSettingChange('contentFiltering', 'allowScaryContent', e.target.checked)}
                  />
                }
                label="Allow mildly scary content (storms, predators)"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.contentFiltering.allowSadContent}
                    onChange={(e) => handleSettingChange('contentFiltering', 'allowSadContent', e.target.checked)}
                  />
                }
                label="Allow sad story elements (whale separation, historical events)"
              />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Safety Features</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.safety.emergencyContactEnabled}
                    onChange={(e) => handleSettingChange('safety', 'emergencyContactEnabled', e.target.checked)}
                  />
                }
                label="Emergency contact button visible"
              />

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>
                  Comfort Check Frequency: Every {localSettings.safety.comfortCheckFrequency} minutes
                </Typography>
                <Slider
                  value={localSettings.safety.comfortCheckFrequency}
                  onChange={(_, value) => handleSettingChange('safety', 'comfortCheckFrequency', value)}
                  min={5}
                  max={60}
                  step={5}
                  marks={[
                    { value: 5, label: '5min' },
                    { value: 15, label: '15min' },
                    { value: 30, label: '30min' },
                    { value: 60, label: '1hr' }
                  ]}
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.safety.safeWordEnabled}
                    onChange={(e) => handleSettingChange('safety', 'safeWordEnabled', e.target.checked)}
                  />
                }
                label="Enable safe word for immediate comfort support"
              />
            </AccordionDetails>
          </Accordion>
        </TabPanel>

        {/* Time Management Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" sx={{ mb: 3 }}>Screen Time & Usage Controls</Typography>

          <Box sx={{ display: 'grid', gap: 3 }}>
            <Box>
              <Typography gutterBottom>
                Daily Time Limit: {localSettings.timeManagement.dailyTimeLimit} minutes
              </Typography>
              <Slider
                value={localSettings.timeManagement.dailyTimeLimit}
                onChange={(_, value) => handleSettingChange('timeManagement', 'dailyTimeLimit', value)}
                min={15}
                max={180}
                step={15}
                marks={[
                  { value: 30, label: '30min' },
                  { value: 60, label: '1hr' },
                  { value: 120, label: '2hr' },
                  { value: 180, label: '3hr' }
                ]}
              />
            </Box>

            <Box>
              <Typography gutterBottom>
                Session Time Limit: {localSettings.timeManagement.sessionTimeLimit} minutes
              </Typography>
              <Slider
                value={localSettings.timeManagement.sessionTimeLimit}
                onChange={(_, value) => handleSettingChange('timeManagement', 'sessionTimeLimit', value)}
                min={10}
                max={90}
                step={5}
                marks={[
                  { value: 15, label: '15min' },
                  { value: 30, label: '30min' },
                  { value: 60, label: '1hr' }
                ]}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl>
                <InputLabel>Allowed Start Time</InputLabel>
                <Select
                  value={localSettings.timeManagement.allowedHours.start}
                  onChange={(e) => handleSettingChange('timeManagement', 'allowedHours', {
                    ...localSettings.timeManagement.allowedHours,
                    start: e.target.value
                  })}
                  label="Allowed Start Time"
                >
                  {[...Array(24)].map((_, i) => (
                    <MenuItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {`${i.toString().padStart(2, '0')}:00`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Allowed End Time</InputLabel>
                <Select
                  value={localSettings.timeManagement.allowedHours.end}
                  onChange={(e) => handleSettingChange('timeManagement', 'allowedHours', {
                    ...localSettings.timeManagement.allowedHours,
                    end: e.target.value
                  })}
                  label="Allowed End Time"
                >
                  {[...Array(24)].map((_, i) => (
                    <MenuItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {`${i.toString().padStart(2, '0')}:00`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.timeManagement.breakReminders}
                  onChange={(e) => handleSettingChange('timeManagement', 'breakReminders', e.target.checked)}
                />
              }
              label="Send gentle break reminders"
            />
          </Box>
        </TabPanel>

        {/* Privacy Controls Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" sx={{ mb: 3 }}>Privacy & Data Protection</Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Old Tom is designed with privacy-first principles. We collect minimal data and prioritize your child's safety.
            </Typography>
          </Alert>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Data Collection Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.privacy.voiceRecordingEnabled}
                    onChange={(e) => handleSettingChange('privacy', 'voiceRecordingEnabled', e.target.checked)}
                  />
                }
                label="Enable voice interactions with Old Tom"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                Voice data is processed locally when possible and never stored permanently
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.privacy.dataCollectionMinimal}
                    onChange={(e) => handleSettingChange('privacy', 'dataCollectionMinimal', e.target.checked)}
                  />
                }
                label="Minimal data collection mode"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                Only collect essential data for app functionality and learning progress
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.privacy.allowAnalytics}
                    onChange={(e) => handleSettingChange('privacy', 'allowAnalytics', e.target.checked)}
                  />
                }
                label="Anonymous usage analytics"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                Help improve Old Tom with anonymous, aggregated usage data
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Sharing & Communication</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.privacy.shareProgressWithEducators}
                    onChange={(e) => handleSettingChange('privacy', 'shareProgressWithEducators', e.target.checked)}
                  />
                }
                label="Share learning progress with teachers"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.privacy.parentalEmailUpdates}
                    onChange={(e) => handleSettingChange('privacy', 'parentalEmailUpdates', e.target.checked)}
                  />
                }
                label="Weekly progress email updates"
              />
            </AccordionDetails>
          </Accordion>

          <Button
            onClick={() => setShowPrivacyDetails(true)}
            startIcon={<Info />}
            sx={{ mt: 2 }}
          >
            View Detailed Privacy Policy
          </Button>
        </TabPanel>

        {/* Learning Settings Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" sx={{ mb: 3 }}>Learning Preferences</Typography>

          <Box sx={{ display: 'grid', gap: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.learning.adaptiveDifficulty}
                  onChange={(e) => handleSettingChange('learning', 'adaptiveDifficulty', e.target.checked)}
                />
              }
              label="Adaptive difficulty based on child's progress"
            />

            <FormControl>
              <InputLabel>Progress Report Frequency</InputLabel>
              <Select
                value={localSettings.learning.progressReportFrequency}
                onChange={(e) => handleSettingChange('learning', 'progressReportFrequency', e.target.value)}
                label="Progress Report Frequency"
              >
                <MenuItem value="daily">Daily Summary</MenuItem>
                <MenuItem value="weekly">Weekly Report</MenuItem>
                <MenuItem value="monthly">Monthly Overview</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Celebration Level</InputLabel>
              <Select
                value={localSettings.learning.celebrationLevel}
                onChange={(e) => handleSettingChange('learning', 'celebrationLevel', e.target.value)}
                label="Celebration Level"
              >
                <MenuItem value="minimal">Gentle Recognition</MenuItem>
                <MenuItem value="normal">Balanced Celebrations</MenuItem>
                <MenuItem value="enthusiastic">Enthusiastic Praise</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </TabPanel>

        {/* Reports & Analytics Tab */}
        <TabPanel value={activeTab} index={4}>
          <Typography variant="h6" sx={{ mb: 3 }}>Usage Reports & Insights</Typography>

          <Box sx={{ display: 'grid', gap: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>This Week's Learning</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
                  <Box>
                    <Typography variant="h4" color="primary">{usageStats.learningProgress.subjectsExplored}</Typography>
                    <Typography variant="body2">Subjects Explored</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="success.main">{usageStats.learningProgress.conceptsMastered}</Typography>
                    <Typography variant="body2">Concepts Mastered</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="warning.main">{usageStats.learningProgress.achievementsUnlocked}</Typography>
                    <Typography variant="body2">Achievements</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Emotional Well-being</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Average Comfort Level: {usageStats.emotionalWellbeing.averageComfortLevel.toFixed(1)}/5
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(usageStats.emotionalWellbeing.averageComfortLevel / 5) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2">
                  Support requests today: {usageStats.emotionalWellbeing.supportRequestsToday}
                </Typography>
                <Typography variant="body2">
                  Positive interactions: {usageStats.emotionalWellbeing.positiveInteractions}
                </Typography>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Favorite Activities</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {usageStats.favoriteActivities.map((activity, index) => (
                    <Chip key={index} label={activity} variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Action Buttons */}
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Button onClick={resetToDefaults} variant="outlined">
              Reset to Recommended Defaults
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={saveSettings}
                variant="contained"
                disabled={!hasUnsavedChanges}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
          {hasUnsavedChanges && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              You have unsaved changes. Click "Save Changes" to apply them.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ParentalControlDashboard;