import rawLayout from "./scene-layout.json";

/**
 * Layered 2.5D hero scene — configuration types and helpers.
 *
 * All layers live in one logical coordinate system (the original hero image,
 * 1448 × 1086). Each layer is placed by its *centre* (x, y), scaled from its
 * native pixel size and rotated about that centre. Positions are calibrated
 * data in scene-layout.json (edit them with the dev-only editor: /portfolio/?editor),
 * never hard-coded in components.
 */

export type Interaction = "tracing" | "shaping" | null;

export interface SceneLayerConfig {
  /** Unique id (file name without extension). */
  id: string;
  /** Path below `assetBase`, e.g. "characters/char_green_body.png". */
  file: string;
  /** Physical group from the manifest — layers of a group move together. */
  group: string;
  /** Which theme a click selects (from the manifest's clickTarget). */
  interaction: Interaction;
  /** Native pixel size of the PNG. */
  width: number;
  height: number;
  /** Centre position in logical scene px. */
  x: number;
  y: number;
  /** Uniform scale relative to the native pixel size. */
  scale: number;
  /** Degrees, clockwise, about the centre. */
  rotation: number;
  /** Mirror the sprite about its centre (applied before rotation). */
  flipX?: boolean;
  flipY?: boolean;
  /** Stacking order — larger is in front. */
  z: number;
  opacity: number;
  visible: boolean;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SceneLayout {
  version: 1;
  baseSize: { width: number; height: number };
  /** Folder of the PNGs, relative to the site root (public/). */
  assetBase: string;
  /** Regions of the scene. `hero` is what must stay visible at any viewport size. */
  framing: { hero: Rect } & Record<string, Rect>;
  layers: SceneLayerConfig[];
}

export const sceneLayout = rawLayout as SceneLayout;

export const layerSrc = (layout: SceneLayout, layer: SceneLayerConfig) =>
  `${import.meta.env.BASE_URL}${layout.assetBase.replace(/^\//, "")}${layer.file}`;

export const byZ = (layers: SceneLayerConfig[]) => [...layers].sort((a, b) => a.z - b.z);

/** CSS transform for a layer's own rotation and mirroring (about its centre). */
export function layerTransform(l: SceneLayerConfig): string {
  const parts: string[] = [];
  if (l.rotation) parts.push(`rotate(${l.rotation}deg)`);
  if (l.flipX || l.flipY) parts.push(`scale(${l.flipX ? -1 : 1}, ${l.flipY ? -1 : 1})`);
  return parts.join(" ");
}

/** On-screen size of a layer in logical px. */
export const layerSize = (l: SceneLayerConfig) => ({ w: l.width * l.scale, h: l.height * l.scale });

export interface Fit {
  /** Logical px → CSS px. */
  scale: number;
  /** Offset of the scene's top-left corner inside the stage (CSS px). */
  x: number;
  y: number;
}

export type Shot = "hero" | "tracing" | "shaping";

/** Place the scene at `scale`, centring `focus` and clamping so the scene covers the stage. */
function place(layout: SceneLayout, width: number, height: number, scale: number, focus: Rect): Fit {
  const { width: SW, height: SH } = layout.baseSize;
  // When the scene is smaller than the stage on an axis: centre horizontally,
  // sit on the bottom vertically (the floor stays grounded).
  const axis = (stage: number, scene: number, centre: number, short: "centre" | "end") => {
    const extent = scene * scale;
    if (extent < stage) return short === "end" ? stage - extent : (stage - extent) / 2;
    return Math.min(0, Math.max(stage - extent, stage / 2 - centre * scale));
  };
  return {
    scale,
    x: axis(width, SW, focus.x + focus.width / 2, "centre"),
    y: axis(height, SH, focus.y + focus.height / 2, "end"),
  };
}

/**
 * Fit the logical scene into a stage of `width × height` CSS px.
 *
 * - "cover": fill the stage (no empty areas) while keeping `framing.hero`
 *   fully visible. If both are impossible (very tall or narrow stages), the
 *   framing wins and the scene is anchored to the bottom so any leftover
 *   space falls on the plain wall at the top.
 * - "contain": show the whole scene (editor).
 */
export function fitScene(
  layout: SceneLayout,
  width: number,
  height: number,
  mode: "cover" | "contain" = "cover",
  padding = 0,
): Fit {
  const { width: SW, height: SH } = layout.baseSize;
  if (width <= 0 || height <= 0) return { scale: 1, x: 0, y: 0 };

  if (mode === "contain") {
    const scale = Math.min((width - padding * 2) / SW, (height - padding * 2) / SH);
    return { scale, x: (width - SW * scale) / 2, y: (height - SH * scale) / 2 };
  }

  const f = layout.framing.hero;
  const cover = Math.max(width / SW, height / SH);
  const safe = Math.min(width / f.width, height / f.height);
  return place(layout, width, height, Math.min(cover, safe), f);
}

/**
 * Virtual camera: the 2D transform for a shot. "hero" is the stage fit; the
 * Tracing/Shaping shots zoom toward `framing.tracing` / `framing.shaping` but
 * never below "cover" (so no area outside the reconstructed scene can show)
 * and never beyond `maxZoom` × the hero framing.
 */
export function cameraFit(layout: SceneLayout, width: number, height: number, shot: Shot, maxZoom: number): Fit {
  const hero = fitScene(layout, width, height, "cover");
  const target = layout.framing[shot];
  if (shot === "hero" || !target || width <= 0 || height <= 0) return hero;
  const { width: SW, height: SH } = layout.baseSize;
  const cover = Math.max(width / SW, height / SH);
  const want = Math.min(width / target.width, height / target.height);
  const scale = Math.min(Math.max(want, cover, hero.scale), hero.scale * maxZoom);
  return place(layout, width, height, scale, target);
}

/** Minimal structural check for layouts loaded from files or browser storage. */
export function parseLayout(json: unknown): SceneLayout {
  const fail = (msg: string): never => {
    throw new Error(`Invalid scene layout: ${msg}`);
  };
  if (!json || typeof json !== "object") fail("not an object");
  const l = json as SceneLayout;
  if (l.version !== 1) fail("unsupported version");
  if (!l.baseSize || typeof l.baseSize.width !== "number") fail("missing baseSize");
  if (!l.framing?.hero) fail("missing framing.hero");
  if (!Array.isArray(l.layers) || l.layers.length === 0) fail("missing layers");
  const ids = new Set<string>();
  for (const layer of l.layers) {
    for (const k of ["x", "y", "scale", "rotation", "z", "opacity", "width", "height"] as const) {
      if (typeof layer[k] !== "number" || !Number.isFinite(layer[k])) fail(`${layer.id ?? "?"}.${k} is not a number`);
    }
    if (typeof layer.id !== "string" || typeof layer.file !== "string") fail("layer without id/file");
    for (const k of ["flipX", "flipY", "visible"] as const) {
      if (layer[k] !== undefined && typeof layer[k] !== "boolean") fail(`${layer.id}.${k} is not a boolean`);
    }
    if (ids.has(layer.id)) fail(`duplicate id ${layer.id}`);
    ids.add(layer.id);
  }
  return l;
}
