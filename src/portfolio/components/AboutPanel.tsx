import { useState } from "react";
import { Link } from "react-router-dom";
import { MODES, MODE_ORDER } from "../data/modes";
import { site } from "../data/site";
import { capabilities, practice, recognition } from "../data/capabilities";
import { getProject, projectNumber } from "../data/projects";
import { previewHandlers } from "../hooks/usePortfolioState";
import { ModeIcon } from "./ModeIcon";

/**
 * Capability map: each row is something I can do, with the methods behind it
 * and the works where it shows. Hovering a row lights up its side of the scene.
 */
function CapabilityMap() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="cap" aria-labelledby="cap-title">
      <h2 id="cap-title" className="cap__title">
        Research capabilities
      </h2>
      <p className="cap__intro">Each capability links to the work where you can see it in practice.</p>
      <ol className="cap__list">
        {capabilities.map((c, i) => (
          <li
            key={c.title}
            className="cap__row"
            data-mode={c.mode}
            data-active={active === i || undefined}
            onPointerEnter={(e) => {
              previewHandlers(c.mode).onPointerEnter(e);
              setActive(i);
            }}
            onPointerLeave={(e) => {
              previewHandlers(c.mode).onPointerLeave(e);
              setActive(null);
            }}
          >
            <div className="cap__head">
              <ModeIcon mode={c.mode} />
              <h3 className="cap__name">{c.title}</h3>
            </div>
            <p className="cap__line">{c.line}</p>
            <ul className="cap__methods" aria-label={`${c.title} methods`}>
              {c.methods.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <p className="cap__works">
              <span className="label">Seen in</span>
              {c.works.map((id) => {
                const p = getProject(id);
                return p ? (
                  <Link key={id} to={`/works/${id}`} className="cap__work">
                    <span className="cap__work-num">{projectNumber(id)}</span>
                    {p.title}
                  </Link>
                ) : null;
              })}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function AboutPanel() {
  return (
    <div className="about">
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
              <ModeIcon mode={mode} />
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

      <CapabilityMap />

      <section className="practice" aria-labelledby="practice-title">
        <h2 id="practice-title" className="cap__title">
          Teaching &amp; practice
        </h2>
        <ul className="practice__list">
          {practice.map((p) => (
            <li key={p.role + p.place} className="practice__item">
              <p className="practice__head">
                <span className="practice__role">{p.role}</span>
                <span className="practice__when">{p.when}</span>
              </p>
              <p className="practice__place">{p.place}</p>
              <p className="practice__text">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="recognition" aria-labelledby="recog-title">
        <h2 id="recog-title" className="cap__title">
          Recognition
        </h2>
        <ul className="recognition__list">
          {recognition.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

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
