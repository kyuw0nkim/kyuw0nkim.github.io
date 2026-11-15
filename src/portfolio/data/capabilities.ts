import type { Mode } from "./types";

// ===========================================================================
// ABOUT — research capabilities, teaching & practice, recognition.
// Source: October 2026 CV. Project ids refer to data/projects.ts.
// ===========================================================================

export interface Capability {
  title: string;
  mode: Mode;
  /** What the capability lets me do, in one line. */
  line: string;
  methods: string[];
  /** Projects where this capability is visible. */
  works: string[];
}

export const capabilities: Capability[] = [
  {
    title: "Study design",
    mode: "tracing",
    line: "Experiments and user studies run end to end — from design and recruitment to data collection and analysis.",
    methods: ["Multi-condition group experiments", "User studies (100+ participants)", "Cross-institutional collaboration", "Interviews", "Eye-tracking (Tobii)"],
    works: ["agent-roles-in-deliberation", "ai-ethics-games"],
  },
  {
    title: "Discourse analysis",
    mode: "tracing",
    line: "Theory-driven coding frameworks that make the moves of a discussion countable.",
    methods: ["SEDA-based coding", "Discussion-move frameworks", "Ko-SBERT semantic clustering", "BERTopic"],
    works: ["productive-discussion-moves", "agent-roles-in-deliberation"],
  },
  {
    title: "Computational modeling",
    mode: "tracing",
    line: "Models of how interaction unfolds over time, and what it is associated with.",
    methods: ["Hidden Markov Models", "Ordered Network Analysis", "Linear mixed-effects models", "Topic modeling", "Scanpath Trend Analysis"],
    works: ["productive-discussion-moves", "agent-roles-in-deliberation", "mapping-ai-in-education"],
  },
  {
    title: "Building AI agents",
    mode: "shaping",
    line: "LLM-based agents that take part in multi-party conversation, not just one-on-one chat.",
    methods: ["Python", "LangChain", "PyTorch / TensorFlow", "Agent memory & participation rules", "React"],
    works: ["your-thoughtful-opponent", "agent-roles-in-deliberation", "conversational-agent-prototypes"],
  },
  {
    title: "Prototyping & learning design",
    mode: "shaping",
    line: "Turning learning theory into games, interfaces, and workshops people can actually use.",
    methods: ["Figma", "ProtoPie", "Game-based learning", "Learning-analytics dashboards", "Workshop facilitation"],
    works: ["ai-ethics-games", "bridging-literacy", "hspace-learning-experiences"],
  },
];

export interface PracticeItem {
  role: string;
  place: string;
  when: string;
  text: string;
}

/** Teaching and applied work outside the lab. */
export const practice: PracticeItem[] = [
  {
    role: "Consultant",
    place: "College of Education, Ewha Womans University",
    when: "2026 –",
    text: "Advising the pedagogical design of an AI agent that helps preservice teachers develop and revise lesson plans — translating instructional-design principles into functional requirements.",
  },
  {
    role: "Museum Educator",
    place: "Seoul Robot & AI Museum",
    when: "2026 –",
    text: "Bilingual, inquiry-based tours for audiences from children to museum professionals, and self-guided tour apps that use micro-scaffolding to sustain engagement with exhibits.",
  },
  {
    role: "Lecturer",
    place: "Vibe-coding workshops, Ewha Womans University",
    when: "2026",
    text: "Teaching non-programmers and high-school students to turn ideas into interactive web applications through AI-assisted, iterative prototyping.",
  },
  {
    role: "Consultant",
    place: "HSPACE",
    when: "2024 –",
    text: "Co-designed an AI penetration competition selected for DEF CON 34, designed a leadership workshop for 120 student leaders, and mentor an instructional-design intern.",
  },
];

export const recognition: string[] = [
  "IEEE TCLT Best Student Paper Nominee & Student Award — ICALT 2026",
  "Best Paper Award — Korean Association for Educational Information and Media, 2026",
  "Best Poster Award — ICCE 2024 (1st of 57 submissions)",
  "Excellence Award — Korean National Commission for UNESCO, 2024",
  "M.A. GPA 4.0 / 4.0 with full-tuition scholarship · B.A./B.S.E. summa cum laude",
];
