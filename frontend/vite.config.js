import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import liveReload from 'vite-plugin-live-reload'

export default defineConfig({
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
      usePolling: true, // Needed for WSL2 filesystem watching
      interval: 1000    // Poll every second
    }
  }
})
