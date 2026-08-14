import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { fileURLToPath, URL } from "node:url";
const path = (value)=>fileURLToPath(new URL(value, import.meta.url));

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      ".trycloudflare.com"
    ]
  },

  plugins: [react()],

  resolve: {
    alias:{
      "@src": path("./src"),
      "@assets": path("./src/assets"),
      "@components": path("./src/components"),
      "@templates": path("./src/templates"),
      "@error": path("./src/error"),
      "@utils": path("./src/utils"),
      "@guard": path("./src/guard"),
    }
  },

  define : {
    global: "window",
  }
})