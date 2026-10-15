/** The two perspectives of the portfolio. A project can belong to both. */
export type Mode = "tracing" | "shaping";

/** A list filter: one mode, or every project. */
export type ModeFilter = Mode | "all";

/**
 * A visual asset. `placeholder` renders a clearly labelled empty frame,
 * so missing screenshots never get replaced by invented imagery.
 */
export interface Media {
  kind: "image" | "video" | "embed" | "placeholder";
  /** Image/video URL (e.g. "/portfolio/projects/my-project/screen.png") or embed URL. */
  src?: string;
  /** Required for images: describe what the image shows. */
  alt?: string;
  caption?: string;
  /** CSS aspect-ratio, e.g. "3 / 2". Defaults to "3 / 2". */
  aspect?: string;
  /** For placeholders: what should go in this frame. */
  label?: string;
  /**
   * "figure" keeps small research figures sharp on a framed plate;
   * "bleed" lets large screenshots/photos fill the column.
   */
  frame?: "figure" | "bleed";
  /** Optional video poster image. */
  poster?: string;
}

export interface ProjectSection {
  /** Short heading, e.g. "Context", "Process", "Outcome". */
  title: string;
  /** Paragraphs. */
  body?: string[];
  /** Short list items. */
  points?: string[];
  media?: Media[];
  /**
   * Renders a labelled "to be added" note. Use instead of writing
   * content that has not been verified yet.
   */
  placeholder?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  /** URL slug — /portfolio/#/works/<id> */
  id: string;
  title: string;
  subtitle?: string;
  /** null = unknown yet (rendered as a placeholder). */
  year: number | null;
  /** Short category shown in the list, e.g. "Learning analytics". */
  category: string;
  modes: Mode[];
  /** One sentence for the list preview and the detail hero. */
  summary: string;
  /** Your role. Leave undefined until confirmed — it renders as a placeholder. */
  role?: string;
  /** Where the work happened, e.g. a lab or organisation. */
  organization?: string;
  collaborators?: string;
  /** Used in the list preview. Falls back to `hero`. */
  thumbnail?: Media;
  /** Large visual at the top of the detail page. */
  hero?: Media;
  sections: ProjectSection[];
  /** Verified outcomes only (venues, awards, deployments…). */
  outcomes?: string[];
  /** Ids from src/data/publications.generated.ts (the academic site's Excel pipeline). */
  publications?: string[];
  links?: ProjectLink[];
  /** Marks projects whose content is still mostly placeholder. */
  draft?: boolean;
}
