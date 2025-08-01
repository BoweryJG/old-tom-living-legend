// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Paper, Typography, Fab } from '@mui/material';
import { 
  BugReport as BugIcon, 
  Close as CloseIcon,
  Clear as ClearIcon,
  ContentCopy as CopyIcon 
} from '@mui/icons-material';

interface LogEntry {
  id: number;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
}

const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);
  const originalConsole = useRef({
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  });

  useEffect(() => {
    // Override console methods to capture logs
    const captureLog = (type: LogEntry['type']) => (...args: any[]) => {
      const message = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');

      setLogs(prev => [...prev, {
        id: logIdRef.current++,
        type,
        message,
        timestamp: new Date().toLocaleTimeString()
      }]);

      // Still call the original console method
      originalConsole.current[type](...args);
    };

    console.log = captureLog('log');
    console.error = captureLog('error');
    console.warn = captureLog('warn');
    console.info = captureLog('info');

    // Add initial log
    console.log('🐋 Debug panel initialized - Old Tom voice logs will appear here');
    
    // Log available voices after a short delay to ensure they're loaded
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      console.log('🎤 Available TTS voices:', voices.length);
      voices.forEach((voice, index) => {
        console.log(`  ${index}: ${voice.name} (${voice.lang}) ${voice.localService ? 'LOCAL' : 'REMOTE'}`);
      });
    }, 100);

    // Cleanup
    return () => {
      console.log = originalConsole.current.log;
      console.error = originalConsole.current.error;
      console.warn = originalConsole.current.warn;
      console.info = originalConsole.current.info;
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
    console.log('🧹 Logs cleared');
  };

  const copyLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}`
    ).join('\n');
    navigator.clipboard.writeText(logText);
    console.log('📋 Logs copied to clipboard');
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return '#ff6b6b';
      case 'warn': return '#ffd93d';
      case 'info': return '#74c0fc';
      default: return '#95d5b2';
    }
  };

  return (
    <>
      {/* Floating debug button */}
      <Fab
        color="primary"
        size="large"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1400,
          backgroundColor: '#2e7d32',
          '&:hover': {
            backgroundColor: '#1b5e20'
          }
        }}
      >
        <BugIcon />
      </Fab>

      {/* Debug panel */}
      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            width: { xs: 'calc(100% - 40px)', sm: 400, md: 500 },
            maxHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
            backgroundColor: 'rgba(18, 18, 18, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h6" sx={{ color: 'white' }}>
              🐋 Old Tom Debug Logs
            </Typography>
            <Box>
              <IconButton 
                onClick={copyLogs} 
                size="small"
                sx={{ color: 'white', mr: 1 }}
              >
                <CopyIcon />
              </IconButton>
              <IconButton 
                onClick={clearLogs} 
                size="small"
                sx={{ color: 'white', mr: 1 }}
              >
                <ClearIcon />
              </IconButton>
              <IconButton 
                onClick={() => setIsOpen(false)} 
                size="small"
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Logs */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          >
            {logs.length === 0 ? (
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                No logs yet. Try clicking the narration button!
              </Typography>
            ) : (
              logs.map(log => (
                <Box
                  key={log.id}
                  sx={{
                    mb: 1,
                    p: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 1,
                    borderLeft: `3px solid ${getLogColor(log.type)}`,
                    wordBreak: 'break-word'
                  }}
                >
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '10px',
                      mb: 0.5
                    }}
                  >
                    {log.timestamp}
                  </Typography>
                  <Typography
                    sx={{
                      color: getLogColor(log.type),
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {log.message}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Paper>
      )}
    </>
  );
};

export default DebugPanel;