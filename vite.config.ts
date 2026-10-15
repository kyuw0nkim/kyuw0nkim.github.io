import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      // Two independent pages: the academic site (/) and the portfolio (/portfolio/).
      // The portfolio is not linked from the academic site's navigation.
      input: {
        main: path.resolve(__dirname, "index.html"),
        portfolio: path.resolve(__dirname, "portfolio/index.html"),
      },
    },
  },
}));
