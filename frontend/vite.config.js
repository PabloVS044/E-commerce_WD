import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const apiProxyTarget = process.env.VITE_API_PROXY_TARGET || 'http://localhost:3000';
const frontendHost = process.env.FRONTEND_HOST || '0.0.0.0';
const frontendPort = Number(process.env.FRONTEND_PORT || 5173);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: frontendHost,
    port: frontendPort,
    strictPort: true,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
      }
    }
  }
});
