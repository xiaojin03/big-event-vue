import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        // 获取路径中包含"/api"的请求
        target: "http://localhost:8080", // 目标服务器地址
        changeOrigin: true, // 修改源
        rewrite: (path) => path.replace(/^\/api/, ""), // 将路径中的"/api"去掉
      },
    },
  },
});
