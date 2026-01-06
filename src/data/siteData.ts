import { SiteData } from "./types";

export const siteData: SiteData = {
  news: [
    { id: "n1", date: "2026-09-01", title: "First News" },
    { id: "n2", date: "2026-09-10", title: "Submitted a paper to CHI 2027" },
    { id: "n3", date: "2026-10-02", title: "Invited talk at HCI seminar" }
  ],
  publications: [
    {
      id: "p1",
      title: "Can Fans Build Parasocial Relationships through Idols' Simulated Voice Messages?: A Study of AI Private Call Users' Perceptions, Cognitions, and Behaviors",
      authors: ["Eun Jeong Kang", "Haesoo Kim", "Hyunwoo Kim", "Susan R. Fussell", "Juho Kim"],
      year: 2026,
      venue: "CSCW 2026",
      type: "Conference",
      topics: ["Human-AI interaction"],
      tags: ["Human-AI interaction", "Social"],
      links: { pdf: "#", acmdl: "#", doi: "https://doi.org/10.1145/3746058.3758410" }
    },
    {
      id: "p2",
      title: "CUPID: Evaluating Personalized and Contextualized Alignment of LLMs from Interactions",
      authors: ["Tae Soo Kim", "Yoonjoo Lee", "Yoonah Park", "Jiho Kim", "Young-Ho Kim", "Juho Kim"],
      year: 2026,
      venue: "COLM 2026",
      type: "Workshop",
      topics: ["Human-AI interaction"],
      tags: ["Human-AI interaction"],
      links: { website: "#", arxiv: "#" }
    },
    {
      id: "p3",
      title: "Your Thoughtful Opponent: Embracing Cognitive Conflict with Peer Agent",
      authors: ["Kyuwon Kim", "Jaeryeong Hwang", "Younseo Lee", "Jeanhee Lee", "Sung-Eun Kim", "Hyo-Jeong So"],
      year: 2025,
      venue: "UIST 2025",
      type: "Conference",
      topics: ["Human-AI interaction", "Learning"],
      tags: ["Human-AI interaction", "Learning"],
      links: { pdf: "#", acmdl: "#", doi: "https://doi.org/10.1145/3746058.3758410" }
    },
    {
      id: "p4",
      title: "Designing a dialogue-game for AI ethics education: Supporting ethical discourse through collective decision-making",
      authors: ["Kim, S. E.", "Kim, K.", "Lee, J.", "So, H. J."],
      year: 2025,
      venue: "Journal of Korean Association for Educational Information and Media",
      type: "Journal",
      topics: ["AI Ethics", "Education"],
      tags: ["AI Ethics", "Education"],
      links: { doi: "#" }
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
