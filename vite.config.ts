import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Frontend builds to /dist, which Cloudflare Pages serves as static assets.
// API requests (/api/*) are handled by Pages Functions in /functions.
export default defineConfig({
  plugins: [react()],
  server: {
    // Bind IPv4 explicitly — avoids localhost resolving to ::1 while Vite listens elsewhere.
    host: "127.0.0.1",
    port: 5173,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
