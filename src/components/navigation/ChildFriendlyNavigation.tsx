import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Breadcrumbs,
  Chip,
  useTheme,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Home as HomeIcon,
  AutoStories as StoryIcon,
  Chat as ChatIcon,
  Waves as OceanIcon,
  AccessTime as TimeIcon,
  Palette as PaintIcon,
  Dream as DreamIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useSpring, animated } from '@react-spring/web';
import { useAccessibility } from '../accessibility/AccessibilityProvider';
import { AccessibleButton } from '../accessibility/AccessibleButton';

interface NavigationItem {
  path: string;
  label: string;
  childFriendlyLabel: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  unlocked: boolean;
  completed: boolean;
  hasNewContent: boolean;
}

interface ChildFriendlyNavigationProps {
  currentProgress?: {
    totalSteps: number;
    completedSteps: number;
    currentChapter: string;
  };
  onSettingsOpen?: () => void;
  onHelpOpen?: () => void;
}

export const ChildFriendlyNavigation: React.FC<ChildFriendlyNavigationProps> = ({
  currentProgress = { totalSteps: 10, completedSteps: 3, currentChapter: 'Meeting Old Tom' },
  onSettingsOpen,
  onHelpOpen
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, announceToScreenReader } = useAccessibility();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // Define navigation structure
  const navigationItems: NavigationItem[] = [
    {
      path: '/',
      label: 'Home',
      childFriendlyLabel: 'Start Your Adventure',
      icon: <HomeIcon />,
      description: 'Begin your journey with Old Tom',
      color: theme.palette.primary.main,
      unlocked: true,
      completed: false,
      hasNewContent: false
    },
    {
      path: '/story',
      label: 'Story',
      childFriendlyLabel: 'Old Tom\'s Tales',
      icon: <StoryIcon />,
      description: 'Listen to stories about Old Tom',
      color: theme.palette.secondary.main,
      unlocked: true,
      completed: currentProgress.completedSteps > 2,
      hasNewContent: true
    },
    {
      path: '/chat',
      label: 'Chat',
      childFriendlyLabel: 'Talk with Old Tom',
      icon: <ChatIcon />,
      description: 'Have conversations with the legendary whale',
      color: theme.palette.info.main,
      unlocked: currentProgress.completedSteps > 1,
      completed: false,
      hasNewContent: false
    },
    {
      path: '/ocean',
      label: 'Ocean',
      childFriendlyLabel: 'Twofold Bay',
      icon: <OceanIcon />,
      description: 'Explore the magical waters where Old Tom lived',
      color: theme.palette.ocean.main,
      unlocked: true,
      completed: false,
      hasNewContent: false
    },
    {
      path: '/time-portal',
      label: 'Time Portal',
      childFriendlyLabel: 'Travel Through Time',
      icon: <TimeIcon />,
      description: 'Visit different times in Old Tom\'s life',
      color: theme.palette.sunset.main,
      unlocked: currentProgress.completedSteps > 3,
      completed: false,
      hasNewContent: false
    },
    {
      path: '/painting',
      label: 'Art Gallery',
      childFriendlyLabel: 'Draw with Old Tom',
      icon: <PaintIcon />,
      description: 'Create art inspired by Old Tom\'s adventures',
      color: theme.palette.forest.main,
      unlocked: currentProgress.completedSteps > 4,
      completed: false,
      hasNewContent: false
    },
    {
      path: '/dream',
      label: 'Dream Realm',
      childFriendlyLabel: 'Old Tom\'s Dreams',
      icon: <DreamIcon />,
      description: 'Experience Old Tom\'s magical dreams',
      color: theme.palette.sunset.dark,
      unlocked: currentProgress.completedSteps > 6,
      completed: false,
      hasNewContent: false
    }
  ];

  // Get current navigation item
  const currentItem = navigationItems.find(item => item.path === location.pathname) || navigationItems[0];

  // Breadcrumb generation
  const generateBreadcrumbs = useCallback(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/', childFriendlyLabel: 'Start' }];

    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const item = navigationItems.find(nav => nav.path === currentPath);
      if (item) {
        breadcrumbs.push({
          label: item.label,
          path: item.path,
          childFriendlyLabel: item.childFriendlyLabel
        });
      }
    });

    return breadcrumbs;
  }, [location.pathname, navigationItems]);

  const breadcrumbs = generateBreadcrumbs();

  // Navigation animations
  const progressAnimation = useSpring({
    width: `${(currentProgress.completedSteps / currentProgress.totalSteps) * 100}%`,
    config: { tension: 300, friction: 30 }
  });

  const headerAnimation = useSpring({
    transform: showProgress ? 'translateY(0)' : 'translateY(-10px)',
    opacity: showProgress ? 1 : 0.8,
    config: { tension: 400, friction: 40 }
  });

  // Handle navigation
  const handleNavigate = useCallback((path: string, itemLabel: string) => {
    const item = navigationItems.find(nav => nav.path === path);
    
    if (!item?.unlocked) {
      announceToScreenReader(`${itemLabel} is locked. Complete more of the story to unlock it.`);
      return;
    }

    navigate(path);
    setDrawerOpen(false);
    announceToScreenReader(`Navigating to ${itemLabel}`);
  }, [navigate, navigationItems, announceToScreenReader]);

  const handleBackNavigation = useCallback(() => {
    if (breadcrumbs.length > 1) {
      const previousBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
      handleNavigate(previousBreadcrumb.path, previousBreadcrumb.childFriendlyLabel);
    }
  }, [breadcrumbs, handleNavigate]);

  // Show progress on navigation
  useEffect(() => {
    setShowProgress(true);
    const timer = setTimeout(() => setShowProgress(false), 3000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* Main Navigation Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: alpha(currentItem.color, 0.9),
          backdropFilter: 'blur(10px)',
          borderBottom: settings.highContrast ? '2px solid white' : 'none'
        }}
      >
        <Toolbar sx={{ minHeight: settings.largeTargets ? 64 : 56 }}>
          {/* Back Button */}
          {breadcrumbs.length > 1 && (
            <AccessibleButton
              onClick={handleBackNavigation}
              aria-label="Go back to previous page"
              childFriendlyLabel="Go Back"
              sx={{ mr: 1 }}
            >
              <BackIcon />
            </AccessibleButton>
          )}

          {/* Menu Button */}
          <AccessibleButton
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            childFriendlyLabel="Open Menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </AccessibleButton>

          {/* Current Page Title */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              component="h1"
              sx={{ 
                fontSize: settings.largeText ? '1.5rem' : '1.25rem',
                fontWeight: 500
              }}
            >
              {settings.simplifiedLanguage ? currentItem.childFriendlyLabel : currentItem.label}
            </Typography>
            
            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && !settings.simplifiedLanguage && (
              <Breadcrumbs 
                aria-label="Navigation breadcrumbs"
                sx={{ 
                  fontSize: '0.875rem',
                  '& .MuiBreadcrumbs-separator': { 
                    color: alpha(theme.palette.common.white, 0.7) 
                  }
                }}
              >
                {breadcrumbs.map((crumb, index) => (
                  <Typography
                    key={crumb.path}
                    color={index === breadcrumbs.length - 1 ? 'inherit' : alpha(theme.palette.common.white, 0.7)}
                    sx={{ 
                      cursor: index < breadcrumbs.length - 1 ? 'pointer' : 'default',
                      '&:hover': index < breadcrumbs.length - 1 ? { textDecoration: 'underline' } : {}
                    }}
                    onClick={() => index < breadcrumbs.length - 1 && handleNavigate(crumb.path, crumb.childFriendlyLabel)}
                  >
                    {settings.simplifiedLanguage ? crumb.childFriendlyLabel : crumb.label}
                  </Typography>
                ))}
              </Breadcrumbs>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onHelpOpen && (
              <AccessibleButton
                onClick={onHelpOpen}
                aria-label="Get help"
                childFriendlyLabel="Help"
              >
                <HelpIcon />
              </AccessibleButton>
            )}
            
            {onSettingsOpen && (
              <AccessibleButton
                onClick={onSettingsOpen}
                aria-label="Open accessibility settings"
                childFriendlyLabel="Settings"
              >
                <SettingsIcon />
              </AccessibleButton>
            )}
          </Box>
        </Toolbar>

        {/* Progress Bar */}
        <animated.div style={headerAnimation}>
          {showProgress && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {settings.simplifiedLanguage ? 'Your Progress' : `Chapter: ${currentProgress.currentChapter}`}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {currentProgress.completedSteps} of {currentProgress.totalSteps}
                </Typography>
              </Box>
              <Box sx={{ position: 'relative' }}>
                <LinearProgress
                  variant="determinate"
                  value={(currentProgress.completedSteps / currentProgress.totalSteps) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: alpha(theme.palette.common.white, 0.3),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundColor: theme.palette.common.white
                    }
                  }}
                />
                <animated.div
                  style={{
                    ...progressAnimation,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    borderRadius: 3,
                    animation: !settings.reduceMotion ? 'shimmer 2s infinite' : 'none'
                  }}
                />
              </Box>
            </Box>
          )}
        </animated.div>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 320,
            backgroundColor: theme.palette.background.paper,
            border: settings.highContrast ? '2px solid white' : 'none'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
            {settings.simplifiedLanguage ? 'Where To Go?' : 'Old Tom\'s World'}
          </Typography>
          
          <List>
            {navigationItems.map((item) => (
              <ListItem
                key={item.path}
                component="button"
                onClick={() => handleNavigate(item.path, item.childFriendlyLabel)}
                disabled={!item.unlocked}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: location.pathname === item.path ? alpha(item.color, 0.1) : 'transparent',
                  border: location.pathname === item.path ? `2px solid ${item.color}` : '2px solid transparent',
                  opacity: item.unlocked ? 1 : 0.5,
                  cursor: item.unlocked ? 'pointer' : 'not-allowed',
                  minHeight: settings.largeTargets ? 56 : 48,
                  '&:hover': item.unlocked ? {
                    backgroundColor: alpha(item.color, 0.05),
                    transform: settings.reduceMotion ? 'none' : 'translateX(4px)'
                  } : {},
                  transition: settings.reduceMotion ? 'none' : 'all 0.2s ease'
                }}
                aria-label={`${item.unlocked ? 'Go to' : 'Locked -'} ${item.childFriendlyLabel}. ${item.description}`}
                role="button"
                tabIndex={0}
              >
                <ListItemIcon sx={{ color: item.color, minWidth: 40 }}>
                  <Badge 
                    badgeContent={item.hasNewContent ? '!' : null}
                    color="error"
                    invisible={!item.hasNewContent}
                  >
                    {item.icon}
                  </Badge>
                </ListItemIcon>
                
                <ListItemText
                  primary={settings.simplifiedLanguage ? item.childFriendlyLabel : item.label}
                  secondary={settings.verboseDescriptions ? item.description : undefined}
                  primaryTypographyProps={{
                    fontSize: settings.largeText ? '1.1rem' : '1rem',
                    fontWeight: location.pathname === item.path ? 600 : 400
                  }}
                  secondaryTypographyProps={{
                    fontSize: settings.largeText ? '0.9rem' : '0.8rem'
                  }}
                />
                
                {/* Status Indicators */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  {item.completed && (
                    <Chip
                      icon={<StarIcon />}
                      label="Done"
                      size="small"
                      sx={{ 
                        backgroundColor: theme.palette.success.main,
                        color: theme.palette.success.contrastText,
                        fontSize: '0.75rem'
                      }}
                    />
                  )}
                  
                  {!item.unlocked && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        fontSize: '0.7rem',
                        textAlign: 'center'
                      }}
                    >
                      Locked
                    </Typography>
                  )}
                  
                  {item.hasNewContent && item.unlocked && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: theme.palette.error.main,
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}
                    >
                      New!
                    </Typography>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>

          {/* Progress Summary */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
              {settings.simplifiedLanguage ? 'How You\'re Doing' : 'Your Journey Progress'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">
                {currentProgress.completedSteps} of {currentProgress.totalSteps} completed
              </Typography>
              <Typography variant="h6" color="primary">
                {Math.round((currentProgress.completedSteps / currentProgress.totalSteps) * 100)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(currentProgress.completedSteps / currentProgress.totalSteps) * 100}
              sx={{ mt: 1, height: 8, borderRadius: 4 }}
            />
          </Box>
        </Box>
      </Drawer>

      {/* Hidden navigation landmark for screen readers */}
      <nav aria-label="Main navigation" style={{ display: 'none' }}>
        <ul>
          {navigationItems.map(item => (
            <li key={item.path}>
              <button onClick={() => handleNavigate(item.path, item.childFriendlyLabel)}>
                {item.childFriendlyLabel}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <style>
        {!settings.reduceMotion && `
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </>
  );
};

export default ChildFriendlyNavigation;