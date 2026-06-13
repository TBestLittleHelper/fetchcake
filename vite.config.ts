import { defineConfig } from 'vite'

export default defineConfig({
  base: '/fetchcake/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
