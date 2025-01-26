import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@assets': '/src/assets',
      '@icons': '/src/assets/icons',
      '@images': '/src/assets/images',
      '@pages': '/src/pages',
      '@fonts': '/src/assets/fonts',
    },
  },
});
