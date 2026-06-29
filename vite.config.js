import { defineConfig } from 'vite'; // C'EST CETTE LIGNE QUI MANQUE SUREMENT
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://portfolio-backend-7xj4.onrender.com',
        changeOrigin: true,
        secure: false, // Utile si Render a des soucis de certificat
      }
    }
  }
});