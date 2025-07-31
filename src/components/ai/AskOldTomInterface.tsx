// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  List,
  ListItem,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Fade,
  Slide
} from '@mui/material';
import {
  Send,
  Mic,
  MicOff,
  VolumeUp,
  VolumeOff,
  Psychology,
  Lightbulb,
  History,
  Star
} from '@mui/icons-material';
import { askOldTomService } from '../../services/askOldTomService';
import { emotionalAIService } from '../../services/emotionalAIService';
import { speechRecognitionService } from '../../services/speechRecognitionService';
import { privacyService } from '../../services/privacyService';
import { conversationMemoryService } from '../../services/conversationMemoryService';

interface ConversationMessage {
  id: string;
  type: 'user' | 'character';
  text: string;
  timestamp: number;
  emotion?: string;
  educationalContent?: {
    topic: string;
    learningObjectives: string[];
    relatedTopics: string[];
  };
}

interface AskOldTomInterfaceProps {
  childAge?: number;
  maxMessages?: number;
  showSuggestions?: boolean;
  enableVoice?: boolean;
  enableEmotionalAI?: boolean;
  onLearningProgress?: (progress: any) => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  timestamp: number;
}

export const AskOldTomInterface: React.FC<AskOldTomInterfaceProps> = ({
  childAge = 7,
  maxMessages = 20,
  showSuggestions = true,
  enableVoice = true,
  enableEmotionalAI = true,
  onLearningProgress
}) => {
  // Core state
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Privacy and consent state
  const [privacyConsent, setPrivacyConsent] = useState({
    consentGiven: false,
    voiceProcessing: false,
    emotionalAnalysis: false,
    learningTracking: false
  });
  
  // Speech recognition state
  const [speechState, setSpeechState] = useState({
    listening: false,
    supported: false,
    transcript: ''
  });
  
  // Learning and achievements state
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  // Emotion analysis state
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [previousTopics, setPreviousTopics] = useState<string[]>([]);
  
  // Suggested questions based on age and topics
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  
  // Refs
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initialize component
  useEffect(() => {
    // Check for speech recognition support
    setSpeechState(prev => ({
      ...prev,
      supported: speechRecognitionService.isSupported()
    }));
    
    // Initialize suggested questions
    const ageAppropriateTopics = askOldTomService.getAgeAppropriateTopics(childAge);
    const suggestions = ageAppropriateTopics.map(topic => {
      if (childAge <= 5) {
        return `What is ${topic}?`;
      } else if (childAge <= 8) {
        return `Can you tell me about ${topic}?`;
      } else {
        return `How does ${topic} work?`;
      }
    }).slice(0, 6);
    
    setSuggestedQuestions([
      ...suggestions,
      "Tell me about your friendship with George",
      "What's your favorite thing about the ocean?",
      "How do whales talk to each other?"
    ]);
    
    // Initialize privacy consent check
    initializePrivacy();
  }, [childAge]);
  
  // Initialize privacy settings
  const initializePrivacy = useCallback(async () => {
    try {
      const consentResult = await privacyService.requestConsent(
        sessionId,
        childAge,
        ['voice_processing', 'learning_tracking', 'emotional_analysis']
      );
      
      if (!consentResult.consentRequired) {
        setPrivacyConsent({
          consentGiven: true,
          voiceProcessing: true,
          emotionalAnalysis: true,
          learningTracking: true
        });
      }
    } catch (error) {
      console.error('Privacy initialization error:', error);
    }
  }, [sessionId, childAge]);
  
  // Auto-scroll to bottom of conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  // Handle question submission
  const handleAskQuestion = useCallback(async (questionText: string = question) => {
    if (!questionText.trim() || isAsking) return;
    
    setIsAsking(true);
    setShowWelcome(false);
    
    // Add user message to conversation
    const userMessage: ConversationMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      text: questionText.trim(),
      timestamp: Date.now()
    };
    
    setConversation(prev => [...prev.slice(-(maxMessages - 1)), userMessage]);
    setQuestion('');
    
    try {
      // Emotional analysis if enabled
      let emotionalResponse;
      if (enableEmotionalAI && privacyConsent.emotionalAnalysis) {
        emotionalResponse = await emotionalAIService.processChildInteraction(
          {
            text: questionText,
            sessionData: {
              childAge,
              sessionDuration: Date.now() - conversation[0]?.timestamp || 0,
              responseTime: 1000,
              interactionCount: conversation.length + 1
            }
          },
          'old-tom',
          extractTopicFromQuestion(questionText)
        );
        
        if (emotionalResponse.detectedEmotion) {
          setCurrentEmotion(emotionalResponse.detectedEmotion.primary);
        }
      }
      
      // Process with Ask Old Tom service
      const response = await askOldTomService.askOldTom({
        question: questionText,
        childAge,
        sessionId,
        context: {
          currentEmotion,
          previousTopics,
          learningLevel: childAge <= 6 ? 'beginner' : childAge <= 9 ? 'intermediate' : 'advanced'
        },
        inputMethod: 'text'
      });
      
      // Add Old Tom's response to conversation
      const tomMessage: ConversationMessage = {
        id: `tom_${Date.now()}`,
        type: 'character',
        text: response.textResponse,
        timestamp: Date.now(),
        emotion: response.emotion,
        educationalContent: response.educationalContent
      };
      
      setConversation(prev => [...prev, tomMessage]);
      
      // Update learning progress
      if (response.educationalContent && onLearningProgress) {
        onLearningProgress({
          topic: response.educationalContent.topic,
          objectives: response.educationalContent.learningObjectives,
          achieved: true
        });
      }
      
      // Add to previous topics
      if (response.educationalContent) {
        setPreviousTopics(prev => {
          const newTopics = [...prev, response.educationalContent!.topic];
          return newTopics.slice(-5); // Keep only last 5 topics
        });
      }
      
      // Add achievement if significant learning occurred
      if (response.educationalContent?.learningObjectives.length > 0) {
        const newAchievement: Achievement = {
          id: `learning_${Date.now()}`,
          title: `Learned about ${response.educationalContent.topic}`,
          description: `Asked great questions about ${response.educationalContent.topic}`,
          timestamp: Date.now()
        };
        
        setAchievements(prev => [...prev.slice(-9), newAchievement]); // Keep last 10 achievements
      }
      
    } catch (error) {
      console.error('Ask Old Tom error:', error);
      
      // Add error message
      const errorMessage: ConversationMessage = {
        id: `error_${Date.now()}`,
        type: 'character',
        text: "Oh my, the ocean currents seem a bit choppy right now! Could you try asking me again?",
        timestamp: Date.now(),
        emotion: 'gentle'
      };
      
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsAsking(false);
    }
  }, [
    question,
    isAsking,
    maxMessages,
    childAge,
    sessionId,
    currentEmotion,
    previousTopics,
    conversation,
    enableEmotionalAI,
    privacyConsent.emotionalAnalysis,
    onLearningProgress
  ]);
  
  // Voice toggle handler
  const handleVoiceToggle = useCallback(async () => {
    if (!enableVoice || !speechState.supported) return;
    
    try {
      if (speechState.listening) {
        // Stop listening
        speechRecognitionService.stopListening();
        setSpeechState(prev => ({ ...prev, listening: false, transcript: '' }));
      } else {
        // Set up listeners before starting
        const resultHandler = (result: any) => {
          setSpeechState(prev => ({ ...prev, transcript: result.transcript }));
          if (result.isFinal && result.transcript.trim()) {
            setQuestion(result.transcript);
            setSpeechState(prev => ({ ...prev, listening: false, transcript: '' }));
            speechRecognitionService.removeListener('result', resultHandler);
            speechRecognitionService.removeErrorListener(errorHandler);
          }
        };
        
        const errorHandler = (error: any) => {
          console.error('Speech recognition error:', error);
          setSpeechState(prev => ({ ...prev, listening: false, transcript: '' }));
          speechRecognitionService.removeListener('result', resultHandler);
          speechRecognitionService.removeErrorListener(errorHandler);
        };
        
        speechRecognitionService.addListener('result', resultHandler);
        speechRecognitionService.addErrorListener(errorHandler);
        
        // Start listening
        await speechRecognitionService.startListening();
        setSpeechState(prev => ({ ...prev, listening: true }));
      }
    } catch (error) {
      console.error('Voice toggle error:', error);
      setSpeechState(prev => ({ ...prev, listening: false, transcript: '' }));
    }
  }, [enableVoice, speechState.supported, speechState.listening]);
  
  // Suggestion click handler
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuestion(suggestion);
    inputRef.current?.focus();
  }, []);
  
  // Key press handler
  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleAskQuestion();
    }
  }, [handleAskQuestion]);
  
  // Privacy consent handler
  const handlePrivacyConsent = useCallback(async () => {
    try {
      const result = await privacyService.recordConsent(
        sessionId,
        {
          voiceProcessing: true,
          emotionalAnalysis: true,
          learningTracking: true,
          dataRetention: true
        }
      );
      
      if (result.success) {
        setPrivacyConsent({
          consentGiven: true,
          voiceProcessing: true,
          emotionalAnalysis: true,
          learningTracking: true
        });
      }
    } catch (error) {
      console.error('Privacy consent error:', error);
    }
  }, [sessionId]);
  
  // Utility function to extract topic from question
  const extractTopicFromQuestion = (question: string): string => {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('whale') || questionLower.includes('ocean')) return 'marine life';
    if (questionLower.includes('friend') || questionLower.includes('help')) return 'friendship';
    if (questionLower.includes('george') || questionLower.includes('history')) return 'history';
    if (questionLower.includes('deep') || questionLower.includes('current')) return 'ocean science';
    
    return 'general';
  };
  
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 800,
        mx: 'auto',
        p: 2,
      }}
    >
      {/* Header with Old Tom Character */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 2,
          background: 'linear-gradient(135deg, rgba(21, 101, 192, 0.05), rgba(2, 119, 189, 0.1))',
          border: '1px solid rgba(21, 101, 192, 0.1)',
          borderRadius: 3,
          textAlign: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ 
            fontSize: '4rem',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
          }}>
            🐋
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#1565C0', fontWeight: 'bold', mb: 1 }}>
              Ask Old Tom Anything
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', maxWidth: 400 }}>
              I'm here to share ocean wisdom and answer all your curious questions!
            </Typography>
          </Box>
        </Box>
        
        {/* Privacy Notice */}
        {!privacyConsent.consentGiven && (
          <Alert 
            severity="info" 
            sx={{ mt: 2, fontSize: '0.9rem' }}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={handlePrivacyConsent}
              >
                ✓
              </IconButton>
            }
          >
            🛡️ Your privacy is important! Click ✓ to enable all features with parental permission.
          </Alert>
        )}
      </Paper>
      
      {/* Welcome Message */}
      {showWelcome && conversation.length === 0 && (
        <Fade in timeout={1000}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              mb: 2,
              background: 'linear-gradient(135deg, rgba(21, 101, 192, 0.1), rgba(135, 206, 235, 0.1))',
              border: '1px solid rgba(21, 101, 192, 0.2)',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" sx={{ color: '#1565C0', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lightbulb /> Welcome, young explorer!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              I'm Old Tom, and I've lived in these waters for over a century! I love sharing stories about the ocean, 
              my friendship with George Davidson, and all the amazing creatures I've met.
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
              Ask me anything about marine life, friendship, or ocean adventures!
            </Typography>
          </Paper>
        </Fade>
      )}
      
      {/* Conversation Area */}
      <Paper
        elevation={1}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          minHeight: 300
        }}
      >
        {/* Conversation Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            backgroundColor: '#fafafa'
          }}
        >
          <List sx={{ p: 0 }}>
            {conversation.map((message, index) => (
              <Slide
                key={message.id}
                direction="up"
                in={true}
                timeout={300 + index * 100}
              >
                <ListItem
                  sx={{
                    mb: 2,
                    p: 0,
                    flexDirection: 'column',
                    alignItems: message.type === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      backgroundColor: message.type === 'user' ? '#E3F2FD' : '#FFF',
                      borderRadius: 3,
                      border: message.type === 'user' ? '1px solid #2196F3' : '1px solid #1565C0',
                      position: 'relative'
                    }}
                  >
                    {/* Message Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {message.type === 'character' && (
                        <>
                          <Typography variant="subtitle2" sx={{ color: '#1565C0', fontWeight: 'bold' }}>
                            🐋 Old Tom
                          </Typography>
                          {message.emotion && (
                            <Chip
                              size="small"
                              label={message.emotion}
                              sx={{
                                fontSize: '0.7rem',
                                height: 20,
                                backgroundColor: 'rgba(21, 101, 192, 0.1)',
                                color: '#1565C0'
                              }}
                            />
                          )}
                        </>
                      )}
                      {message.type === 'user' && (
                        <Typography variant="subtitle2" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                          You 🧒
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Message Text */}
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.5,
                        color: message.type === 'user' ? '#1976D2' : '#333'
                      }}
                    >
                      {message.text}
                    </Typography>
                    
                    {/* Educational Content Tags */}
                    {message.educationalContent && (
                      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        <Chip
                          size="small"
                          icon={<Star />}
                          label={message.educationalContent.topic}
                          sx={{
                            fontSize: '0.7rem',
                            backgroundColor: 'rgba(255, 193, 7, 0.1)',
                            color: '#F57C00'
                          }}
                        />
                        {message.educationalContent.relatedTopics.slice(0, 2).map((topic, idx) => (
                          <Chip
                            key={idx}
                            size="small"
                            label={topic}
                            sx={{
                              fontSize: '0.7rem',
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              color: '#388E3C'
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    
                    {/* Timestamp */}
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 1,
                        color: '#666',
                        textAlign: message.type === 'user' ? 'right' : 'left'
                      }}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </ListItem>
              </Slide>
            ))}
          </List>
          
          {/* Loading indicator */}
          {isAsking && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                Old Tom is thinking about your question...
              </Typography>
            </Box>
          )}
          
          <div ref={conversationEndRef} />
        </Box>
        
        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            backgroundColor: 'white',
            borderTop: '1px solid #e0e0e0'
          }}
        >
          {/* Suggested Questions */}
          {showSuggestions && conversation.length === 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#666', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lightbulb fontSize="small" /> Try asking:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {suggestedQuestions.slice(0, 4).map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    variant="outlined"
                    clickable
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      fontSize: '0.8rem',
                      '&:hover': {
                        backgroundColor: 'rgba(21, 101, 192, 0.1)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {/* Question Input */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              ref={inputRef}
              fullWidth
              multiline
              maxRows={3}
              variant="outlined"
              placeholder="Ask Old Tom a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isAsking}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
            
            {/* Voice Toggle */}
            {enableVoice && speechState.supported && (
              <Tooltip title={speechState.listening ? 'Stop Listening' : 'Start Voice Input'}>
                <IconButton
                  onClick={handleVoiceToggle}
                  disabled={isAsking || !privacyConsent.voiceProcessing}
                  sx={{
                    backgroundColor: speechState.listening ? '#FF9800' : '#f5f5f5',
                    color: speechState.listening ? 'white' : '#666',
                    '&:hover': {
                      backgroundColor: speechState.listening ? '#F57C00' : '#e0e0e0',
                    },
                  }}
                >
                  {speechState.listening ? <MicOff /> : <Mic />}
                </IconButton>
              </Tooltip>
            )}
            
            {/* Send Button */}
            <Tooltip title="Ask Old Tom">
              <span>
                <IconButton
                  onClick={() => handleAskQuestion()}
                  disabled={!question.trim() || isAsking}
                  sx={{
                    backgroundColor: '#1565C0',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#0D47A1',
                    },
                    '&:disabled': {
                      backgroundColor: '#e0e0e0',
                      color: '#999'
                    }
                  }}
                >
                  {isAsking ? <CircularProgress size={24} color="inherit" /> : <Send />}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          
          {/* Voice Transcript Display */}
          {speechState.transcript && speechState.listening && (
            <Box
              sx={{
                mt: 1,
                p: 1,
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(255, 152, 0, 0.3)'
              }}
            >
              <Typography variant="caption" sx={{ color: '#F57C00', fontWeight: 500 }}>
                🎤 Listening: "{speechState.transcript}"
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <Paper
          elevation={1}
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(139, 195, 74, 0.1))'
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#388E3C', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star /> Recent Learning Achievements
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {achievements.slice(-3).map((achievement) => (
              <Chip
                key={achievement.id}
                icon={<Star />}
                label={achievement.title}
                size="small"
                sx={{
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  color: '#388E3C',
                  fontSize: '0.75rem'
                }}
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AskOldTomInterface;