import type { FocusEvent, PointerEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { ModeFilter, Project } from "../data/types";
import { MODES } from "../data/modes";
import { projectNumber } from "../data/projects";
import { portfolioStore } from "../hooks/usePortfolioState";
import { ModeIcon } from "./ModeIcon";

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function preview(project: Project, filter: ModeFilter, el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  portfolioStore.set({
    previewId: project.id,
    previewY: rect.top + rect.height / 2,
    // In "All works", hovering a project also nudges the scene and headline toward its mode.
    hover: filter === "all" && project.modes.length === 1 ? project.modes[0] : null,
  });
}

function clearPreview(id: string) {
  if (portfolioStore.get().previewId === id) portfolioStore.set({ previewId: null, hover: null });
}

export function ProjectList({ projects, filter }: { projects: Project[]; filter: ModeFilter }) {
  return (
    <motion.ol className="project-list" variants={list} initial="hidden" animate="show">
      {projects.map((p) => {
        const onEnter = (e: PointerEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>) => {
          if ("pointerType" in e && e.pointerType === "touch") return;
          preview(p, filter, e.currentTarget);
        };
        return (
          <motion.li key={p.id} variants={item} className="project-row">
            <Link
              to={`/works/${p.id}`}
              state={{ from: filter }}
              className="project-row__link"
              onPointerEnter={onEnter}
              onFocus={onEnter}
              onPointerLeave={() => clearPreview(p.id)}
              onBlur={() => clearPreview(p.id)}
            >
              <span className="project-row__num">{projectNumber(p.id)}</span>
              <span className="project-row__main">
                <span className="project-row__title">{p.title}</span>
                <span className="project-row__meta">
                  <span className="project-row__modes" aria-hidden="true">
                    {p.modes.map((m) => (
                      <ModeIcon key={m} mode={m} />
                    ))}
                  </span>
                  <span className="sr-only">{p.modes.map((m) => MODES[m].label).join(" and ")}: </span>
                  <span className="project-row__category">{p.category}</span>
                  {p.draft && <span className="tag tag--quiet">Draft</span>}
                </span>
                <span className="project-row__summary">{p.summary}</span>
              </span>
              <span className={`project-row__year${p.year ? "" : " is-unknown"}`}>{p.year ?? "TBD"}</span>
              <span className="project-row__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
