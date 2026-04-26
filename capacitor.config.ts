import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.degg.joj2026",
  appName: "DÉGG",
  webDir: 'out',
  // For production: point to your deployed URL (Vercel, etc.)
  // The web server handles the DeepL API routes — no static export needed
  server: {
    url: "http://10.0.2.2:3000", // Android emulator → localhost
    cleartext: true,
    androidScheme: "http",
  },
  android: {
    backgroundColor: "#0a2a16",
  },
  ios: {
    backgroundColor: "#0a2a16",
    preferredContentMode: "mobile",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#0a2a16",
      showSpinnerOnFirstRun: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0a2a16",
    },
  },
};

export default config;
