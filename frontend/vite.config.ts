import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANTE: "base" precisa ser "/nome-do-repositorio/" no GitHub Pages.
// Ajuste abaixo se o nome do seu repositório no GitHub for diferente de "p1-eduardo".
export default defineConfig({
  plugins: [react()],
  base: "/p1-eduardo/",
  server: { port: 5173 },
});
