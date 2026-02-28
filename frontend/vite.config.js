import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  envDir: '../', // Look for .env in root directory
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@mui/utils']
        }
      }
    }
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
