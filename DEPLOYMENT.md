# 🚀 Deployment Guide for Old Tom: The Living Legend

## Quick Start

1. **Set up remote repository:**
```bash
# For GitHub:
git remote add origin https://github.com/yourusername/old-tom-living-legend.git

# For GitLab:
git remote add origin https://gitlab.com/yourusername/old-tom-living-legend.git

# For Bitbucket:
git remote add origin https://bitbucket.org/yourusername/old-tom-living-legend.git
```

2. **Push to remote:**
```bash
git push -u origin main
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
# Add your API keys to .env.local
```

4. **Install and run:**
```bash
npm install
npm start
```

## Production Deployment

### Option 1: Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard
5. Enable automatic deployments

### Option 2: Vercel
1. Connect repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Add environment variables in Vercel dashboard

### Option 3: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Option 4: AWS S3 + CloudFront
1. Build the app: `npm run build`
2. Upload build folder to S3 bucket
3. Configure CloudFront distribution
4. Set up Route 53 for custom domain

## Environment Variables

Required for production:
- `REACT_APP_OPENAI_API_KEY` - OpenAI API key for character AI

Optional:
- `REACT_APP_OPENAI_BASE_URL` - Custom OpenAI endpoint
- Performance and feature flags (see .env.example)

## Performance Optimization

The app includes:
- ✅ Service Worker for offline caching
- ✅ Code splitting for animation libraries
- ✅ Progressive image loading
- ✅ Adaptive quality based on device performance
- ✅ Bundle analysis with `npm run analyze`

## Security Considerations

- API keys are client-side (consider proxy server for production)
- Content Security Policy recommended
- HTTPS required for PWA features
- Consider rate limiting for API endpoints

## Monitoring

Built-in performance monitoring tracks:
- FPS and memory usage
- Asset loading times
- User interaction delays
- Network latency

Consider integrating:
- Sentry for error tracking
- Google Analytics for usage metrics
- Web Vitals monitoring

## Next Steps

1. Set up continuous deployment
2. Configure custom domain
3. Add analytics and error tracking
4. Optimize for Core Web Vitals
5. Add E2E testing with Playwright/Cypress