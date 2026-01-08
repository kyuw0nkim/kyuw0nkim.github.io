import { SiteData } from "./types";

export const siteData: SiteData = {
  news: [
    { id: "n1", date: "2026-09-01", title: "First News" },
    { id: "n2", date: "2026-09-10", title: "Submitted a paper to CHI 2027" },
    { id: "n3", date: "2026-10-02", title: "Invited talk at HCI seminar" }
  ],
  publications: [
    {
      id: "p2025-j1",
      title: "AI 윤리교육을 위한 대화형 게임 설계: 집단 의사결정을 통한 윤리 담화 지원",
      authors: ["김성은", "김규원", "이진희", "소효정"],
      year: 2025,
      venue: "교육정보미디어연구, v.31, no.5, 2033-2060",
      type: "Journal",
      topics: ["AI Ethics", "Education"],
      tags: ["AI Ethics", "Education"],
      links: { doi: "http://dx.doi.org/10.15833/KAFEIAM.31.5.2033" }
    },
    {
      id: "p2025-c1",
      title: "Your Thoughtful Opponent: Embracing Cognitive Conflict with Peer Agent",
      authors: ["Kyuwon Kim", "Jaeryeong Hwang", "Younseo Lee", "Jeanhee Lee", "Sung-Eun Kim", "Hyo-Jeong So"],
      year: 2025,
      venue: "UIST 2025",
      type: "Conference",
      topics: ["Learning", "AI in Education"],
      tags: ["Learning", "AI"],
      links: { doi: "https://doi.org/10.1145/3746058.3758410" }
    },
    {
      id: "p2025-c2",
      title: "Dilemmas in AI Ethics: A Digital Game for Moral Reasoning and Collective Decision-Making",
      authors: ["Sung-Eun Kim", "Kyuwon Kim", "Jean Hee Lee", "Yeji Ko", "Yue Wang", "Hyo-Jeong So"],
      year: 2025,
      venue: "AIED 2025",
      type: "Conference",
      topics: ["AI Ethics", "Learning"],
      tags: ["AI Ethics", "Game"],
      links: { doi: "https://doi.org/10.1007/978-3-031-98417-4_31" }
    },
    {
      id: "p2025-c3",
      title: "Bridging Literacy with AI: AI-Integrated Digital Textbook for Deaf and Hard-of-Hearing Students",
      authors: ["Ga Young Lee", "Seonhee Na", "Kyuwon Kim", "Hyo-Jeong So"],
      year: 2025,
      venue: "IDC 2025",
      type: "Conference",
      topics: ["Literacy", "Accessibility"],
      tags: ["AI", "Accessibility"],
      links: { doi: "https://doi.org/10.1145/3713043.3731489" }
    },
    {
      id: "p2025-c4",
      title: "FLIP: Tabletop Role-Play Game for AI Ethics Education through Cognitive Dissonance",
      authors: ["Yue Wang", "Yeji Ko", "Kyuwon Kim", "Sung-Eun Kim", "Hyo-Jeong So"],
      year: 2025,
      venue: "ICLS 2025",
      type: "Conference",
      topics: ["AI Ethics", "Learning"],
      tags: ["AI Ethics", "Game"],
      links: { doi: "https://doi.org/10.22318/icls2025.945127" }
    },
    {
      id: "p2025-c5",
      title: "Tracing the Boundaries: A Structural Topic Modeling Analysis of Research Themes in Educational Technology and the Learning Sciences",
      authors: ["Chohui Lee", "Nayeon Hong", "Soyeon Mun", "Kyuwon Kim", "Il-Hyun Jo"],
      year: 2025,
      venue: "2025 Korean Society for Educational Technology Spring Conference",
      type: "Conference",
      topics: ["EdTech", "Learning Sciences"],
      tags: ["EdTech", "Research"],
      links: { website: "#" }
    },
    {
      id: "p2024-j1",
      title: "A Systematic Literature Review on AI Integration in Korean Schools: Focusing on Recent Research Trends",
      authors: ["Seo-yun Kim", "Hyo-Jeong So", "Kyuwon Kim"],
      year: 2024,
      venue: "교과교육학연구, v.28 n.5, 391–402",
      type: "Journal",
      topics: ["AI in Education", "EdTech"],
      tags: ["AI", "Review"],
      links: { website: "#" }
    },
    {
      id: "p2024-c1",
      title: "What Do University Students Say About ChatGPT? A Topic Modeling of Perception on GenAI in Academic Writing",
      authors: ["Lingxi Jin", "Kyuwon Kim", "Hyo-Jeong So", "Ga Young Lee"],
      year: 2024,
      venue: "ICCE 2024",
      type: "Conference",
      topics: ["GenAI", "Writing"],
      tags: ["GenAI", "Education"],
      links: { website: "#" },
      award: "Best Poster Design Award"
    },
    {
      id: "p2024-c2",
      title: "국내 학교교육 분야의 AI활용 연구 동향",
      authors: ["김서윤", "김규원", "소효정"],
      year: 2024,
      venue: "2024 한국교육공학회 춘계학술대회",
      type: "Conference",
      topics: ["AI in Education", "EdTech"],
      tags: ["AI", "Trends"],
      links: { website: "#" },
      award: "장려상"
    },
    {
      id: "p2022-j1",
      title: "콘텐츠 설계원리에 대한 학습유형별 학습자 인지적 상태 차이",
      authors: ["정겨운", "김규원", "조일현"],
      year: 2022,
      venue: "교육정보미디어연구, v.28 n.1, 133–160",
      type: "Journal",
      topics: ["Learning", "Education"],
      tags: ["Learning", "Design"],
      links: { website: "#" }
    }
  ],
  projects: [
    {
      id: "pr1",
      title: "Can Fans Build Parasocial Relationships through Idols' Simulated Voice Messages?",
      year: 2026,
      startDate: "2026-09-01",
      endDate: "2027-12-31",
      role: "Student Researcher",
      summary: "Investigating how AI-generated voice messages affect fan-idol parasocial relationships.",
      description: `## Overview

This project explores the psychological and social dynamics of parasocial relationships formed through AI-simulated voice messages from K-pop idols.

## Research Questions

1. How do fans perceive AI-generated voice messages compared to authentic communications?
2. What factors influence the formation of parasocial bonds through simulated interactions?
3. What are the ethical implications of AI-mediated celebrity relationships?

## Methodology

- Mixed-methods approach combining surveys and interviews
- Analysis of user behavior patterns on AI private call platforms
- Longitudinal study tracking relationship development over time

## Key Findings

- Users demonstrate complex awareness of AI mediation
- Emotional attachment develops despite acknowledged artificiality
- Platform design significantly influences relationship dynamics`,
      relatedPublications: ["p1"]
    },
    {
      id: "pr2",
      title: "Thoughtful Peer Agent for Cognitive Conflict in Learning",
      year: 2025,
      startDate: "2025-03-01",
      endDate: "2025-12-31",
      role: "Lead Researcher",
      summary: "Designing AI agents that challenge learners' thinking through productive cognitive conflict.",
      description: `## Overview

Developing an AI peer agent that promotes deeper learning by introducing productive cognitive conflicts during educational interactions.

## Research Goals

- Design agents that challenge misconceptions constructively
- Measure learning outcomes from cognitive conflict experiences
- Understand optimal timing and intensity of challenges

## Methods

- User studies with university students
- A/B testing of different agent personalities
- Learning gain measurements and qualitative analysis`,
      relatedPublications: ["p3"]
    }
  ]
};

// Helper functions
export function getPublicationById(id: string) {
  return siteData.publications.find(p => p.id === id);
}

export function getProjectById(id: string) {
  return siteData.projects.find(p => p.id === id);
}

export function getPublicationsByYear() {
  const grouped: Record<number, typeof siteData.publications> = {};
  siteData.publications.forEach(pub => {
    if (!grouped[pub.year]) grouped[pub.year] = [];
    grouped[pub.year].push(pub);
  });
  return Object.entries(grouped)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, pubs]) => ({ year: Number(year), publications: pubs }));
}

export function getProjectsByYear() {
  const grouped: Record<number, typeof siteData.projects> = {};
  siteData.projects.forEach(proj => {
    if (!grouped[proj.year]) grouped[proj.year] = [];
    grouped[proj.year].push(proj);
  });
  return Object.entries(grouped)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, projs]) => ({ year: Number(year), projects: projs }));
}

export function getAllTopics() {
  const topics = new Set<string>();
  siteData.publications.forEach(pub => pub.topics.forEach(t => topics.add(t)));
  return Array.from(topics);
}

export function getAllTypes() {
  const types = new Set<string>();
  siteData.publications.forEach(pub => types.add(pub.type));
  return Array.from(types);
}

export function filterPublications(topic?: string, type?: string) {
  return siteData.publications.filter(pub => {
    if (topic && topic !== "All" && !pub.topics.includes(topic)) return false;
    if (type && type !== "All" && pub.type !== type) return false;
    return true;
  });
}

export function getLatestPublication() {
  return [...siteData.publications].sort((a, b) => b.year - a.year)[0];
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
