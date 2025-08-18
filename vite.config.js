import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // auto registers the SW and checks for updates
      registerType: 'autoUpdate',
      // enable in dev if you want to test SW without building:
      // devOptions: { enabled: true },

      manifest: {
        name: 'Rail Web ',
        short_name: 'Rail',
        start_url: '/?source=pwa',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0ea5e9',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },

      workbox: {
        navigateFallback: '/index.html'
      },

      includeAssets: ['robots.txt', 'apple-touch-icon.png']
    })
  ]
})
