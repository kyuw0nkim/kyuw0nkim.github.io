// ===========================================================================
// Case studies — shown at #case/<id> on /vision/ and /portfolio/.
//
// SOURCING RULE (same as data.ts): text comes only from the author's papers,
// SoP and CV. Each block notes its source. The Agent Roles case also uses the
// project text from the original portfolio (src/portfolio/data/projects.ts),
// which that portfolio's CONTENT_SOURCES.md traces to the KAEIM 2026
// presentation script; those passages are marked "ORIGINAL PORTFOLIO".
// ===========================================================================

const thumb = (f: string) => `/thumbnails/${encodeURIComponent(f)}`;

export interface CaseFigure {
  src: string;
  alt: string;
  caption: string;
}

export interface CaseSection {
  title: string;
  body?: string[];
  /** Numbered steps (e.g. an analysis pipeline). */
  steps?: { title: string; text: string }[];
  /** Plain list. */
  points?: string[];
  figure?: CaseFigure;
}

export interface CaseStudy {
  id: string;
  title: string;
  /** Paper title(s). */
  papers: string[];
  meta: { label: string; value: string }[];
  figure: CaseFigure;
  sections: CaseSection[];
  links: { label: string; href: string }[];
}

export const cases: CaseStudy[] = [
  // ------------------------------------------------------------- LAK + ICALT
  {
    id: "productive-discussion-moves",
    title: "Productive Discussion Moves",
    papers: [
      "Productive Discussion Moves in Groups Addressing Controversial Issues (LAK 2026)",
      "Understanding Productive Dialogue in Value-Laden Contexts through Hidden Markov Models (IEEE ICALT 2026)",
    ],
    meta: [
      { label: "Role", value: "First author on both papers" },
      { label: "Venues", value: "LAK 2026 full paper; IEEE ICALT 2026 full paper" },
      { label: "Recognition", value: "IEEE TCLT Best Student Paper Nominee & Student Award (ICALT 2026)" },
      { label: "With", value: "Jeanhee Lee, Sung-Eun Kim, Hyo-Jeong So" },
    ],
    figure: {
      src: thumb("pic.C.Productive Discussion.png"),
      alt: "Ordered networks of discussion moves for high-quality and low-quality discussion groups, and their subtraction network.",
      caption: "Ordered network of discussion moves in different discussion quality groups (LAK 2026, Fig. 2).",
    },
    sections: [
      {
        title: "Question",
        body: [
          // LAK abstract
          "While prior research has identified productive discussion moves mainly in STEM-oriented contexts, less is known about what constitutes productive discussion in ethical and value-laden discussions.",
        ],
        points: [
          // LAK RQs
          "What types of discussion moves emerge when learners engage with controversial issues?",
          "Which discussion moves are associated with higher-quality discussions?",
          "How do the sequential patterns of discussion differ between high- and low-quality discussion groups?",
          // ICALT RQs
          "What are the latent dialogue modes and their sequential transition patterns during value-laden dialogues?",
          "How are different configurations of latent dialogue modes associated with dialogic productivity?",
        ],
      },
      {
        title: "Study design",
        body: [
          // LAK 3.1
          "51 undergraduate students from diverse majors were randomly assigned to groups of three and engaged in face-to-face discussions on AI ethics dilemmas involving human-like household robots. Groups discussed five dilemmas sequentially and were instructed to reach a joint consensus at the end.",
          "85 audio recordings (5 sessions × 17 groups) of 10–20 minutes each were transcribed. 83 sessions were included in the LAK analysis and 80 in the ICALT analysis.",
        ],
        points: [
          // LAK Table 1
          "A household android requires 24-hour private data collection for a system upgrade. Should the user allow or restrict it?",
          "After an emotional upgrade, a user’s mother became attached to a household android. Should further emotional upgrades be allowed?",
          "Parents increasingly rely on household androids to interact with children. Should the country impose age restrictions?",
          "Decisions without clear explanations raise calls for XAI despite performance and security concerns. Should XAI be mandated?",
          "Household androids are essential but environmentally costly. Should their upgrade and use be restricted?",
        ],
      },
      {
        title: "Analysis",
        steps: [
          {
            title: "Expert coding",
            text: "2,199 utterances were independently coded by two annotators using the Scheme for Educational Dialogue Analysis (SEDA). Cohen’s κ on 20% of the data was .80.",
          },
          {
            title: "Data-driven discovery",
            text: "A Korean Sentence-BERT model, fine-tuned on 20% of the manually labeled data, embedded each utterance; BERTopic with HDBSCAN clustered them (minimum topic size 15, merging threshold 0.5).",
          },
          {
            title: "Aligning clusters with theory",
            text: "LIFT scores with a threshold of 2.0 linked clusters to SEDA labels. Clusters with no dominant label, or several, were treated as novel moves. The result was 14 discussion moves in five categories.",
          },
          {
            title: "Measuring discussion quality",
            text: "Integrative Complexity (IC) scores. Three researchers evaluated 24% of sessions; final agreement r_wg = .94, ICC(1) = .60, ICC(2) = .75.",
          },
          {
            title: "Moves and quality",
            text: "A linear mixed-effects model predicted IC from the 14 moves; Ordered Network Analysis compared top- and bottom-quartile groups.",
          },
          {
            title: "Latent dialogue modes",
            text: "Hidden Markov Models treated modes as hidden states and the five move categories as emissions; AIC and BIC favoured three states. Wilcoxon rank-sum tests and linear mixed-effects models related mode configurations to IC.",
          },
        ],
      },
      {
        title: "Findings",
        points: [
          // LAK 4.1
          "14 discussion moves in five categories: Elaborating Ideas, Position Taking, Reasoning & Justifications, Emotional Expression, and Discussion Management. Emotional Expression, including Emotive/Experiential Argument and Acknowledging Ambiguity, emerged through the bottom-up analysis.",
          // LAK 4.2 / Table 3
          "Emotive/Experiential Argument (B = 0.081, p = .005) and Acknowledging Ambiguity (B = 0.436, p = .040) positively predicted discussion quality; Building on Ideas was negatively associated (B = −0.283, p = .040); Evidence-based Argument was marginal (B = 0.171, p = .058).",
          // LAK 5
          "In high-quality discussions, emotive or experiential arguments were not treated as endpoints: they were revisited and subsequently connected to evidence-based arguments. In low-quality discussions they were more likely to transition into procedural management.",
          // ICALT III
          "Three latent modes: Deliberative Dialogue, Conversational Mediation, and Affective Dialogue. Direct transitions between affective and deliberative dialogue were rare (p < .001); conversational mediation functioned as an intermediate mode.",
          "Affective-to-deliberative transitions showed no significant difference in quality (p = .35), but the coexistence of affective and deliberative dialogue within a session predicted significantly higher dialogic quality (β = 0.608, p = .027).",
        ],
        figure: {
          src: thumb("pic.C.Understanding Productive.png"),
          alt: "Three hidden states with their emission profiles and transition probabilities.",
          caption: "Transition pathways between hidden states (ICALT 2026, Fig. 1).",
        },
      },
      {
        title: "Limitations",
        points: [
          // LAK 6
          "Participants were Korean undergraduates; the approach should be validated with broader and more heterogeneous samples.",
          "Manual annotation provided ground truth for the transformer-based model, which limits scalability.",
          "Clustering parameters were set manually, introducing a degree of subjectivity.",
          // ICALT IV
          "The five-category scheme may have obscured finer-grained conversational functions, and few sessions showed affective-to-deliberative transitions, so transition effects may have been underpowered.",
        ],
      },
      {
        title: "What it led to",
        body: [
          // SoP, Future Directions
          "Building on these findings, my doctoral research will examine how groups move toward deeper engagement across differences. One hypothesis I have is that the emergence of subjective uncertainty makes space for participants to reconsider their assumptions and explore alternative views.",
        ],
      },
    ],
    links: [
      { label: "LAK paper (ACM DL)", href: "https://doi.org/10.1145/3785022.3785111" },
      { label: "Code", href: "https://github.com/kyuw0nkim/LAK26-methodology" },
      { label: "ICALT paper (IEEE)", href: "https://doi.org/10.1109/ICALT68022.2026.00046" },
    ],
  },

  // --------------------------------------------------------------- thesis
  {
    id: "agent-roles-in-deliberation",
    title: "Agent Roles in Deliberation",
    papers: [
      "Examining the Effects of LLM-Based Conversational Agent Participation and Role in Decision-Making on Controversial Issues (M.A. thesis)",
    ],
    meta: [
      // CV
      { label: "Role", value: "First author; led the study end to end" },
      { label: "Venues", value: "M.A. thesis; KAEIM 2026 Spring Conference; journal manuscript under review" },
      { label: "Recognition", value: "Best Paper Award, KAEIM 2026" },
      { label: "With", value: "Hyo-Jeong So; A. Samadi and Nia Nixon (UC Irvine)" },
    ],
    figure: {
      src: thumb("pic.C.논쟁문제 의사결정.png"),
      alt: "Box plots comparing discussion and decision measures across a human-only group, a supporter-agent group and a peer-agent group.",
      // ORIGINAL PORTFOLIO
      caption: "Discussion and decision measures across three conditions: humans only, a supporter agent and a peer agent.",
    },
    sections: [
      {
        title: "Question",
        body: [
          // SoP
          "Analyzing groups in our dialogic games revealed a key problem: although participants readily joined the conversation, many groups reached premature agreement without examining underlying value tensions. For my master’s thesis, I investigated what role generative AI agents should play in deliberation to foster constructive dialogue.",
        ],
      },
      {
        title: "Study design",
        body: [
          // SoP
          "Running this experiment required a specialized infrastructure for synchronous, multi-user human–AI teaming, so I initiated a cross-institutional collaboration with a doctoral researcher at UC Irvine (PI: Nia Nixon) and adapted their platform.",
          // SoP
          "I compared 21 groups (N = 49) across three conditions: a perspective-contributing agent, a process-supporting agent, and a human-only baseline.",
          // ORIGINAL PORTFOLIO
          "Groups discussed AI ethics dilemmas. The process-supporting agent summarized and coordinated without expressing its own position; the perspective-contributing agent participated as a teammate, contributing a position and reasons. The agent’s identity was disclosed after discussion to limit prior expectations.",
        ],
      },
      {
        title: "Analysis",
        steps: [
          // CV
          { title: "Building the agents", text: "LLM-based collaborative learning agents developed in Python with LangChain." },
          // ORIGINAL PORTFOLIO
          {
            title: "Measures",
            text: "Perspective diversity in the discussion and integrative complexity in the joint statement, alongside perceived discussion and decision quality, team satisfaction, and interviews.",
          },
          // SoP
          { title: "Models", text: "Linear mixed-effects models and Ordered Network Analysis to examine both outcomes and interaction patterns." },
        ],
      },
      {
        title: "Findings",
        points: [
          // SoP
          "Perspective-contributing agents, by introducing viewpoints participants might not have encountered on their own, significantly broadened the range of ideas explored and led to more integrative group decisions than the baseline.",
          // ORIGINAL PORTFOLIO
          "The process-supporting agent showed no significant improvement over human-only groups on the measured variables.",
          "Participants’ experience did not mirror objective performance: human-only groups reported the highest mean perceived discussion and decision quality, and the process-supporting condition reported significantly lower team satisfaction than human-only groups.",
        ],
      },
      {
        title: "What it led to",
        body: [
          // SoP
          "Because the agents triggered interventions autonomously via prompt-based heuristics, their timing was disconnected from systematic evidence of how the group’s conversation was actually evolving. This shaped my next research question: what computational measures can capture pivotal moments in a group’s deliberation to guide when and how AI should intervene?",
        ],
      },
    ],
    links: [],
  },

  // ------------------------------------------------------------------ UIST
  {
    id: "your-thoughtful-opponent",
    title: "Your Thoughtful Opponent",
    papers: ["Your Thoughtful Opponent: Embracing Cognitive Conflict With a Peer Agent (UIST 2025 Adjunct)"],
    meta: [
      { label: "Role", value: "First author" },
      { label: "Venue", value: "UIST 2025 Adjunct Proceedings" },
      { label: "With", value: "Jaeryeong Hwang, Younseo Lee, Jeanhee Lee, Sung-Eun Kim, Hyo-Jeong So" },
    ],
    figure: {
      src: thumb("pic.P.Your Thoughtful.png"),
      alt: "Interface, positioning rules and the peer agent's deliberation workflow.",
      caption: "Proposed interface and overall workflow of the peer agent system (UIST 2025 Adjunct, Fig. 1).",
    },
    sections: [
      {
        title: "Question",
        body: [
          // UIST 1
          "Most existing work has focused on the role of LLMs in synthesizing or amplifying pre-existing opinions, rather than leveraging LLMs to simulate and introduce diverse perspectives. We propose a Peer Agent designed to simulate a deliberative conversational partner that induces socio-cognitive conflict within dilemma-based game play.",
        ],
      },
      {
        title: "Interaction design",
        body: [
          // UIST 2.1
          "The system simulates a voice-based multi-party deliberation between two human players and one peer agent on AI ethics dilemmas (e.g., should we allow the development of AI killer robots?). Players state their stance and rate their confidence on a 1–5 scale.",
          "If both players choose the same stance, the agent adopts the opposing position to introduce tension. If they disagree, it aligns with the player who shows lower opinion strength, amplifying the minority viewpoint.",
        ],
      },
      {
        title: "Architecture",
        steps: [
          {
            title: "Context Interpreter",
            text: "Stores each player’s position and confidence, analyzes transcribed dialogue with the theory of basic human values, and monitors the discussion phase.",
          },
          {
            title: "Agent State Manager",
            text: "Manages position, opinion strength, long-term memory and persona. Initial opinion strength is the average of the players’ confidence and is adjusted when persuasive arguments are detected.",
          },
          {
            title: "Thought Generator",
            text: "Generates general thoughts and strategic thoughts, the latter built on transactive talk moves to deepen deliberation.",
          },
          {
            title: "Thought Evaluator",
            text: "Rates each thought’s motivation (1–5) on relevance, information gap and expected impact, then applies rules based on discussion phase and players’ opinion strength.",
          },
          {
            title: "Thought Articulator",
            text: "Voices the highest-scoring strategic thought if it passes a threshold; otherwise selects a general thought probabilistically to keep the conversation fluid.",
          },
        ],
      },
      {
        title: "Preliminary study",
        body: [
          // UIST 3
          "A single-party prototype was tested with four participants. They perceived the agent’s competence as comparable to their own (M = 4.00, SD = 1.37) while recognizing that it expressed different viewpoints (perceived homophily M = 3.38, SD = 1.73).",
        ],
        points: [
          "Need for nuanced expression: a sudden shift in the agent’s opinion disrupted the conversational flow.",
          "Need for an external knowledge base: some responses lacked sufficient supporting grounds.",
        ],
      },
    ],
    links: [{ label: "Paper (ACM DL)", href: "https://doi.org/10.1145/3746058.3758410" }],
  },

  // ------------------------------------------------------------ AIED + ICLS
  {
    id: "ai-ethics-games",
    title: "AI Ethics Through Play",
    papers: [
      "Dilemmas in AI Ethics: A Digital Game for Moral Reasoning and Collective Decision-Making (AIED 2025)",
      "FLIP: Tabletop Role-Play Game for AI Ethics Education through Cognitive Dissonance (ICLS 2025)",
    ],
    meta: [
      // SoP + CV
      { label: "Role", value: "Designed the FLIP cards; built the digital game" },
      { label: "Venues", value: "AIED 2025; ICLS 2025" },
      { label: "With", value: "Sung-Eun Kim, Jeanhee Lee, Yeji Ko, Yue Wang, Hyo-Jeong So" },
    ],
    figure: {
      src: thumb("pic.C.Dilemmas in.png"),
      alt: "Screens of The Desk: Dilemmas in AI Ethics.",
      caption: "The Desk: Dilemmas in AI Ethics (AIED 2025).",
    },
    sections: [
      {
        title: "Question",
        body: [
          // AIED 2.1, FLIP intro
          "Principle-based approaches to AI ethics education may not adequately address the complexity of AI ethical issues. Drawing on the social intuitionist model, we designed dialogue games where conflicting intuitions are triggered through discourse, so that learners share, justify and challenge moral judgments.",
        ],
      },
      {
        title: "The Desk: a digital dialogue game",
        body: [
          // AIED 3
          "Three players act as a newspaper editorial team choosing which of two articles about killer robots to publish. Four mechanics support the moral judgment process: three-player dialogue settings, separate individual and group decision spaces, dilemma scenarios based on conflicting moral foundations, and positive and negative feedback from the public.",
          // AIED 4–5
          "Tested with three groups of nine participants, the dilemmas engaged all six moral foundations; Care (26%) and Purity (24%) were referenced most often, and opposing and supporting positions drew on different foundations.",
        ],
      },
      {
        title: "FLIP: a tabletop role-play game",
        body: [
          // FLIP
          "Players join an imaginary committee deciding the global future of killer robots, with randomly assigned Role and Nationality Cards. Dialogue Cards based on Critical Systems Heuristics and Moral Foundations Theory, Scenario Cards and Ending Cards move play through four phases.",
          "With 15 undergraduates in three groups of five, cognitive dissonance occurred over twenty times, triggered by new information, reminders of other players’ roles, and self-triggered role conflicts.",
        ],
        figure: {
          src: thumb("pic.C.FLIP.png"),
          alt: "Overview of FLIP, a tabletop role-play game for AI ethics education.",
          caption: "FLIP: Tabletop role-play game for AI ethics education (ICLS 2025).",
        },
      },
      {
        title: "What it led to",
        body: [
          // SoP
          "These environments showed that intentionally structured spaces can bring diverse viewpoints into dialogue. Yet many groups reached premature agreement without examining underlying value tensions. Creating space for dialogue was only a starting point; I wanted to understand how in-conversation support could help learners engage more deeply with one another.",
        ],
      },
    ],
    links: [
      { label: "AIED paper", href: "https://doi.org/10.1007/978-3-031-98417-4_31" },
      { label: "ICLS paper", href: "https://doi.org/10.22318/icls2025.945127" },
    ],
  },
];

export const getCase = (id: string | null) => cases.find((c) => c.id === id);
