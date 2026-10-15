import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Mode } from "../data/types";
import { MODES, otherMode } from "../data/modes";
import { usePortfolioStore } from "../hooks/usePortfolioState";
import { useReducedMotion } from "../hooks/useMedia";

/** Time each word stays before switching (ms). */
const INTERVAL = 3000;
const EASE = [0.65, 0, 0.35, 1] as const;

/** Each word carries its own voice: Tracing reads, Shaping builds. */
const WORD_CLASS: Record<Mode, string> = {
  tracing: "kh__word--serif",
  shaping: "kh__word--sans",
};

interface Props {
  /** Explicitly selected mode — stops the alternation. */
  selected: Mode | null;
  size?: "hero" | "compact";
  /**
   * Called by the swap arrow when a mode is selected (e.g. navigate to the
   * other list). Without it, the arrow swaps the word and pauses alternation.
   */
  onSwap?: (next: Mode) => void;
}

export function KineticHeadline({ selected, size = "hero", onSwap }: Props) {
  const hover = usePortfolioStore((s) => s.hover);
  const reduced = useReducedMotion();
  const [auto, setAuto] = useState<Mode>(selected ?? "tracing");
  const [paused, setPaused] = useState(false);

  // Previewed (hover) beats selected beats the automatic cycle.
  const shown: Mode = hover ?? selected ?? auto;

  // Keep the cycle where the visitor left it, so leaving a hover never jumps back.
  useEffect(() => {
    if (hover) setAuto(hover);
  }, [hover]);
  useEffect(() => {
    if (selected) setAuto(selected);
  }, [selected]);

  const running = !selected && !hover && !paused && !reduced;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setAuto((w) => otherMode(w)), INTERVAL);
    return () => window.clearInterval(id);
  }, [running]);

  const handleSwap = () => {
    const next = otherMode(shown);
    if (onSwap && selected) {
      onSwap(next);
      return;
    }
    setPaused(true);
    setAuto(next);
  };

  const swapLabel =
    onSwap && selected
      ? `Switch to ${MODES[otherMode(selected)].label}`
      : `Show “${MODES[otherMode(shown)].label}”${paused ? "" : " and stop the automatic word switching"}`;

  const Heading = size === "hero" ? "h1" : "h2";

  return (
    <div className={`kh kh--${size}`} data-word={shown}>
      <button type="button" className="kh__swap" onClick={handleSwap} aria-label={swapLabel} title={swapLabel}>
        <svg viewBox="0 0 40 64" aria-hidden="true" className="kh__arrow">
          <path d="M27 5 C 9 12, 4 34, 13 48 C 16 53, 20 56, 25 58" />
          <path d="M17 58.5 L 25.5 58.5 L 23 50.5" />
        </svg>
      </button>

      <Heading className="kh__heading">
        <span className="sr-only">
          {selected ? MODES[selected].label : "Tracing and shaping"} how we think together.
        </span>
        <span className="kh__visual" aria-hidden="true">
          <span className="kh__box">
            {/* Sizer: both words stacked invisibly so the box never changes size. */}
            <span className="kh__sizer">
              <span className={`kh__word ${WORD_CLASS.tracing}`}>{MODES.tracing.label}</span>
              <span className={`kh__word ${WORD_CLASS.shaping}`}>{MODES.shaping.label}</span>
            </span>
            <AnimatePresence initial={false}>
              <motion.span
                key={shown}
                className={`kh__word kh__live ${WORD_CLASS[shown]}`}
                initial={{ y: "108%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-108%" }}
                transition={{ duration: 0.72, ease: EASE }}
              >
                {MODES[shown].label}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="kh__tail">
            How we think <span className="kh__together">together.</span>
          </span>
        </span>
      </Heading>
    </div>
  );
}
