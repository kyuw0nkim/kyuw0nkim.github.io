import type { KeyboardEvent } from "react";
import type { Mode } from "../data/types";
import { setHover } from "../hooks/usePortfolioState";

interface Props {
  selected: Mode | null;
  onSelect: (mode: Mode) => void;
}

/**
 * Temporary 2D stand-in used only when WebGL is unavailable (or with ?no3d).
 * Same targets as the 3D scene: characters → Tracing, table → Shaping.
 */
export function SceneFallback({ selected, onSelect }: Props) {
  const target = (mode: Mode, label: string) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": label,
    className: `fallback__target${selected === mode ? " is-selected" : ""}`,
    onClick: () => onSelect(mode),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(mode);
      }
    },
    onPointerEnter: () => setHover(mode),
    onPointerLeave: () => setHover(null),
    onFocus: () => setHover(mode),
    onBlur: () => setHover(null),
  });

  const eyes = (x: number, y: number, gap = 18) => (
    <g fill="#20201E">
      <ellipse cx={x - gap / 2} cy={y} rx="4.2" ry="5.2" />
      <ellipse cx={x + gap / 2} cy={y} rx="4.2" ry="5.2" />
    </g>
  );

  return (
    <svg className="fallback" viewBox="0 0 600 600" preserveAspectRatio="xMidYMax meet">
      <ellipse cx="300" cy="560" rx="250" ry="26" fill="#6B5A48" opacity="0.08" />

      {/* characters behind the table */}
      <g {...target("tracing", "Characters — explore Tracing")}>
        <path d="M226 400 V300 C226 236 262 204 300 204 C338 204 374 236 374 300 V400 Z" fill="#F7F4EF" stroke="#E8E1D6" strokeWidth="2" />
        {eyes(300, 270)}
        <path
          d="M470 268 L490 316 L540 320 L502 352 L514 402 L470 376 L426 402 L438 352 L400 320 L450 316 Z"
          fill="#F28C93"
          stroke="#F28C93"
          strokeWidth="18"
          strokeLinejoin="round"
        />
        {eyes(470, 336)}
      </g>

      <g {...target("shaping", "Table and laptop — explore Shaping")}>
        <path d="M262 420 L338 420 L354 548 L246 548 Z" fill="#E7DCCA" />
        <ellipse cx="300" cy="412" rx="236" ry="56" fill="#EFE6D6" stroke="#E2D5C1" strokeWidth="3" />
        <path d="M262 392 L338 392 L346 352 L254 352 Z" fill="#D9D9DE" />
        <rect x="252" y="388" width="96" height="10" rx="4" fill="#C9C9CF" />
        <circle cx="300" cy="372" r="6" fill="#FFD76A" />
      </g>

      {/* characters in front of the table (same target, one tab stop) */}
      <g {...target("tracing", "Characters — explore Tracing")} tabIndex={-1} aria-hidden="true">
        <g fill="#79B77F">
          <circle cx="104" cy="402" r="40" />
          <circle cx="72" cy="440" r="36" />
          <circle cx="136" cy="444" r="36" />
          <circle cx="104" cy="474" r="36" />
          <circle cx="104" cy="440" r="42" />
        </g>
        {eyes(108, 436)}
        <circle cx="108" cy="450" r="4" fill="#F37C8A" />
        <ellipse cx="148" cy="420" rx="22" ry="12" fill="#79B77F" />
        <ellipse cx="490" cy="462" rx="52" ry="46" fill="#BDB3E6" />
        {eyes(466, 452, 16)}
      </g>
    </svg>
  );
}
