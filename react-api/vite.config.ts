import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // 配置别名
    alias: {
      "@": path.resolve("./src"),
    },
  },
})
