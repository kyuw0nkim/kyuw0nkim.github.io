import { memo } from "react";
import type { SceneLayerConfig } from "./sceneConfig";
import { layerSize, layerTransform } from "./sceneConfig";
import { GLOW_BELOW_LAYERS } from "./sceneMotion";

export type Highlight = "selected" | "hover" | null;

interface Props {
  layer: SceneLayerConfig;
  src: string;
  /** Parallax depth in logical px (0 = fixed). Driven by --par-x/--par-y on the world. */
  depth?: number;
  highlight?: Highlight;
  onSettled?: (id: string) => void;
}

/**
 * One transparent PNG placed in logical scene px. The image is laid out at its
 * displayed size (rather than scaled with a transform) so the browser
 * downsamples it with full quality.
 */
export const SceneLayer = memo(function SceneLayer({ layer, src, depth = 0, highlight = null, onSettled }: Props) {
  const { w, h } = layerSize(layer);
  const parallax = depth
    ? `translate3d(calc(var(--par-x, 0) * ${-depth}px), calc(var(--par-y, 0) * ${-depth}px), 0)`
    : "";
  const transform = `${parallax} ${layerTransform(layer)}`.trim();
  return (
    <img
      className="scene-layer"
      src={src}
      alt=""
      draggable={false}
      decoding="async"
      data-layer={layer.id}
      data-group={layer.group}
      data-interaction={layer.interaction ?? undefined}
      data-highlight={highlight ?? undefined}
      data-glow={GLOW_BELOW_LAYERS.has(layer.id) ? "below" : undefined}
      onLoad={() => onSettled?.(layer.id)}
      onError={() => onSettled?.(layer.id)}
      style={{
        left: layer.x - w / 2,
        top: layer.y - h / 2,
        width: w,
        height: h,
        zIndex: layer.z,
        opacity: layer.opacity,
        transform: transform || undefined,
        display: layer.visible ? undefined : "none",
      }}
    />
  );
});
