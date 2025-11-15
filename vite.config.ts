import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },

  // Important for Web Workers (video processing, rendering, etc.)
  worker: {
    format: "es",
  },

  // Prevent Vite from trying to pre-bundle worker files
  optimizeDeps: {
    exclude: [
      "worker.js",
      "videoWorker.js",
      "@ffmpeg/ffmpeg",
      "@ffmpeg/util"
    ],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
