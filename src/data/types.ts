export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  type: "Conference" | "Workshop" | "Journal" | "Preprint";
  topics: string[];
  tags: string[];
  links: {
    pdf?: string;
    acmdl?: string;
    arxiv?: string;
    website?: string;
    doi?: string;
  };
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
  title: string;
  link?: string;
}

export interface SiteData {
  news: NewsItem[];
  publications: Publication[];
  projects: Project[];
}
