// vite.config.js - Enhanced version
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // Enable HMR by default for development
    hmr: {
      port: 5173,
      host: 'localhost',
    },
    // If you still have WebSocket issues, try this:
    // hmr: false  // This will disable hot reload but might fix connection issues
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      // Optional: Add path aliases if needed
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-redux'],
    // Force pre-bundling of these dependencies
    force: true,
  },
  // Clear cache on build
  build: {
    rollupOptions: {
      external: [],
    },
  },
  // Optional: Define global variables if needed
  define: {
    'process.env': {},
  },
})