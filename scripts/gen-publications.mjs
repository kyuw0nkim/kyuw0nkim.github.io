// Reads data/publications.xlsx and generates src/data/publications.generated.ts.
// Run with:  npm run gen:pubs   (also runs automatically before every build)
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import xlsx from "xlsx";
import { COLUMNS, rowToPublication } from "./pub-fields.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const XLSX_PATH = resolve(root, "data/publications.xlsx");
const OUT_PATH = resolve(root, "src/data/publications.generated.ts");

if (!existsSync(XLSX_PATH)) {
  console.error(`✗ Excel file not found: ${XLSX_PATH}`);
  process.exit(1);
}

const wb = xlsx.read(readFileSync(XLSX_PATH), { type: "buffer" });
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

const publications = [];
const allErrors = [];
const seenIds = new Set();

rows.forEach((row, i) => {
  const rowNum = i + 2; // +1 for 0-index, +1 for header row
  // Skip fully blank rows.
  if (COLUMNS.every((c) => String(row[c] ?? "").trim() === "")) return;

  const { pub, errors } = rowToPublication(row, rowNum);
  allErrors.push(...errors);
  if (seenIds.has(pub.id)) allErrors.push(`row ${rowNum}: duplicate id "${pub.id}"`);
  seenIds.add(pub.id);
  publications.push(pub);
});

if (allErrors.length) {
  console.error("✗ Could not generate publications — fix these rows in the Excel file:");
  for (const e of allErrors) console.error(`   - ${e}`);
  process.exit(1);
}

const body = publications.map((p) => "  " + JSON.stringify(p)).join(",\n");
const out = `// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Source of truth: data/publications.xlsx
// Regenerate with:  npm run gen:pubs
import { Publication } from "./types";

export const publications: Publication[] = [
${body},
];
`;

writeFileSync(OUT_PATH, out, "utf8");
console.log(`✓ Wrote ${publications.length} publications -> src/data/publications.generated.ts`);
