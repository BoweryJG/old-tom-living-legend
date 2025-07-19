const { override, addWebpackAlias, addWebpackPlugin } = require('customize-cra');
const { GenerateSW } = require('workbox-webpack-plugin');
const path = require('path');

module.exports = override(
  // Add path aliases
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
    '@/components': path.resolve(__dirname, 'src/components'),
    '@/pages': path.resolve(__dirname, 'src/pages'),
    '@/hooks': path.resolve(__dirname, 'src/hooks'),
    '@/store': path.resolve(__dirname, 'src/store'),
    '@/services': path.resolve(__dirname, 'src/services'),
    '@/utils': path.resolve(__dirname, 'src/utils'),
    '@/assets': path.resolve(__dirname, 'src/assets'),
    '@/styles': path.resolve(__dirname, 'src/styles'),
    '@/types': path.resolve(__dirname, 'src/types'),
  }),

  // Add Service Worker for PWA
  addWebpackPlugin(
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB for 4K assets
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        {
          urlPattern: /\.(?:json)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'lottie-animations',
          },
        },
        {
          urlPattern: /\.(?:mp3|wav|ogg)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'audio',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
            },
          },
        },
      ],
    })
  ),

  // Custom webpack config for performance optimization
  (config) => {
    // Enable code splitting for animations and 3D libraries
    if (!config.optimization.splitChunks) {
      config.optimization.splitChunks = {};
    }
    if (!config.optimization.splitChunks.cacheGroups) {
      config.optimization.splitChunks.cacheGroups = {};
    }
    
    config.optimization.splitChunks = {
      ...config.optimization.splitChunks,
      cacheGroups: {
        ...config.optimization.splitChunks.cacheGroups,
        animations: {
          test: /[\\/]node_modules[\\/](lottie-react|@react-spring|framer-motion)[\\/]/,
          name: 'animations',
          chunks: 'all',
          priority: 30,
        },
        three: {
          test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
          name: 'three',
          chunks: 'all',
          priority: 20,
        },
        mui: {
          test: /[\\/]node_modules[\\/](@mui)[\\/]/,
          name: 'mui',
          chunks: 'all',
          priority: 10,
        },
      },
    };

    return config;
  }
);