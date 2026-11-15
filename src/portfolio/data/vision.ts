import type { Mode } from "./types";

// ===========================================================================
// RESEARCH VISION — the /vision page (#/vision).
//
// Grounded in the Fall 2027 Statement of Purpose and the October 2026 CV.
// Numbers and findings here must match those documents; the discussion
// vignette (`trace`) is an illustrative, scripted sketch and is labelled so.
// ===========================================================================

export const vision = {
  kicker: "Research vision",
  statement: "Much of what feels out of reach is simply what we have never encountered.",
  lede: [
    "I design AI-supported learning environments that help people engage in constructive dialogue across differences. My aim is to ground AI design in empirical discourse research — studying how group discussions actually unfold, so that systems know when and how to support them.",
  ],
  prologue:
    "As a freshman research assistant, I went looking for a missing reference on the twentieth page of Google Scholar and found a future I had never considered. As the first in my family to pursue graduate study, I have kept asking the same question since: if we cannot see our own blind spots alone, can engaging with others' lived perspectives carry us past them?",
};

/** A step in the research arc. Each ends with the pivotal moment that led to the next one. */
export interface Chapter {
  id: string;
  /** Short label shown on the arc ribbon. */
  short: string;
  title: string;
  years: string;
  modes: Mode[];
  /** Which side of the scene lights up while this chapter is on screen. */
  glow: Mode;
  body: string[];
  /** Evidence chips — verified figures only. */
  evidence: string[];
  /** Methods used in this chapter. */
  methods: string[];
  /** Project ids in data/projects.ts. */
  works: string[];
  /** The tension observed — the question that opened the next chapter. */
  pivot?: { observed: string; question: string };
}

export const chapters: Chapter[] = [
  {
    id: "environments",
    short: "Design spaces",
    title: "Designing environments for deliberation",
    years: "2024 – 2025",
    modes: ["shaping"],
    glow: "shaping",
    body: [
      "My research began with dialogue-based games for AI ethics education, built so that learners make collective decisions through structured discussion. I designed the cards for our tabletop role-play game and drew on my software engineering background to build the digital game.",
    ],
    evidence: ["82 participants", "Tabletop + digital formats", "ICLS ’25 · AIED ’25"],
    methods: ["Figma", "ProtoPie", "Game-based learning design", "User studies"],
    works: ["ai-ethics-games"],
    pivot: {
      observed:
        "Participants joined the conversation readily — but many groups reached agreement before ever examining the value tensions underneath.",
      question: "Being exposed to other perspectives didn't guarantee reconsidering one's own. What could help inside the conversation?",
    },
  },
  {
    id: "agents",
    short: "Add an agent",
    title: "Scaffolding deliberation with AI",
    years: "2025 – 2026",
    modes: ["shaping", "tracing"],
    glow: "shaping",
    body: [
      "For my master's thesis I asked what role a generative AI agent should play in group deliberation. I initiated a cross-institutional collaboration with UC Irvine to adapt a platform for synchronous, multi-user human–AI teaming, and compared groups with a perspective-contributing agent, a process-supporting agent, and no agent.",
      "Perspective-contributing agents — introducing viewpoints the group might not have reached on its own — significantly broadened the ideas explored and led to more integrative group decisions than human-only groups.",
    ],
    evidence: ["21 groups · N = 49", "3 conditions", "Best Paper Award, KAEIM ’26"],
    methods: ["Python + LangChain agents", "Controlled experiment", "Linear mixed-effects models", "Ordered Network Analysis"],
    works: ["agent-roles-in-deliberation", "your-thoughtful-opponent"],
    pivot: {
      observed:
        "The agents decided when to speak through prompt-based heuristics — their timing was disconnected from evidence of how the group's conversation was actually evolving.",
      question: "What computational measures can capture the pivotal moments in a group's deliberation — to guide when and how AI should intervene?",
    },
  },
  {
    id: "dynamics",
    short: "Read the dialogue",
    title: "Uncovering deliberative dynamics",
    years: "2025 – 2026",
    modes: ["tracing"],
    glow: "tracing",
    body: [
      "Most dialogue research centers on logic-driven problem solving; contested, value-laden discussion has received far less attention. I coupled theory-driven qualitative coding with BERT-based semantic modeling to analyze group dialogue about ethical dilemmas.",
      "Explicitly acknowledging ambiguity and uncertainty was linked to more productive deliberation (LAK ’26). Modeling interaction patterns with Hidden Markov Models, discussions that combined emotional engagement with logical examination were associated with higher-quality deliberation (IEEE ICALT ’26).",
    ],
    evidence: ["2,199 utterances", "80 discussions", "Best Student Paper Nominee, ICALT ’26"],
    methods: ["SEDA-based coding", "Ko-SBERT · BERTopic", "Hidden Markov Models", "Ordered Network Analysis"],
    works: ["productive-discussion-moves"],
  },
];

/** Where the arc goes next: closing the loop between tracing and shaping. */
export const next = {
  title: "From measurement to intervention",
  hypothesis:
    "One hypothesis guides me: the emergence of subjective uncertainty makes space for people to reconsider their assumptions and explore alternative views.",
  steps: [
    { mode: "tracing" as Mode, label: "Detect", text: "Identify and validate linguistic indicators of pivotal moments in a discussion." },
    { mode: "tracing" as Mode, label: "Model", text: "Track how the dialogue's state evolves over time, turn by turn." },
    { mode: "shaping" as Mode, label: "Adapt", text: "Build AI agents that adjust their support to the real-time discourse state." },
    { mode: "shaping" as Mode, label: "Examine", text: "Study when and how those interventions deepen collective thinking." },
  ],
  closing:
    "After my PhD, I hope to continue this work in academia and mentor future scholars. As a first-generation graduate student who relied on generous mentors to navigate academia's unwritten rules, I want to pay that guidance forward.",
};

// ---------------------------------------------------------------------------
// "A discussion, traced" — an illustrative, scripted vignette of the research
// direction. Speakers borrow the colours of the characters in the hero scene;
// the laptop on the table is the agent. NOT study data.
// ---------------------------------------------------------------------------

export type Speaker = "green" | "white" | "pink" | "lilac" | "agent";

export interface TraceTurn {
  speaker: Speaker;
  text: string;
  /** Discourse code shown on the turn. */
  move: string;
  /** Dialogue state this turn moves the group into (drives the ribbon). */
  state: "position" | "converging" | "uncertainty" | "perspective" | "integrating";
  /** What the agent is doing at this point. */
  agent: string;
  pivotal?: boolean;
}

export const traceDilemma = "Should a school use AI to flag students at risk of dropping out?";

export const traceTurns: TraceTurn[] = [
  {
    speaker: "green",
    text: "Yes — catching it early is how you actually help someone.",
    move: "Position",
    state: "position",
    agent: "Listening",
  },
  {
    speaker: "white",
    text: "Agreed. Early support is the whole point.",
    move: "Agreement",
    state: "converging",
    agent: "Listening · group converging quickly",
  },
  {
    speaker: "pink",
    text: "Same here, sounds good to me.",
    move: "Agreement",
    state: "converging",
    agent: "Listening · values not yet examined",
  },
  {
    speaker: "lilac",
    text: "Hmm… I'm honestly not sure. What if being flagged changes how teachers see you?",
    move: "Acknowledging uncertainty",
    state: "uncertainty",
    agent: "Pivotal moment — room to reconsider",
    pivotal: true,
  },
  {
    speaker: "agent",
    text: "A view we haven't heard yet is the flagged student's. How might an “at-risk” label feel — and who should be able to see it?",
    move: "Contributing a perspective",
    state: "perspective",
    agent: "Speaking — contributing an unheard perspective",
  },
  {
    speaker: "green",
    text: "That's fair. Maybe only counselors see it, and the student is part of the conversation.",
    move: "Building on ideas",
    state: "integrating",
    agent: "Listening",
  },
];

export const traceStates: Record<TraceTurn["state"], string> = {
  position: "Taking positions",
  converging: "Converging",
  uncertainty: "Uncertainty",
  perspective: "New perspective",
  integrating: "Integrating",
};
