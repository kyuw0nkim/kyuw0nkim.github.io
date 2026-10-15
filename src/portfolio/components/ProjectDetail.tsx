import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getPublicationById } from "@/data/siteData";
import { trackOutbound } from "@/lib/analytics";
import type { ModeFilter, ProjectSection } from "../data/types";
import { MODES } from "../data/modes";
import { getAdjacentProjects, getProject, projectNumber, projects } from "../data/projects";
import { site } from "../data/site";
import { pathForFilter } from "../hooks/usePortfolioState";
import { Media, PlaceholderNote } from "./Media";
import { ModeIcon } from "./ModeIcon";

const LINK_LABELS: Record<string, string> = { doi: "DOI", acmdl: "ACM DL", arxiv: "arXiv", pdf: "PDF", website: "Website" };

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
} as const;

function Section({ section, index }: { section: ProjectSection; index: number }) {
  const hasText = !!(section.body?.length || section.points?.length);
  return (
    <motion.section className="pd-section" {...reveal}>
      <header className="pd-section__head">
        <span className="pd-section__num">{String(index).padStart(2, "0")}</span>
        <h2 className="pd-section__title">{section.title}</h2>
      </header>
      <div className="pd-section__body">
        {section.body?.map((p) => (
          <p key={p.slice(0, 32)} className="pd-text">
            {p}
          </p>
        ))}
        {section.points && (
          <ol className="pd-points">
            {section.points.map((p) => (
              <li key={p.slice(0, 32)}>{p}</li>
            ))}
          </ol>
        )}
        {section.placeholder && <PlaceholderNote>{section.placeholder}</PlaceholderNote>}
        {!hasText && !section.placeholder && <PlaceholderNote>Content to be added.</PlaceholderNote>}
        {section.media && section.media.length > 0 && (
          <div className={`pd-gallery pd-gallery--${Math.min(section.media.length, 2)}`}>
            {section.media.map((m, i) => (
              <Media key={`${m.src ?? m.label}-${i}`} media={m} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

function MetaItem({ label, value, fallback }: { label: string; value?: string | number | null; fallback: string }) {
  return (
    <div className="pd-meta__item">
      <dt>{label}</dt>
      <dd className={value ? undefined : "is-placeholder"}>{value ?? fallback}</dd>
    </div>
  );
}

export function ProjectDetail() {
  const { id } = useParams();
  const location = useLocation();
  const project = getProject(id);
  if (!project) return <Navigate to="/works" replace />;

  const stateFrom = (location.state as { from?: ModeFilter } | null)?.from;
  const from: ModeFilter = stateFrom ?? (project.modes.length === 1 ? project.modes[0] : "all");
  const { prev, next } = getAdjacentProjects(project.id, from);
  const pubs = (project.publications ?? []).map(getPublicationById).filter(Boolean);
  const backLabel = from === "all" ? "All works" : `${MODES[from].label} works`;
  const hasRecord = !!(project.outcomes?.length || pubs.length || project.links?.length);

  return (
    <motion.article
      className="pd"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <main id="main" tabIndex={-1} className="pd__main">
        <div className="pd__topbar">
          <Link to={pathForFilter(from)} className="back-link">
            <span aria-hidden="true">←</span> {backLabel}
          </Link>
          <span className="pd__index">
            {projectNumber(project.id)} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        <header className="pd-hero">
          <div className="pd-hero__chips">
            {project.modes.map((m) => (
              <Link key={m} to={`/${m}`} className="mode-chip" data-mode={m}>
                <ModeIcon mode={m} />
                {MODES[m].label}
              </Link>
            ))}
            {project.draft && <span className="tag">Draft — content in progress</span>}
          </div>
          <h1 className="pd-hero__title">{project.title}</h1>
          {project.subtitle && <p className="pd-hero__subtitle">{project.subtitle}</p>}
          <dl className="pd-meta">
            <MetaItem label="Year" value={project.year} fallback="To be added" />
            <MetaItem label="Role" value={project.role} fallback="To be added" />
            <MetaItem label="Category" value={project.category} fallback="—" />
            <MetaItem label="Context" value={project.organization} fallback="To be added" />
          </dl>
        </header>

        {project.hero && <Media media={project.hero} priority className="pd-hero__media" />}

        <motion.p className="pd-summary" {...reveal}>
          {project.summary}
        </motion.p>
        {project.collaborators && (
          <p className="pd-collab">
            <span className="label">With</span> {project.collaborators}
          </p>
        )}

        {project.sections.map((s, i) => (
          <Section key={s.title} section={s} index={i + 1} />
        ))}

        {hasRecord && (
          <motion.section className="pd-section pd-record" {...reveal}>
            <header className="pd-section__head">
              <span className="pd-section__num">{String(project.sections.length + 1).padStart(2, "0")}</span>
              <h2 className="pd-section__title">Recognition &amp; links</h2>
            </header>
            <div className="pd-section__body">
              {project.outcomes && project.outcomes.length > 0 && (
                <ul className="pd-outcomes">
                  {project.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              )}
              {pubs.length > 0 && (
                <ul className="pd-pubs">
                  {pubs.map((pub) => (
                    <li key={pub.id} className="pd-pub">
                      <p className="pd-pub__title">{pub.title}</p>
                      <p className="pd-pub__venue">
                        {pub.venue ?? pub.type} · {pub.year}
                        {pub.award && <span className="pd-pub__award"> · {pub.award}</span>}
                      </p>
                      {pub.links && (
                        <p className="pd-pub__links">
                          {Object.entries(pub.links)
                            .filter(([, href]) => !!href)
                            .map(([k, href]) => (
                              <a key={k} href={href} target="_blank" rel="noreferrer" className="pill-link" onClick={() => trackOutbound(href!, k)}>
                                {LINK_LABELS[k] ?? k} <span aria-hidden="true">↗</span>
                              </a>
                            ))}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <p className="pd-links">
                {project.links?.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="pill-link" onClick={() => trackOutbound(l.href, l.label)}>
                    {l.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
                <a href={site.academicUrl} className="pill-link">
                  Academic website <span aria-hidden="true">→</span>
                </a>
              </p>
            </div>
          </motion.section>
        )}

        <nav className="pd-next" aria-label="More projects">
          {prev && prev.id !== project.id && (
            <Link to={`/works/${prev.id}`} state={{ from }} className="pd-next__link pd-next__link--prev">
              <span className="label">← Previous</span>
              <span className="pd-next__title">{prev.title}</span>
            </Link>
          )}
          {next && next.id !== project.id && (
            <Link to={`/works/${next.id}`} state={{ from }} className="pd-next__link pd-next__link--next">
              <span className="label">Next →</span>
              <span className="pd-next__title">{next.title}</span>
            </Link>
          )}
        </nav>
      </main>
    </motion.article>
  );
}
