#!/usr/bin/env node
// Verifies the layered hero: every manifest asset exists on disk with the stated
// pixel size, and the scene layout covers exactly the manifest's assets.
// Usage: npm run check:hero
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const assetDir = path.join(root, "public/hero-assets");
const manifest = JSON.parse(fs.readFileSync(path.join(assetDir, "manifest.json"), "utf8"));
const layout = JSON.parse(fs.readFileSync(path.join(root, "src/portfolio/hero2d/scene-layout.json"), "utf8"));

const pngSize = (file) => {
  const buf = fs.readFileSync(file);
  if (buf.toString("ascii", 1, 4) !== "PNG") throw new Error("not a PNG");
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
};

const problems = [];
const byFile = new Map(layout.layers.map((l) => [l.file, l]));
for (const a of manifest.assets) {
  const file = path.join(assetDir, a.file);
  if (!fs.existsSync(file)) {
    problems.push(`missing file: ${a.file}`);
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

if (problems.length) {
  console.error(`Hero assets: ${problems.length} problem(s)\n - ${problems.join("\n - ")}`);
  process.exit(1);
}
console.log(`Hero assets OK: ${manifest.assets.length} layers, all files present and sized as declared.`);
