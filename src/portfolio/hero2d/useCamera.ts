import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { MutableRefObject, RefObject } from "react";
import { cubicBezier } from "framer-motion";
import type { Fit, Shot } from "./sceneConfig";
import { CAMERA } from "./sceneMotion";

const ease = cubicBezier(...CAMERA.ease);

/** Normalised speed of the easing curve (0…1, 1 at its fastest). */
const speed = (() => {
  const slope = (t: number) => {
    const a = Math.max(0, t - 0.002);
    const b = Math.min(1, t + 0.002);
    return (ease(b) - ease(a)) / (b - a);
  };
  let max = 0;
  for (let i = 0; i <= 200; i++) max = Math.max(max, slope(i / 200));
  return (t: number) => slope(t) / max;
})();

/**
 * Camera in between two shots: a zoom about the one point that stays put on
 * screen (so the move reads as the camera pushing in, not the picture sliding),
 * with the scale changing at an even rate on a log scale.
 */
function between(a: Fit, b: Fit, e: number): Fit {
  if (Math.abs(b.scale / a.scale - 1) < 1e-4) return { scale: a.scale, x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e };
  const s = a.scale * Math.pow(b.scale / a.scale, e);
  // Fixed point p (logical px): a.x + a.scale·p = b.x + b.scale·p.
  const px = (a.x - b.x) / (b.scale - a.scale);
  const py = (a.y - b.y) / (b.scale - a.scale);
  return { scale: s, x: a.x + (a.scale - s) * px, y: a.y + (a.scale - s) * py };
}

/**
 * A 3D translate while moving keeps the world on its own compositor layer (no
 * repaint per frame); the 2D form at rest lets the browser re-raster it sharply
 * at the final zoom.
 */
const toTransform = (f: Fit, moving: boolean) =>
  moving ? `translate3d(${f.x}px, ${f.y}px, 0) scale(${f.scale})` : `translate(${f.x}px, ${f.y}px) scale(${f.scale})`;

interface Options {
  fit: Fit;
  shot: Shot;
  /** Animate shot changes (off before the first measurement, for reduced motion, low power, the editor). */
  animate: boolean;
  /** Add the per-layer depth while moving (layers must be on their own compositor layers — see SceneLayer). */
  depthMotion: boolean;
  /** Stage size in CSS px. */
  width: number;
  height: number;
  /** Receives the --cam-* variables read by the layers (see SceneLayer). */
  hostRef: RefObject<HTMLElement>;
  worldRefs: RefObject<HTMLElement>[];
  /** True while a move is running. */
  movingRef: MutableRefObject<boolean>;
  onSettle?: () => void;
}

/**
 * CameraController: applies the scene transform to the world(s). A change of
 * shot is animated; anything else (first layout, resize, editor) snaps. A move
 * already under way is allowed to finish if only the motion settings changed
 * (e.g. low-power mode switched on mid-move), so it never jumps.
 *
 * While moving, layers get a little extra depth — nearer groups scale from the
 * view centre and lead the pan slightly more than far ones, in proportion to
 * the camera's speed — so the move feels like a camera travelling through the
 * room. At rest the extra terms are zero and the calibrated composition holds.
 */
export function useCamera({ fit, shot, animate, depthMotion, width, height, hostRef, worldRefs, movingRef, onSettle }: Options) {
  const applied = useRef<Fit | null>(null);
  const lastShot = useRef(shot);
  const run = useRef<{ raf: number; to: Fit } | null>(null);
  const settle = useRef(onSettle);
  settle.current = onSettle;
  const worlds = useRef(worldRefs);
  worlds.current = worldRefs;

  const stop = useCallback(() => {
    if (run.current) cancelAnimationFrame(run.current.raf);
    run.current = null;
    movingRef.current = false;
  }, [movingRef]);
  useEffect(() => stop, [stop]);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const apply = (f: Fit, moving = false) => {
      applied.current = f;
      const t = toTransform(f, moving);
      for (const w of worlds.current) if (w.current) w.current.style.transform = t;
    };
    const depth = (k: number, tx: number, ty: number, cx: number, cy: number) => {
      if (!host) return;
      host.style.setProperty("--cam-k", k.toFixed(5));
      host.style.setProperty("--cam-tx", tx.toFixed(3));
      host.style.setProperty("--cam-ty", ty.toFixed(3));
      host.style.setProperty("--cam-px", cx.toFixed(1));
      host.style.setProperty("--cam-py", cy.toFixed(1));
    };
    const snap = () => {
      stop();
      apply(fit);
      depth(0, 0, 0, 0, 0);
    };

    const from = applied.current;
    const shotChanged = lastShot.current !== shot;
    lastShot.current = shot;
    if (!shotChanged && run.current && sameFit(run.current.to, fit)) return; // let it finish
    if (!from || !animate || !shotChanged || width <= 0) return snap();

    stop();
    const to = fit;
    const centre = (f: Fit) => ({ x: (width / 2 - f.x) / f.scale, y: (height / 2 - f.y) / f.scale });
    const c0 = centre(from);
    const c1 = centre(to);
    // Push in when zooming in, pull out when zooming out.
    const ratio = Math.log(to.scale / from.scale);
    const push = !depthMotion || Math.abs(ratio) < 0.02 ? 0 : Math.sign(ratio) * CAMERA.depthScale;
    // Nearer layers lead the pan (content moves opposite to the view centre); capped for long pans.
    const lead = depthMotion ? CAMERA.depthLead : 0;
    let lx = (c0.x - c1.x) * lead;
    let ly = (c0.y - c1.y) * lead;
    const len = Math.hypot(lx, ly);
    if (len > CAMERA.maxDepthLead) {
      lx *= CAMERA.maxDepthLead / len;
      ly *= CAMERA.maxDepthLead / len;
    }

    movingRef.current = true;
    let start = -1; // the first frame's timestamp (same clock as the later ones)
    const tick = (now: number) => {
      if (start < 0) start = now;
      const t = Math.min(1, (now - start) / CAMERA.durationMs);
      const f = between(from, to, ease(t));
      apply(f, t < 1);
      if (t >= 1) {
        depth(0, 0, 0, 0, 0);
        run.current = null;
        movingRef.current = false;
        settle.current?.();
        return;
      }
      const v = speed(t);
      const c = centre(f);
      depth(push * v, lx * v, ly * v, c.x, c.y);
      if (run.current) run.current.raf = requestAnimationFrame(tick);
    };
    run.current = { raf: requestAnimationFrame(tick), to };
  }, [fit, shot, animate, depthMotion, width, height, hostRef, movingRef, stop]);
}

const sameFit = (a: Fit, b: Fit) => Math.abs(a.scale - b.scale) < 1e-6 && Math.abs(a.x - b.x) < 0.01 && Math.abs(a.y - b.y) < 0.01;
