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
// • Content provenance and remaining limits: portfolio/CONTENT_SOURCES.md.
// • Never fill gaps with guessed results, roles, or publication claims.
// ===========================================================================

/** Reference an image in public/thumbnails/ (handles spaces and Korean names). */
const thumb = (file: string) => `/thumbnails/${encodeURIComponent(file)}`;

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
          "The LAK study analyzed 83 discussion sessions from 51 undergraduates in groups of three. Expert-informed SEDA coding and BERTopic clustering were combined to identify 14 discussion moves across five categories. Ordered Network Analysis (ONA) then examined how those moves followed one another in groups with different discussion quality.",
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
        title: "What makes dialogue productive?",
        body: [
          "Emotive and experiential arguments, together with explicit acknowledgment of ambiguity, were positively associated with discussion quality. More productive discussions connected emotional and personal experience to evidence-based reasoning. This suggests that analytics for ethical discussion need to capture how people work through values and feelings alongside their arguments.",
          "A companion ICALT study used Hidden Markov Models to recover latent dialogue states and their transitions: deliberative dialogue, conversational mediation, and affective dialogue. Together, the studies connect observable discussion moves with the evolving process of thinking together.",
        ],
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
          "The study assigned 49 graduate students to human-only, supporter-agent, and peer-agent conditions for AI ethics dilemma discussions. The supporter summarized and coordinated without expressing its own position; the peer participated as an equal teammate, contributing a position and reasons.",
          "Evaluation separated objective decision quality from participants' experience: perspective diversity in the discussion and integrative complexity in the joint statement were examined alongside perceived discussion and decision quality, team satisfaction, and interviews. The agent's identity was disclosed after discussion to limit prior expectations.",
        ],
      },
      {
        title: "Better decisions can feel harder",
        body: [
          "Compared with human-only groups, peer-agent groups showed significantly greater perspective diversity and integrative complexity. Supporter-agent groups showed no significant improvement over human-only groups on the measured variables.",
          "Participants' experience did not mirror objective performance: human-only groups reported the highest mean perceived discussion and decision quality, while supporter-agent groups reported significantly lower team satisfaction than human-only groups. Interviews pointed to mismatches between expected and delivered support. The design implication is to evaluate both the quality of collective reasoning and how the intervention is experienced.",
        ],
      },
    ],
    outcomes: ["Best Paper Award — KAEIM 2026 Spring Conference"],
    publications: ["p2026-c3"],
  },
  {
    id: "stealth-assessment",
    title: "Stealth Assessment",
    subtitle: "Exploring moral perspectives through educational dialogue",
    year: 2025,
    category: "NLP · Research prototype",
    modes: ["tracing"],
    summary:
      "Exploring how language models can detect the moral perspectives expressed in AI ethics discussions without interrupting the conversation.",
    role: "Research and modeling exploration",
    organization: IDL,
    sections: [
      {
        title: "Reading values in conversation",
        body: [
          "Learners can disagree about an AI dilemma because they prioritize different values. This exploratory work asks whether those perspectives can be identified from the dialogue itself, providing evidence for learning support while the group continues its discussion.",
        ],
      },
      {
        title: "From theory to a detection task",
        body: [
          "Moral Foundations Theory provides six dimensions for interpreting utterances: care, loyalty, authority, equality, purity, and proportionality. The research explores adapting a language model from a general moral-language corpus to transcribed educational dialogue, and examining the contribution of conversational context.",
        ],
      },
      {
        title: "Research direction",
        body: [
          "The aim is to connect interpretable evidence of expressed values with interventions that introduce underexplored perspectives. This remains an exploratory prototype; it does not establish a validated measure of a learner's moral beliefs or a demonstrated improvement in learning.",
        ],
      },
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
      },
      {
        title: "A design for constructive disagreement",
        body: [
          "The resulting peer-agent architecture links interpretation, memory, internal thought evaluation, and participation rules. It makes both what to contribute and when to speak explicit design decisions, with the goal of sustaining cognitive conflict during deliberation.",
          "Presented as a UIST 2025 poster, the work documents the prototype and its design rationale. The related Agent Roles in Deliberation study separately examines how an agent's participation role changes group decision-making.",
        ],
      },
    ],
    outcomes: ["Poster — UIST 2025 Extended Abstracts"],
    publications: ["p2025-c1"],
  },
  {
    id: "conversational-agent-prototypes",
    title: "MelodyMate",
    subtitle: "A conversational partner for music form analysis",
    year: 2026,
    category: "Interactive systems",
    modes: ["shaping"],
    summary:
      "An interactive score, MIDI playback, and an LLM-based pedagogical agent bring listening, notation, and dialogue into one music-analysis environment.",
    role: "Co-author",
    organization: IDL,
    collaborators: "Lingxi Jin, Baicheng Lin, Mengze Hong, Hyo-Jeong So",
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
        title: "Making musical structure discussable",
        body: [
          "Music form analysis asks learners to connect what they hear with how a piece is organized. MelodyMate brings the score, playback, and a conversational partner into the same workspace, so learners can move between musical evidence and questions about form.",
          "Scores (PDF or image) are pre-processed through optical music recognition, MIDI conversion and ABC-notation conversion, so learners can play the piece back on an interactive sheet while talking with the agent about its form.",
        ],
      },
      {
        title: "Designing the interaction",
        points: [
          "An interactive music sheet anchors the conversation in the piece being studied.",
          "MIDI playback lets learners listen while inspecting the notation.",
          "An LLM-based pedagogical conversational agent supports dialogue about musical form alongside the score.",
        ],
      },
      {
        title: "Studying learner engagement",
        body: [
          "The CHI 2026 Extended Abstracts paper examines how learners engage with the agent during music form analysis. This case brings together an interactive learning environment and an investigation of the conversations it supports.",
        ],
      },
    ],
    outcomes: ["Poster — CHI 2026 Extended Abstracts (MelodyMate)"],
    publications: ["p2026-c1"],
  },

  {
    id: "ai-ethics-games",
    title: "AI Ethics Through Play",
    subtitle: "Digital dilemmas and tabletop role-play for collective decision-making",
    year: 2025,
    category: "Game-based learning · AI ethics",
    modes: ["shaping", "tracing"],
    summary:
      "Designing dialogue-based games that invite learners to encounter competing values, explain their positions, and make collective decisions about AI ethics.",
    role: "Co-author · Game-based learning research",
    organization: IDL,
    collaborators: "Sung-Eun Kim, Jeanhee Lee, Yeji Ko, Yue Wang, Hyo-Jeong So (across related studies)",
    hero: {
      kind: "image",
      src: thumb("pic.C.Dilemmas in.png"),
      alt: "Overview of the digital game for AI ethics dilemmas and collective decision-making.",
      caption: "Dilemmas in AI Ethics — a digital game for moral reasoning and collective decision-making.",
      aspect: "3 / 2",
      frame: "figure",
    },
    sections: [
      {
        title: "Learning through competing values",
        body: [
          "AI ethics dilemmas rarely have a single answer that satisfies every stakeholder. Our team designed dialogue-based learning environments in which learners encounter competing values and work toward a collective decision through structured discussion.",
        ],
      },
      {
        title: "Two forms of play",
        body: [
          "The digital game places moral reasoning and collective decision-making at the center of the activity. FLIP, a tabletop role-play game, explores cognitive dissonance as a resource for AI ethics education. Across this work, I participated in translating theoretical frameworks into prototypes and studying the learner interactions they supported.",
        ],
        media: [
          {
            kind: "image",
            src: thumb("pic.C.FLIP.png"),
            alt: "Research overview of FLIP, a tabletop role-play game for AI ethics education.",
            caption: "FLIP — tabletop role-play for AI ethics education through cognitive dissonance.",
            aspect: "3 / 2",
            frame: "figure",
          },
        ],
      },
      {
        title: "From game design to dialogue research",
        body: [
          "The work was reported at AIED 2025 and ICLS 2025, and in a journal article on supporting ethical discourse through collective decision-making. Observing groups reach premature consensus helped motivate my subsequent work on peer agents and the analysis of productive discussion.",
        ],
      },
    ],
    outcomes: ["Digital game — AIED 2025", "FLIP — ICLS 2025", "Journal article — Educational Information and Media, 2025"],
    publications: ["p2025-c2", "p2025-c4", "p2025-j1"],
  },
  {
    id: "bridging-literacy",
    title: "Bridging Literacy with AI",
    subtitle: "An AI-integrated digital textbook for deaf and hard-of-hearing students",
    year: 2025,
    category: "Inclusive learning · Digital textbook",
    modes: ["shaping"],
    summary:
      "Exploring AI integration in a digital textbook designed around the literacy learning needs of deaf and hard-of-hearing students.",
    role: "Co-author",
    organization: IDL,
    collaborators: "Ga Young Lee, Seonhee Na, Hyo-Jeong So",
    hero: {
      kind: "image",
      src: thumb("pic.P.Bridging Literacy.png"),
      alt: "Research overview of an AI-integrated digital textbook for deaf and hard-of-hearing students.",
      caption: "Bridging Literacy with AI — digital textbook research presented at IDC 2025.",
      aspect: "3 / 2",
      frame: "figure",
    },
    sections: [
      {
        title: "Starting with the learner",
        body: [
          "This project explores literacy support for deaf and hard-of-hearing students through an AI-integrated digital textbook. Its focus on a specific learner community places accessibility and learning needs at the center of the educational design question.",
        ],
      },
      {
        title: "AI within a learning resource",
        body: [
          "The work brings AI into the digital textbook format as a setting for literacy learning. It extends my broader interest in learning technologies to the question of how an AI-supported resource can be designed for learners with different access needs.",
        ],
      },
      {
        title: "Research contribution",
        body: [
          "The collaborative project was presented in the IDC 2025 Extended Abstracts. The publication documents an AI-integrated textbook concept for this learner community and connects it to the wider discussion of inclusive educational technology.",
        ],
      },
    ],
    outcomes: ["Extended abstract — ACM Interaction Design and Children 2025"],
    publications: ["p2025-c3"],
  },
  {
    id: "hspace-learning-experiences",
    title: "Learning Experiences at HSPACE",
    subtitle: "Cybersecurity training and game-based leadership workshops",
    year: 2024,
    category: "Learning experience design",
    modes: ["shaping"],
    summary:
      "Turning specialist knowledge into training programs and participatory workshops, from cybersecurity learning to student-club leadership.",
    role: "Learning Experience Designer",
    organization: "HSPACE",
    collaborators: "Cybersecurity subject matter experts and program teams",
    sections: [
      {
        title: "Designing with domain experts",
        body: [
          "Beginning in January 2024, I worked with subject matter experts to design, develop, and operate cybersecurity and hacking training programs. The work connects instructional design with the practical needs of a specialist learning community.",
        ],
      },
      {
        title: "Making organizational identity tangible",
        body: [
          "A game-based branding workshop translates mission, vision, and core values into choices that student-club leaders can discuss. Teams define a target member persona, combine Club Value Proposition cards, and prepare a short recruitment pitch. Participants then vote from their assigned personas' perspectives.",
          "The activity connects those choices to a club's current and desired value proposition, then moves toward a slogan, communication channels, and indicators for assessing branding. It turns an abstract organizational topic into a sequence of decisions, peer responses, and reflection.",
        ],
      },
      {
        title: "Facilitation and delivery",
        body: [
          "My documented experience includes designing and facilitating a leadership workshop for 120 student organization leaders, incorporating a game-based session on organizational branding. Alongside cybersecurity training, this work shows how I structure learning activities and carry them into facilitation.",
        ],
      },
    ],
    outcomes: ["Cybersecurity training design, development, and operation", "Leadership workshop designed and facilitated for 120 student organization leaders"],
  },
  {
    id: "mapping-ai-in-education",
    title: "Mapping AI in Education",
    subtitle: "Literature, learner perceptions, and the boundaries of a research field",
    year: 2024,
    category: "Research synthesis · Topic modeling",
    modes: ["tracing"],
    summary:
      "Using literature review and topic modeling to examine AI integration in schools, students' views of ChatGPT, and research themes across educational technology and the learning sciences.",
    role: "Co-author",
    organization: "Ewha Womans University",
    collaborators: "Research teams with Hyo-Jeong So and Il-Hyun Jo (across related studies)",
    hero: {
      kind: "image",
      src: thumb("pic.P.What Do.png"),
      alt: "Research overview of topic modeling university students' perceptions of ChatGPT in academic writing.",
      caption: "What Do University Students Say About ChatGPT? — ICCE 2024.",
      aspect: "3 / 2",
      frame: "figure",
    },
    sections: [
      {
        title: "Seeing the broader landscape",
        body: [
          "Alongside the design of individual learning systems, I contribute to work that examines how AI is being understood and used in education. These studies move between published research and learners' expressed perceptions to make broader patterns visible.",
        ],
      },
      {
        title: "Three complementary lenses",
        points: [
          "A systematic literature review examines recent research on AI integration in Korean schools.",
          "Topic modeling explores university students' perceptions of ChatGPT in academic writing.",
          "Structural topic modeling compares research themes in educational technology and the learning sciences.",
        ],
        media: [
          {
            kind: "image",
            src: thumb("pic.J.A Systematic.png"),
            alt: "Overview of the systematic literature review on AI integration in Korean schools.",
            caption: "A systematic review of AI integration in Korean schools, published in 2024.",
            aspect: "3 / 2",
            frame: "figure",
          },
        ],
      },
      {
        title: "Sharing the evidence",
        body: [
          "This work produced a 2024 journal article, an ICCE 2024 paper, and a 2025 conference presentation on disciplinary research themes. The ICCE work received a Best Poster Design Award, connecting analysis with the visual communication of research.",
        ],
      },
    ],
    outcomes: ["Best Poster Design Award — ICCE 2024"],
    publications: ["p2024-j1", "p2024-c1", "p2025-c5"],
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
