import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// "app" builds the copy bundled into the Android app, served from the APK at "/".
// The website lives on the GitHub Pages project path.
export default defineConfig(({ mode }) => ({
  base: mode === "app" ? "/" : process.env.GITHUB_ACTIONS ? "/ayat-answers/" : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  build: mode === "app"
    ? { outDir: "dist-app", rollupOptions: { input: path.resolve(__dirname, "index.source.html") } }
    : {},
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
