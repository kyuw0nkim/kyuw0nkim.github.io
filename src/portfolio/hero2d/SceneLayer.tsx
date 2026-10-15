import { memo } from "react";
import type { SceneLayerConfig } from "./sceneConfig";
import { layerSize } from "./sceneConfig";

interface Props {
  layer: SceneLayerConfig;
  src: string;
  onSettled?: (id: string) => void;
}

/**
 * One transparent PNG placed in logical scene px. The image is laid out at its
 * displayed size (rather than scaled with a transform) so the browser
 * downsamples it with full quality.
 */
export const SceneLayer = memo(function SceneLayer({ layer, src, onSettled }: Props) {
  const { w, h } = layerSize(layer);
  return (
    <img
      className="scene-layer"
      src={src}
      alt=""
      draggable={false}
      decoding="async"
      data-layer={layer.id}
      data-group={layer.group}
      onLoad={() => onSettled?.(layer.id)}
      onError={() => onSettled?.(layer.id)}
      style={{
        left: layer.x - w / 2,
        top: layer.y - h / 2,
        width: w,
        height: h,
        zIndex: layer.z,
        opacity: layer.opacity,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
        display: layer.visible ? undefined : "none",
      }}
    />
  );
});
