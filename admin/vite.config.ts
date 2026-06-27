import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Admin SPA (ADR-011). Потребляет общий shared/design-system из корня репо —
// loadPaths = корень, поэтому `@use "shared/design-system/…"` резолвится так же,
// как в web/.
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(import.meta.dirname, "..")],
      },
    },
  },
  server: { port: 5174 },
});
