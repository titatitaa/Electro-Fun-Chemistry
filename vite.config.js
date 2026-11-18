import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const firebaseCompatPath = path.resolve(__dirname, 'src/firebase.js')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'firebase/app': firebaseCompatPath,
      'firebase/auth': firebaseCompatPath,
      'firebase/firestore': firebaseCompatPath,
      'firebase': firebaseCompatPath,
    },
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:3001',
    },
  },
})
