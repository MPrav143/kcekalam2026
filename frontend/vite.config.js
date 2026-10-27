import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production'
    ? (process.env.VITE_BASE_PATH || '/')
    : '/',
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: ['**/*.tmp', '**/*.~tmp', '**/*.swp', '**/.~*']
    }
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Precise Core React bundle (avoids pulling unneeded react-* utilities into core chunk)
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router/') || id.includes('/react-router-dom/')) {
              return 'vendor-react';
            }
            // Admin-only heavy libraries
            if (id.includes('xlsx') || id.includes('jspdf') || id.includes('json2csv')) {
              return 'vendor-export';
            }
            // Admin Dashboard Charts
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            // Icons
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            // Motion animation
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // HTTP client
            if (id.includes('axios')) {
              return 'vendor-axios';
            }
          }
        }
      }
    }
  }
})
