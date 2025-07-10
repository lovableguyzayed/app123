import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.retro.calculator',
  appName: 'Retro Calculator',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0a0a1a",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: "#0a0a1a"
    }
  }
};

export default config;