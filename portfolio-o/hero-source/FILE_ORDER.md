# Tracing / Shaping — 2.5D Hero Assets

Total: 26 production-candidate PNG sprites with actual RGBA alpha channels.
The order below is back-to-front (z-index).

| Layer | Filename | Original generation | Click |
|---:|---|---|---|
| 01 | `background/bg_exterior_far.png` | Batch 1 · 01 | no |
| 02 | `background/bg_exterior_foliage.png` | Batch 1 · 02 | no |
| 03 | `background/bg_room_window_floor.png` | Batch 1 · 03 | no |
| 04 | `shadows/shadow_table.png` | Batch 2 · 09 | no |
| 05 | `shadows/shadow_chair_green.png` | Batch 2 · 10 | no |
| 06 | `shadows/shadow_chair_pink.png` | Batch 3 · 05 | no |
| 07 | `shadows/shadow_stool.png` | Batch 3 · 06 | no |
| 08 | `furniture/chair_green_legs.png` | Batch 3 · 07 (replacement) | no |
| 09 | `furniture/chair_pink_legs.png` | Batch 3 · 08 (replacement) | no |
| 10 | `furniture/stool_lavender_legs.png` | Batch 3 · 09 (replacement) | no |
| 11 | `furniture/chair_green_back.png` | Batch 2 · 02 | no |
| 12 | `furniture/chair_pink_back.png` | Batch 2 · 05 | no |
| 13 | `furniture/stool_lavender_seat.png` | Batch 3 · 10 (replacement) | no |
| 14 | `characters/char_white_body.png` | Batch 1 · 04 | tracing |
| 15 | `characters/char_green_body.png` | Pattern-free revision · 02 | tracing |
| 16 | `characters/char_pink_body.png` | Pattern-free revision · 01 | tracing |
| 17 | `furniture/chair_green_front.png` | Batch 2 · 03 | no |
| 18 | `furniture/chair_pink_front.png` | Batch 2 · 06 | no |
| 19 | `furniture/table_pedestal.png` | Batch 1 · 08 | shaping |
| 20 | `furniture/table_surface.png` | Batch 1 · 09 | shaping |
| 21 | `characters/char_green_front_paws.png` | Rounded paws revision · 02 | tracing |
| 22 | `characters/char_pink_front_paws.png` | Rounded paws revision · 01 | tracing |
| 23 | `tools/tool_laptop.png` | Batch 1 · 10 | shaping |
| 24 | `furniture/table_front_rim.png` | Batch 3 · 04 | shaping |
| 25 | `characters/char_lavender.png` | Batch 1 · 07 | tracing |
| 26 | `foreground/fg_plant_blur.png` | Batch 3 · 01 | no |

## Important production notes

These PNGs were produced as separate generations from a reference image, **not extracted pixel-for-pixel**. Their outlines, relative positions, sizes and exact overlap cannot be assumed to reproduce the original when combined.
The manifest records real pixel dimensions, z-index and interaction groups. `scenePositionPx` and `sceneScale` are deliberately `null` until visual alignment is performed.
Alpha verification confirms genuine transparent pixels in all 26 files; it does not certify feathering, absence of edge halos, original-style fidelity or successful scene reconstruction.
New revised green/pink bodies have no surface pattern, and the front paw assets are from the latest rounded revision.
The source batches contained 36 images; this package selects 26 final candidates without including deprecated variants.

## Suggested next step

Composite all sprites at 1448×1086 in the approved layer order, visually calibrate x/y/scale, resolve table/character occlusion, update `manifest.json`, and only then implement parallax, zoom, and glow.
