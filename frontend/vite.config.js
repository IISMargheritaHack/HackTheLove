import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    host: '0.0.0.0',
    port: 4000,
    strictPort: true,
    allowedHosts: 'all',
  },
  server: {
    host: '0.0.0.0',
    port: 4000,
    strictPort: true,
    allowedHosts: 'all',
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    base: '/',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@fonts': path.resolve(__dirname, 'src/assets/fonts'),
      '@api': path.resolve(__dirname, 'src/api/'),
      '@provider': path.resolve(__dirname, 'src/provider'),
      '@config': path.resolve(__dirname, 'src/config.js'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  define: {
    'import.meta.env.MODE': 'production',
    'import.meta.env.PROD': 'true',
  },
})
