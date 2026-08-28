import { SiteData } from "./types";
import { publications } from "./publications.generated";

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
        { text: "Interaction Design for Learning Lab", href: "https://idlearning.org", tooltip: "Meet the awesome people I work with👋" },
        ", advised by ",
        { text: "Prof. Hyo-Jeong So", href: "https://scholar.google.com/citations?user=dI0biU8AAAAJ&hl=en", tooltip: "A researcher I truly admire🍀" },
        "."
      ],
      [
        "My research explores how human thinking unfolds—and sometimes breaks down—during collaborative dialogue, especially around socially contested topics. I focus on understanding how AI systems can ",
        { text: "recognize these critical moments", href: "https://doi.org/10.48550/arXiv.2601.05651"},
        " and ",
        { text: "intervene", href: "https://doi.org/10.1145/3746058.3758410"},
        " to sustain and deepen the dialogue. Ultimately, I aim to build learning technologies that support people in thinking together through complex and contested issues."
      ],
      [
        "Outside the lab, I enjoy listening to people's stories, tinkering with design, and watching Let's Play videos. New perspectives always inspire me - so feel free to reach out!"
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
    cvUrl: "/Kyuwon Kim_CV_Apr_2026.pdf",

    education: [
      {
        degree: "M.A. in Educational Technology",
        institution: "Ewha Womans University",
        period: "Mar 2025 - Aug 2026"
      },
      {
        degree: "B.A. in Educational Technology & B.E. in Software",
        institution: "Ewha Womans University",
        period: "Mar 2021 - Feb 2025"
      },
    ],

    experience: [
      {
        role: "Graduate Research Assistant",
        lab: "Interaction Design for Learning Lab, Research Advisor: Hyo-Jeong So",
        period: "Mar 2025 - Aug 2026"
      },
      {
        role: "Undergraduate Research Assistant",
        lab: "Interaction Design for Learning Lab, Research Advisor: Hyo-Jeong So",
        period: "Jan 2024 - Feb 2025"
      },
      {
        role: "Undergraduate Research Assistant",
        lab: "Learning Analytics for Prediction & Action Lab, Research Advisor: Il-Hyun Jo",
        period: "Summer 2021, Winter 2021, Summer 2023"
      },
    ],

    awards: [
      { title: "Best Student Paper Nominee", organization: "ICALT 2026", year: 2026 },
      { title: "IEEE TCLT Student Award", organization: "IEEE TCLT", year: 2026 },
      { title: "Outstanding Research Award", organization: "Korean Association for Educational Information and Media", year: 2026 },
      { title: "Best Paper Award", organization: "Korean Association for Educational Information and Media", year: 2026 },
      { title: "Best Poster Design Award", organization: "APSCE", year: 2024 },
      { title: "Excellence Award in Youth Idea Contest on African Educational Development Cooperation", organization: "Korean National Commission for UNESCO", year: 2024 },
      { title: "Outstanding Paper Award", organization: "Korean Association for Educational Information and Media", year: 2024 },
      { title: "Honorable Mention", organization: "The Korean Society for Educational Technology", year: 2023 },
      { title: "Grand Award in Upcoming Life in Space SW Challenge", organization: "Future & Software Foundation", year: 2022 },
    ],

    skills: ["Python", "R", "MySQL", "JavaScript/TypeScript", "React", "Machine Learning", "Figma", "LaTeX"],

    service: [
      { role: "Ad hoc Reviewer", details: ["Journal of Research, Innovation and Technologies (JoRIT)", "Environment and Social Psychology"] },
      { role: "Student Volunteer", details: ["KAEIM&KSET 2023 Fall", "KAEIM 2025 Spring", "ICoME 2025", "KAEIM&KSET 2025 Fall", "KAEIM 2026 Spring"] },
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
    { id: "n12", date: "2026-07-07", title: ["My first-authored paper has been nominated for the Best Student Paper Award at ICALT 2026."] },
    { id: "n11", date: "2026-05-30", title: ["Excited to share that my first-authored poster received the Best Paper Award at the KAEIM Spring Conference."] },
    { id: "n10", date: "2026-05-18", title: ["Started my new journey at Seoul Robot & AI Museum as a museum educator🤖"] },
    { id: "n9", date: "2026-05-07", title: ["Honored to be selected as a recipient of the IEEE TCLT Student Award."] },
    { id: "n8", date: "2026-04-25", title: ["After a short break in Korea, off to Norway for LAK 2026🍀"] },
    { id: "n7", date: "2026-04-04", title: ["Our paper about productive dialogue in value-laden discussions is accepted as full paper in ICALT 2026."] },
    { id: "n6", date: "2026-03-18", title: ["Traveling to London, Milan, and Barcelona (Apr 2–19). So many places in the world to explore!"] },
    { id: "n5", date: "2026-02-20", title: ["MelodyMate is accepted as poster in CHI 2026✨"] },
    { id: "n4", date: "2025-12-01", title: ["Our research article is accepted as full paper in LAK 2026! Now available in ", { text: "arXiv", href: "https://doi.org/10.48550/arXiv.2601.05651", tooltip: "Check out our preprint" }, "."] },
    { id: "n3", date: "2025-10-01", title: ["Presented the poster ", { text: "Your Thoughtful Opponent", href: "https://doi.org/10.1145/3746058.3758410", tooltip: "Read the paper" }, " at UIST 2025."] },
    { id: "n2", date: "2025-03-02", title: ["Just started my Master's journey in the IDL lab, at Ewha Womans University🚀"] },
    { id: "n1", date: "2024-11-29", title: ["Attended ICCE 2024 in person as a presenter. Our poster received a Best Poster Design Award at ICCE 2024🎉"] }
  ],

  // =========================================================================
  // 논문 목록 — 여기서 직접 수정하지 마세요!
  //
  // 논문은 엑셀 파일에서 관리합니다:  data/publications.xlsx
  //   1. data/publications.xlsx 를 열어 행을 추가/수정 (한 행 = 논문 하나)
  //   2. 터미널에서  npm run gen:pubs  실행
  //      → src/data/publications.generated.ts 가 자동으로 다시 생성됩니다
  //   3. git add / commit / push  하면 사이트에 자동 반영
  //
  // 썸네일: public/thumbnails/ 폴더에 이미지를 넣고(권장 3:2, 예 600×400px),
  //         엑셀의 thumbnail 열에 파일명(예: my-paper-2025.png)을 적으세요.
  // =========================================================================
  publications: publications,

  // =========================================================================
  // 프로젝트 — 프로젝트를 여기서 추가/수정하세요
  // =========================================================================
  projects: [
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
      relatedPublications: ["p2025-c1"]
    }
  ],

  // =========================================================================
  // 차트 주석 — Analytics 그래프에 표시할 개인 이정표를 추가하세요
  // year: X축 연도 (숫자), label: 표시할 텍스트
  // =========================================================================
  chartAnnotations: [
    { year: 2025, label: "Earned my bachelor's degree" },
  ],
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
  return [...siteData.publications]
    .filter(p => p.type !== "Preprint")
    .sort((a, b) => b.year - a.year)[0];
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
