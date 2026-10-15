import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import type { Mode } from "../data/types";
import { useIsWide, useReducedMotion } from "../hooks/useMedia";
import { Backdrop, ForegroundPlant } from "./Backdrop";
import { SceneFallback } from "./SceneFallback";

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
}

export function SceneStage({ selected, onSelect }: Props) {
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
