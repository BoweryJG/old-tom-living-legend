import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
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
} from '@mui/icons-material';
import { ElevenLabsTTSService } from '../services/elevenLabsTTS';

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
  const chatEndRef = useRef<HTMLDivElement>(null);
  const oldTomVoice = useRef(new ElevenLabsTTSService());

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Old Tom's voice on first load
  useEffect(() => {
    if (open) {
      oldTomVoice.current.initialize().catch(console.error);
    }
  }, [open]);

  const generateOldTomResponse = async (userMessage: string): Promise<string> => {
    // This would integrate with OpenAI GPT - for now using predefined responses
    const responses = [
      `Ah, ${userMessage.toLowerCase().includes('whale') ? 'whales are magnificent creatures indeed!' : 'that reminds me of a tale from the deep...'} You know, in my day, we orcas worked alongside the Davidson family whalers. We had what they called the "Law of the Tongue" - a sacred partnership where we'd guide the whalers to the great baleen whales, and in return, we'd feast on the tongues and lips. It was a fair trade that lasted for generations.`,
      
      `Your curiosity reminds me of young Thomas Davidson, who first learned to trust our pod. ${userMessage.toLowerCase().includes('story') ? 'Here\'s a story for you:' : 'Let me share this with you:'} One stormy morning in 1895, we spotted a massive blue whale near the bay. I led the whalers through treacherous waters, breaching high to signal the direction. The trust between human and orca was unbreakable.`,
      
      `Wise words, young one! ${userMessage.toLowerCase().includes('learn') ? 'Learning is like navigating the ocean currents' : 'That takes me back to...'} - you must respect the sea to understand it. We orcas have lived in these waters for thousands of years, passing down knowledge through our songs. Each pod has its own dialect, its own stories. Would you like to hear one of our ancient songs?`,
      
      `Ho ho! ${userMessage.toLowerCase().includes('adventure') ? 'Adventures were plentiful in those days!' : 'That reminds me of the old days...'} I remember the time we helped the Davidsons during the great storm of 1902. The waters were so rough that even experienced whalers feared for their lives. But our pod surrounded their boat, creating a living shield against the waves. That's when they truly understood - we weren't just hunters, we were partners.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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
    
    setIsSpeaking(true);
    setMessages(prev => prev.map(msg => 
      msg.id === message.id ? { ...msg, isPlaying: true } : { ...msg, isPlaying: false }
    ));

    try {
      await oldTomVoice.current.streamTextToSpeech(message.text, 'old-tom');
    } catch (error) {
      console.error('Error playing message:', error);
    }
    
    setIsSpeaking(false);
    setMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          background: 'linear-gradient(135deg, rgba(15, 52, 96, 0.95) 0%, rgba(46, 139, 87, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          borderRadius: 4,
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(45deg, #2E8B57 30%, #4CAF50 90%)',
          color: '#F5F5DC',
          fontFamily: '"Cinzel", serif',
          fontSize: '1.5rem',
          fontWeight: 600,
          textAlign: 'center',
          position: 'relative',
          borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif' }}>
            🐋 Conversation with Old Tom
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#F5F5DC',
              '&:hover': { background: 'rgba(255,255,255,0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
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
                        disabled={isSpeaking}
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          right: 4,
                          color: message.isPlaying ? '#D4AF37' : 'rgba(245, 245, 220, 0.7)',
                          '&:hover': { color: '#D4AF37' }
                        }}
                      >
                        {message.isPlaying ? <CircularProgress size={16} color="inherit" /> : <VolumeUpIcon fontSize="small" />}
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
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Old Tom about his adventures..."
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