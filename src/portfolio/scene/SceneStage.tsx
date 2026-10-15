import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import type { Mode } from "../data/types";
import { useCanHover, useIsWide, useReducedMotion } from "../hooks/useMedia";
import { setHover, usePortfolioStore } from "../hooks/usePortfolioState";
import { HeroScene } from "../hero2d/HeroScene";
import { Backdrop, ForegroundPlant } from "./Backdrop";
import { SceneFallback } from "./SceneFallback";

/**
 * Which hero renderer to use. The layered 2.5D scene (transparent PNGs) replaces
 * the real-time 3D scene; `?scene=3d` brings the legacy 3D scene back while the
 * migration is in progress.
 */
type HeroRenderer = "2.5d" | "3d";
const DEFAULT_RENDERER: HeroRenderer = "2.5d";

function pickRenderer(): HeroRenderer {
  const requested = new URLSearchParams(window.location.search).get("scene");
  return requested === "3d" || requested === "2.5d" ? requested : DEFAULT_RENDERER;
}

// three.js is only downloaded when the scene is actually shown.
const Scene3D = lazy(() => import("./Scene3D"));

/**
 * Use the 3D scene only with hardware-accelerated WebGL. Software renderers
 * (SwiftShader, llvmpipe…) would make the whole page stutter.
 * `?no3d` forces the 2D scene, `?3d` forces 3D (handy for testing).
 */
function canRender3D(): boolean {
  const params = new URLSearchParams(window.location.search);
  if (params.has("no3d")) return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    if (params.has("3d")) return true;
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

class SceneErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("3D scene failed, showing the simplified scene instead.", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface Props {
  selected: Mode | null;
  onSelect: (mode: Mode) => void;
  /** Back to the Hero shot (intro). */
  onReset?: () => void;
}

export function SceneStage(props: Props) {
  const [renderer] = useState(pickRenderer);
  return renderer === "3d" ? <Stage3D {...props} /> : <Stage25D {...props} />;
}

/**
 * Layered 2.5D hero. The route decides the camera shot (Hero / Tracing /
 * Shaping); hovering previews a theme (headline + glow); clicking a character
 * opens Tracing, the table or laptop opens Shaping. Escape returns to Hero.
 */
function Stage25D({ selected, onSelect, onReset }: Props) {
  const reduced = useReducedMotion();
  const finePointer = useCanHover();
  const isWide = useIsWide();
  const hover = usePortfolioStore((s) => s.hover);
  const hoverObject = usePortfolioStore((s) => s.hoverObject);

  useEffect(() => {
    if (!selected || !onReset) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key !== "Escape" || (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      onReset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, onReset]);

  return (
    <section className="stage" data-renderer="2.5d" data-selected={selected ?? undefined} aria-labelledby="stage-title" aria-describedby="stage-desc">
      <h2 id="stage-title" className="sr-only">
        Illustration: four soft characters sitting around a round table with a laptop, in a sunlit room
      </h2>
      <p id="stage-desc" className="sr-only">
        Selecting a character opens Tracing; selecting the table or laptop opens Shaping. The same choices are available
        as links in the main content.
      </p>
      <HeroScene
        className="stage__scene"
        shot={selected ?? "hero"}
        parallax={finePointer}
        bleed={isWide}
        interactive
        reducedMotion={reduced}
        highlight={{ selected, hoverMode: hover, hoverGroup: hoverObject }}
        onHoverTarget={(t) => setHover(t?.mode ?? null, t?.group ?? null)}
        onSelectTarget={(t) => onSelect(t.mode)}
      />
      <div className="stage__edge" aria-hidden="true" />
    </section>
  );
}

/** Legacy real-time 3D hero (kept as a fallback during the 2.5D migration). */
function Stage3D({ selected, onSelect }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [supported] = useState(canRender3D);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const reduced = useReducedMotion();
  const isWide = useIsWide();
  const use3D = supported && !failed;

  // Stop rendering while the scene is scrolled out of view (small screens).
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.02 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Gentle parallax for the 2D layers (window, plant). The 3D camera has its own.
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    ref.current.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const onPointerLeave = () => {
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
  };

  return (
    <section
      ref={ref}
      className="stage"
      data-renderer="3d"
      data-ready={ready || !use3D || undefined}
      data-selected={selected ?? undefined}
      aria-labelledby="stage-title"
      aria-describedby="stage-desc"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <h2 id="stage-title" className="sr-only">
        Interactive scene
      </h2>
      <p id="stage-desc" className="sr-only">
        Four soft characters sit around a round table with a laptop. Selecting a character opens Tracing; selecting the
        table or laptop opens Shaping. The same choices are available as links in the main content.
      </p>

      <Backdrop />

      {use3D ? (
        <div className="stage__canvas" aria-hidden="true">
          <SceneErrorBoundary onError={() => setFailed(true)}>
            <Suspense fallback={null}>
              <Scene3D
                selected={selected}
                onSelect={onSelect}
                reduced={reduced}
                quality={isWide ? "high" : "low"}
                active={onScreen}
                onReady={() => setReady(true)}
                onTooSlow={() => setFailed(true)}
              />
            </Suspense>
          </SceneErrorBoundary>
        </div>
      ) : (
        <SceneFallback selected={selected} onSelect={onSelect} />
      )}

      <ForegroundPlant />

      {!use3D && <p className="stage__note">Simplified 2D view — 3D isn’t available on this device.</p>}
    </section>
  );
}
