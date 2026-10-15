import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

/**
 * Dev-server only: lets the portfolio's hero scene editor (/portfolio/?editor)
 * write its calibrated layout back to src/portfolio/hero2d/scene-layout.json.
 * Not part of production builds.
 */
function heroLayoutSave(): Plugin {
  const target = path.resolve(__dirname, "src/portfolio/hero2d/scene-layout.json");
  const isNum = (v: unknown) => typeof v === "number" && Number.isFinite(v);
  return {
    name: "hero-layout-save",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__hero-layout", (req, res) => {
        // The custom header forces a CORS preflight, so other sites can't post here.
        if (req.method !== "POST" || req.headers["x-hero-editor"] !== "1") {
          res.statusCode = 405;
          res.end("Method not allowed");
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
          if (body.length > 1_000_000) req.destroy();
        });
        req.on("end", () => {
          try {
            const layout = JSON.parse(body);
            const ok =
              layout?.version === 1 &&
              Array.isArray(layout.layers) &&
              layout.layers.every(
                (l: Record<string, unknown>) =>
                  typeof l.id === "string" &&
                  typeof l.file === "string" &&
                  ["x", "y", "scale", "rotation", "z", "opacity", "width", "height"].every((k) => isNum(l[k])),
              );
            if (!ok) throw new Error("not a valid scene layout");
            fs.writeFileSync(target, `${JSON.stringify(layout, null, 2)}\n`);
            res.end("saved");
          } catch (err) {
            res.statusCode = 400;
            res.end(err instanceof Error ? err.message : "invalid");
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger(), heroLayoutSave()].filter(Boolean),
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
