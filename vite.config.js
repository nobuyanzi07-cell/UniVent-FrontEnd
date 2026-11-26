import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api requests to the Flask dev server so we avoid CORS locally.
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
    // Node 25+ has its own localStorage that hides jsdom's; turn it off in tests.
    execArgv: ["--no-experimental-webstorage"],
  },
});