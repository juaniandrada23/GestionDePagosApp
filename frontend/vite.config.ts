import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const isDocker = !!process.env.DOCKER_ENV;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: !isDocker,
    host: isDocker ? '0.0.0.0' : undefined,
    hmr: isDocker ? {
      host: 'localhost',
      port: 3000,
      clientPort: 3000,
    } : undefined,
    proxy: {
      '/api': {
        target: process.env.PROXY_BACKEND || 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/storage': {
        target: process.env.PROXY_MINIO || 'http://localhost:9000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/storage/, ''),
      },
    },
    watch: isDocker ? { usePolling: true, interval: 300 } : undefined,
  },
  build: {
    outDir: 'build',
  },
});
