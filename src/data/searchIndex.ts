import { siteData } from "./siteData";
import { blogPosts } from "./blogPosts";

export type SearchItem = {
  id: string;
  title: string;
  url: string;
  category: "publication" | "project" | "news" | "blog";
  content: string;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

const scoreItem = (query: string, content: string) => {
  if (!query) return 0;
  const normalizedQuery = normalize(query);
  const normalizedContent = normalize(content);
  if (!normalizedQuery || !normalizedContent) return 0;

  let score = 0;
  if (normalizedContent.includes(normalizedQuery)) {
    score += 5;
  }

  const words = normalizedQuery.split(" ").filter(Boolean);
  for (const word of words) {
    if (normalizedContent.includes(word)) {
      score += 1;
    }
  }

  return score;
};

const buildSearchItems = (): SearchItem[] => {
  const publicationItems = siteData.publications.map((publication) => ({
    id: publication.id,
    title: publication.title,
    url: "/publications",
    category: "publication" as const,
    content: [
      publication.title,
      publication.authors.join(" "),
      publication.venue,
      publication.type,
      publication.topics.join(" "),
      publication.tags.join(" "),
      publication.year.toString(),
    ].join(" "),
  }));

  const projectItems = siteData.projects.map((project) => ({
    id: project.id,
    title: project.title,
    url: `/projects/${project.id}`,
    category: "project" as const,
    content: [
      project.title,
      project.summary,
      project.role,
      project.description,
      project.year.toString(),
    ].join(" "),
  }));

  const newsItems = siteData.news.map((news) => ({
    id: news.id,
    title: news.title,
    url: "/news",
    category: "news" as const,
    content: [news.title, news.date].join(" "),
  }));

  const blogItems = blogPosts.map((post) => ({
    id: post.id,
    title: post.title,
    url: `/blog/${post.id}`,
    category: "blog" as const,
    content: [post.title, post.excerpt, post.tags.join(" "), post.content].join(" "),
  }));

  return [...publicationItems, ...projectItems, ...newsItems, ...blogItems];
};

const searchItems = buildSearchItems();

export const getSearchResults = (query: string, limit = 5) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const scored = searchItems
    .map((item) => ({
      item,
      score: scoreItem(normalizedQuery, item.content),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));

  return scored.slice(0, limit).map((entry) => entry.item);
};
