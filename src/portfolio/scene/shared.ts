import { createContext, useContext, useMemo } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Mode } from "../data/types";
import { portfolioStore, setHover } from "../hooks/usePortfolioState";

// --------------------------------------------------------------- state ----

export interface SceneLive {
  selected: Mode | null;
  hover: Mode | null;
  hoverObject: string | null;
  reduced: boolean;
  /** Clock time of the last selection change (drives the small "hop"). */
  selectedAt: number;
  onSelect: (mode: Mode) => void;
}

/** A ref to the latest scene state, read inside useFrame without re-rendering. */
export const SceneContext = createContext<MutableRefObject<SceneLive> | null>(null);

export function useSceneLive() {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useSceneLive must be used inside <Scene3D>");
  return ctx;
}

/** Frame-rate independent easing toward a target. Snaps when motion is reduced. */
export function damp(current: number, target: number, lambda: number, dt: number, snap = false) {
  if (snap) return target;
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * Math.min(dt, 0.1)));
}

/** Pointer handlers that turn an object into a Tracing/Shaping target. */
export function useTarget(mode: Mode, id: string) {
  const live = useSceneLive();
  const gl = useThree((s) => s.gl);
  return useMemo(
    () => ({
      onPointerOver: (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        gl.domElement.style.cursor = "pointer";
        if (e.nativeEvent.pointerType !== "touch") setHover(mode, id);
      },
      onPointerOut: (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        gl.domElement.style.cursor = "";
        if (portfolioStore.get().hoverObject === id) setHover(null);
      },
      onClick: (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        live.current.onSelect(mode);
      },
    }),
    [gl, id, live, mode],
  );
}

// ------------------------------------------------------------ materials ---

/** Soft-touch, slightly plush surface: matte base + velvety sheen. */
function plush(color: string, sheenColor: string, roughness = 0.82) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color(sheenColor),
  });
}

export const MAT = {
  ghost: plush("#FCFAF6", "#FFFFFF", 0.74),
  clover: plush("#6FB678", "#D6F5CF"),
  star: plush("#F2858E", "#FFD9DD"),
  lavender: plush("#B6ABE3", "#F2EEFF"),
  fabric: plush("#F3ECE2", "#FFFFFF", 0.9),
  nose: new THREE.MeshStandardMaterial({ color: "#F0788A", roughness: 0.55 }),
  eye: new THREE.MeshStandardMaterial({ color: "#16141A", roughness: 0.16 }),
  stone: new THREE.MeshStandardMaterial({ color: "#EEE5D6", roughness: 0.72 }),
  stoneBase: new THREE.MeshStandardMaterial({ color: "#E7DCCB", roughness: 0.8 }),
  wood: new THREE.MeshStandardMaterial({ color: "#E2C59E", roughness: 0.58 }),
  aluminium: new THREE.MeshStandardMaterial({ color: "#E3E4E9", roughness: 0.32, metalness: 0.55 }),
  keyboard: new THREE.MeshStandardMaterial({ color: "#C8C9CF", roughness: 0.5, metalness: 0.3 }),
  screen: new THREE.MeshStandardMaterial({
    color: "#34323A",
    emissive: new THREE.Color("#FFE7A0"),
    emissiveIntensity: 0,
    roughness: 0.35,
  }),
  sticker: new THREE.MeshStandardMaterial({ color: "#FFD76A", roughness: 0.6 }),
  block: {
    yellow: plush("#FFD36A", "#FFF2C8", 0.6),
    sage: plush("#8DB59C", "#E1F2E6", 0.6),
    coral: plush("#F3A2AA", "#FFE3E6", 0.6),
    lavender: plush("#BEB5DC", "#F3F0FF", 0.6),
  },
};

// -------------------------------------------------------------- geometry ---

export const GEO = {
  sphere: new THREE.SphereGeometry(1, 48, 32),
  eye: new THREE.SphereGeometry(1, 20, 14),
};

/** A smooth surface of revolution from a few (radius, height) control points. */
export function smoothLathe(points: [number, number][], samples = 64, segments = 72) {
  const curve = new THREE.SplineCurve(points.map(([x, y]) => new THREE.Vector2(x, y)));
  const profile = curve.getPoints(samples);
  return { geometry: new THREE.LatheGeometry(profile, segments), profile };
}

/** Radius of a lathe profile at height y (profile must rise monotonically). */
export function radiusAt(profile: THREE.Vector2[], y: number) {
  for (let i = 1; i < profile.length; i++) {
    const a = profile[i - 1];
    const b = profile[i];
    if ((a.y <= y && b.y >= y) || (a.y >= y && b.y <= y)) {
      const t = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y);
      return THREE.MathUtils.lerp(a.x, b.x, t);
    }
  }
  return 0;
}

/** A rounded, pillowy five-point star. */
export function puffyStar(outer = 0.48, inner = 0.27, depth = 0.14, bevel = 0.12) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? outer : inner;
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
  }
  const curve = new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.3);
  const outline = curve.getPoints(200).slice(0, -1).map((p) => new THREE.Vector2(p.x, p.y));
  let geo: THREE.BufferGeometry = new THREE.ExtrudeGeometry(new THREE.Shape(outline), {
    depth,
    steps: 1,
    curveSegments: 1,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.8,
    bevelSegments: 12,
  });
  geo.translate(0, 0, -depth / 2);
  geo.deleteAttribute("normal");
  geo.deleteAttribute("uv");
  geo = mergeVertices(geo, 1e-4);
  geo.computeVertexNormals();
  return geo;
}

/** Yaw (rotation around Y) that makes +Z face from `from` toward `to`. */
export const yawTo = (from: THREE.Vector3Like, to: THREE.Vector3Like) => Math.atan2(to.x - from.x, to.z - from.z);

export const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export const TABLE_TOP = 0.78;
export const TABLE_RADIUS = 1.15;
