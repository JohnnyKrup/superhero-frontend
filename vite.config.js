import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // URL of Spring Boot backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true, // Enables global functions like describe, test, expect
    environment: "jsdom", // Simulates a browser-like environment
    setupFiles: "./src/__tests__/setupTests.js", // Custom setup file
  },
});
