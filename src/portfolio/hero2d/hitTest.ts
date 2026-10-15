import type { SceneLayerConfig } from "./sceneConfig";

/**
 * Alpha-based hit testing for transparent PNG layers, so empty pixels never act
 * as invisible click targets. Masks are downsampled copies of each PNG's alpha
 * channel, built once per image.
 */
export interface AlphaMask {
  /** Mask resolution relative to the native PNG. */
  k: number;
  w: number;
  h: number;
  alpha: Uint8ClampedArray;
}

const MAX_MASK_SIDE = 320;
const cache = new Map<string, Promise<AlphaMask>>();

export function loadAlphaMask(src: string): Promise<AlphaMask> {
  let p = cache.get(src);
  if (!p) {
    p = (async () => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      await img.decode();
      const k = Math.min(1, MAX_MASK_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * k));
      const h = Math.max(1, Math.round(img.naturalHeight * k));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("2D canvas unavailable");
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      const alpha = new Uint8ClampedArray(w * h);
      for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3];
      return { k, w, h, alpha };
    })();
    cache.set(src, p);
  }
  return p;
}

/** Alpha (0–255) of `layer` at a point given in logical scene px. */
export function alphaAt(layer: SceneLayerConfig, mask: AlphaMask, x: number, y: number): number {
  const r = (-layer.rotation * Math.PI) / 180;
  const dx = x - layer.x;
  const dy = y - layer.y;
  const rx = dx * Math.cos(r) - dy * Math.sin(r);
  const ry = dx * Math.sin(r) + dy * Math.cos(r);
  const u = (rx / layer.scale + layer.width / 2) * mask.k;
  const v = (ry / layer.scale + layer.height / 2) * mask.k;
  if (u < 0 || v < 0 || u >= mask.w || v >= mask.h) return 0;
  return mask.alpha[Math.floor(v) * mask.w + Math.floor(u)];
}
