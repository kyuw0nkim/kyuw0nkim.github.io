import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Mode } from "../data/types";
import { MODES, otherMode } from "../data/modes";
import { usePortfolioStore } from "../hooks/usePortfolioState";
import { useReducedMotion } from "../hooks/useMedia";

/** Time each word stays before switching (ms). */
const INTERVAL = 3000;
const EASE = [0.65, 0, 0.35, 1] as const;

interface Props {
  /** Explicitly selected mode — stops the alternation. */
  selected: Mode | null;
  size?: "hero" | "compact";
}

export function KineticHeadline({ selected, size = "hero" }: Props) {
  const hover = usePortfolioStore((s) => s.hover);
  const reduced = useReducedMotion();
  const [auto, setAuto] = useState<Mode>(selected ?? "tracing");
  // Auto-switching can be stopped (WCAG 2.2.2): hovering the headline pauses it,
  // and keyboard users get a pause button that appears on focus.
  const [paused, setPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);

  // Previewed (hover) beats selected beats the automatic cycle.
  const shown: Mode = hover ?? selected ?? auto;

  // Keep the cycle where the visitor left it, so leaving a hover never jumps back.
  useEffect(() => {
    if (hover) setAuto(hover);
  }, [hover]);
  useEffect(() => {
    if (selected) setAuto(selected);
  }, [selected]);

  const cycles = !selected && !reduced;
  const running = cycles && !hover && !paused && !hoverPaused;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setAuto((w) => otherMode(w)), INTERVAL);
    return () => window.clearInterval(id);
  }, [running]);

  const Heading = size === "hero" ? "h1" : "h2";

  return (
    <div
      className={`kh kh--${size}`}
      data-word={shown}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHoverPaused(true)}
      onPointerLeave={() => setHoverPaused(false)}
    >
      {cycles && (
        <button type="button" className="kh__pause" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          {paused ? "Resume word animation" : "Pause word animation"}
        </button>
      )}

      <Heading className="kh__heading">
        <span className="sr-only">
          {selected ? MODES[selected].label : "Tracing and shaping"} how we think together.
        </span>
        <span className="kh__visual" aria-hidden="true">
          <span className="kh__box">
            {/* Sizer: both words stacked invisibly so the box never changes size. */}
            <span className="kh__sizer">
              <span className="kh__word">{MODES.tracing.label}</span>
              <span className="kh__word">{MODES.shaping.label}</span>
            </span>
            <AnimatePresence initial={false}>
              <motion.span
                key={shown}
                className="kh__word kh__live"
                initial={{ y: "108%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-108%" }}
                transition={{ duration: 0.72, ease: EASE }}
              >
                {MODES[shown].label}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="kh__tail">How we think together.</span>
        </span>
      </Heading>
    </div>
  );
}
