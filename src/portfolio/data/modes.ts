import type { Mode } from "./types";

export interface ModeInfo {
  id: Mode;
  label: string;
  /** Emoji mark shown next to the label. */
  emoji: string;
  /** One-line definition used in the list header and About. */
  definition: string;
  /** Typical activities — perspectives, not strict categories. */
  activities: string[];
}

export const MODES: Record<Mode, ModeInfo> = {
  tracing: {
    id: "tracing",
    label: "Tracing",
    emoji: "💭",
    definition: "Understanding how people interact, collaborate, communicate, and learn.",
    activities: [
      "Dialogue analysis",
      "Learning analytics",
      "Interaction modeling",
      "Assessment",
      "Patterns in human behavior",
    ],
  },
  shaping: {
    id: "shaping",
    label: "Shaping",
    emoji: "🛠️",
    definition: "Designing and building interventions, tools, systems, and experiences.",
    activities: [
      "Conversational AI agents",
      "Interactive systems",
      "Automation tools",
      "Learning experience design",
      "Educational technology",
    ],
  },
};

export const MODE_ORDER: Mode[] = ["tracing", "shaping"];

export const otherMode = (mode: Mode): Mode => (mode === "tracing" ? "shaping" : "tracing");
