import { useCallback, useEffect, useMemo, useRef } from "react";
import type { MutableRefObject, RefObject } from "react";
import { alphaAt, loadAlphaMask } from "./hitTest";
import type { AlphaMask } from "./hitTest";
import type { ParallaxState } from "./useParallax";
import { byZ, layerSrc } from "./sceneConfig";
import type { SceneLayerConfig, SceneLayout } from "./sceneConfig";
import { HIT_ALPHA, HOVER_GRACE_MS, PARALLAX_DEPTH, PASS_THROUGH_GROUPS } from "./sceneMotion";

export interface SceneTarget {
  mode: "tracing" | "shaping";
  /** Physical group that was hit, e.g. "character-green", "table", "laptop". */
  group: string;
}

interface Options {
  layout: SceneLayout;
  enabled: boolean;
  /** Element receiving pointer events (the scene root). */
  rootRef: RefObject<HTMLElement>;
  /** The transformed scene world; its live transform is read so picking stays exact mid-transition. */
  worldRef: RefObject<HTMLElement>;
  parallaxRef: RefObject<ParallaxState>;
  parallaxOn: boolean;
  /** True while the camera is moving: hover holds still and is refreshed when it settles. */
  movingRef: MutableRefObject<boolean>;
  onHover: (target: SceneTarget | null) => void;
  onSelect: (target: SceneTarget) => void;
}

/**
 * SceneInteractionController: pixel-accurate picking of the six targets
 * (four characters → Tracing, table and laptop → Shaping).
 *
 * Layers are tested front to back on their alpha masks, so transparent PNG
 * areas never act as invisible click targets. The foreground plant is passed
 * through; any other opaque layer in front (a chair, the stool) blocks the
 * objects behind it, as it does visually.
 *
 * Hover lets go only after a short grace period, so crossing the small gaps
 * between characters doesn't blink the glow. Returns `refresh`, which re-reads
 * what is under a resting pointer (call it after the scene moved).
 */
export function useSceneInteraction({
  layout,
  enabled,
  rootRef,
  worldRef,
  parallaxRef,
  parallaxOn,
  movingRef,
  onHover,
  onSelect,
}: Options): () => void {
  // Only layers at or above the lowest interactive layer can matter.
  const candidates = useMemo(() => {
    const sorted = byZ(layout.layers);
    const minZ = Math.min(...sorted.filter((l) => l.interaction).map((l) => l.z));
    return sorted.filter((l) => l.z >= minZ && !PASS_THROUGH_GROUPS.has(l.group) && !l.file.startsWith("shadows/")).reverse();
  }, [layout.layers]);

  const masks = useRef(new Map<string, AlphaMask>());
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    candidates.forEach((l) => {
      loadAlphaMask(layerSrc(layout, l))
        .then((m) => !cancelled && masks.current.set(l.id, m))
        .catch(() => undefined);
    });
    return () => {
      cancelled = true;
    };
  }, [candidates, enabled, layout]);

  const handlers = useRef({ onHover, onSelect });
  handlers.current = { onHover, onSelect };
  const refreshRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const pick = (clientX: number, clientY: number): SceneTarget | null => {
      const world = worldRef.current;
      if (!world) return null;
      // Current (possibly mid-transition) camera: translate(e, f) scale(a).
      const m = new DOMMatrixReadOnly(getComputedStyle(world).transform);
      if (!m.a) return null;
      const r = root.getBoundingClientRect();
      const x = (clientX - r.left - m.e) / m.a;
      const y = (clientY - r.top - m.f) / m.a;
      const par = parallaxRef.current ?? { x: 0, y: 0 };
      for (const l of candidates) {
        if (!l.visible) continue;
        const m = masks.current.get(l.id);
        if (!m) continue;
        const depth = parallaxOn ? (PARALLAX_DEPTH[l.group] ?? 0) : 0;
        if (alphaAt(l as SceneLayerConfig, m, x + par.x * depth, y + par.y * depth) < HIT_ALPHA) continue;
        return l.interaction ? { mode: l.interaction, group: l.group } : null; // opaque non-target blocks
      }
      return null;
    };

    let hovered: string | null = null;
    let frame = 0;
    let release = 0;
    let lastEvent: PointerEvent | null = null;
    const clear = () => {
      window.clearTimeout(release);
      release = 0;
      if (hovered !== null) {
        hovered = null;
        handlers.current.onHover(null);
      }
    };
    const update = () => {
      frame = 0;
      if (!lastEvent || movingRef.current) return;
      const t = pick(lastEvent.clientX, lastEvent.clientY);
      root.style.cursor = t ? "pointer" : "";
      if (!t) {
        if (hovered !== null && !release) release = window.setTimeout(clear, HOVER_GRACE_MS);
        return;
      }
      window.clearTimeout(release);
      release = 0;
      if (t.group !== hovered) {
        hovered = t.group;
        handlers.current.onHover(t);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    refreshRef.current = schedule;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // touch: tap only, no hover state
      lastEvent = e;
      schedule();
    };
    const onLeave = () => {
      lastEvent = null;
      root.style.cursor = "";
      clear();
    };
    const onClick = (e: MouseEvent) => {
      const t = pick(e.clientX, e.clientY);
      if (t) handlers.current.onSelect(t);
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(release);
      refreshRef.current = () => undefined;
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("click", onClick);
      root.style.cursor = "";
    };
  }, [candidates, enabled, movingRef, parallaxOn, parallaxRef, rootRef, worldRef]);

  return useCallback(() => refreshRef.current(), []);
}
