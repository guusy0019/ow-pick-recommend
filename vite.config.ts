import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/ow/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(dir, 'src') },
  },
})
