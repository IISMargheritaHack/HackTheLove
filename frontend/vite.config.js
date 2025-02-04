import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   allowedHosts: true,
  // },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    "alias": {
      '@components': '/src/components',
      '@assets': '/src/assets',
      '@icons': '/src/assets/icons',
      '@images': '/src/assets/images',
      '@pages': '/src/pages',
      '@fonts': '/src/assets/fonts',
      '@api': '/src/api/',
      '@provider': '/src/provider'
    }
  },

})
