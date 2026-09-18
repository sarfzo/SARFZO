import { defineConfig } from 'vite';

// Vite configuration for Sarfzo website
export default defineConfig({
  root: './',
  publicDir: 'assets',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        zoLight: './zo-light.html',
        mirrorClock: './mirror-clock.html',
      },
    },
  },
});
