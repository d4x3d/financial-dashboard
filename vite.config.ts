import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    copyPublicDir: true,
    rollupOptions: {
      external: [
        'convex/values',
        'convex/server',
        'convex/_generated/server',
        'convex/_generated/api'
      ]
    }
  }
})
