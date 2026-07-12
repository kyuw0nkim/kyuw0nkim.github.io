// ONE-TIME bootstrap: extract the current `publications` array from
// src/data/siteData.ts and write it to data/publications.xlsx so the Excel
// file starts out exactly matching the live site. Safe to delete afterwards.
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import xlsx from "xlsx";
import { COLUMNS, publicationToRow } from "./pub-fields.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const src = readFileSync(resolve(root, "src/data/siteData.ts"), "utf8");

// Find `publications: [` and walk brackets (respecting strings) to its match.
const marker = "publications:";
const start = src.indexOf("[", src.indexOf(marker));
if (start === -1) throw new Error("Could not locate publications array in siteData.ts");

let depth = 0;
let end = -1;
let inStr = null; // quote char while inside a string
for (let i = start; i < src.length; i++) {
  const ch = src[i];
  if (inStr) {
    if (ch === "\\") i++;
    else if (ch === inStr) inStr = null;
    continue;
  }
  if (ch === '"' || ch === "'" || ch === "`") inStr = ch;
  else if (ch === "[") depth++;
  else if (ch === "]") {
    depth--;
    if (depth === 0) { end = i; break; }
  }
}
if (end === -1) throw new Error("Unbalanced brackets while parsing publications array");

const literal = src.slice(start, end + 1);
// The array literal is plain JS (only the outer const had TS annotations).
const publications = new Function(`return (${literal});`)();

const rows = publications.map(publicationToRow);
const ws = xlsx.utils.json_to_sheet(rows, { header: COLUMNS });
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, "publications");

mkdirSync(resolve(root, "data"), { recursive: true });
const outPath = resolve(root, "data/publications.xlsx");
xlsx.writeFile(wb, outPath);
console.log(`✓ Wrote ${rows.length} publications -> data/publications.xlsx`);
