import { AnimatePresence, motion } from "framer-motion";
import { getProject, previewMedia, projectNumber } from "../data/projects";
import { usePortfolioStore } from "../hooks/usePortfolioState";
import { Media } from "./Media";

const CARD_HALF = 190;

/** Floating visual preview of the hovered/focused list row (wide screens with a fine pointer). */
export function ProjectPreview() {
  const previewId = usePortfolioStore((s) => s.previewId);
  const y = usePortfolioStore((s) => s.previewY);
  const project = getProject(previewId ?? undefined);
  const media = project ? previewMedia(project) : undefined;
  const top = Math.min(Math.max(y, CARD_HALF + 24), window.innerHeight - CARD_HALF - 24);

  return (
    <AnimatePresence>
      {project && (
        <motion.aside
          className="project-preview"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.96, top }}
          animate={{ opacity: 1, scale: 1, top }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {media && <Media media={media} bare className="project-preview__media" />}
          <div className="project-preview__body">
            <span className="project-preview__num">{projectNumber(project.id)}</span>
            <p className="project-preview__title">{project.title}</p>
            <p className="project-preview__summary">{project.summary}</p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
