import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Mode, ModeFilter } from "../data/types";
import { MODES } from "../data/modes";
import { getProjects } from "../data/projects";
import { site } from "../data/site";
import { KineticHeadline } from "./KineticHeadline";
import { ModeTabs } from "./ModeLinks";
import { ProjectList } from "./ProjectList";

const ALL_DEFINITION =
  "Selected research, design, and development work. Each project traces how people think together, shapes something that helps them — or both.";

export function ExplorePanel({ filter }: { filter: ModeFilter }) {
  const navigate = useNavigate();
  const selected: Mode | null = filter === "all" ? null : filter;

  return (
    <div className="explore">
      <Link to="/" className="back-link">
        <span aria-hidden="true">←</span> Intro
      </Link>

      <KineticHeadline selected={selected} size="compact" onSwap={(m) => navigate(`/${m}`)} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={filter}
          className="explore__definition"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
        >
          {selected ? MODES[selected].definition : ALL_DEFINITION}
        </motion.p>
      </AnimatePresence>

      <ModeTabs current={filter} />
      <ProjectList key={filter} projects={getProjects(filter)} filter={filter} />

      <p className="explore__footnote">
        Publications, CV and news live on the{" "}
        <a href={site.academicUrl} className="text-link">
          academic website
        </a>
        .
      </p>
    </div>
  );
}
