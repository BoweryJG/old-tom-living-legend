interface SpeechRecognitionOptions {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
}

interface VoiceCommand {
  pattern: RegExp;
  action: string;
  confidence: number;
  context?: string[];
}

interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  command?: {
    type: string;
    action: string;
    parameters: Record<string, any>;
  };
}

type SpeechEventCallback = (result: SpeechResult) => void;
type ErrorCallback = (error: Error) => void;

class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private listeners: Map<string, SpeechEventCallback[]> = new Map();
  private errorListeners: ErrorCallback[] = [];
  private voiceCommands: VoiceCommand[] = [];
  private currentContext: string = 'general';
  private confidenceThreshold: number = 0.7;

  constructor() {
    this.initializeSpeechRecognition();
    this.setupVoiceCommands();
  }

  private initializeSpeechRecognition() {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || 
                             (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    
    // Configure recognition settings
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 3;

    // Set up event listeners
    this.recognition.onstart = () => {
      this.isListening = true;
      this.notifyListeners('start', { transcript: '', confidence: 0, isFinal: false });
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.notifyListeners('end', { transcript: '', confidence: 0, isFinal: true });
    };

    this.recognition.onresult = (event: any) => {
      this.handleSpeechResult(event);
    };

    this.recognition.onerror = (event: any) => {
      this.handleSpeechError(event);
    };

    this.recognition.onnomatch = () => {
      this.notifyListeners('nomatch', { 
        transcript: '', 
        confidence: 0, 
        isFinal: true 
      });
    };
  }

  private setupVoiceCommands() {
    this.voiceCommands = [
      // Navigation commands
      {
        pattern: /(?:go to|navigate to|show me) (?:the )?(home|ocean|story|painting|dream|chat) ?(?:page|screen)?/i,
        action: 'navigate',
        confidence: 0.8,
        context: ['general', 'navigation']
      },
      {
        pattern: /(?:next|continue|go forward)/i,
        action: 'next',
        confidence: 0.7,
        context: ['story', 'general']
      },
      {
        pattern: /(?:back|previous|go back)/i,
        action: 'previous',
        confidence: 0.7,
        context: ['story', 'general']
      },

      // Story navigation
      {
        pattern: /tell me about (?:the )?(rope|whale|tom|george|friendship|ocean)/i,
        action: 'story_topic',
        confidence: 0.8,
        context: ['story', 'chat']
      },
      {
        pattern: /(?:read|tell) (?:me )?(?:the )?chapter (\d+|one|two|three|four|five)/i,
        action: 'read_chapter',
        confidence: 0.8,
        context: ['story']
      },

      // Character interaction
      {
        pattern: /(?:talk to|speak with|ask) (?:old )?tom/i,
        action: 'talk_to_tom',
        confidence: 0.9,
        context: ['general', 'chat']
      },
      {
        pattern: /(?:talk to|speak with|ask) george/i,
        action: 'talk_to_george',
        confidence: 0.9,
        context: ['general', 'chat']
      },

      // Audio controls
      {
        pattern: /(?:play|start) (?:the )?(?:audio|sound|music)/i,
        action: 'play_audio',
        confidence: 0.8,
        context: ['general']
      },
      {
        pattern: /(?:pause|stop) (?:the )?(?:audio|sound|music)/i,
        action: 'pause_audio',
        confidence: 0.8,
        context: ['general']
      },
      {
        pattern: /(?:volume|make it) (?:up|louder|higher)/i,
        action: 'volume_up',
        confidence: 0.7,
        context: ['general']
      },
      {
        pattern: /(?:volume|make it) (?:down|quieter|lower|softer)/i,
        action: 'volume_down',
        confidence: 0.7,
        context: ['general']
      },

      // Learning queries for Old Tom
      {
        pattern: /(?:what|tell me) (?:about|is) (?:a |an )?(whale|orca|ocean|sea|fish)/i,
        action: 'ask_about_marine_life',
        confidence: 0.8,
        context: ['chat', 'learning']
      },
      {
        pattern: /(?:how|why) (?:do|did) (?:whales|tom|old tom)/i,
        action: 'ask_how_why',
        confidence: 0.7,
        context: ['chat', 'learning']
      },

      // Help and guidance
      {
        pattern: /(?:help|what can i|how do i)/i,
        action: 'show_help',
        confidence: 0.6,
        context: ['general']
      },
      {
        pattern: /(?:what|show me) (?:can i|should i) (?:do|say)/i,
        action: 'show_options',
        confidence: 0.7,
        context: ['general']
      },

      // Emotional responses
      {
        pattern: /(?:i'm|i am|i feel) (?:scared|afraid|worried)/i,
        action: 'comfort',
        confidence: 0.8,
        context: ['chat']
      },
      {
        pattern: /(?:i'm|i am) (?:excited|happy|amazed)/i,
        action: 'encourage',
        confidence: 0.8,
        context: ['chat']
      },

      // Exit commands
      {
        pattern: /(?:goodbye|bye|see you|stop listening)/i,
        action: 'goodbye',
        confidence: 0.7,
        context: ['general']
      }
    ];
  }

  private handleSpeechResult(event: any) {
    const results = event.results;
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < results.length; i++) {
      const result = results[i];
      const transcript = result[0].transcript.trim();
      const confidence = result[0].confidence;

      if (result.isFinal) {
        finalTranscript += transcript + ' ';
        
        const speechResult: SpeechResult = {
          transcript: finalTranscript.trim(),
          confidence,
          isFinal: true,
          command: this.parseVoiceCommand(finalTranscript.trim())
        };

        this.notifyListeners('result', speechResult);
      } else {
        interimTranscript += transcript;
        
        const speechResult: SpeechResult = {
          transcript: interimTranscript,
          confidence,
          isFinal: false
        };

        this.notifyListeners('interim', speechResult);
      }
    }
  }

  private parseVoiceCommand(transcript: string): SpeechResult['command'] | undefined {
    // Filter commands by current context
    const relevantCommands = this.voiceCommands.filter(cmd => 
      !cmd.context || cmd.context.includes(this.currentContext)
    );

    // Try to match commands, sorted by confidence
    const matches = relevantCommands
      .map(cmd => {
        const match = transcript.match(cmd.pattern);
        return match ? {
          command: cmd,
          match,
          confidence: cmd.confidence
        } : null;
      })
      .filter(Boolean)
      .sort((a, b) => (b?.confidence || 0) - (a?.confidence || 0));

    if (matches.length === 0 || !matches[0] || matches[0].confidence < this.confidenceThreshold) {
      return undefined;
    }

    const bestMatch = matches[0];
    const command = bestMatch.command;
    const match = bestMatch.match;

    return {
      type: command.action,
      action: command.action,
      parameters: this.extractParameters(command.action, match, transcript)
    };
  }

  private extractParameters(action: string, match: RegExpMatchArray, transcript: string): Record<string, any> {
    const params: Record<string, any> = {};

    switch (action) {
      case 'navigate':
        if (match[1]) {
          params.destination = match[1].toLowerCase();
        }
        break;

      case 'story_topic':
        if (match[1]) {
          params.topic = match[1].toLowerCase();
        }
        break;

      case 'read_chapter':
        if (match[1]) {
          const chapter = match[1].toLowerCase();
          const chapterMap: Record<string, number> = {
            'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5
          };
          params.chapter = chapterMap[chapter] || parseInt(chapter) || 1;
        }
        break;

      case 'ask_about_marine_life':
        if (match[1]) {
          params.subject = match[1].toLowerCase();
        }
        break;

      case 'volume_up':
      case 'volume_down':
        params.direction = action.includes('up') ? 'up' : 'down';
        break;

      default:
        params.originalText = transcript;
        break;
    }

    return params;
  }

  private handleSpeechError(event: any) {
    console.error('Speech recognition error:', event.error);
    
    const errorTypes = {
      'network': 'Network connection issue. Please check your internet connection.',
      'not-allowed': 'Microphone access denied. Please allow microphone access.',
      'no-speech': 'No speech detected. Please try speaking again.',
      'audio-capture': 'Audio capture failed. Please check your microphone.',
      'service-not-allowed': 'Speech recognition service not available.'
    };

    const errorMessage = errorTypes[event.error as keyof typeof errorTypes] || 
                        'Speech recognition error occurred.';

    this.errorListeners.forEach(callback => {
      callback(new Error(errorMessage));
    });
  }

  private notifyListeners(eventType: string, result: SpeechResult) {
    const listeners = this.listeners.get(eventType) || [];
    listeners.forEach(callback => callback(result));
  }

  // Public API methods
  public startListening(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        resolve();
        return;
      }

      try {
        this.recognition.start();
        
        // Resolve when listening starts
        const startHandler = () => {
          this.removeListener('start', startHandler);
          resolve();
        };
        this.addListener('start', startHandler);

        // Handle errors
        const errorHandler = (error: Error) => {
          this.removeErrorListener(errorHandler);
          reject(error);
        };
        this.addErrorListener(errorHandler);

      } catch (error) {
        reject(error);
      }
    });
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  public setContext(context: string): void {
    this.currentContext = context;
  }

  public setConfidenceThreshold(threshold: number): void {
    this.confidenceThreshold = Math.max(0, Math.min(1, threshold));
  }

  public addListener(eventType: string, callback: SpeechEventCallback): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  public removeListener(eventType: string, callback: SpeechEventCallback): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  public addErrorListener(callback: ErrorCallback): void {
    this.errorListeners.push(callback);
  }

  public removeErrorListener(callback: ErrorCallback): void {
    const index = this.errorListeners.indexOf(callback);
    if (index > -1) {
      this.errorListeners.splice(index, 1);
    }
  }

  public isSupported(): boolean {
    return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  // Voice command management
  public addCustomCommand(command: VoiceCommand): void {
    this.voiceCommands.push(command);
  }

  public removeCustomCommand(pattern: RegExp): void {
    this.voiceCommands = this.voiceCommands.filter(cmd => 
      cmd.pattern.source !== pattern.source
    );
  }

  public getAvailableCommands(context?: string): VoiceCommand[] {
    if (!context) return this.voiceCommands;
    
    return this.voiceCommands.filter(cmd => 
      !cmd.context || cmd.context.includes(context)
    );
  }

  // Utility methods
  public testCommand(text: string): SpeechResult['command'] | undefined {
    return this.parseVoiceCommand(text);
  }

  public getVoiceCommandHelp(context?: string): string[] {
    const commands = this.getAvailableCommands(context || this.currentContext);
    return commands.map(cmd => {
      // Generate human-readable examples from regex patterns
      return this.generateCommandExample(cmd.pattern);
    });
  }

  private generateCommandExample(pattern: RegExp): string {
    const patternStr = pattern.source;
    
    // Simple pattern to example mapping
    const examples: Record<string, string> = {
      '(?:go to|navigate to|show me)': 'Go to ocean page',
      '(?:tell me about)': 'Tell me about whales',
      '(?:talk to|speak with|ask)': 'Talk to Old Tom',
      '(?:play|start)': 'Play audio',
      '(?:help|what can i)': 'Help me',
      '(?:next|continue)': 'Next chapter'
    };

    for (const [key, example] of Object.entries(examples)) {
      if (patternStr.includes(key)) {
        return example;
      }
    }

    return 'Voice command available';
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
export default SpeechRecognitionService;