import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true, // Listen on all local IPs
    proxy: {
      '/api': {
        target: 'http://172.21.154.88:8080', // IP laptop để mobile có thể kết nối
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  }
});
