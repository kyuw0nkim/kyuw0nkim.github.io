import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { SceneLayer } from "./SceneLayer";
import type { Highlight } from "./SceneLayer";
import { byZ, cameraFit, fitScene, layerSrc, sceneLayout } from "./sceneConfig";
import type { Fit, SceneLayerConfig, SceneLayout, Shot } from "./sceneConfig";
import { CAMERA, PARALLAX_DEPTH } from "./sceneMotion";
import { useParallax } from "./useParallax";
import { useSceneInteraction } from "./useSceneInteraction";
import type { SceneTarget } from "./useSceneInteraction";

/**
 * Size of the element (or of its parent when `useParent`), plus a ref to the
 * measured element. With bleed, the scene root is wider than the stage it sits
 * in, but framing and pointer maths still follow the stage.
 */
function useElementSize<T extends HTMLElement>(useParent: boolean) {
  const ref = useRef<T>(null);
  const measured = useRef<HTMLElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const el = useParent ? (ref.current?.parentElement ?? null) : ref.current;
    measured.current = el;
    if (!el) return;
    const measure = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [useParent]);
  return [ref, size, measured] as const;
}

/**
 * Layers that may continue behind the page content when the scene bleeds:
 * the room and the view through its window. Everything else stays in the stage.
 */
const BACKDROP_GROUPS = new Set(["exterior-far", "exterior-near", "room"]);

/** What should glow: the selected theme's objects, and every object of the hovered theme. */
export interface SceneHighlight {
  selected: "tracing" | "shaping" | null;
  hoverMode: "tracing" | "shaping" | null;
}

interface Props {
  layout?: SceneLayout;
  /** "cover" for the website stage, "contain" for the editor. */
  fit?: "cover" | "contain";
  padding?: number;
  /** Virtual camera shot (website). */
  shot?: Shot;
  /** Replaces the automatic fit (the editor's zoomable viewport). */
  fitOverride?: Fit;
  /** Pointer parallax (desktop pointers only). */
  parallax?: boolean;
  /**
   * Let the room continue to the right, behind the page content (desktop
   * split layout). Characters and furniture stay inside the stage.
   */
  bleed?: boolean;
  /** Clickable characters / table / laptop. */
  interactive?: boolean;
  /** No camera transitions or parallax. */
  reducedMotion?: boolean;
  highlight?: SceneHighlight;
  onHoverTarget?: (target: SceneTarget | null) => void;
  onSelectTarget?: (target: SceneTarget) => void;
  /** Rendered inside the scene's coordinate system (logical px), above the layers. */
  children?: ReactNode;
  onFit?: (fit: Fit) => void;
  /** Called once every layer has loaded (or failed). */
  onReady?: () => void;
  className?: string;
}

function highlightFor(layer: SceneLayerConfig, h?: SceneHighlight): Highlight {
  if (!h || !layer.interaction) return null;
  if (h.selected === layer.interaction) return "selected";
  if (h.hoverMode === layer.interaction) return "hover";
  return null;
}

const noop = () => undefined;

/**
 * The layered 2.5D hero: transparent PNGs positioned in the 1448×1086 logical
 * space from scene-layout.json, scaled as one group to the stage, with a
 * virtual camera (translate + scale), depth parallax, pixel-accurate picking
 * and a soft glow on the selected/hovered objects.
 */
export function HeroScene({
  layout = sceneLayout,
  fit: mode = "cover",
  padding = 0,
  shot = "hero",
  fitOverride,
  parallax = false,
  bleed = false,
  interactive = false,
  reducedMotion = false,
  highlight,
  onHoverTarget = noop,
  onSelectTarget = noop,
  children,
  onFit,
  onReady,
  className = "",
}: Props) {
  const [ref, size, stageRef] = useElementSize<HTMLDivElement>(bleed);
  const worldRef = useRef<HTMLDivElement>(null);
  const layers = useMemo(() => byZ(layout.layers), [layout.layers]);
  const [backLayers, frontLayers] = useMemo(
    () => (bleed ? [layers.filter((l) => BACKDROP_GROUPS.has(l.group)), layers.filter((l) => !BACKDROP_GROUPS.has(l.group))] : [[], layers]),
    [bleed, layers],
  );
  const autoFit = useMemo(
    () =>
      mode === "contain"
        ? fitScene(layout, size.width, size.height, "contain", padding)
        : cameraFit(layout, size.width, size.height, shot, CAMERA.maxZoom),
    [layout, size, mode, padding, shot],
  );
  const fit = fitOverride ?? autoFit;
  useEffect(() => onFit?.(fit), [fit, onFit]);
  // Tall, narrow stages: keeping the hero framing whole leaves the room short of
  // the top edge (see fitScene). Mark it so the room can fade out there.
  const gapTop = mode === "cover" && fitScene(layout, size.width, size.height, "cover").y > 0.5;

  // Animate camera moves only after the first real measurement (no zoom-in on load).
  const [cameraLive, setCameraLive] = useState(false);
  useEffect(() => {
    if (size.width === 0 || cameraLive) return;
    const id = requestAnimationFrame(() => setCameraLive(true));
    return () => cancelAnimationFrame(id);
  }, [size.width, cameraLive]);

  // Low-power fallback: if the device can't keep parallax smooth, drop the
  // continuous motion (parallax, animated camera) and keep everything else.
  const [lowPower, setLowPower] = useState(false);
  const parallaxOn = parallax && !reducedMotion && !lowPower;
  const parallaxState = useParallax(ref, stageRef, parallaxOn, () => setLowPower(true));
  useSceneInteraction({
    layout,
    enabled: interactive,
    rootRef: ref,
    worldRef,
    parallaxRef: parallaxState,
    parallaxOn,
    onHover: onHoverTarget,
    onSelect: onSelectTarget,
  });

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

  const animate = cameraLive && !reducedMotion && !fitOverride && !lowPower;
  const worldStyle: CSSProperties = {
    width: layout.baseSize.width,
    height: layout.baseSize.height,
    transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.scale})`,
    transition: animate ? `transform ${CAMERA.durationMs}ms ${CAMERA.easing}` : "none",
  };

  const renderLayer = (layer: SceneLayerConfig) => (
    <SceneLayer
      key={layer.id}
      layer={layer}
      src={layerSrc(layout, layer)}
      depth={parallaxOn ? (PARALLAX_DEPTH[layer.group] ?? 0) : 0}
      highlight={highlightFor(layer, highlight)}
      onSettled={onSettled}
    />
  );

  return (
    <div
      ref={ref}
      className={`hero-scene${bleed ? " hero-scene--bleed" : ""} ${className}`.trim()}
      data-ready={ready || undefined}
      data-gap-top={gapTop || undefined}
      data-shot={shot}
      data-interactive={interactive || undefined}
    >
      {backLayers.length > 0 && (
        <div className="hero-scene__world hero-scene__world--back" style={worldStyle} aria-hidden="true">
          {backLayers.map(renderLayer)}
        </div>
      )}
      <div className="hero-scene__clip">
        <div ref={worldRef} className="hero-scene__world" style={worldStyle}>
          {frontLayers.map(renderLayer)}
          {children}
        </div>
      </div>
    </div>
  );
}
