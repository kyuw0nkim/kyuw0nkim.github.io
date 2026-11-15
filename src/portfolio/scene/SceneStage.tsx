import { useEffect } from "react";
import type { Mode } from "../data/types";
import { useCanHover, useIsWide, useReducedMotion } from "../hooks/useMedia";
import { setHover, usePortfolioStore } from "../hooks/usePortfolioState";
import { HeroScene } from "../hero2d/HeroScene";

interface Props {
  selected: Mode | null;
  onSelect: (mode: Mode) => void;
  /** Back to the Hero shot (intro). */
  onReset?: () => void;
}

/**
 * The layered 2.5D hero. The route decides the camera shot (Hero / Tracing /
 * Shaping); hovering previews a theme (headline + glow); clicking a character
 * opens Tracing, the table or laptop opens Shaping. Escape returns to Hero.
 */
export function SceneStage({ selected, onSelect, onReset }: Props) {
  const reduced = useReducedMotion();
  const finePointer = useCanHover();
  const isWide = useIsWide();
  const hover = usePortfolioStore((s) => s.hover);

  useEffect(() => {
    if (!selected || !onReset) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key !== "Escape" || (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      onReset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, onReset]);

  return (
    <section className="stage" data-selected={selected ?? undefined} aria-labelledby="stage-title" aria-describedby="stage-desc">
      <h2 id="stage-title" className="sr-only">
        Illustration: four soft characters sitting around a round table with a laptop, in a sunlit room
      </h2>
      <p id="stage-desc" className="sr-only">
        Selecting a character opens Tracing; selecting the table or laptop opens Shaping. The same choices are available
        as links in the main content.
      </p>
      <HeroScene
        className="stage__scene"
        shot={selected ?? "hero"}
        parallax={finePointer}
        bleed={isWide}
        interactive
        reducedMotion={reduced}
        highlight={{ selected, hoverMode: hover }}
        onHoverTarget={(t) => setHover(t?.mode ?? null)}
        onSelectTarget={(t) => onSelect(t.mode)}
      />
      <div className="stage__edge" aria-hidden="true" />
    </section>
  );
}
