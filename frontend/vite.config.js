import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Allow HMR WebSocket to connect through Docker to the host browser
    hmr: {
      host: 'localhost',
      port: 5173,
    },
    // Required on Windows: Docker volumes don't propagate inotify events,
    // so Vite must poll the filesystem to detect file changes.
    watch: {
      usePolling: true,
      interval: 500,
    },
  },
})
