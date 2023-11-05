import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: null,
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import '../src/assets/styles/styles.scss';
        `,
      },
    },
  },
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // todo: remove this and add .vue to the end of all vue files imports
    extensions: [".js", ".json", ".vue"],
  },
});
