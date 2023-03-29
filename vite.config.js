import { defineConfig } from "vite";
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        app: "./index.html",
      },
    },
  },
  server: {
    open: "/index.html",
  },
});
