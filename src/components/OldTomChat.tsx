// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Fab,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  VolumeUp as VolumeUpIcon,
  Person as PersonIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
} from '@mui/icons-material';
import { higgsAudioService } from '../services/higgsAudioService';
import { speechRecognitionService } from '../services/speechRecognitionService';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'oldtom';
  timestamp: Date;
  isPlaying?: boolean;
}

interface OldTomChatProps {
  open: boolean;
  onClose: () => void;
}

const OldTomChat: React.FC<OldTomChatProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Ahoy there, young navigator! I am Old Tom, the great orca of Eden Bay. What tales would you like to hear about my adventures with the Davidson whalers?',
      sender: 'oldtom',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set up speech recognition listeners
  useEffect(() => {
    const handleResult = (result: any) => {
      if (result.isFinal) {
        const newText = (inputText + ' ' + result.transcript).trim();
        setInputText(newText);
        setInterimTranscript('');
        
        // Auto-send after a short delay when voice input is complete
        if (newText && isListening) {
          setTimeout(() => {
            // Will trigger send via useEffect
            setIsListening(false);
            speechRecognitionService.stopListening();
          }, 1000); // 1 second delay to allow for corrections
        }
      } else {
        setInterimTranscript(result.transcript);
      }
    };

    const handleError = (error: Error) => {
      console.error('Speech recognition error:', error);
      setIsListening(false);
      setInterimTranscript('');
    };

    const handleEnd = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    speechRecognitionService.addListener('result', handleResult);
    speechRecognitionService.addListener('interim', handleResult);
    speechRecognitionService.addListener('end', handleEnd);
    speechRecognitionService.addErrorListener(handleError);
    speechRecognitionService.setContext('chat');

    return () => {
      speechRecognitionService.removeListener('result', handleResult);
      speechRecognitionService.removeListener('interim', handleResult);
      speechRecognitionService.removeListener('end', handleEnd);
      speechRecognitionService.removeErrorListener(handleError);
    };
  }, [inputText, isListening]);

  // Auto-send when voice input stops and there's text
  useEffect(() => {
    if (!isListening && inputText.trim() && interimTranscript === '') {
      // Check if we just stopped listening (voice input ended)
      const wasListening = speechRecognitionService.getIsListening();
      if (!wasListening && inputText.trim()) {
        // Small delay to ensure smooth transition
        const timer = setTimeout(() => {
          if (inputText.trim() && !isLoading) {
            handleSendMessage();
          }
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isListening, inputText, interimTranscript, isLoading]);

  // Play Old Tom's voice using Higgs Audio
  const playOldTomVoice = async (text: string) => {
    setIsSpeaking(true);
    setIsGeneratingAudio(true);
    
    try {
      // Generate audio using Higgs Audio service
      const audioUrl = await higgsAudioService.generateOldTomVoice(text);
      setIsGeneratingAudio(false);
      
      if (audioUrl) {
        // Create and play the audio
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsSpeaking(false);
        };
        
        audio.onerror = () => {
          console.error('Failed to play audio');
          setIsSpeaking(false);
          // Fallback to browser TTS
          playBrowserTTS(text);
        };
        
        await audio.play();
      } else {
        // Fallback to browser TTS if Higgs Audio fails
        playBrowserTTS(text);
      }
    } catch (error) {
      console.error('Error playing Old Tom voice:', error);
      setIsGeneratingAudio(false);
      setIsSpeaking(false);
      // Fallback to browser TTS
      playBrowserTTS(text);
    }
  };

  // Fallback browser TTS
  const playBrowserTTS = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('Browser does not support speech synthesis');
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure for Old Tom's voice
    const voices = window.speechSynthesis.getVoices();
    const australianVoice = voices.find(voice => 
      voice.lang.includes('en-AU') || 
      voice.name.toLowerCase().includes('australian')
    );
    
    if (australianVoice) {
      utterance.voice = australianVoice;
    }
    
    utterance.pitch = 0.5;  // Deep voice
    utterance.rate = 0.6;   // Slow, elderly speech
    utterance.volume = 0.8;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const generateOldTomResponse = async (userMessage: string): Promise<string> => {
    // Simulate Old Tom's responses based on user input
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Check for specific topics and respond accordingly
    if (lowercaseMessage.includes('davidson') || lowercaseMessage.includes('family')) {
      return "Ah, the Davidsons! *chuckles deeply* Fine folk they were, young sailor. Three generations of 'em I worked with - from old George Davidson right down to his grandsons. We had what they called the 'Law of the Tongue' - they'd get the meat, and we'd feast on the tongue and lips. Fair deal it was, lasted near on 40 years!";
    } else if (lowercaseMessage.includes('hunt') || lowercaseMessage.includes('whale')) {
      return "The great hunts, eh? *tail slaps the water* I'd spot the humpbacks from miles away, then swim to shore and thrash my tail - WHACK! WHACK! WHACK! The Davidson boys would hear it and know Old Tom had found prey. Then my pod and I would herd the whale into Twofold Bay, like shepherds of the sea we were!";
    } else if (lowercaseMessage.includes('storm') || lowercaseMessage.includes('danger')) {
      return "Storms? *voice grows serious* Aye, I've seen the ocean in all her moods. Once, young Jackie Davidson's boat capsized in a gale. I swam beneath him for hours, keeping him afloat until help arrived. The sea can be cruel, but we orcas never forgot our human partners.";
    } else if (lowercaseMessage.includes('age') || lowercaseMessage.includes('old') || lowercaseMessage.includes('years')) {
      return "How old am I? *laughs heartily* Well now, I've been swimming these waters since before your grandfather's grandfather was born! The museum folks reckon I lived from 1895 to 1930 - that's 35 years of partnership with the Davidsons. But in whale years, I feel as spry as a young calf!";
    } else if (lowercaseMessage.includes('museum')) {
      return "The Eden Killer Whale Museum? *voice fills with pride* Aye, they've got my skeleton there now. Bit strange thinking about it, but I'm glad the young'uns can still learn about our partnership. My bones tell the story of when humans and orcas worked as one. Visit sometime - you'll see the worn teeth from all those rope pulls!";
    } else {
      // Default responses for general conversation
      const responses = [
        "That's an interesting thought, young navigator! *swims in a thoughtful circle* In all my years patrolling these waters, I've learned that the ocean holds many mysteries. What specific tale would you like to hear about?",
        "Ah, you've got the curiosity of a true sailor! *breaches playfully* The waters of Eden Bay have seen many adventures. Would you like to hear about our hunting techniques, the Davidson family, or perhaps the great storm of 1920?",
        "*clicks and whistles* You know, in my day, we orcas had our own language - a mix of clicks, calls, and tail slaps. The Davidsons learned to read our signals just as we learned theirs. Communication, young one, that's the key to any good partnership!",
        "Well now, that reminds me of something... *settles into storytelling mode* Every question has a story behind it in these waters. Tell me, what draws your interest most - our hunting partnership, life in the pod, or the human friends we made?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Generate Old Tom's response
      const responseText = await generateOldTomResponse(inputText);
      
      const oldTomMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'oldtom',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, oldTomMessage]);
      
      // Auto-play Old Tom's response
      setTimeout(() => {
        handlePlayMessage(oldTomMessage);
      }, 500);
      
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Apologies, young navigator. The ocean currents are disrupting our connection. Please try again.',
        sender: 'oldtom',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsLoading(false);
  };

  const handlePlayMessage = async (message: ChatMessage) => {
    if (message.sender !== 'oldtom' || isSpeaking) return;
    
    setMessages(prev => prev.map(msg => 
      msg.id === message.id ? { ...msg, isPlaying: true } : { ...msg, isPlaying: false }
    ));
    
    // Use the new playOldTomVoice function which handles Higgs Audio and fallbacks
    await playOldTomVoice(message.text);
    
    setMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = async () => {
    if (isListening) {
      speechRecognitionService.stopListening();
      setIsListening(false);
      setInterimTranscript('');
    } else {
      try {
        await speechRecognitionService.startListening();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start voice input:', error);
        alert('Please allow microphone access to use voice input.');
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={window.innerWidth < 600}
      PaperProps={{
        sx: {
          height: { xs: '100vh', sm: '80vh' },
          maxHeight: { xs: '100vh', sm: '80vh' },
          background: 'linear-gradient(135deg, rgba(15, 52, 96, 0.95) 0%, rgba(46, 139, 87, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: { xs: 'none', sm: '2px solid rgba(212, 175, 55, 0.3)' },
          borderRadius: { xs: 0, sm: 4 },
          margin: { xs: 0, sm: 2 },
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(45deg, #2E8B57 30%, #4CAF50 90%)',
          color: '#F5F5DC',
          fontFamily: '"Cinzel", serif',
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
          fontWeight: 600,
          textAlign: 'center',
          position: 'relative',
          borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: '"Cinzel", serif',
              fontSize: { xs: '1.1rem', sm: '1.3rem' }
            }}
          >
            🐋 Conversation with Old Tom
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: { xs: 4, sm: 8 },
              top: { xs: 4, sm: 8 },
              color: '#F5F5DC',
              '&:hover': { background: 'rgba(255,255,255,0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Messages List */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(212, 175, 55, 0.3)',
              borderRadius: '10px',
            },
          }}
        >
          <List sx={{ p: 0 }}>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 2,
                  mb: 2,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: message.sender === 'oldtom' ? '#2E8B57' : '#8B7355',
                      width: 48,
                      height: 48,
                      fontSize: '1.5rem',
                    }}
                  >
                    {message.sender === 'oldtom' ? '🐋' : <PersonIcon />}
                  </Avatar>
                </ListItemAvatar>

                <Box
                  sx={{
                    flex: 1,
                    maxWidth: '70%',
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      background: message.sender === 'oldtom' 
                        ? 'linear-gradient(135deg, rgba(46, 139, 87, 0.2) 0%, rgba(15, 52, 96, 0.3) 100%)'
                        : 'linear-gradient(135deg, rgba(139, 115, 85, 0.2) 0%, rgba(212, 175, 55, 0.2) 100%)',
                      border: `1px solid ${message.sender === 'oldtom' ? 'rgba(46, 139, 87, 0.3)' : 'rgba(212, 175, 55, 0.3)'}`,
                      borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                      position: 'relative',
                    }}
                  >
                    <ListItemText
                      primary={message.text}
                      secondary={message.timestamp.toLocaleTimeString()}
                      primaryTypographyProps={{
                        color: '#F5F5DC',
                        fontFamily: message.sender === 'oldtom' ? '"Crimson Text", serif' : '"Roboto", sans-serif',
                        fontSize: message.sender === 'oldtom' ? '1.1rem' : '1rem',
                        lineHeight: 1.6,
                      }}
                      secondaryTypographyProps={{
                        color: 'rgba(245, 245, 220, 0.7)',
                        fontSize: '0.8rem',
                        textAlign: message.sender === 'user' ? 'right' : 'left',
                      }}
                    />
                    
                    {message.sender === 'oldtom' && (
                      <IconButton
                        size="small"
                        onClick={() => handlePlayMessage(message)}
                        disabled={isSpeaking || isGeneratingAudio}
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          right: 4,
                          color: message.isPlaying ? '#D4AF37' : 'rgba(245, 245, 220, 0.7)',
                          '&:hover': { color: '#D4AF37' }
                        }}
                      >
                        {(message.isPlaying || (isGeneratingAudio && message.isPlaying !== false)) ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <VolumeUpIcon fontSize="small" />
                        )}
                      </IconButton>
                    )}
                  </Paper>
                </Box>
              </ListItem>
            ))}
            
            {isLoading && (
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#2E8B57', width: 48, height: 48 }}>
                    🐋
                  </Avatar>
                </ListItemAvatar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: '#D4AF37' }} />
                  <Typography sx={{ color: 'rgba(245, 245, 220, 0.7)', fontStyle: 'italic' }}>
                    Old Tom is thinking...
                  </Typography>
                </Box>
              </ListItem>
            )}
          </List>
          <div ref={chatEndRef} />
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            borderTop: '2px solid rgba(212, 175, 55, 0.3)',
            background: 'rgba(15, 52, 96, 0.3)',
            position: 'relative',
          }}
        >
          {/* Listening indicator */}
          {isListening && (
            <Box
              sx={{
                position: 'absolute',
                top: -2,
                left: 0,
                right: 0,
                height: 2,
                background: 'linear-gradient(90deg, #f44336 0%, #e91e63 50%, #f44336 100%)',
                backgroundSize: '200% 100%',
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': { backgroundPosition: '200% 0' },
                  '100%': { backgroundPosition: '-200% 0' },
                },
              }}
            />
          )}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={inputText + (interimTranscript ? ' ' + interimTranscript : '')}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening..." : "Ask Old Tom about his adventures..."}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#F5F5DC',
                  fontFamily: '"Roboto", sans-serif',
                  '& fieldset': {
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(212, 175, 55, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#D4AF37',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(245, 245, 220, 0.5)',
                },
              }}
            />
            <Fab
              size="small"
              onClick={toggleVoiceInput}
              sx={{
                background: isListening 
                  ? 'linear-gradient(45deg, #f44336 30%, #e91e63 90%)'
                  : 'linear-gradient(45deg, #8B7355 30%, #A0826D 90%)',
                '&:hover': {
                  background: isListening
                    ? 'linear-gradient(45deg, #e91e63 30%, #f44336 90%)'
                    : 'linear-gradient(45deg, #A0826D 30%, #8B7355 90%)',
                },
                mr: 1,
              }}
            >
              {isListening ? <MicOffIcon /> : <MicIcon />}
            </Fab>
            <Fab
              size="small"
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              sx={{
                background: 'linear-gradient(45deg, #2E8B57 30%, #4CAF50 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4CAF50 30%, #2E8B57 90%)',
                },
                '&:disabled': {
                  background: 'rgba(139, 115, 85, 0.3)',
                },
              }}
            >
              <SendIcon />
            </Fab>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OldTomChat;