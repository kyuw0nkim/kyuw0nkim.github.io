import { SiteData } from "./types";

export const siteData: SiteData = {
  // =========================================================================
  // 프로필 정보 — 이름, 소속, 소개글, 소셜 링크를 여기서 수정하세요
  // =========================================================================
  profile: {
    name: "Kyuwon Kim",
    title: "Master's student",
    lab: "Interaction Design for Learning Lab",
    department: "Department of Educational Technology",
    university: "Ewha Womans University",

    // 프로필 이미지: public/ 폴더에 이미지를 올리고 경로를 입력하세요.
    // 예: profileImage: "/profile.jpg"
    // 이미지가 없으면 이 줄을 삭제하거나 주석 처리하세요.
    profileImage: "/casual_profile.jpg",

    // 소개글: 단락(문단) 단위로 작성합니다.
    // 각 단락은 TextPart 배열입니다.
    //   - 일반 텍스트: "그냥 문자열"
    //   - 링크 텍스트: { text: "표시할 텍스트", href: "https://..." }
    // 예시:
    //   ["안녕하세요 ", { text: "Ewha", href: "https://ewha.ac.kr" }, " 소속입니다."]
    bioParagraphs: [
      [
        "Hi, I'm Kyuwon, a master's student in Educational Technology at Ewha Womans University. I am currently a member of the ",
        { text: "Interaction Design for Learning Lab", href: "https://idlearning.org" },
        ", advised by Prof. Hyo-Jeong So. My research sits at the intersection of learning and HCI, guided by a single question: How might learning technologies help us go beyond our limitations and create a better society? Outside the lab, I enjoy listening to people's stories, tinkering with design, and watching Let's Play videos. New perspectives always inspire me - so feel free to reach out!"
      ]
    ],

    // 소셜 링크
    email: "kyuwonkim95@ewha.ac.kr",
    googleScholar: "https://scholar.google.com/citations?user=oYoOlXgAAAAJ",
    researchGate: "https://www.researchgate.net/profile/Kyuwon-Kim-5",
    linkedin: "https://www.linkedin.com/in/kyuwon-kim-23168a209",
    github: "https://github.com/kyuw0nkim",
  },

  // =========================================================================
  // CV 정보 — 학력, 경력, 수상, 스킬, 봉사를 여기서 수정하세요
  // =========================================================================
  cv: {
    // CV PDF 파일 링크 (public/ 폴더에 파일을 올리고 "/파일명.pdf"로 입력)
    cvUrl: "#",

    education: [
      {
        degree: "M.A. in Educational Technology",
        institution: "Ewha Womans University",
        period: "Mar 2025 - Aug 2026 (Expected)",
      },
      {
        degree: "B.A. in Educational Technology & B.E. in Software",
        institution: "Ewha Womans University",
        period: "Mar 2021 - Feb 2025",
      },
    ],

    experience: [
      {
        role: "Graduate Research Assistant",
        lab: "Interaction Design for Learning Lab, Research Advisor: Hyo-Jeong So",
        period: "Mar 2025 - Present",
      },
      {
        role: "Undergraduate Research Assistant",
        lab: "Interaction Design for Learning Lab, Research Advisor: Hyo-Jeong So",
        period: "Jan 2024 - Feb 2025",
      },
      {
        role: "Undergraduate Research Assistant",
        lab: "Learning Analytics for Prediction & Action Lab, Research Advisor: Il-Hyun Jo",
        period: "Summer 2021, Winter 2021, Summer 2023",
      },
    ],

    awards: [
      { title: "Best Poster Design Award", organization: "APSCE", year: 2024 },
      { title: "Excellence Award in Youth Idea Contest on African Educational Development Cooperation", organization: "Korean National Commission for UNESCO", year: 2024 },
      { title: "Outstanding Paper Award", organization: "Korean Association for Educational Information and Media", year: 2024 },
      { title: "Honorable Mention", organization: "The Korean Society for Educational Technology", year: 2023 },
      { title: "Grand Award in Upcoming Life in Space SW Challenge", organization: "Future & Software Foundation", year: 2022 },
    ],

    skills: ["Python", "R", "MySQL", "JavaScript/TypeScript", "React", "Machine Learning", "Figma", "LaTeX"],

    service: [
      { role: "Ad hoc Reviewer", details: ["Journal of Research, Innovation and Technologies (JoRIT)", "Environment and Social Psychology"] },
      { role: "Student Volunteer", details: ["KAIEM&KSET 2023 Fall", "KAIEM 2025 Spring", "ICoME 2025", "KAIEM&KSET 2025 Fall"] },
    ],
  },

  // =========================================================================
  // 뉴스 — 최신 소식을 여기서 추가/수정하세요
  // =========================================================================
  // 뉴스 title도 TextPart 배열입니다.
  //   - 일반 텍스트: "문자열"
  //   - 링크 텍스트: { text: "표시할 텍스트", href: "https://..." }
  // 예시 (title 일부에 링크):
  //   title: ["Presented the poster ", { text: "Your Thoughtful Opponent", href: "https://..." }, " at UIST 2025."]
  // 예시 (title 전체에 링크):
  //   title: [{ text: "전체 제목", href: "https://..." }]
  news: [
    { id: "n6", date: "2026-03-18", title: ["Traveling to London, Milan, and Barcelona (Apr 2–19). So many places in the world to explore!"] },
    { id: "n5", date: "2026-02-20", title: ["MelodyMate is accepted as poster in CHI 2026✨"] },
    { id: "n4", date: "2025-12-01", title: ["Our research article is accepted as full paper in LAK 2026! Currently available in ", { text: "arXiv", href: "https://doi.org/10.48550/arXiv.2601.05651" }, "."] },
    { id: "n3", date: "2025-10-01", title: ["Presented the poster Your Thoughtful Opponent at UIST 2025."] },
    { id: "n2", date: "2025-03-02", title: ["Just started my Master's journey in the IDL lab, at Ewha Womans University🚀"] },
    { id: "n1", date: "2024-11-29", title: ["Attended ICCE 2024 in person as a presenter. Our poster received a Best Poster Design Award at ICCE 2024🎉"] }
  ],

  // =========================================================================
  // 논문 목록 — 논문을 여기서 추가/수정하세요
  //
  // 썸네일 이미지 추가 방법:
  //   1. public/thumbnails/ 폴더에 이미지 파일을 넣으세요 (예: my-paper-2025.png)
  //      권장 비율: 3:2 (예: 600×400px) — 다른 크기도 자동으로 맞춰집니다
  //   2. 해당 논문 항목에 thumbnail: "my-paper-2025.png" 를 추가하세요
  // =========================================================================
  publications: [
    {
      id: "p2026-c2",
      thumbnail: "pic.P.Understanding University.png",
      title: "Understanding university music learners’ interaction with an LLM-powered pedagogical conversational agent",
      authors: ["Lingxi Jin", "Kyuwon Kim", "Baicheng Lin", "Mengze Hong", "Hyo-Jeong So"],
      year: 2026,
      venue: "CHI 2026 (to appear)",
      type: "Conference",
      topics: ["Conversational Agent", "Learning Analytics", "AIED"],
      tags: ["Conversational Agent", "Learning Analytics", "AIED"],
      //links: { arxiv: "https://doi.org/10.48550/arXiv.2601.05651" }
    },
    {
      id: "p2026-c1",
      thumbnail: "pic.C.Productive Discussion.png",
      title: "Productive Discussion Moves in Groups Addressing Controversial Issues",
      authors: ["Kyuwon Kim", "Jeanhee Lee", "Sung-Eun Kim", "Hyo-Jeong So"],
      year: 2026,
      venue: "LAK 2026 (to appear)",
      type: "Conference",
      topics: ["Learning Analytics"],
      tags: ["Learning Analytics"],
      links: { arxiv: "https://doi.org/10.48550/arXiv.2601.05651" }
    },
    {
      id: "p2025-j1",
      thumbnail: "pic.J.AI 윤리교육.png",
      title: "AI 윤리교육을 위한 대화형 게임 설계: 집단 의사결정을 통한 윤리 담화 지원",
      authors: ["김성은", "김규원", "이진희", "소효정"],
      year: 2025,
      venue: "교육정보미디어연구, v.31, no.5, 2033-2060",
      type: "Journal",
      topics: ["AIED", "Game-based Learning", "Learning Analytics"],
      tags: ["AIED", "Game-based Learning", "Learning Analytics"],
      links: { doi: "http://dx.doi.org/10.15833/KAFEIAM.31.5.2033" }
    },
    {
      id: "p2025-c1",
      thumbnail: "pic.P.Your Thoughtful.png",
      title: "Your Thoughtful Opponent: Embracing Cognitive Conflict with Peer Agent",
      authors: ["Kyuwon Kim", "Jaeryeong Hwang", "Younseo Lee", "Jeanhee Lee", "Sung-Eun Kim", "Hyo-Jeong So"],
      year: 2025,
      venue: "UIST 2025",
      type: "Conference",
      topics: ["Conversational Agent", "AIED"],
      tags: ["Conversational Agent", "AIED"],
      links: { acmdl: "https://doi.org/10.1145/3746058.3758410" }
    },
    {
      id: "p2025-c2",
      thumbnail: "pic.C.Dilemmas in.png",
      title: "Dilemmas in AI Ethics: A Digital Game for Moral Reasoning and Collective Decision-Making",
      authors: ["Sung-Eun Kim", "Kyuwon Kim", "Jean Hee Lee", "Yeji Ko", "Yue Wang", "Hyo-Jeong So"],
      year: 2025,
      venue: "AIED 2025",
      type: "Conference",
      topics: ["AIED", "Game-based Learning"],
      tags: ["AIED", "Game-based Learning"],
      links: { doi: "https://doi.org/10.1007/978-3-031-98417-4_31" }
    },
    {
      id: "p2025-c3",
      thumbnail: "pic.P.Bridging Literacy.png",
      title: "Bridging Literacy with AI: AI-Integrated Digital Textbook for Deaf and Hard-of-Hearing Students",
      authors: ["Ga Young Lee", "Seonhee Na", "Kyuwon Kim", "Hyo-Jeong So"],
      year: 2025,
      venue: "IDC 2025",
      type: "Conference",
      topics: ["AIED"],
      tags: ["AIED"],
      links: { acmdl: "https://doi.org/10.1145/3713043.3731489" }
    },
    {
      id: "p2025-c4",
      thumbnail: "pic.C.FLIP.png",
      title: "FLIP: Tabletop Role-Play Game for AI Ethics Education through Cognitive Dissonance",
      authors: ["Yue Wang", "Yeji Ko", "Kyuwon Kim", "Sung-Eun Kim", "Hyo-Jeong So"],
      year: 2025,
      venue: "ICLS 2025",
      type: "Conference",
      topics: ["AIED", "Game-based Learning"],
      tags: ["AIED", "Game-based Learning"],
      links: { doi: "https://doi.org/10.22318/icls2025.945127" }
    },
    {
      id: "p2025-c5",
      thumbnail: "pic.C.Tracing the.png",
      title: "Tracing the Boundaries: A Structural Topic Modeling Analysis of Research Themes in Educational Technology and the Learning Sciences",
      authors: ["Chohui Lee", "Nayeon Hong", "Soyeon Mun", "Kyuwon Kim", "Il-Hyun Jo"],
      year: 2025,
      venue: "2025 Korean Society for Educational Technology Spring Conference",
      type: "Conference",
      topics: ["Review"],
      //tags: ["Review"],
      //links: { doi: "https://doi.org/10.22318/icls2025.945127" }
    },
    {
      id: "p2024-j1",
      thumbnail: "pic.J.A Systematic.png",
      title: "A Systematic Literature Review on AI Integration in Korean Schools: Focusing on Recent Research Trends",
      authors: ["Seo-yun Kim", "Hyo-Jeong So", "Kyuwon Kim"],
      year: 2024,
      venue: "교과교육학연구, v.28 n.5, 391–402",
      type: "Journal",
      topics: ["AIED"],
      tags: ["AIED"],
      links: { doi: "https://doi.org/10.24231/rici.2024.28.5.391" }
    },
    {
      id: "p2024-c1",
      thumbnail: "pic.P.What Do.png",
      title: "What Do University Students Say About ChatGPT? A Topic Modeling of Perception on GenAI in Academic Writing",
      authors: ["Lingxi Jin", "Kyuwon Kim", "Hyo-Jeong So", "Ga Young Lee"],
      year: 2024,
      venue: "ICCE 2024",
      type: "Conference",
      topics: ["AIED"],
      tags: ["AIED"],
      links: { doi: "https://doi.org/10.58459/icce.2024.5029" },
      award: "Best Poster Design Award"
    },
    {
      id: "p2024-c2",
      thumbnail: "pic.P.국내 학교교육.png",
      title: "국내 학교교육 분야의 AI활용 연구 동향",
      authors: ["김서윤", "김규원", "소효정"],
      year: 2024,
      venue: "2024 한국교육공학회 춘계학술대회",
      type: "Conference",
      topics: ["AIED"],
      tags: ["AIED"],
      //links: { website: "#" },
      award: "장려상"
    },
    {
      id: "p2022-j1",
      thumbnail: "pic.J.콘텐츠 설계원리.png",
      title: "콘텐츠 설계원리에 대한 학습유형별 학습자 인지적 상태 차이",
      authors: ["정겨운", "김규원", "조일현"],
      year: 2022,
      venue: "교육정보미디어연구, v.28 n.1, 133–160",
      type: "Journal",
      topics: ["Learning Analytics"],
      tags: ["Learning Analytics"],
      links: { doi: "https://doi.org/10.15833/KAFEIAM.28.1.133" }
    }
  ],

  // =========================================================================
  // 프로젝트 — 프로젝트를 여기서 추가/수정하세요
  // =========================================================================
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
  siteData.publications.forEach(pub => (pub.topics ?? []).forEach(t => topics.add(t)));
  return Array.from(topics);
}

export function getAllTypes() {
  const types = new Set<string>();
  siteData.publications.forEach(pub => types.add(pub.type));
  return Array.from(types);
}

export function filterPublications(topic?: string, type?: string) {
  return siteData.publications.filter(pub => {
    if (topic && topic !== "All" && !(pub.topics ?? []).includes(topic)) return false;
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
