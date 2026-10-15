#!/usr/bin/env node
// Verifies the layered hero:
//  - every manifest asset exists in the original package (portfolio/hero-source/)
//    with the stated pixel size, and the scene layout covers exactly those assets;
//  - every layer has its web copy (public/hero-assets/*.webp) with the same aspect
//    ratio, sharp enough for its current scale (else: npm run optimize:hero).
// Usage: npm run check:hero
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const sourceDir = path.join(root, "portfolio/hero-source");
const webDir = path.join(root, "public/hero-assets");
const manifest = JSON.parse(fs.readFileSync(path.join(sourceDir, "manifest.json"), "utf8"));
const layout = JSON.parse(fs.readFileSync(path.join(root, "src/portfolio/hero2d/scene-layout.json"), "utf8"));

// Keep in sync with scripts/optimize-hero-assets.py.
const DENSITY = 2.5;
const SOFT_DENSITY = 1.25;
const isSoft = (l) => l.id.startsWith("shadow_") || l.group === "foreground-plant";

const pngSize = (file) => {
  const buf = fs.readFileSync(file);
  if (buf.toString("ascii", 1, 4) !== "PNG") throw new Error("not a PNG");
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
};

const webpSize = (file) => {
  const buf = fs.readFileSync(file);
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") throw new Error("not a WebP");
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") return [buf.readUIntLE(24, 3) + 1, buf.readUIntLE(27, 3) + 1];
  if (chunk === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
  }
  if (chunk === "VP8 ") return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  throw new Error(`unknown WebP chunk ${chunk}`);
};

const problems = [];
const warnings = [];
const byFile = new Map(layout.layers.map((l) => [l.file, l]));
for (const a of manifest.assets) {
  const file = path.join(sourceDir, a.file);
  if (!fs.existsSync(file)) {
    problems.push(`missing original: ${a.file}`);
    continue;
  }
  const [w, h] = pngSize(file);
  if (w !== a.dimensionsPx[0] || h !== a.dimensionsPx[1]) problems.push(`${a.file}: ${w}×${h}, manifest says ${a.dimensionsPx.join("×")}`);
  const l = byFile.get(a.file);
  if (!l) problems.push(`not in scene-layout.json: ${a.file}`);
  else if (l.width !== w || l.height !== h) problems.push(`${a.file}: layout size ${l.width}×${l.height} ≠ file ${w}×${h}`);
}
const manifestFiles = new Set(manifest.assets.map((a) => a.file));
for (const l of layout.layers) if (!manifestFiles.has(l.file)) problems.push(`layout layer not in manifest: ${l.file}`);

const webFiles = new Set();
for (const l of layout.layers) {
  const rel = l.file.replace(/\.png$/i, ".webp");
  const file = path.join(webDir, rel);
  webFiles.add(path.normalize(file));
  if (!fs.existsSync(file)) {
    problems.push(`missing web copy: public/hero-assets/${rel} (npm run optimize:hero)`);
    continue;
  }
  const [w, h] = webpSize(file);
  if (Math.abs(w / h - l.width / l.height) > 0.01) problems.push(`${rel}: ${w}×${h} doesn't match the original's aspect ratio`);
  const density = w / (l.width * l.scale);
  const want = Math.min(l.width / (l.width * l.scale), isSoft(l) ? SOFT_DENSITY : DENSITY);
  if (density < want * 0.85) warnings.push(`${rel}: ${density.toFixed(2)} px per scene px, ${want.toFixed(2)} expected (npm run optimize:hero)`);
}
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
for (const f of walk(webDir)) if (!webFiles.has(path.normalize(f))) warnings.push(`unused file: ${path.relative(root, f)}`);

if (warnings.length) console.warn(`Hero assets: ${warnings.length} warning(s)\n - ${warnings.join("\n - ")}`);
if (problems.length) {
  console.error(`Hero assets: ${problems.length} problem(s)\n - ${problems.join("\n - ")}`);
  process.exit(1);
}
console.log(`Hero assets OK: ${manifest.assets.length} layers, originals and web copies present and consistent.`);
