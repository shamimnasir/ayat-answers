import type { CapacitorConfig } from "@capacitor/cli";

// Same package name as the published Play app, so this ships as an update to it.
const config: CapacitorConfig = {
  appId: "procreators.io.alquran",
  appName: "Al Quran",
  webDir: "dist-app",
  backgroundColor: "#0c1a0f",
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SystemBars: { insetsHandling: "css", initialViewportFitValueHint: "cover" },
  },
};

export default config;
