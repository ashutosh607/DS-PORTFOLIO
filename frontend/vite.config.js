import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

function nonBlockingCss() {
  return {
    name: 'non-blocking-css',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        '<link rel="preload" as="style" href="$1">\n  <link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media=\'all\'">\n  <noscript><link rel="stylesheet" href="$1"></noscript>'
      );
    },
  };
}

// https://vite.dev/config/ - Google Maps enabled
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    nonBlockingCss()
  ],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/categories': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');
          if (
            normalized.includes('/node_modules/react/') ||
            normalized.includes('/node_modules/react-dom/') ||
            normalized.includes('/node_modules/react-router/') ||
            normalized.includes('/node_modules/react-router-dom/') ||
            normalized.includes('/node_modules/scheduler/')
          ) {
            return 'vendor-react';
          }
          if (
            normalized.includes('/node_modules/framer-motion/') ||
            normalized.includes('/node_modules/motion-dom/') ||
            normalized.includes('/node_modules/motion-utils/')
          ) {
            return 'vendor-motion';
          }
          if (normalized.includes('/node_modules/lenis/')) {
            return 'vendor-lenis';
          }
        },
      },
    },
  },
})
