import { Link } from "react-router-dom";
import { MODES, MODE_ORDER } from "../data/modes";
import { site } from "../data/site";
import { previewHandlers } from "../hooks/usePortfolioState";

export function AboutPanel() {
  return (
    <div className="about">
      <p className="eyebrow">
        <span>About</span>
        <span className="eyebrow__rule" aria-hidden="true" />
        <span>{site.location}</span>
      </p>

      <h1 className="statement">{site.about.statement}</h1>

      <div className="prose">
        {site.about.paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      <div className="about__modes">
        {MODE_ORDER.map((mode) => (
          <Link key={mode} to={`/${mode}`} className="about__mode" {...previewHandlers(mode)}>
            <h2 className="about__mode-title">
              <span className="mode-dot" data-mode={mode} aria-hidden="true" />
              {MODES[mode].label}
            </h2>
            <p className="about__mode-def">{MODES[mode].definition}</p>
            <ul className="about__mode-list">
              {MODES[mode].activities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <span className="about__mode-more">
              See {MODES[mode].label.toLowerCase()} work <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="about__toolkit">
        <h2 className="label">Toolkit</h2>
        <ul className="chips">
          {site.skills.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>
      </div>

      <p className="explore__footnote">
        Publications, CV and news:{" "}
        <a href={site.academicUrl} className="text-link">
          academic website
        </a>{" "}
        ·{" "}
        <a href={site.cvUrl} className="text-link" target="_blank" rel="noreferrer">
          CV (PDF)
        </a>
      </p>
    </div>
  );
}
