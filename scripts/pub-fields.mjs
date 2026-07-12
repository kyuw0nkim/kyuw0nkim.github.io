// Shared schema + (de)serialization helpers for publications <-> spreadsheet.
// Keep this file in sync with the `Publication` type in src/data/types.ts.

// Column order used when writing the .xlsx (also the human-facing column order).
export const COLUMNS = [
  "id",
  "title",
  "authors",   // ";"-separated
  "year",
  "venue",
  "type",       // Conference | Workshop | Journal | Preprint
  "topics",     // ";"-separated
  "tags",       // ";"-separated
  "pdf",        // -> links.pdf
  "doi",        // -> links.doi
  "arxiv",      // -> links.arxiv
  "acmdl",      // -> links.acmdl
  "website",    // -> links.website
  "award",
  "thumbnail",
];

const LINK_KEYS = ["pdf", "doi", "arxiv", "acmdl", "website"];
const ALLOWED_TYPES = ["Conference", "Workshop", "Journal", "Preprint"];
const LIST_SEP = ";";

const splitList = (v) =>
  String(v ?? "")
    .split(LIST_SEP)
    .map((s) => s.trim())
    .filter(Boolean);

const joinList = (arr) => (arr ?? []).join(`${LIST_SEP} `);

// Turn one spreadsheet row (object keyed by COLUMNS) into a Publication object.
// `rowNum` is 1-based for human-friendly error messages. Returns { pub, errors }.
export function rowToPublication(row, rowNum) {
  const errors = [];
  const get = (k) => String(row[k] ?? "").trim();

  const id = get("id");
  const title = get("title");
  const yearRaw = get("year");
  const type = get("type");

  if (!id) errors.push(`row ${rowNum}: missing "id"`);
  if (!title) errors.push(`row ${rowNum}: missing "title"`);
  const year = Number(yearRaw);
  if (!yearRaw || Number.isNaN(year)) errors.push(`row ${rowNum}: invalid "year" ("${yearRaw}")`);
  if (!type) errors.push(`row ${rowNum}: missing "type"`);
  else if (!ALLOWED_TYPES.includes(type))
    errors.push(`row ${rowNum}: "type" must be one of ${ALLOWED_TYPES.join(", ")} (got "${type}")`);

  const pub = { id, title, year, type };

  const authors = splitList(row.authors);
  if (authors.length) pub.authors = authors;

  const venue = get("venue");
  if (venue) pub.venue = venue;

  const topics = splitList(row.topics);
  if (topics.length) pub.topics = topics;

  const tags = splitList(row.tags);
  if (tags.length) pub.tags = tags;

  const links = {};
  for (const k of LINK_KEYS) {
    const v = get(k);
    if (v) links[k] = v;
  }
  if (Object.keys(links).length) pub.links = links;

  const award = get("award");
  if (award) pub.award = award;

  const thumbnail = get("thumbnail");
  if (thumbnail) pub.thumbnail = thumbnail;

  return { pub, errors };
}

// Turn a Publication object into a flat spreadsheet row (object keyed by COLUMNS).
export function publicationToRow(pub) {
  const links = pub.links ?? {};
  return {
    id: pub.id ?? "",
    title: pub.title ?? "",
    authors: joinList(pub.authors),
    year: pub.year ?? "",
    venue: pub.venue ?? "",
    type: pub.type ?? "",
    topics: joinList(pub.topics),
    tags: joinList(pub.tags),
    pdf: links.pdf ?? "",
    doi: links.doi ?? "",
    arxiv: links.arxiv ?? "",
    acmdl: links.acmdl ?? "",
    website: links.website ?? "",
    award: pub.award ?? "",
    thumbnail: pub.thumbnail ?? "",
  };
}
