/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { contentPlugin } from './tools/content-plugin.ts'

export default defineConfig({
  plugins: [
    react(),
    contentPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Restore',
        short_name: 'Restore',
        lang: 'sv',
        description: 'Vetenskaplig utbildning om kroppens reglersystem, belastning och återhämtning.',
        display: 'standalone',
        start_url: '/',
        background_color: '#FFFFFF',
        theme_color: '#FFFFFF',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,png,svg,json,woff2}'], navigateFallback: 'index.html' },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/unit/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    globals: true,
  },
})
