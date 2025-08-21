// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],     // no VitePWA
  server: {
    host: true,
    port: 5173,
    // hmr: true,          // (default) keep if you want hot reload
    // hmr: false          // uncomment to disable websocket/HMR
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  }
})
