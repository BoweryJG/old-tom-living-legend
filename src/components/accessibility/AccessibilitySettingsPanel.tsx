import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Slider,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Divider,
  Alert,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  TouchApp as TouchIcon,
  Psychology as CognitiveIcon,
  VolumeUp as AudioIcon,
  ScreenShare as ScreenReaderIcon,
  Restore as ResetIcon
} from '@mui/icons-material';
import { useAccessibility } from './AccessibilityProvider';
import { AccessibleButton } from './AccessibleButton';

interface AccessibilitySettingsPanelProps {
  onClose: () => void;
  embedded?: boolean;
}

export const AccessibilitySettingsPanel: React.FC<AccessibilitySettingsPanelProps> = ({
  onClose,
  embedded = false
}) => {
  const theme = useTheme();
  const { settings, updateSettings, announceToScreenReader } = useAccessibility();
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value });
    setHasChanges(true);
    announceToScreenReader(`${key} setting changed to ${value}`);
  };

  const resetToDefaults = () => {
    updateSettings({
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
    });
    setHasChanges(false);
    announceToScreenReader('All accessibility settings reset to defaults');
  };

  const containerProps = embedded ? {} : {
    component: Card,
    sx: {
      maxWidth: 600,
      margin: '0 auto',
      backgroundColor: theme.palette.background.paper
    }
  };

  return (
    <Box {...containerProps}>
      {!embedded && (
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Accessibility Settings
            </Typography>
            <AccessibleButton
              onClick={onClose}
              aria-label="Close accessibility settings"
              childFriendlyLabel="Close Settings"
            >
              ×
            </AccessibleButton>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            Customize Old Tom to work best for you. These settings make the app easier and more comfortable to use.
          </Typography>
        </CardContent>
      )}

      <CardContent>
        {/* Visual Accessibility */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VisibilityIcon color="primary" />
              <Typography variant="h6">Visual Accessibility</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.highContrast}
                    onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                  />
                }
                label="High Contrast Mode"
                aria-describedby="high-contrast-help"
              />
              <Typography id="high-contrast-help" variant="body2" color="text.secondary">
                Makes text and buttons easier to see with stronger colors
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.largeText}
                    onChange={(e) => handleSettingChange('largeText', e.target.checked)}
                  />
                }
                label="Large Text"
                aria-describedby="large-text-help"
              />
              <Typography id="large-text-help" variant="body2" color="text.secondary">
                Makes all text bigger and easier to read
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.reduceMotion}
                    onChange={(e) => handleSettingChange('reduceMotion', e.target.checked)}
                  />
                }
                label="Reduce Motion"
                aria-describedby="reduce-motion-help"
              />
              <Typography id="reduce-motion-help" variant="body2" color="text.secondary">
                Reduces animations that might cause discomfort or distraction
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Color Vision Support</InputLabel>
                <Select
                  value={settings.colorBlindnessMode}
                  onChange={(e) => handleSettingChange('colorBlindnessMode', e.target.value)}
                  label="Color Vision Support"
                >
                  <MenuItem value="none">No adjustment needed</MenuItem>
                  <MenuItem value="protanopia">Red color difficulty</MenuItem>
                  <MenuItem value="deuteranopia">Green color difficulty</MenuItem>
                  <MenuItem value="tritanopia">Blue color difficulty</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Motor Accessibility */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TouchIcon color="primary" />
              <Typography variant="h6">Touch & Motor</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.largeTargets}
                    onChange={(e) => handleSettingChange('largeTargets', e.target.checked)}
                  />
                }
                label="Larger Touch Targets"
                aria-describedby="large-targets-help"
              />
              <Typography id="large-targets-help" variant="body2" color="text.secondary">
                Makes buttons bigger and easier to tap
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.reduceGestures}
                    onChange={(e) => handleSettingChange('reduceGestures', e.target.checked)}
                  />
                }
                label="Simple Touch Only"
                aria-describedby="reduce-gestures-help"
              />
              <Typography id="reduce-gestures-help" variant="body2" color="text.secondary">
                Use simple taps instead of swipe and pinch gestures
              </Typography>

              <Typography gutterBottom>
                Dwell Time (hover to activate): {settings.dwellTime}ms
              </Typography>
              <Slider
                value={settings.dwellTime}
                onChange={(_, value) => handleSettingChange('dwellTime', value)}
                min={500}
                max={3000}
                step={100}
                marks={[
                  { value: 500, label: 'Fast' },
                  { value: 1500, label: 'Normal' },
                  { value: 3000, label: 'Slow' }
                ]}
                aria-label="Dwell time slider"
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Cognitive Accessibility */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CognitiveIcon color="primary" />
              <Typography variant="h6">Learning & Memory</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.simplifiedLanguage}
                    onChange={(e) => handleSettingChange('simplifiedLanguage', e.target.checked)}
                  />
                }
                label="Simple Language"
                aria-describedby="simple-language-help"
              />
              <Typography id="simple-language-help" variant="body2" color="text.secondary">
                Uses easier words and shorter sentences
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Reading Speed</InputLabel>
                <Select
                  value={settings.readingSpeed}
                  onChange={(e) => handleSettingChange('readingSpeed', e.target.value)}
                  label="Reading Speed"
                >
                  <MenuItem value="slow">Slow - Extra time to read</MenuItem>
                  <MenuItem value="normal">Normal speed</MenuItem>
                  <MenuItem value="fast">Fast - Quick reading</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.memoryAids}
                    onChange={(e) => handleSettingChange('memoryAids', e.target.checked)}
                  />
                }
                label="Memory Helpers"
                aria-describedby="memory-aids-help"
              />
              <Typography id="memory-aids-help" variant="body2" color="text.secondary">
                Shows reminders and progress to help remember where you are in the story
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pauseOnFocus}
                    onChange={(e) => handleSettingChange('pauseOnFocus', e.target.checked)}
                  />
                }
                label="Pause When Focused"
                aria-describedby="pause-focus-help"
              />
              <Typography id="pause-focus-help" variant="body2" color="text.secondary">
                Pauses audio and animations when you focus on something to help concentration
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Audio Accessibility */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AudioIcon color="primary" />
              <Typography variant="h6">Audio & Sound</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.audioDescriptions}
                    onChange={(e) => handleSettingChange('audioDescriptions', e.target.checked)}
                  />
                }
                label="Audio Descriptions"
                aria-describedby="audio-descriptions-help"
              />
              <Typography id="audio-descriptions-help" variant="body2" color="text.secondary">
                Describes what's happening on screen for visually impaired users
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.captionsEnabled}
                    onChange={(e) => handleSettingChange('captionsEnabled', e.target.checked)}
                  />
                }
                label="Captions"
                aria-describedby="captions-help"
              />
              <Typography id="captions-help" variant="body2" color="text.secondary">
                Shows text for all spoken words and sound effects
              </Typography>

              <Typography gutterBottom>
                Background Music Volume: {Math.round(settings.backgroundMusicVolume * 100)}%
              </Typography>
              <Slider
                value={settings.backgroundMusicVolume}
                onChange={(_, value) => handleSettingChange('backgroundMusicVolume', value)}
                min={0}
                max={1}
                step={0.1}
                marks={[
                  { value: 0, label: 'Off' },
                  { value: 0.5, label: '50%' },
                  { value: 1, label: '100%' }
                ]}
                aria-label="Background music volume"
              />

              <Typography gutterBottom>
                Voice Speed: {settings.voiceSpeed}x
              </Typography>
              <Slider
                value={settings.voiceSpeed}
                onChange={(_, value) => handleSettingChange('voiceSpeed', value)}
                min={0.5}
                max={2}
                step={0.1}
                marks={[
                  { value: 0.5, label: 'Slow' },
                  { value: 1, label: 'Normal' },
                  { value: 2, label: 'Fast' }
                ]}
                aria-label="Voice playback speed"
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Screen Reader */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScreenReaderIcon color="primary" />
              <Typography variant="h6">Screen Reader</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.screenReaderOptimized}
                    onChange={(e) => handleSettingChange('screenReaderOptimized', e.target.checked)}
                  />
                }
                label="Screen Reader Mode"
                aria-describedby="screen-reader-help"
              />
              <Typography id="screen-reader-help" variant="body2" color="text.secondary">
                Optimizes the app to work better with screen reading software
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.verboseDescriptions}
                    onChange={(e) => handleSettingChange('verboseDescriptions', e.target.checked)}
                  />
                }
                label="Detailed Descriptions"
                aria-describedby="verbose-help"
              />
              <Typography id="verbose-help" variant="body2" color="text.secondary">
                Provides more detailed descriptions of images and actions
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Announcement Frequency</InputLabel>
                <Select
                  value={settings.announcementFrequency}
                  onChange={(e) => handleSettingChange('announcementFrequency', e.target.value)}
                  label="Announcement Frequency"
                >
                  <MenuItem value="minimal">Minimal - Only important updates</MenuItem>
                  <MenuItem value="normal">Normal - Regular updates</MenuItem>
                  <MenuItem value="frequent">Frequent - All updates</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <AccessibleButton
            onClick={resetToDefaults}
            startIcon={<ResetIcon />}
            variant="outlined"
            childFriendlyLabel="Reset to Default Settings"
            educationalContext="This will change all settings back to how they started"
            confirmationRequired
          >
            Reset All
          </AccessibleButton>

          {!embedded && (
            <AccessibleButton
              onClick={onClose}
              variant="contained"
              childFriendlyLabel="Save and Close Settings"
              magicalEffect
            >
              Done
            </AccessibleButton>
          )}
        </Box>

        {hasChanges && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Your accessibility settings have been saved automatically.
          </Alert>
        )}
      </CardContent>
    </Box>
  );
};

export default AccessibilitySettingsPanel;