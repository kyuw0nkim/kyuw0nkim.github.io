import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/portfolio.css";

const root = createRoot(document.getElementById("root")!);

// Dev-only hero scene editor: /portfolio/?editor on `npm run dev`.
// `import.meta.env.DEV` is false in production builds, so the editor is never bundled.
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has("editor")) {
  import("./hero2d/editor/EditorApp").then(({ default: EditorApp }) => root.render(<EditorApp />));
} else {
  root.render(<App />);
}
