import { defineConfig } from "vite";

// Configuración base para el proyecto modular
export default defineConfig({
  root: ".",
  publicDir: "public",
  server: {
    open: true, // abre el navegador automáticamente
    port: 5173, // puerto local
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
