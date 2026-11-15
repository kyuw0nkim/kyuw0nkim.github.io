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
    "I'm Kyuwon Kim — a researcher, designer, and developer working where dialogue, AI, and learning meet. I trace how groups talk through contested issues, and shape AI agents that know when and how to help them think together.",

  about: {
    statement: "Learning technologies that help people think together through complex and contested issues.",
    paragraphs: [
      "I study what happens when people encounter perspectives beyond what they already know and believe. My work traces how groups reason through controversial issues — which moves make a discussion productive, and how it shifts over time — and uses that evidence to design AI agents that know when and how to support a group's deliberation.",
      "I trained in both Educational Technology and Software at Ewha Womans University, and completed my M.A. in the Interaction Design for Learning Lab with Prof. Hyo-Jeong So, including a cross-institutional study with UC Irvine. As a first-generation graduate student, I care about making research — and the unwritten rules around it — reachable for others, through teaching, museum education, and mentoring.",
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
