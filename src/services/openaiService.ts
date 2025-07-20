import axios from 'axios';

interface OpenAIConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenAIService {
  private config: OpenAIConfig;
  private axiosInstance;

  constructor(config: Partial<OpenAIConfig> = {}) {
    this.config = {
      apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
      baseURL: process.env.REACT_APP_OPENAI_BASE_URL || 'https://api.openai.com/v1',
      model: 'gpt-4',
      temperature: 0.8,
      maxTokens: 150,
      ...config,
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async generateCharacterResponse(
    characterId: string,
    userMessage: string,
    context: {
      characterPersonality: string[];
      memories: string[];
      conversationHistory: ChatMessage[];
      currentMood: string;
      backstory: string;
    }
  ): Promise<string> {
    try {
      const systemPrompt = this.buildCharacterSystemPrompt(characterId, context);
      
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...(context.conversationHistory || [])
          .filter(msg => msg && msg.role && msg.content)
          .slice(-10), // Last 10 messages for context
        { role: 'user', content: userMessage },
      ];

      const response = await this.axiosInstance.post<ChatCompletionResponse>('/chat/completions', {
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      });

      // Safely extract the response with multiple fallback checks
      const choices = response.data?.choices;
      if (!choices || !Array.isArray(choices) || choices.length === 0) {
        throw new Error('No choices received from OpenAI');
      }

      const firstChoice = choices[0];
      if (!firstChoice || !firstChoice.message) {
        throw new Error('Invalid response structure from OpenAI');
      }

      const assistantMessage = firstChoice.message.content;
      if (!assistantMessage || typeof assistantMessage !== 'string') {
        throw new Error('No valid content received from OpenAI');
      }

      return assistantMessage.trim();
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate character response');
    }
  }

  async generateStoryNarration(
    sceneDescription: string,
    storyContext: string,
    style: 'whimsical' | 'dramatic' | 'peaceful' = 'whimsical'
  ): Promise<string> {
    try {
      const systemPrompt = `You are a master storyteller in the style of Studio Ghibli films. 
      Create beautiful, ${style} narration that brings scenes to life with vivid imagery and emotional depth.
      Keep responses to 2-3 sentences maximum. Use poetic, child-friendly language.`;

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Create narration for this scene: ${sceneDescription}\nStory context: ${storyContext}` 
        },
      ];

      const response = await this.axiosInstance.post<ChatCompletionResponse>('/chat/completions', {
        model: this.config.model,
        messages,
        temperature: 0.9,
        max_tokens: 100,
      });

      return response.data.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error('Story narration generation error:', error);
      throw new Error('Failed to generate story narration');
    }
  }

  private buildCharacterSystemPrompt(characterId: string, context: any): string {
    const {
      characterPersonality,
      memories,
      currentMood,
      backstory,
    } = context;

    return `You are ${characterId}, a character in a magical Studio Ghibli-style children's story.

PERSONALITY: ${characterPersonality.join(', ')}
BACKSTORY: ${backstory}
CURRENT MOOD: ${currentMood}
MEMORIES: ${memories.join('; ')}

GUIDELINES:
- Stay in character at all times
- Use warm, child-friendly language
- Reference your memories and experiences naturally
- Match your current mood in responses
- Keep responses conversational and engaging (1-3 sentences)
- Ask questions to encourage interaction
- Be patient and kind with children
- Weave in ocean and maritime themes naturally
- Use gentle wisdom and storytelling elements

Remember: You are speaking directly to a child who is exploring your world. Make them feel welcome and curious!`;
  }

  async generateImagePrompt(sceneDescription: string): Promise<string> {
    try {
      const systemPrompt = `Create a detailed image generation prompt for a Studio Ghibli-style illustration. 
      The prompt should be artistic, child-friendly, and capture the magical realism of Ghibli films.
      Include specific visual elements, lighting, and atmosphere.`;

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Scene: ${sceneDescription}` },
      ];

      const response = await this.axiosInstance.post<ChatCompletionResponse>('/chat/completions', {
        model: this.config.model,
        messages,
        temperature: 0.7,
        max_tokens: 80,
      });

      return response.data.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error('Image prompt generation error:', error);
      return sceneDescription; // Fallback to original description
    }
  }

  updateConfig(newConfig: Partial<OpenAIConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Update axios instance headers if API key changed
    if (newConfig.apiKey) {
      this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${newConfig.apiKey}`;
    }
  }
}

export const openaiService = new OpenAIService();
export default OpenAIService;