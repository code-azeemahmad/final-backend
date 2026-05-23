import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  plugins: [react()],
})

// add proxy to avoid cors issues
// append + server assumes that the url request is originated from this url 'http://localhost:3000'
// req coming from same server
