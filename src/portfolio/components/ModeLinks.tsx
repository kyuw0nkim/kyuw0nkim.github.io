import { Link } from "react-router-dom";
import type { Mode, ModeFilter } from "../data/types";
import { MODES, MODE_ORDER } from "../data/modes";
import { getProjects } from "../data/projects";
import { pathForFilter, previewHandlers } from "../hooks/usePortfolioState";

/** Compact pill links into Tracing / Shaping — the keyboard/touch alternative to the scene. */
export function ModePills() {
  return (
    <span className="mode-pills">
      {MODE_ORDER.map((mode) => (
        <Link key={mode} to={`/${mode}`} className="mode-pill" data-mode={mode} {...previewHandlers(mode)}>
          <span className="mode-dot" data-mode={mode} aria-hidden="true" />
          {MODES[mode].label}
          <span className="mode-pill__arrow" aria-hidden="true">
            →
          </span>
        </Link>
      ))}
    </span>
  );
}

const FILTERS: ModeFilter[] = ["tracing", "shaping", "all"];

/** Switch lists without going back to the intro. */
export function ModeTabs({ current }: { current: ModeFilter }) {
  return (
    <nav className="mode-tabs" aria-label="Filter works">
      {FILTERS.map((f) => (
        <Link
          key={f}
          to={pathForFilter(f)}
          className="mode-tab"
          aria-current={f === current ? "page" : undefined}
          {...(f === "all" ? {} : previewHandlers(f))}
        >
          {f !== "all" && <span className="mode-dot" data-mode={f} aria-hidden="true" />}
          {f === "all" ? "All works" : MODES[f].label}
          <span className="mode-tab__count">{String(getProjects(f).length).padStart(2, "0")}</span>
        </Link>
      ))}
    </nav>
  );
}
