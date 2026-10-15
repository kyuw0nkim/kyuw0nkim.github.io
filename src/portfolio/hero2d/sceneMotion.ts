/**
 * Motion settings for the layered hero — kept apart from the position
 * calibration in scene-layout.json.
 */

/**
 * Parallax depth per physical group: the maximum offset in logical scene px
 * when the pointer reaches the edge of the stage. Every layer of a group shares
 * one depth, so chairs and their sitters, or the laptop and the tabletop,
 * never drift apart. Groups not listed stay still.
 */
export const PARALLAX_DEPTH: Record<string, number> = {
  "exterior-far": 2,
  "exterior-near": 4,
  room: 0,
  "chair-green": 5,
  "chair-pink": 5,
  "character-white": 5,
  "character-green": 5,
  "character-pink": 5,
  table: 6,
  laptop: 6,
  "stool-lavender": 8,
  "character-lavender": 8,
  "foreground-plant": 12,
};

export const PARALLAX = {
  /** Vertical movement relative to horizontal. */
  yFactor: 0.6,
  /** Exponential smoothing rate (1/s): higher follows the pointer faster. */
  smoothing: 5,
};

export const CAMERA = {
  /** Duration and easing of Hero ↔ Tracing ↔ Shaping camera moves. */
  durationMs: 1100,
  easing: "cubic-bezier(0.65, 0, 0.35, 1)",
  /** Never zoom further than this multiple of the Hero framing. */
  maxZoom: 2.2,
};

/** Groups that never take part in click detection (decoration, not obstacles). */
export const PASS_THROUGH_GROUPS = new Set(["foreground-plant"]);

/** Minimum alpha (0–255) for a pixel to count as part of an object. */
export const HIT_ALPHA = 96;
