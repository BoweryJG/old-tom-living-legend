import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  IconButton
} from '@mui/material';
import {
  ExpandMore,
  Security,
  Storage,
  Share,
  Delete,
  Visibility,
  VpnKey,
  Shield,
  Close,
  CheckCircle,
  Warning,
  Info
} from '@mui/icons-material';

interface DataType {
  name: string;
  purpose: string;
  retention: string;
  sharing: string;
  userControl: string;
  required: boolean;
}

interface PrivacyTransparencyModalProps {
  open: boolean;
  onClose: () => void;
  onExportData?: () => void;
  onDeleteData?: () => void;
}

export const PrivacyTransparencyModal: React.FC<PrivacyTransparencyModalProps> = ({
  open,
  onClose,
  onExportData,
  onDeleteData
}) => {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState<string | false>('data-types');

  const dataTypes: DataType[] = [
    {
      name: 'Learning Progress',
      purpose: 'Track educational achievements and adapt content difficulty',
      retention: 'Until account deletion or 3 years of inactivity',
      sharing: 'Never shared with third parties',
      userControl: 'View, export, or delete anytime',
      required: true
    },
    {
      name: 'Voice Interactions',
      purpose: 'Enable conversations with Old Tom character',
      retention: 'Processed locally, not stored permanently',
      sharing: 'Never transmitted or stored on servers',
      userControl: 'Can be disabled in settings',
      required: false
    },
    {
      name: 'Emotional Comfort Data',
      purpose: 'Provide appropriate support and adjust content sensitivity',
      retention: 'Stored locally, aggregated anonymously for improvements',
      sharing: 'Only anonymous, aggregated patterns for research',
      userControl: 'Full control over sharing preferences',
      required: true
    },
    {
      name: 'Usage Analytics',
      purpose: 'Improve app performance and educational effectiveness',
      retention: 'Anonymous data retained for 2 years',
      sharing: 'Anonymous, aggregated data only',
      userControl: 'Can opt out completely',
      required: false
    },
    {
      name: 'Accessibility Preferences',
      purpose: 'Maintain personalized accessibility settings',
      retention: 'Until changed by user or account deletion',
      sharing: 'Never shared',
      userControl: 'Full control and modification',
      required: false
    }
  ];

  const securityMeasures = [
    {
      title: 'End-to-End Encryption',
      description: 'All sensitive data is encrypted both in transit and at rest',
      icon: <VpnKey color="success" />
    },
    {
      title: 'Local Processing',
      description: 'Voice and emotion recognition processed on device when possible',
      icon: <Security color="success" />
    },
    {
      title: 'Minimal Data Collection',
      description: 'We collect only what\'s necessary for educational purposes',
      icon: <Storage color="info" />
    },
    {
      title: 'No Behavioral Profiling',
      description: 'We don\'t create profiles for advertising or non-educational purposes',
      icon: <Shield color="success" />
    },
    {
      title: 'Regular Security Audits',
      description: 'Independent security reviews and vulnerability assessments',
      icon: <CheckCircle color="success" />
    }
  ];

  const parentalRights = [
    'View all data collected about your child',
    'Export your child\'s data in a readable format',
    'Delete all data associated with your child\'s account',
    'Modify privacy settings at any time',
    'Receive clear notifications about any data practice changes',
    'Contact our privacy team with questions or concerns'
  ];

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Shield color="primary" />
          <Typography variant="h5" component="h2">
            Privacy & Data Protection
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Old Tom is designed with your child's privacy as our top priority.</strong> This page explains 
            exactly what data we collect, why we collect it, and how you can control it.
          </Typography>
        </Alert>

        {/* Data Types Section */}
        <Accordion
          expanded={expandedSection === 'data-types'}
          onChange={handleAccordionChange('data-types')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Storage color="primary" />
              <Typography variant="h6">What Data We Collect</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Below is a complete list of all data types that Old Tom may collect, with full transparency 
              about purpose, retention, and your control options.
            </Typography>
            
            {dataTypes.map((dataType, index) => (
              <Box
                key={index}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                  backgroundColor: dataType.required 
                    ? theme.palette.grey[50] 
                    : theme.palette.background.paper
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {dataType.name}
                  </Typography>
                  <Chip
                    label={dataType.required ? 'Required' : 'Optional'}
                    size="small"
                    color={dataType.required ? 'warning' : 'success'}
                    variant="outlined"
                  />
                </Box>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Purpose:</strong> {dataType.purpose}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Retention:</strong> {dataType.retention}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Sharing:</strong> {dataType.sharing}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Your Control:</strong> {dataType.userControl}
                </Typography>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Security Measures Section */}
        <Accordion
          expanded={expandedSection === 'security'}
          onChange={handleAccordionChange('security')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Security color="primary" />
              <Typography variant="h6">How We Protect Your Data</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {securityMeasures.map((measure, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemIcon>{measure.icon}</ListItemIcon>
                  <ListItemText
                    primary={measure.title}
                    secondary={measure.description}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Your Rights Section */}
        <Accordion
          expanded={expandedSection === 'rights'}
          onChange={handleAccordionChange('rights')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Visibility color="primary" />
              <Typography variant="h6">Your Parental Rights</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>
              As a parent or guardian, you have complete control over your child's data:
            </Typography>
            
            <List>
              {parentalRights.map((right, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary={right} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Data Management Section */}
        <Accordion
          expanded={expandedSection === 'management'}
          onChange={handleAccordionChange('management')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Share color="primary" />
              <Typography variant="h6">Manage Your Child's Data</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Use these tools to view, export, or delete your child's data at any time:
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={onExportData}
                startIcon={<Storage />}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                Export All Data
                <Typography variant="body2" sx={{ ml: 'auto', opacity: 0.7 }}>
                  Download a complete copy of your child's data
                </Typography>
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                onClick={onDeleteData}
                startIcon={<Delete />}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                Delete All Data
                <Typography variant="body2" sx={{ ml: 'auto', opacity: 0.7 }}>
                  Permanently remove all stored information
                </Typography>
              </Button>
            </Box>

            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> Deleting all data will reset your child's learning progress 
                and achievements. This action cannot be undone.
              </Typography>
            </Alert>
          </AccordionDetails>
        </Accordion>

        {/* Contact Information */}
        <Box
          sx={{
            backgroundColor: theme.palette.grey[50],
            borderRadius: 2,
            p: 2,
            mt: 3
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info color="primary" />
            Questions or Concerns?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Our privacy team is here to help with any questions about your child's data protection.
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> privacy@oldtom.app<br />
            <strong>Response time:</strong> Within 24 hours<br />
            <strong>Phone:</strong> 1-800-OLD-TOME (for urgent privacy concerns)
          </Typography>
        </Box>

        {/* Compliance Information */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Compliance:</strong> Old Tom complies with COPPA (Children's Online Privacy Protection Act), 
            GDPR (General Data Protection Regulation), and other applicable privacy laws. 
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="contained" size="large">
          I Understand
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrivacyTransparencyModal;