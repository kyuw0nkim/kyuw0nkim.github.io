// ===========================================================================
// Research vision (/vision/ and /portfolio/) — a conversation-centred portfolio.
// The two entry points differ only through variants.ts.
//
// SOURCING RULE: every sentence here comes from the author's SoP (Fall 2027),
// CV (Oct 2026) or papers. Where a line is not directly sourced it is marked
// `// UNSOURCED` so it can be replaced.
//   • Dilemma: LAK '26 Table 1, scenario 2.
//   • Human utterances: example utterances from the LAK '26 coding scheme
//     (Table 2), quoted verbatim.
//   • Dialogue modes: the three latent modes from ICALT '26 (HMM). Affective
//     and deliberative turns are connected through conversational mediation,
//     as the paper reports direct transitions between them are rare.
// ===========================================================================

export type AnchorId = "games" | "moves" | "modes" | "agent" | "next";
export type Mode = "tracing" | "shaping" | "next";

export interface Evidence {
  id: AnchorId;
  tag: string;
  mode: Mode;
  venue: string;
  title: string;
  /** Finding, in the paper's / SoP's own words. */
  finding: string;
  stats: string[];
  details: { label: string; value: string }[];
  links: { label: string; href: string }[];
}

/** Case studies live in the original portfolio, now at /portfolio-o/. */
export const CASE = (id: string) => `/portfolio-o/#/works/${id}`;

export const evidence: Record<AnchorId, Evidence> = {
  games: {
    id: "games",
    tag: "AIED ’25, ICLS ’25",
    mode: "shaping",
    venue: "AIED 2025, ICLS 2025",
    title: "Dialogic games for AI ethics education",
    // SoP, "Designing Environments for Deliberation"
    finding:
      "Dialogic games designed to engage learners in collective decision-making through structured dialogue. Spanning physical and digital formats, these environments showed that intentionally structured spaces can bring diverse viewpoints into dialogue. Yet many groups reached premature agreement without examining underlying value tensions.",
    stats: ["82 participants", "Tabletop + digital"],
    details: [
      // SoP + CV
      { label: "My role", value: "Designed the cards for the tabletop RPG (FLIP) and built the digital game (The Desk)" },
      // Dilemmas in AI Ethics (AIED) + FLIP (ICLS)
      { label: "Grounded in", value: "Social Intuitionist Model, Moral Foundations Theory, cognitive dissonance" },
    ],
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
    venue: "LAK 2026, full paper, first author",
    title: "Productive Discussion Moves in Groups Addressing Controversial Issues",
    // LAK abstract
    finding:
      "Emotive/experiential arguments, as well as explicit acknowledgment of ambiguity, are strong positive predictors of discussion quality, whereas building on ideas is negatively associated.",
    stats: ["2,199 utterances", "14 discussion moves", "Acknowledging Ambiguity: B = 0.436, p = .040"],
    details: [
      { label: "Data", value: "83 sessions from 51 undergraduates in groups of three" },
      {
        label: "Methods",
        value: "SEDA coding (κ = .80), fine-tuned Korean Sentence-BERT with BERTopic, linear mixed-effects model, Ordered Network Analysis",
      },
    ],
    links: [
      { label: "ACM DL", href: "https://doi.org/10.1145/3785022.3785111" },
      { label: "Code", href: "https://github.com/kyuw0nkim/LAK26-methodology" },
      { label: "Case study", href: CASE("productive-discussion-moves") },
    ],
  },
  modes: {
    id: "modes",
    tag: "ICALT ’26",
    mode: "tracing",
    venue: "IEEE ICALT 2026, full paper, first author",
    title: "Understanding Productive Dialogue in Value-Laden Contexts through Hidden Markov Models",
    // ICALT abstract
    finding:
      "Three recurring dialogue modes emerged: deliberative dialogue, conversational mediation, and affective dialogue. The coexistence of affective and deliberative dialogue modes within a session was a predictor of significantly higher dialogic quality.",
    stats: ["80 sessions", "3 dialogue modes", "Coexistence: β = 0.608, p = .027"],
    details: [
      { label: "Methods", value: "Hidden Markov Models (AIC/BIC model selection), linear mixed-effects models, integrative complexity" },
      { label: "Recognition", value: "IEEE TCLT Best Student Paper Nominee & Student Award" },
    ],
    links: [
      { label: "IEEE", href: "https://doi.org/10.1109/ICALT68022.2026.00046" },
      { label: "Case study", href: CASE("productive-discussion-moves") },
    ],
  },
  agent: {
    id: "agent",
    tag: "M.A. thesis",
    mode: "shaping",
    venue: "M.A. thesis with UC Irvine",
    title: "Examining the Effects of LLM-Based Conversational Agent Participation and Role in Decision-Making on Controversial Issues",
    // SoP, "Scaffolding Deliberation with AI"
    finding:
      "Perspective-contributing agents, by introducing viewpoints participants might not have encountered on their own, significantly broadened the range of ideas explored and led to more integrative group decisions than the human-only baseline.",
    stats: ["21 groups, N = 49", "3 conditions"],
    details: [
      { label: "Conditions", value: "Perspective-contributing agent, process-supporting agent, human-only baseline" },
      { label: "Methods", value: "LLM agents built with Python and LangChain, linear mixed-effects models, Ordered Network Analysis" },
      // UIST '25
      {
        label: "Related",
        value: "UIST ’25 peer agent: if players choose the same stance, the agent adopts the opposing position to introduce tension.",
      },
      { label: "Recognition", value: "Best Paper Award, KAEIM 2026" },
    ],
    links: [
      { label: "Case study", href: CASE("agent-roles-in-deliberation") },
      { label: "UIST ’25 peer agent", href: "https://doi.org/10.1145/3746058.3758410" },
    ],
  },
  next: {
    id: "next",
    tag: "Next",
    mode: "next",
    venue: "Doctoral research",
    title: "What computational measures can capture pivotal moments in a group’s deliberation?",
    // SoP, "Scaffolding" + "Future Directions"
    finding:
      "Because the agents triggered interventions via prompt-based heuristics, their timing was disconnected from systematic evidence of how the group’s conversation was actually evolving. I aim to identify and validate linguistic indicators that capture pivotal moments in a discussion, and translate these measures into AI agents that adapt their support to real-time discourse states.",
    stats: [],
    details: [
      {
        label: "Hypothesis",
        value: "The emergence of subjective uncertainty makes space for participants to reconsider their assumptions and explore alternative views.",
      },
    ],
    links: [],
  },
};

export const anchorOrder: AnchorId[] = ["games", "moves", "modes", "agent", "next"];

// ------------------------------------------------------------ conversation --

export type Speaker = "green" | "pink" | "lilac" | "agent";
export type DialogueMode = "mediation" | "affective" | "deliberative";

export const speakerName: Record<Speaker, string> = {
  green: "A",
  pink: "B",
  lilac: "C",
  agent: "AI agent",
};

export interface Message {
  speaker: Speaker;
  text: string;
  /** Discussion move (LAK '26 coding scheme). */
  move: string;
  mode: DialogueMode;
  /** The whole message is an anchor. */
  anchor?: AnchorId;
  /** The agent's line is not from a paper — see note in the report. */
  unsourced?: boolean;
}

// ICALT '26 mode names.
export const modeLabel: Record<DialogueMode, string> = {
  mediation: "Conversational mediation",
  affective: "Affective dialogue",
  deliberative: "Deliberative dialogue",
};

// LAK '26 Table 1, scenario 2.
export const dilemma =
  "After an emotional upgrade, a user’s mother became attached to a household android. Should further emotional upgrades be allowed?";

// Utterances: LAK '26 Table 2 examples (verbatim, translated by the authors).
export const messages: Message[] = [
  { speaker: "green", text: "I absolutely think restrictions are needed.", move: "Position Declaration", mode: "mediation" },
  { speaker: "pink", text: "Right.", move: "Conversation Maintenance", mode: "mediation" },
  { speaker: "lilac", text: "Let’s collect our opinions.", move: "Facilitating Agreement", mode: "mediation" },
  { speaker: "pink", text: "This is tough.", move: "Acknowledging Ambiguity", mode: "affective", anchor: "moves" },
  {
    speaker: "agent",
    // UNSOURCED — replace with an utterance from the thesis agent logs.
    text: "Let me take the other side. What if her attachment to the android is something she actually needs?",
    move: "Opposing position (peer agent)",
    mode: "mediation",
    anchor: "agent",
    unsourced: true,
  },
  {
    speaker: "lilac",
    text: "I’m an only child… and honestly, as someone who always wanted siblings, I don’t think this robot is such a bad idea.",
    move: "Emotive/Experiential Argument",
    mode: "affective",
  },
  { speaker: "pink", text: "Exactly.", move: "Conversation Maintenance", mode: "mediation" },
  {
    speaker: "green",
    text: "Think about when laptops were first developed; their energy efficiency was terrible at the start… So maybe this robot is just in that initial phase.",
    move: "Connecting with External Contexts",
    mode: "deliberative",
  },
];

/** The uncertain turn — the pivotal moment the agent notices before speaking. */
export const PIVOT_INDEX = 3;

// SoP: "My goal as a researcher is to design AI-supported learning environments
// helping people engage in constructive dialogue. Specifically, I aim to ground
// AI design in empirical discourse research, examining how group discussions
// unfold to inform when and how systems support them."
export const vision =
  "I aim to design AI-supported learning environments that help people engage in constructive dialogue — grounding AI design in empirical discourse research that examines how group discussions unfold, to inform when and how systems support them.";

// ---------------------------------------------------------------- works ----

export interface Work {
  id: string;
  title: string;
  venue: string;
  line: string;
  image: string;
  alt: string;
}

const thumb = (f: string) => `/thumbnails/${encodeURIComponent(f)}`;

export const works: Work[] = [
  {
    id: "productive-discussion-moves",
    title: "Productive Discussion Moves",
    venue: "LAK ’26, IEEE ICALT ’26",
    // LAK abstract
    line: "Productive ethical discussion is grounded not only in reasoning and justification but also in the constructive integration of emotional expression.",
    image: thumb("pic.C.Productive Discussion.png"),
    alt: "Ordered networks of discussion moves in high- and low-quality discussion groups.",
  },
  {
    id: "agent-roles-in-deliberation",
    title: "Agent Roles in Deliberation",
    venue: "M.A. thesis, KAEIM ’26 Best Paper",
    // SoP
    line: "What role generative AI agents should play in deliberation to foster constructive dialogue.",
    image: thumb("pic.C.논쟁문제 의사결정.png"),
    alt: "Box plots comparing discussion and decision measures across three conditions.",
  },
  {
    id: "your-thoughtful-opponent",
    title: "Your Thoughtful Opponent",
    venue: "UIST ’25 Adjunct",
    // UIST abstract
    line: "A peer agent designed to simulate a deliberative conversational partner that induces socio-cognitive conflict within dilemma-based game play.",
    image: thumb("pic.P.Your Thoughtful.png"),
    alt: "Peer agent workflow: Context Interpreter, Agent State Manager, Thought Generator, Thought Evaluator and Thought Articulator.",
  },
  {
    id: "ai-ethics-games",
    title: "AI Ethics Through Play",
    venue: "AIED ’25, ICLS ’25",
    // AIED + ICLS abstracts
    line: "A digital game and a tabletop role-playing game that engage players in moral reasoning and collective decision-making about killer robots.",
    image: thumb("pic.C.Dilemmas in.png"),
    alt: "Screens of The Desk: Dilemmas in AI Ethics.",
  },
];

// CV titles.
export const otherWork: { title: string; venue: string; href: string }[] = [
  {
    title: "How Learners Engage with an LLM-Based Pedagogical Conversational Agent During Music Form Analysis",
    venue: "CHI ’26 EA",
    href: CASE("conversational-agent-prototypes"),
  },
  {
    title: "Bridging Literacy with AI: AI-Integrated Digital Textbook for Deaf and Hard-of-Hearing Students",
    venue: "IDC ’25 EA",
    href: CASE("bridging-literacy"),
  },
  {
    title: "What Do University Students Say About ChatGPT? A Topic Modeling of Perception on GenAI in Academic Writing",
    venue: "ICCE ’24, Best Poster",
    href: CASE("mapping-ai-in-education"),
  },
];
