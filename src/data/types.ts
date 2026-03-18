// A text segment: either a plain string or a linked piece of text.
export type TextPart = string | { text: string; href: string };

export interface Profile {
  name: string;
  title: string;
  lab: string;
  department: string;
  university: string;
  bioParagraphs: TextPart[][];  // array of paragraphs; each paragraph is an array of TextParts
  // 프로필 이미지 경로 (public/ 폴더 기준, 예: "/profile.jpg")
  profileImage?: string;
  email: string;
  googleScholar: string;
  researchGate: string;
  linkedin: string;
  github: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

export interface ExperienceItem {
  role: string;
  lab: string;
  period: string;
}

export interface AwardItem {
  title: string;
  organization?: string;
  year: number | string;
}

export interface ServiceItem {
  role: string;
  details: string[];
}

export interface CVData {
  cvUrl: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  awards: AwardItem[];
  skills: string[];
  service: ServiceItem[];
}

export interface Publication {
  id: string;
  title: string;
  authors?: string[];
  year: number;
  venue?: string;
  type: "Conference" | "Workshop" | "Journal" | "Preprint";
  topics?: string[];
  tags?: string[];
  links?: {
    pdf?: string;
    acmdl?: string;
    arxiv?: string;
    website?: string;
    doi?: string;
  };
  award?: string;
  thumbnail?: string;
}

export interface Project {
  id: string;
  title: string;
  year: number;
  startDate: string;
  endDate: string;
  role: string;
  summary: string;
  description: string;
  thumbnail?: string;
  relatedPublications: string[];
}

export interface NewsItem {
  id: string;
  date: string;
  title: TextPart[];  // array of TextParts; embed { text, href } for inline links
}

export interface DesignWork {
  id: string;
  title: string;
  category: "Prototype" | "Visual" | "UX";
  thumbnail?: string;
  description: string;
  year: number;
  links?: {
    figma?: string;
    demo?: string;
    video?: string;
  };
}

export interface SiteData {
  profile: Profile;
  cv: CVData;
  news: NewsItem[];
  publications: Publication[];
  projects: Project[];
}
