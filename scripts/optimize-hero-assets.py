#!/usr/bin/env python3
"""
Builds the web sprites for the 2.5D hero (public/hero-assets/**/*.webp) from
the original PNG package (portfolio/hero-source/).

Each sprite is drawn at `width × scale` logical px (scene-layout.json). The
originals carry far more pixels than that, so every sprite is downscaled to at
most DENSITY image px per logical px — enough for a 2× display at the deepest
camera zoom on common screens — and saved as lossy WebP with lossless alpha.
Soft, out-of-focus layers (floor shadows, the blurred plant) have no detail to
lose and get SOFT_DENSITY instead.
Resampling is done on premultiplied alpha so edges don't pick up dark fringes.

Re-run after replacing an original or noticeably enlarging a layer in the
editor (`npm run check:hero` warns when a sprite has become too small).

Usage:  npm run optimize:hero        (needs Pillow: pip install pillow)
"""
import json
import sys
from pathlib import Path

from PIL import Image

DENSITY = 2.5  # image px per logical scene px
SOFT_DENSITY = 1.25
SOFT_GROUPS = {"foreground-plant"}
QUALITY = 88  # WebP colour quality; alpha is kept lossless

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "portfolio" / "hero-source"
OUT = ROOT / "public" / "hero-assets"
LAYOUT = ROOT / "src" / "portfolio" / "hero2d" / "scene-layout.json"


def main() -> int:
    layout = json.loads(LAYOUT.read_text())
    written = set()
    total_in = total_out = 0
    for layer in layout["layers"]:
        src = SOURCE / layer["file"]
        dst = OUT / Path(layer["file"]).with_suffix(".webp")
        dst.parent.mkdir(parents=True, exist_ok=True)

        im = Image.open(src)
        im.load()
        im = im.convert("RGBA")
        soft = layer["id"].startswith("shadow_") or layer["group"] in SOFT_GROUPS
        w = min(im.width, round(layer["width"] * layer["scale"] * (SOFT_DENSITY if soft else DENSITY)))
        h = max(1, round(im.height * w / im.width))
        if w < im.width:
            im = im.convert("RGBa").resize((w, h), Image.LANCZOS).convert("RGBA")
        im.save(dst, "WEBP", quality=QUALITY, alpha_quality=100, method=6)

        written.add(dst)
        total_in += src.stat().st_size
        total_out += dst.stat().st_size
        print(f"{layer['file']:<44} {w:>5}×{h:<5} {dst.stat().st_size / 1024:>7.0f} KB")

    for stale in OUT.rglob("*"):
        if stale.is_file() and stale not in written:
            stale.unlink()
            print(f"removed stale {stale.relative_to(ROOT)}")

    print(f"\n{len(written)} sprites: {total_in / 2**20:.1f} MB PNG → {total_out / 2**20:.2f} MB WebP")
    return 0


if __name__ == "__main__":
    sys.exit(main())
