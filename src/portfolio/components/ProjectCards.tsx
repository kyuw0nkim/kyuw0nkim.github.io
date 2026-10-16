import { useCallback, useEffect, useRef, useState } from "react";
import type { FocusEvent, PointerEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { ModeFilter, Project } from "../data/types";
import { MODES } from "../data/modes";
import { previewMedia, projectNumber } from "../data/projects";
import { setHover } from "../hooks/usePortfolioState";
import { useReducedMotion } from "../hooks/useMedia";
import { ModeIcon } from "./ModeIcon";

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/** The card's picture: the project's image, or a clearly labelled stand-in in the theme's colour. */
function CardVisual({ project }: { project: Project }) {
  const media = previewMedia(project);
  const src = media?.kind === "image" ? media.src : media?.kind === "video" ? media.poster : undefined;
  if (media && src) {
    return (
      <span className={`pcard__media pcard__media--${media.frame ?? "bleed"}`}>
        <img src={src} alt="" loading="lazy" decoding="async" />
      </span>
    );
  }
  return (
    <span className="pcard__media pcard__media--empty">
      <span className="pcard__emoji" aria-hidden="true">
        {project.modes.map((m) => MODES[m].emoji).join("")}
      </span>
      <span className="tag tag--quiet pcard__pending">Image to come</span>
    </span>
  );
}

function ProjectCard({ project, filter }: { project: Project; filter: ModeFilter }) {
  // In "All works", hovering a project also nudges the scene and headline toward its theme.
  const single = filter === "all" && project.modes.length === 1 ? project.modes[0] : null;
  const enter = (e: PointerEvent | FocusEvent) => {
    if (!single || ("pointerType" in e && e.pointerType === "touch")) return;
    setHover(single);
  };
  const leave = () => single && setHover(null);

  return (
    <motion.li variants={item} className="pcard" data-mode={project.modes[0]}>
      <Link
        to={`/works/${project.id}`}
        state={{ from: filter }}
        className="pcard__link"
        onPointerEnter={enter}
        onPointerLeave={leave}
        onFocus={enter}
        onBlur={leave}
      >
        <CardVisual project={project} />
        <span className="pcard__body">
          <span className="pcard__meta">
            <span>{projectNumber(project.id)}</span>
            <span className={project.year ? undefined : "is-unknown"}>{project.year ?? "TBD"}</span>
          </span>
          <span className="pcard__title">{project.title}</span>
          <span className="pcard__category">
            <span className="pcard__modes" aria-hidden="true">
              {project.modes.map((m) => (
                <ModeIcon key={m} mode={m} />
              ))}
            </span>
            <span className="sr-only">{project.modes.map((m) => MODES[m].label).join(" and ")}: </span>
            {project.category}
            {project.draft && <span className="tag tag--quiet">Draft</span>}
          </span>
        </span>
      </Link>
    </motion.li>
  );
}

/**
 * Tracing / Shaping: a horizontal rail of cards. About two and a half fit, so
 * the cut-off card shows there is more; the arrows, a trackpad or a swipe move
 * it, and cards snap into place.
 */
export function ProjectRail({ projects, filter, label }: { projects: Project[]; filter: ModeFilter; label: string }) {
  const rail = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure, projects]);

  const step = (dir: 1 | -1) => {
    const el = rail.current;
    const card = el?.querySelector<HTMLElement>(".pcard");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const per = card.offsetWidth + gap;
    // Move by the cards that are fully in view (at least one).
    const n = Math.max(1, Math.floor((el.clientWidth + gap) / per));
    el.scrollBy({ left: dir * n * per, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section className="prail" aria-label={label} data-at-start={edges.start || undefined} data-at-end={edges.end || undefined}>
      {!(edges.start && edges.end) && (
        <div className="prail__controls">
          <button type="button" className="prail__btn" onClick={() => step(-1)} disabled={edges.start} aria-label="Previous projects">
            ←
          </button>
          <button type="button" className="prail__btn" onClick={() => step(1)} disabled={edges.end} aria-label="Next projects">
            →
          </button>
        </div>
      )}
      <motion.ol ref={rail} className="prail__track" variants={list} initial="hidden" animate="show">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} filter={filter} />
        ))}
      </motion.ol>
    </section>
  );
}

/** All works: every card at once, two columns. */
export function ProjectGrid({ projects, filter, label }: { projects: Project[]; filter: ModeFilter; label: string }) {
  return (
    <motion.ol className="pgrid" aria-label={label} variants={list} initial="hidden" animate="show">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} filter={filter} />
      ))}
    </motion.ol>
  );
}
