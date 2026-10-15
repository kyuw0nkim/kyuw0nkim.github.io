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
      "My research explores how human thinking unfolds — and sometimes breaks down — during collaborative dialogue, especially around socially contested topics. I focus on how AI systems can recognize these critical moments and intervene to sustain and deepen the dialogue.",
      "I studied Educational Technology and Software at Ewha Womans University, where I worked in the Interaction Design for Learning Lab with Prof. Hyo-Jeong So. Since May 2026 I've been a museum educator at the Seoul Robot & AI Museum.",
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
