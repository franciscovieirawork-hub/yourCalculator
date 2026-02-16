import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
      },
    },
  },
  // Para produção, usar variável de ambiente ou URL absoluta
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || ''),
  },
});
