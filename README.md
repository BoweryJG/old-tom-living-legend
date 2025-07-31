# 🐋 Old Tom: The Living Legend

*A Studio Ghibli-inspired interactive children's application bringing the legendary orca Old Tom to life through AI, animation, and immersive storytelling.*

![Old Tom Banner](https://img.shields.io/badge/Old%20Tom-Living%20Legend-blue?style=for-the-badge&logo=whale)
![Studio Ghibli Style](https://img.shields.io/badge/Style-Studio%20Ghibli-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react)
![AI Powered](https://img.shields.io/badge/AI-Powered-ff6b6b?style=for-the-badge)

## 🌊 The True Legend of Old Tom

In the waters off Eden, Australia (1860s-1930), a remarkable partnership existed between orcas and whalers. Old Tom, the leader of a pod of killer whales, worked alongside the Davidson family in what was known as the "Law of the Tongue" - guiding whalers to baleen whales in exchange for the choicest portions of the catch.

This application brings that incredible true story to life through interactive AI conversations, immersive 3D environments, and Studio Ghibli-inspired magic.

## ✨ Features

### 🎭 AI-Powered Conversations
- **Talk with Old Tom**: Click to hear his deep, wise voice powered by Higgs Audio
- **Interactive Chat**: Full conversation system with contextual responses about the Davidson partnership
- **Voice Responses**: Every message from Old Tom can be heard with authentic whale vocalizations
- **Educational Content**: Learn about maritime history through engaging storytelling

### 🌊 Living Ocean World
- **3D Particle Systems**: 2,000+ animated marine particles floating through the scene
- **Whale Song Visualizations**: Golden particle emanations representing Old Tom's communications
- **Animated Ocean Surface**: Realistic wave physics with gentle tidal movements
- **Underwater Forest**: Swaying kelp strands creating depth and atmosphere

### 🐋 Character Animations
- **Breathing Animations**: Natural respiratory movements and eye blinking
- **Swimming Motions**: Fluid tail and body movements with Framer Motion
- **Speaking Gestures**: Animated speech bubbles and character responses
- **Greeting Behaviors**: Welcome animations when users interact

### 🎼 Orchestral Music System
- **5 Atmospheric Moods**: Peaceful, Mysterious, Adventurous, Nostalgic, Dramatic
- **Layered Audio Mixing**: Multiple orchestral tracks blend based on current mood
- **Adaptive Soundscapes**: Music changes dynamically with story progression
- **Studio Ghibli Style**: Orchestral arrangements inspired by Joe Hisaishi

### ⚓ Authentic Maritime Design
- **Historical Typography**: Antique fonts (Cinzel Decorative, Cinzel, Crimson Text)
- **Period Color Palette**: Deep ocean blues, antique brass, maritime gold
- **Animated Elements**: Swaying anchors, flowing maritime decorations
- **19th Century Aesthetics**: Authentic whaling era visual design

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
- **Higgs Audio (Hugging Face)** for text-to-speech and character voices
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
├── components/
│   ├── OldTomCharacter.tsx    # Animated whale character with breathing/swimming
│   ├── OldTomChat.tsx         # AI chat interface with voice integration
│   ├── OceanParticles.tsx     # 3D ocean environment with marine particles
│   └── OrchestraManager.tsx   # Music system and atmospheric mood control
├── services/
│   └── higgsAudioService.ts   # Voice synthesis service with character profiles
├── App.tsx                    # Main application with theme and routing
└── index.tsx                  # Application entry point
```

## 🎮 How to Experience Old Tom

### Getting Started
1. **Meet Old Tom**: Click "Talk to Old Tom" to hear his deep voice introduction
2. **Start Conversations**: Use the chat buttons to begin interactive conversations
3. **Explore Ocean**: Watch 2,000+ marine particles float in the 3D environment
4. **Control Atmosphere**: Hover over music control (bottom-left) to change moods

### Interactive Elements
- **Voice Conversations**: Old Tom responds with contextual stories about whaling history
- **Character Animation**: Watch Old Tom breathe, swim, and react to conversations
- **Ocean Environment**: Observe whale song visualizations and floating kelp
- **Adaptive Music**: Experience how orchestral moods change with interactions

### Educational Features
- **Historical Accuracy**: Learn about the real Old Tom and Davidson family partnership
- **Marine Biology**: Understand orca behavior and ocean ecosystems
- **Cultural Heritage**: Explore Australian maritime history and whaling traditions
- **Conservation**: Discover the importance of protecting marine environments

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
- OpenAI and Higgs Audio for AI capabilities
- All contributors and beta testers

---

## 🐋 The Legacy Lives On

The historical Old Tom was a real orca who lived from approximately 1895 to 1930. His skeleton is now displayed in the Eden Killer Whale Museum in Eden, New South Wales, Australia. The partnership between his pod and the Davidson whalers represents one of the most remarkable examples of interspecies cooperation in recorded history.

This application honors that legacy by:
- **Preserving History**: Keeping the Old Tom story alive for new generations
- **Educational Impact**: Teaching children about marine conservation and history
- **Technological Innovation**: Using AI and animation to create immersive learning
- **Cultural Appreciation**: Celebrating Australian maritime heritage

*"In the deep waters off Eden Bay, legends never die - they live on in the songs of the sea and the memories of those who dare to listen."* 🌊

**Built with ❤️ and Studio Ghibli magic** 
🐋 Generated with [Claude Code](https://claude.ai/code)