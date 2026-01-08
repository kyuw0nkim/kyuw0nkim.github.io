import { SiteData } from "./types";

export const siteData: SiteData = {
  news: [
    { id: "n1", date: "2024-11-29", title: "Attended ICCE 2024 in person as a presenter. Our poster received a Best Poster Design Award at ICCE 2024🎉" },
    { id: "n2", date: "2025-03-02", title: "Just started my Master's journey in the IDL lab, at Ewha Womans University🚀" },
    { id: "n3", date: "2025-10-01", title: "Presented the poster Your Thoughtful Opponent at UIST 2025." },
    { id: "n4", date: "2026-12-01", title: "Our research article is accepted as full paper in LAK 2026! Full paper will be available soon in arXiv." }
  ],
  publications: [
    {
      id: "p1",
      title: "Paper title",
      authors: ["Kyuwon Kim", "Hyo-Jeong So"],
      year: 2026,
      venue: "CSCW 2026",
      type: "Conference",
      topics: ["Human-AI interaction"],
      tags: ["Human-AI interaction", "Social"],
      links: { pdf: "#", acmdl: "#", doi: "https://doi.org" }
    },
    {
      id: "p2",
      title: "Paper title",
      authors: ["Kyuwon Kim", "Hyo-Jeong So"],
      year: 2026,
      venue: "CSCW 2026",
      type: "Conference",
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
      title: "Project Title",
      year: 2026,
      startDate: "2026-09-01",
      endDate: "2027-12-31",
      role: "Student Researcher",
      summary: "Project summary",
      description: `## Overview

This project explores...

## Research Questions

1. A
2. B

## Methodology

- Mixed-methods approach combining surveys and interviews

## Key Findings

- Users demonstrate complex awareness of AI mediation`,
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
