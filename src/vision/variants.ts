// ===========================================================================
// One page, two entry points:
//   /vision/     → "dialogue" (constructive dialogue programs)
//   /portfolio/  → "stem"     (STEM programs)
// The variant comes from <html data-variant="…"> in each entry HTML.
// Overrides are empty for now, so both pages are identical. To tailor the STEM
// version, fill in only text taken from the STEM SoP / CV — never invented copy.
// ===========================================================================

export type Variant = "dialogue" | "stem";

export interface VariantOverrides {
  /** Replaces the "I aim…" sentence under the headline. */
  vision?: string;
  /** Project ids (see data.ts `works`) in the order to show them. */
  worksOrder?: string[];
}

export const variantOverrides: Record<Variant, VariantOverrides> = {
  dialogue: {},
  stem: {},
};

export function currentVariant(): Variant {
  return document.documentElement.dataset.variant === "stem" ? "stem" : "dialogue";
}
