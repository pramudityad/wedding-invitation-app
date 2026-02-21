import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import liveReload from 'vite-plugin-live-reload'

export default defineConfig({
  envDir: '../', // Look for .env in root directory
  plugins: [
    react(),
    liveReload([
      '../**/*.go' // Watch Go files in backend
    ])
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    watch: {
      usePolling: true,
      interval: 1000
    },
    proxy: {
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/protected': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/rsvp': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/guests': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/mark-opened': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/comments': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/health': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/spotify': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
