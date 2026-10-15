import type { Mode } from "./types";

export interface ModeInfo {
  id: Mode;
  label: string;
  /** One-line definition used in the list header and About. */
  definition: string;
  /** Typical activities — perspectives, not strict categories. */
  activities: string[];
  /** Short hint shown when hovering the matching object in the 3D scene. */
  sceneHint: string;
  /** CSS custom property holding the mode's accent colour. */
  colorVar: string;
}

export const MODES: Record<Mode, ModeInfo> = {
  tracing: {
    id: "tracing",
    label: "Tracing",
    definition: "Understanding how people interact, collaborate, communicate, and learn.",
    activities: [
      "Dialogue analysis",
      "Learning analytics",
      "Interaction modeling",
      "Assessment",
      "Patterns in human behavior",
    ],
    sceneHint: "Follow the conversation",
    colorVar: "var(--pf-tracing)",
  },
  shaping: {
    id: "shaping",
    label: "Shaping",
    definition: "Designing and building interventions, tools, systems, and experiences.",
    activities: [
      "Conversational AI agents",
      "Interactive systems",
      "Automation tools",
      "Learning experience design",
      "Educational technology",
    ],
    sceneHint: "Open the workbench",
    colorVar: "var(--pf-shaping)",
  },
};

export const MODE_ORDER: Mode[] = ["tracing", "shaping"];

export const otherMode = (mode: Mode): Mode => (mode === "tracing" ? "shaping" : "tracing");
