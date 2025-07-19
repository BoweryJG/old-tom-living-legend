# Old Tom: The Living Legend

A magical Studio Ghibli-style children's interactive story app featuring Old Tom and his oceanic adventures.

## 🌊 Features

- **Interactive Storytelling**: Voice-controlled navigation and AI-powered conversations
- **Studio Ghibli Aesthetics**: Beautiful animations with Lottie, React Spring, and Three.js
- **Progressive Web App**: Offline-capable with service worker caching
- **AI Integration**: OpenAI for character intelligence and ElevenLabs for voice synthesis
- **Immersive Experiences**: Ocean scenes, time portals, and whale dream sequences
- **Mobile-First Design**: Optimized for touch interactions and responsive design
- **Performance Optimized**: 60fps animations with adaptive quality settings

## 🎨 Technology Stack

### Core Framework
- **React 18** with TypeScript
- **Material-UI (MUI) 5** for component system
- **React Router** for navigation
- **Redux Toolkit** for state management

### Animation & 3D
- **Lottie React** for character animations
- **React Spring** for physics-based transitions
- **Three.js/React Three Fiber** for 3D ocean effects
- **Framer Motion** for micro-interactions

### AI & Voice
- **OpenAI API** for character conversations and story generation
- **ElevenLabs API** for text-to-speech and character voices
- **Web Speech API** for voice recognition

### Performance & PWA
- **Workbox** for service worker and caching
- **Web Vitals** for performance monitoring
- **React Lazy Loading** for code splitting
- **Progressive image loading** for 4K assets

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- OpenAI API key
- ElevenLabs API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd tom
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:
```
REACT_APP_OPENAI_API_KEY=your_openai_key_here
REACT_APP_ELEVENLABS_API_KEY=your_elevenlabs_key_here
```

4. Start the development server
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 🎯 Key Components

### Story Engine
- Scene management with branching narratives
- Character state and conversation history
- Progress tracking and achievements

### Audio System
- Spatial audio with Web Audio API
- Voice recognition for commands
- Dynamic music and sound effects

### Animation Framework
- Lottie integration for character expressions
- Physics-based UI transitions
- 3D water effects and particle systems

### Performance Monitoring
- Real-time FPS and memory tracking
- Adaptive quality based on device capabilities
- Asset loading optimization

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── characters/     # Character-specific components
│   ├── environments/   # Scene and environment components
│   ├── ui/            # General UI components
│   └── animations/    # Animation components
├── pages/              # Main application pages
├── store/              # Redux store and slices
├── services/           # API services and integrations
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── assets/             # Static assets
├── styles/             # Global styles and themes
└── types/              # TypeScript type definitions
```

## 🎮 Interactive Features

### Voice Commands
- "Next scene" - Navigate forward
- "Go back" - Return to previous scene
- "Talk to Tom" - Open chat interface
- "Settings" - Open settings panel

### Touch Interactions
- Tap ocean for ripple effects
- Swipe for scene transitions
- Pinch to zoom on paintings
- Long press for hidden features

### Chat with Old Tom
- Ask questions about the story
- Get maritime wisdom and tales
- Unlock new memories and scenes
- Build relationship through conversation

## 🔧 Development Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run analyze` - Analyze bundle size

## 🌊 Responsive Design

- **Mobile First**: Optimized for phones and tablets
- **Touch Friendly**: 44px minimum touch targets
- **Progressive Enhancement**: Works on all devices
- **Accessibility**: WCAG 2.1 AA compliant

## 📊 Performance Goals

- **60 FPS** smooth animations
- **< 3s** initial load time
- **< 1s** scene transitions
- **< 100ms** interaction response
- **4K asset** support with progressive loading

## 🚧 Deployment

The app is configured as a Progressive Web App and can be deployed to:
- **Netlify/Vercel** for static hosting
- **Firebase Hosting** with cloud functions
- **AWS S3 + CloudFront** for global CDN
- **Docker** containers for self-hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Studio Ghibli for artistic inspiration
- The React and open-source community
- OpenAI and ElevenLabs for AI capabilities
- All contributors and beta testers

---

*"The ocean holds many stories, and Old Tom knows them all."* 🌊