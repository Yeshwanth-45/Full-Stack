import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.biterush.app',
  appName: 'BiteRush',
  webDir: 'build',
  server: {
    // Point to your backend API server (update with your actual IP/domain)
    // url: 'http://10.0.2.2:8080', // Android emulator localhost alias
    androidScheme: 'https',
    cleartext: true, // Allow HTTP for development
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#667eea',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#667eea',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
  android: {
    allowMixedContent: true, // Allow HTTP + HTTPS during development
    backgroundColor: '#667eea',
  },
};

export default config;
