import type { Media, ModeFilter, Project } from "./types";

// ===========================================================================
// SELECTED WORKS — the single source of truth for the portfolio.
//
// • Order here = order in every list (and the 01, 02… numbering).
// • `modes` decides where a project appears: ["tracing"], ["shaping"] or both.
// • Images: put files in public/portfolio/projects/<id>/ and reference them as
//   "/portfolio/projects/<id>/file.png". Research figures already used on the
//   academic site live in public/thumbnails/ and are reused via `thumb()`.
// • Publications are linked by id from src/data/publications.generated.ts,
//   so venues, links and awards stay in sync with data/publications.xlsx.
// • Never fill gaps with guessed content — use `placeholder` fields instead.
// ===========================================================================

/** Reference an image in public/thumbnails/ (handles spaces and Korean names). */
const thumb = (file: string) => `/thumbnails/${encodeURIComponent(file)}`;

/** A clearly labelled empty frame for an asset that does not exist yet. */
const pending = (label: string, aspect = "16 / 10"): Media => ({ kind: "placeholder", label, aspect });

const RAIM = "Seoul Robot & AI Museum (RAIM)";
const IDL = "Interaction Design for Learning Lab, Ewha Womans University";

export const projects: Project[] = [
  // ------------------------------------------------------------------ TRACING
  {
    id: "productive-discussion-moves",
    title: "Productive Discussion Moves",
    subtitle: "What productive dialogue looks like when groups discuss controversial issues",
    year: 2026,
    category: "Learning analytics",
    modes: ["tracing"],
    summary:
      "Modeling the discussion moves and dialogue states behind productive group discussion on value-laden, controversial issues.",
    role: "First author",
    organization: IDL,
    collaborators: "Jeanhee Lee, Sung-Eun Kim, Hyo-Jeong So",
    hero: {
      kind: "image",
      src: thumb("pic.C.Productive Discussion.png"),
      alt: "Two network diagrams of discussion moves such as Perspective Taking, Evidence-based Argument and Building on Ideas, comparing groups with high-quality and low-quality discussion.",
      caption: "Individual unit networks for groups with high-quality (a) and low-quality (b) discussion.",
      aspect: "3 / 2",
      frame: "figure",
    },
    sections: [
      {
        title: "Context",
        body: [
          "Controversial, value-laden issues ask a group to reason together across different positions. This line of work looks closely at those discussions: which moves participants make, how the moves connect, and how the dialogue unfolds over time.",
        ],
      },
      {
        title: "Process",
        body: [
          "Group dialogue was coded for discussion moves — from position declaration and perspective taking to evidence-based argument, critical questioning and building on ideas — then analysed as networks of co-occurring moves and as sequences of dialogue states with Hidden Markov Models.",
        ],
        media: [
          {
            kind: "image",
            src: thumb("pic.C.Understanding Productive.png"),
            alt: "Hidden Markov model diagram with three dialogue states and transition probabilities between them.",
            caption:
              "Three dialogue states — deliberative dialogue, conversational mediation and affective dialogue — with transition probabilities.",
            aspect: "3 / 2",
            frame: "figure",
          },
        ],
      },
      {
        title: "Outcome",
        placeholder: "Add a short, verified summary of the key findings.",
      },
    ],
    outcomes: [
      "Full paper — LAK 2026",
      "Full paper — IEEE ICALT 2026, nominated for Best Student Paper",
    ],
    publications: ["p2026-c2", "p2026-pre1"],
    links: [{ label: "Preprint (arXiv)", href: "https://doi.org/10.48550/arXiv.2601.05651" }],
  },
  {
    id: "agent-roles-in-deliberation",
    title: "Agent Roles in Deliberation",
    subtitle: "Does it matter how an AI agent takes part in a group decision?",
    year: 2026,
    category: "Conversational agents · Experiment",
    modes: ["tracing", "shaping"],
    summary:
      "Comparing how an LLM-based conversational agent's participation and role affect group decision-making on controversial issues.",
    role: "First author",
    organization: IDL,
    collaborators: "Hyo-Jeong So",
    hero: {
      kind: "image",
      src: thumb("pic.C.논쟁문제 의사결정.png"),
      alt: "Box plots comparing discussion depth, perspective diversity, perceived quality and team satisfaction across a human-only control group, a supporter-agent group and a peer-agent group.",
      caption:
        "Discussion and decision measures across three conditions: humans only (H), a supporter agent (S) and a peer agent (P).",
      aspect: "3 / 2",
      frame: "figure",
    },
    sections: [
      {
        title: "Context",
        body: [
          "When a conversational agent joins a group deliberating a controversial issue, the role it plays may shape the discussion. This study compares groups deliberating without an agent with groups joined by an LLM-based agent acting either as a supporter or as a peer.",
        ],
      },
      {
        title: "Process",
        body: [
          "Measures covered the depth and perspective diversity of the discussion process and of the final decision, perceived quality of the discussion and the decision, and satisfaction with the team.",
        ],
        placeholder: "Add the agent designs for the two roles (prompts, screenshots, or an interaction excerpt).",
      },
      {
        title: "Outcome",
        placeholder: "Add a short, verified summary of the key findings.",
      },
    ],
    outcomes: ["Best Paper Award — KAEIM 2026 Spring Conference"],
    publications: ["p2026-c3"],
  },
  {
    id: "stealth-assessment",
    title: "Stealth Assessment",
    year: null,
    category: "Assessment",
    modes: ["tracing"],
    summary: "Assessing learning unobtrusively from traces of interaction.",
    hero: pending("Key visual — assessment model or evidence map"),
    sections: [
      { title: "Context", placeholder: "Describe the learning setting and what was being assessed." },
      { title: "Process", placeholder: "Describe the evidence model and the data it used." },
      { title: "Outcome", placeholder: "Add verified results or artefacts." },
    ],
    draft: true,
  },

  // ------------------------------------------------------------------ SHAPING
  {
    id: "your-thoughtful-opponent",
    title: "Your Thoughtful Opponent",
    subtitle: "Embracing cognitive conflict with a peer agent",
    year: 2025,
    category: "Conversational AI · Peer agent",
    modes: ["shaping"],
    summary:
      "A peer agent that joins group deliberation as a thoughtful opponent, bringing productive cognitive conflict into the conversation.",
    role: "First author",
    organization: IDL,
    collaborators: "Jaeryeong Hwang, Younseo Lee, Jeanhee Lee, Sung-Eun Kim, Hyo-Jeong So",
    hero: {
      kind: "image",
      src: thumb("pic.P.Your Thoughtful.png"),
      alt: "System diagram: learner input flows through a context interpreter into the agent's thought formation, thought evaluation and rule-based logic, producing the agent's response.",
      caption: "System overview — engaging in deliberation with the peer agent.",
      aspect: "3 / 2",
      frame: "figure",
    },
    sections: [
      {
        title: "Context",
        body: [
          "This project designs a peer agent that takes part in group deliberation as a thoughtful opponent — embracing cognitive conflict as part of the conversation rather than avoiding it.",
        ],
      },
      {
        title: "Process",
        points: [
          "Context interpreter — extracts each user's opinion and estimated opinion strength, and detects the value orientations underlying their speech.",
          "Thought formation — generates internal thoughts from the current utterance, extracted values and retrieved memory.",
          "Thought evaluation — scores thoughts with pre-defined heuristics and the agent state (long-term memory, opinion strength, persona).",
          "Rule-based logic — weights scores by discussion phase and estimated opinion strength to decide the agent's response and participation.",
        ],
        media: [pending("Interface screenshots or a short demo video of a deliberation session")],
      },
      {
        title: "Outcome",
        placeholder: "Add verified study results or observations.",
      },
    ],
    outcomes: ["Poster — UIST 2025 Extended Abstracts"],
    publications: ["p2025-c1"],
  },
  {
    id: "conversational-agent-prototypes",
    title: "Conversational Agent Prototypes",
    subtitle: "LLM-powered agents for learning",
    year: 2026,
    category: "Interactive systems",
    modes: ["shaping"],
    summary:
      "A collection of LLM-powered conversational agents for learning, including MelodyMate, a pedagogical agent for music form analysis.",
    organization: IDL,
    hero: {
      kind: "image",
      src: thumb("pic.P.Understanding University.png"),
      alt: "MelodyMate overview: a music-score pre-processing pipeline above an interface combining an interactive music sheet with MIDI playback and a chat with an LLM-powered pedagogical agent.",
      caption:
        "MelodyMate — an interactive music sheet with MIDI playback alongside an LLM-powered pedagogical conversational agent.",
      aspect: "3 / 2",
      frame: "figure",
    },
    sections: [
      {
        title: "MelodyMate",
        body: [
          "Scores (PDF or image) are pre-processed through optical music recognition, MIDI conversion and ABC-notation conversion, so learners can play the piece back on an interactive sheet while talking with the agent about its form.",
        ],
        placeholder: "Add your role in MelodyMate and interface screenshots.",
      },
      {
        title: "More prototypes",
        placeholder: "Add further agent prototypes — one paragraph and one visual each.",
        media: [pending("Prototype screenshot"), pending("Prototype screenshot")],
      },
    ],
    outcomes: ["Poster — CHI 2026 Extended Abstracts (MelodyMate)"],
    publications: ["p2026-c1"],
    draft: true,
  },
  {
    id: "raim-reservation-verification",
    title: "RAIM Reservation Verification Automation",
    year: 2026,
    category: "Automation",
    modes: ["shaping"],
    summary: "Automating the verification of visitor reservations at the museum.",
    organization: RAIM,
    hero: pending("Workflow diagram or tool screenshot"),
    sections: [
      { title: "Context", placeholder: "What was verified by hand before, and why it mattered." },
      { title: "Process", placeholder: "How the automation works (stack, data flow)." },
      { title: "Outcome", placeholder: "Verified impact, e.g. time saved — only if measured." },
    ],
    draft: true,
  },
  {
    id: "raim-volunteer-scheduling",
    title: "RAIM Volunteer Scheduling Dashboard",
    year: 2026,
    category: "Dashboard",
    modes: ["shaping"],
    summary: "A dashboard for coordinating volunteer schedules at the museum.",
    organization: RAIM,
    hero: pending("Dashboard screenshot"),
    sections: [
      { title: "Context", placeholder: "Who uses the dashboard and the scheduling problem it addresses." },
      { title: "Process", placeholder: "Design decisions and implementation." },
      { title: "Outcome", placeholder: "Screens and verified results." },
    ],
    draft: true,
  },
  {
    id: "raim-atelier-dashboard",
    title: "RAIM Atelier Management Dashboard",
    year: 2026,
    category: "Dashboard",
    modes: ["shaping"],
    summary: "A dashboard for managing the museum's atelier.",
    organization: RAIM,
    hero: pending("Dashboard screenshot"),
    sections: [
      { title: "Context", placeholder: "What the atelier is and what needed managing." },
      { title: "Process", placeholder: "Design decisions and implementation." },
      { title: "Outcome", placeholder: "Screens and verified results." },
    ],
    draft: true,
  },
  {
    id: "ai-museum-learning",
    title: "AI Museum Learning Experiences",
    year: 2026,
    category: "Learning experience design",
    modes: ["shaping"],
    summary: "Designing learning experiences about AI for museum visitors.",
    role: "Museum educator",
    organization: RAIM,
    hero: pending("Photo of a program or exhibit (with permission)", "3 / 2"),
    sections: [
      { title: "Context", placeholder: "Audience and learning goals." },
      { title: "Process", placeholder: "Activity design, materials, iterations." },
      { title: "Outcome", placeholder: "Photos, materials and verified outcomes." },
    ],
    draft: true,
  },
  {
    id: "ai-robotics-programs",
    title: "AI and Robotics Educational Programs",
    year: null,
    category: "Educational programs",
    modes: ["shaping"],
    summary: "Educational programs about AI and robotics.",
    hero: pending("Program photo or teaching materials", "3 / 2"),
    sections: [
      { title: "Context", placeholder: "Where and for whom the programs ran." },
      { title: "Process", placeholder: "Curriculum and activity design." },
      { title: "Outcome", placeholder: "Materials and verified outcomes." },
    ],
    draft: true,
  },
];

// ---------------------------------------------------------------- helpers ---

export function getProject(id: string | undefined): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjects(filter: ModeFilter): Project[] {
  return filter === "all" ? projects : projects.filter((p) => p.modes.includes(filter));
}

/** Stable display number (01, 02…) based on position in `projects`. */
export function projectNumber(id: string): string {
  return String(projects.findIndex((p) => p.id === id) + 1).padStart(2, "0");
}

export function getAdjacentProjects(id: string, filter: ModeFilter) {
  const list = getProjects(filter);
  const i = list.findIndex((p) => p.id === id);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    prev: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}

export const previewMedia = (p: Project): Media | undefined => p.thumbnail ?? p.hero;
