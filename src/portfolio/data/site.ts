import { siteData } from "@/data/siteData";

const { profile, cv } = siteData;

/**
 * Portfolio copy. Contact links and skills are read from the academic
 * site's src/data/siteData.ts so both sites stay in sync.
 */
export const site = {
  name: profile.name,
  email: profile.email,
  /** The academic website (publications, CV, news). */
  academicUrl: "/",
  /** Publication list on the academic website (HashRouter route). */
  publicationsUrl: "/#/publications",
  cvUrl: cv.cvUrl,

  heroIntro:
    "I'm Kyuwon Kim — a researcher, designer, and developer working where human interaction, AI, and learning meet. I trace how people think and talk together, and shape the agents, tools, and learning experiences that help them do it.",

  about: {
    statement: "Learning technologies that help people think together through complex and contested issues.",
    paragraphs: [
      "I study what happens when people encounter perspectives beyond what they already know and believe. My work traces how groups reason through controversial issues, express competing values, and move toward more integrative collective decisions. I combine dialogue analysis and computational modeling with the design of conversational agents and learning environments.",
      "My background spans Educational Technology and Software at Ewha Womans University and research in the Interaction Design for Learning Lab with Prof. Hyo-Jeong So. My projects include AI ethics games, a peer agent for deliberation, music-learning interfaces, and inclusive digital learning resources. At HSPACE, I have also designed training programs and game-based workshops with domain experts.",
    ],
  },

  contactLine: "New perspectives always inspire me — feel free to reach out.",

  skills: cv.skills,

  socials: [
    { label: "Academic website", href: "/" },
    { label: "Google Scholar", href: profile.googleScholar },
    { label: "LinkedIn", href: profile.linkedin },
    { label: "GitHub", href: profile.github },
    { label: "ResearchGate", href: profile.researchGate },
  ],
};
