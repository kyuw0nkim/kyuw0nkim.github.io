import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { SceneLayer } from "./SceneLayer";
import { byZ, fitScene, layerSrc, sceneLayout } from "./sceneConfig";
import type { Fit, SceneLayout } from "./sceneConfig";

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

interface Props {
  layout?: SceneLayout;
  /** "cover" for the website stage, "contain" for the editor. */
  fit?: "cover" | "contain";
  padding?: number;
  /** Rendered inside the scene's coordinate system (logical px), above the layers. */
  children?: ReactNode;
  /** Replaces the automatic fit (the editor's zoomable viewport). */
  fitOverride?: Fit;
  /** Reports the current logical→CSS mapping. */
  onFit?: (fit: Fit) => void;
  /** Called once every layer has loaded (or failed). */
  onReady?: () => void;
  className?: string;
}

/**
 * The layered 2.5D hero: transparent PNGs positioned in the 1448×1086 logical
 * space from scene-layout.json, scaled as one group to the stage.
 * Static for now — parallax, virtual camera and selection come in the next phase.
 */
export function HeroScene({
  layout = sceneLayout,
  fit: mode = "cover",
  padding = 0,
  fitOverride,
  children,
  onFit,
  onReady,
  className = "",
}: Props) {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const layers = useMemo(() => byZ(layout.layers), [layout.layers]);
  const autoFit = useMemo(() => fitScene(layout, size.width, size.height, mode, padding), [layout, size, mode, padding]);
  const fit = fitOverride ?? autoFit;

  useEffect(() => onFit?.(fit), [fit, onFit]);

  // Reveal the scene once all layers are in, so it never assembles piece by piece.
  const settled = useRef(new Set<string>());
  const [ready, setReady] = useState(false);
  const onSettled = useCallback(
    (id: string) => {
      settled.current.add(id);
      if (settled.current.size >= layers.length && !ready) {
        setReady(true);
        onReady?.();
      }
    },
    [layers.length, onReady, ready],
  );
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 6000); // never stay hidden on a slow network
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div ref={ref} className={`hero-scene ${className}`.trim()} data-ready={ready || undefined}>
      <div
        className="hero-scene__world"
        style={{
          width: layout.baseSize.width,
          height: layout.baseSize.height,
          transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.scale})`,
        }}
      >
        {layers.map((layer) => (
          <SceneLayer key={layer.id} layer={layer} src={layerSrc(layout, layer)} onSettled={onSettled} />
        ))}
        {children}
      </div>
    </div>
  );
}
