import type { Mode } from "../data/types";
import { MODES } from "../data/modes";

/** The mode's emoji mark. Decorative: the label is always next to it or in sr-only text. */
export function ModeIcon({ mode }: { mode: Mode }) {
  return (
    <span className="mode-icon" data-mode={mode} aria-hidden="true">
      {MODES[mode].emoji}
    </span>
  );
}
