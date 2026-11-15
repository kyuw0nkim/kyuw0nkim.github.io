// ===========================================================================
// Portfolio C (/portfolio-c/) — a conversation-centred portfolio.
//
// The hero is a scripted group conversation in which an AI agent steps in.
// Tagged parts of the conversation ("anchors") reveal the research behind them.
// Findings and numbers come from the Fall 2027 SoP and the October 2026 CV;
// the conversation itself is illustrative and labelled so on the page.
// ===========================================================================

export type AnchorId = "games" | "moves" | "states" | "agent" | "next";

export interface Evidence {
  id: AnchorId;
  /** Short tag shown in the conversation. */
  tag: string;
  /** Which side of the work this is. */
  mode: "tracing" | "shaping" | "next";
  /** What this part of the conversation stands for. */
  stands: string;
  venue: string;
  title: string;
  finding: string;
  stats: string[];
  methods?: string;
  role?: string;
  award?: string;
  links: { label: string; href: string }[];
}

const CASE = (id: string) => `/portfolio/#/works/${id}`;

export const evidence: Record<AnchorId, Evidence> = {
  games: {
    id: "games",
    tag: "AIED ’25 · ICLS ’25",
    mode: "shaping",
    stands: "Where the conversation comes from",
    venue: "AIED 2025 · ICLS 2025",
    title: "Dialogue games for AI ethics",
    finding:
      "Tabletop and digital games that bring diverse viewpoints into collective decisions. They showed a key problem: many groups agreed before examining the values underneath. Exposure to other views did not guarantee reconsidering one's own.",
    stats: ["82 participants", "Tabletop + digital"],
    methods: "Game design · Figma · ProtoPie · User studies",
    role: "Led prototype design & development",
    links: [
      { label: "AIED paper", href: "https://doi.org/10.1007/978-3-031-98417-4_31" },
      { label: "ICLS paper", href: "https://doi.org/10.22318/icls2025.945127" },
      { label: "Case study", href: CASE("ai-ethics-games") },
    ],
  },
  moves: {
    id: "moves",
    tag: "LAK ’26",
    mode: "tracing",
    stands: "What makes a turn productive",
    venue: "LAK 2026 · Full paper",
    title: "Productive discussion moves in groups addressing controversial issues",
    finding:
      "Explicitly acknowledging ambiguity and uncertainty was linked to more productive deliberation — recognizing one's own limits opens room for competing views.",
    stats: ["2,199 utterances", "14 discussion moves"],
    methods: "SEDA-based coding · Ko-SBERT / BERTopic · Ordered Network Analysis",
    role: "First author",
    links: [
      { label: "ACM DL", href: "https://doi.org/10.1145/3785022.3785111" },
      { label: "Case study", href: CASE("productive-discussion-moves") },
    ],
  },
  states: {
    id: "states",
    tag: "ICALT ’26",
    mode: "tracing",
    stands: "How the discussion moves over time",
    venue: "IEEE ICALT 2026 · Full paper",
    title: "Understanding productive dialogue in value-laden discussions through Hidden Markov Models",
    finding:
      "Discussions that combined emotional engagement with logical examination were associated with higher-quality deliberation.",
    stats: ["80 discussions", "3 dialogue states"],
    methods: "Hidden Markov Models · discourse coding",
    role: "First author",
    award: "IEEE TCLT Best Student Paper Nominee & Student Award",
    links: [
      { label: "IEEE", href: "https://doi.org/10.1109/ICALT68022.2026.00046" },
      { label: "arXiv", href: "https://doi.org/10.48550/arXiv.2601.05651" },
      { label: "Case study", href: CASE("productive-discussion-moves") },
    ],
  },
  agent: {
    id: "agent",
    tag: "M.A. thesis",
    mode: "shaping",
    stands: "What role the agent should play",
    venue: "M.A. thesis · with UC Irvine",
    title: "How conversational agent roles shape group deliberation on controversial issues",
    finding:
      "Compared with human-only groups, a perspective-contributing agent significantly broadened the ideas explored and led to more integrative group decisions. A process-supporting agent did not.",
    stats: ["21 groups · N = 49", "3 conditions"],
    methods: "LLM agents (Python, LangChain) · Linear mixed-effects models · Ordered Network Analysis",
    role: "First author · led cross-institutional study",
    award: "Best Paper Award, KAEIM 2026 · journal manuscript under review",
    links: [
      { label: "Case study", href: CASE("agent-roles-in-deliberation") },
      { label: "Related: peer-agent design (UIST ’25)", href: CASE("your-thoughtful-opponent") },
    ],
  },
  next: {
    id: "next",
    tag: "Next",
    mode: "next",
    stands: "When the agent should speak",
    venue: "Doctoral research",
    title: "From measurement to intervention",
    finding:
      "Today the agent decides when to speak through prompt-based heuristics, disconnected from how the conversation is actually evolving. I want to identify and validate linguistic indicators of pivotal moments — such as the emergence of uncertainty — and build agents that adapt their support to the real-time discourse state.",
    stats: ["Hypothesis: uncertainty makes room to reconsider"],
    links: [],
  },
};

export const anchorOrder: AnchorId[] = ["games", "moves", "states", "agent", "next"];

// ------------------------------------------------------------ conversation --

export type Speaker = "green" | "white" | "pink" | "lilac" | "agent";

export const speakerName: Record<Speaker, string> = {
  green: "Jun",
  white: "Mina",
  pink: "Seo",
  lilac: "Ari",
  agent: "AI agent",
};

export interface Message {
  speaker: Speaker;
  /** Text; a `highlight` substring is marked as an anchor. */
  text: string;
  highlight?: { text: string; anchor: AnchorId };
  /** The whole bubble is an anchor. */
  anchor?: AnchorId;
  state: DialogueState;
}

export type DialogueState = "position" | "converging" | "uncertainty" | "perspective" | "integrating";

export const stateLabel: Record<DialogueState, string> = {
  position: "Taking positions",
  converging: "Converging",
  uncertainty: "Uncertainty",
  perspective: "New perspective",
  integrating: "Integrating",
};

export const dilemma = {
  label: "Dilemma card",
  text: "Should your school use AI to flag students at risk of dropping out?",
};

export const messages: Message[] = [
  { speaker: "green", text: "Yes. Flagging students early is how you actually help them.", state: "position" },
  { speaker: "white", text: "Agreed — early support is the whole point.", state: "converging" },
  { speaker: "pink", text: "Sounds good to me too.", state: "converging" },
  {
    speaker: "lilac",
    text: "Hmm… I'm honestly not sure. What if being flagged changes how teachers see you?",
    highlight: { text: "I'm honestly not sure.", anchor: "moves" },
    state: "uncertainty",
  },
  {
    speaker: "agent",
    text: "One view we haven't heard yet is the flagged student's. How might an “at-risk” label feel — and who should be able to see it?",
    anchor: "agent",
    state: "perspective",
  },
  { speaker: "green", text: "That's fair. Maybe only counselors see it, and the student gets a say.", state: "integrating" },
];

/** Index of the message the agent "notices" before speaking (the pivotal moment). */
export const PIVOT_INDEX = 3;

export const vision =
  "I design AI-supported learning environments that help people engage in constructive dialogue across differences — grounding when and how AI steps in on evidence of how group discussions actually unfold.";

// ---------------------------------------------------------------- works ----

export interface Work {
  id: string;
  title: string;
  venue: string;
  line: string;
  image: string;
  alt: string;
  mode: "tracing" | "shaping";
}

const thumb = (f: string) => `/thumbnails/${encodeURIComponent(f)}`;

export const works: Work[] = [
  {
    id: "productive-discussion-moves",
    title: "Productive Discussion Moves",
    venue: "LAK ’26 · IEEE ICALT ’26",
    line: "Which moves and dialogue states make value-laden group discussion productive.",
    image: thumb("pic.C.Productive Discussion.png"),
    alt: "Network diagrams of discussion moves in high- and low-quality discussions.",
    mode: "tracing",
  },
  {
    id: "agent-roles-in-deliberation",
    title: "Agent Roles in Deliberation",
    venue: "M.A. thesis · KAEIM ’26 Best Paper",
    line: "Does it matter how an AI agent takes part in a group decision?",
    image: thumb("pic.C.논쟁문제 의사결정.png"),
    alt: "Box plots comparing discussion and decision measures across three conditions.",
    mode: "shaping",
  },
  {
    id: "your-thoughtful-opponent",
    title: "Your Thoughtful Opponent",
    venue: "UIST ’25 Adjunct",
    line: "A peer agent that decides what to contribute and when to speak.",
    image: thumb("pic.P.Your Thoughtful.png"),
    alt: "System diagram of the peer agent's context interpreter, thought formation and participation rules.",
    mode: "shaping",
  },
  {
    id: "ai-ethics-games",
    title: "AI Ethics Through Play",
    venue: "AIED ’25 · ICLS ’25",
    line: "Dialogue games that bring competing values into collective decisions.",
    image: thumb("pic.C.Dilemmas in.png"),
    alt: "Overview of the digital game for AI ethics dilemmas.",
    mode: "shaping",
  },
];

export const otherWork: { title: string; venue: string; href: string }[] = [
  { title: "MelodyMate — a conversational partner for music form analysis", venue: "CHI ’26 EA", href: CASE("conversational-agent-prototypes") },
  { title: "Bridging Literacy with AI — a digital textbook for DHH students", venue: "IDC ’25 EA", href: CASE("bridging-literacy") },
  { title: "Mapping AI in Education — reviews and topic modeling", venue: "ICCE ’24 Best Poster", href: CASE("mapping-ai-in-education") },
  { title: "Learning experiences at HSPACE — incl. a DEF CON 34 competition", venue: "Practice", href: CASE("hspace-learning-experiences") },
];
