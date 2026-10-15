import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { PARALLAX } from "./sceneMotion";

/** Current smoothed pointer position, -1…1 on each axis (y already scaled by yFactor). */
export interface ParallaxState {
  x: number;
  y: number;
}

/**
 * ParallaxController: follows the pointer relative to the stage and writes
 * --par-x / --par-y on the scene world. Layers turn those into small,
 * depth-scaled offsets (see SceneLayer). Uses one rAF loop that stops as soon
 * as the motion settles; no React re-renders per frame.
 */
export function useParallax(
  worldRef: RefObject<HTMLElement>,
  stageRef: RefObject<HTMLElement>,
  enabled: boolean,
  /** Called once if frames stay slow while moving (e.g. software compositing). */
  onSlow?: () => void,
): RefObject<ParallaxState> {
  const state = useRef<ParallaxState>({ x: 0, y: 0 });
  const slowCb = useRef(onSlow);
  slowCb.current = onSlow;

  useEffect(() => {
    const world = worldRef.current;
    const stage = stageRef.current;
    if (!world || !stage) return;
    const write = () => {
      world.style.setProperty("--par-x", state.current.x.toFixed(4));
      world.style.setProperty("--par-y", state.current.y.toFixed(4));
    };
    if (!enabled) {
      state.current = { x: 0, y: 0 };
      write();
      return;
    }

    const target = { x: 0, y: 0 };
    let raf = 0;
    let last = 0;
    const frameTimes: number[] = [];
    const tick = (now: number) => {
      if (last) {
        frameTimes.push(now - last);
        if (frameTimes.length > 30) frameTimes.shift();
        const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        if (frameTimes.length === 30 && avg > 45) {
          slowCb.current?.();
          return;
        }
      }
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      const k = 1 - Math.exp(-PARALLAX.smoothing * dt);
      const s = state.current;
      s.x += (target.x - s.x) * k;
      s.y += (target.y - s.y) * k;
      write();
      if (Math.abs(target.x - s.x) > 0.001 || Math.abs(target.y - s.y) > 0.001) raf = requestAnimationFrame(tick);
      else {
        raf = 0;
        last = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = stage.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      target.x = clamp(((e.clientX - r.left) / r.width) * 2 - 1);
      target.y = clamp(((e.clientY - r.top) / r.height) * 2 - 1) * PARALLAX.yFactor;
      kick();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [enabled, stageRef, worldRef]);

  return state;
}
