import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { HeroScene } from "../HeroScene";
import { alphaAt, loadAlphaMask } from "../hitTest";
import type { AlphaMask } from "../hitTest";
import { byZ, fitScene, layerSize, layerSrc, parseLayout, sceneLayout } from "../sceneConfig";
import type { Fit, SceneLayerConfig, SceneLayout } from "../sceneConfig";
import "./editor.css";

/**
 * DEV-ONLY asset position editor for the layered hero (open /portfolio/?editor
 * on the dev server). It edits the same scene-layout.json the website renders;
 * nothing here ships in production builds.
 */

const DRAFT_KEY = "hero-editor:draft:v1";
const LOCK_KEY = "hero-editor:locked:v1";
const DEFAULT_LOCKED = ["bg_exterior_far", "bg_exterior_foliage", "bg_room_window_floor"];

// A reference image dropped into src/portfolio/hero2d/reference/ (git-ignored) loads automatically.
const referenceFiles = import.meta.glob("../reference/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const AUTO_REFERENCE = Object.values(referenceFiles)[0] ?? null;

/** Stage sizes the website produces (see .stage in portfolio.css), drawn as crop previews. */
const STAGE_PRESETS = [
  { label: "Desktop 1440×900", w: 1440 * 0.47, h: 900, color: "#2f6fed" },
  { label: "Desktop 1920×1080", w: 1920 * 0.47, h: 1080, color: "#7a4cf0" },
  { label: "Laptop 1280×720", w: 1280 * 0.47, h: 720, color: "#0e9f6e" },
  { label: "Mobile 390×844", w: 390, h: Math.min(Math.max(340, 390 * 1.18), 844 * 0.7), color: "#e8590c" },
];

type Step = "x" | "y" | "scale" | "rotation" | "opacity" | "z";

function round(v: number, d = 1) {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

const serialize = (l: SceneLayout) => `${JSON.stringify(l, null, 2)}\n`;

function loadDraft(): SceneLayout | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? parseLayout(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export default function EditorApp() {
  const fileLayout = sceneLayout;
  const [layout, setLayout] = useState<SceneLayout>(() => loadDraft() ?? fileLayout);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [restored] = useState(() => {
    const d = loadDraft();
    return !!d && serialize(d) !== serialize(fileLayout);
  });
  const [locked, setLocked] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCK_KEY) ?? "null") ?? DEFAULT_LOCKED;
    } catch {
      return DEFAULT_LOCKED;
    }
  });
  const [linkGroup, setLinkGroup] = useState(false);
  const [solo, setSolo] = useState(false);
  const [showFraming, setShowFraming] = useState(true);
  const [showOutlines, setShowOutlines] = useState(false);
  const [reference, setReference] = useState({
    src: AUTO_REFERENCE as string | null,
    show: !!AUTO_REFERENCE,
    opacity: 0.5,
    blend: "normal" as "normal" | "difference",
    above: true,
  });
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  // ------------------------------------------------------------ history --
  const past = useRef<SceneLayout[]>([]);
  const future = useRef<SceneLayout[]>([]);
  const lastKey = useRef<{ key: string; t: number } | null>(null);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  const commit = useCallback((next: SceneLayout, coalesceKey?: string) => {
    const now = performance.now();
    const same = coalesceKey && lastKey.current?.key === coalesceKey && now - lastKey.current.t < 800;
    if (!same) past.current.push(layoutRef.current);
    if (past.current.length > 200) past.current.shift();
    future.current = [];
    lastKey.current = coalesceKey ? { key: coalesceKey, t: now } : null;
    setLayout(next);
  }, []);

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (!prev) return;
    future.current.push(layoutRef.current);
    lastKey.current = null;
    setLayout(prev);
  }, []);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push(layoutRef.current);
    lastKey.current = null;
    setLayout(next);
  }, []);

  // Keep a draft in this browser so a reload never loses calibration work.
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        if (serialize(layout) === serialize(fileLayout)) localStorage.removeItem(DRAFT_KEY);
        else localStorage.setItem(DRAFT_KEY, JSON.stringify(layout));
      } catch {
        /* storage unavailable */
      }
    }, 300);
    return () => window.clearTimeout(t);
  }, [layout, fileLayout]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCK_KEY, JSON.stringify(locked));
    } catch {
      /* ignore */
    }
  }, [locked]);

  const dirty = serialize(layout) !== serialize(fileLayout);
  const layers = useMemo(() => byZ(layout.layers), [layout.layers]);
  const selected = layout.layers.find((l) => l.id === selectedId) ?? null;

  const patchLayers = useCallback(
    (ids: string[], fn: (l: SceneLayerConfig) => Partial<SceneLayerConfig>, coalesceKey?: string) => {
      const cur = layoutRef.current;
      commit({ ...cur, layers: cur.layers.map((l) => (ids.includes(l.id) ? { ...l, ...fn(l) } : l)) }, coalesceKey);
    },
    [commit],
  );

  /** The selected layer, plus its group when "move group together" is on. */
  const targetsFor = useCallback(
    (id: string) => {
      const l = layoutRef.current.layers.find((x) => x.id === id);
      if (!l) return [];
      return linkGroup ? layoutRef.current.layers.filter((x) => x.group === l.group).map((x) => x.id) : [id];
    },
    [linkGroup],
  );

  const nudge = useCallback(
    (key: Step, delta: number) => {
      if (!selectedId) return;
      const ids = key === "x" || key === "y" ? targetsFor(selectedId) : [selectedId];
      patchLayers(
        ids,
        (l) => {
          if (key === "scale") return { scale: round(l.scale * (1 + delta), 4) };
          if (key === "opacity") return { opacity: Math.min(1, Math.max(0, round(l.opacity + delta, 2))) };
          if (key === "z") return { z: l.z + delta };
          return { [key]: round(l[key] + delta, 1) } as Partial<SceneLayerConfig>;
        },
        `nudge:${selectedId}:${key}`,
      );
    },
    [patchLayers, selectedId, targetsFor],
  );

  /** Swap z with the neighbour in the stacking order. */
  const moveZ = useCallback(
    (id: string, dir: 1 | -1) => {
      const sorted = byZ(layoutRef.current.layers);
      const i = sorted.findIndex((l) => l.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= sorted.length) return;
      const a = sorted[i];
      const b = sorted[j];
      patchLayers([a.id, b.id], (l) => ({ z: l.id === a.id ? b.z : a.z }));
    },
    [patchLayers],
  );

  // -------------------------------------------------------- viewport -----
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [view, setView] = useState({ zoom: 1, panX: 0, panY: 0 });
  useLayoutEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const measure = () => setCanvasSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const baseFit = useMemo(() => fitScene(layout, canvasSize.w, canvasSize.h, "contain", 28), [layout, canvasSize]);
  const fit: Fit = useMemo(
    () => ({ scale: baseFit.scale * view.zoom, x: baseFit.x * view.zoom + view.panX, y: baseFit.y * view.zoom + view.panY }),
    [baseFit, view],
  );
  const fitRef = useRef(fit);
  fitRef.current = fit;

  const toLogical = useCallback((clientX: number, clientY: number) => {
    const r = canvasRef.current!.getBoundingClientRect();
    const f = fitRef.current;
    return { x: (clientX - r.left - f.x) / f.scale, y: (clientY - r.top - f.y) / f.scale };
  }, []);

  // Alpha masks for click selection (transparent pixels never select a layer).
  const masks = useRef(new Map<string, AlphaMask>());
  useEffect(() => {
    layout.layers.forEach((l) => {
      if (masks.current.has(l.id)) return;
      loadAlphaMask(layerSrc(layout, l))
        .then((m) => masks.current.set(l.id, m))
        .catch(() => undefined);
    });
  }, [layout]);

  const hitsAt = useCallback(
    (x: number, y: number) =>
      byZ(layoutRef.current.layers)
        .reverse()
        .filter((l) => l.visible && !locked.includes(l.id))
        .filter((l) => {
          const m = masks.current.get(l.id);
          return m ? alphaAt(l, m, x, y) > 40 : false;
        }),
    [locked],
  );

  const drag = useRef<null | {
    kind: "layer" | "pan";
    ids: string[];
    start: { x: number; y: number };
    origin: Record<string, { x: number; y: number }>;
    view?: typeof view;
    client: { x: number; y: number };
    pushed: boolean;
  }>(null);
  const spaceDown = useRef(false);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.button !== 1) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const p = toLogical(e.clientX, e.clientY);
    if (e.button === 1 || spaceDown.current) {
      drag.current = { kind: "pan", ids: [], start: p, origin: {}, view, client: { x: e.clientX, y: e.clientY }, pushed: true };
      return;
    }
    const hits = hitsAt(p.x, p.y);
    let target = hits[0] ?? null;
    if (e.altKey && hits.length > 1 && selectedId) {
      const i = hits.findIndex((h) => h.id === selectedId);
      target = hits[(i + 1) % hits.length];
    }
    if (!target) {
      setSelectedId(null);
      return;
    }
    setSelectedId(target.id);
    const ids = targetsFor(target.id);
    const origin: Record<string, { x: number; y: number }> = {};
    layoutRef.current.layers.forEach((l) => ids.includes(l.id) && (origin[l.id] = { x: l.x, y: l.y }));
    drag.current = { kind: "layer", ids, start: p, origin, client: { x: e.clientX, y: e.clientY }, pushed: false };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = toLogical(e.clientX, e.clientY);
    setPointer({ x: round(p.x), y: round(p.y) });
    const d = drag.current;
    if (!d) return;
    if (d.kind === "pan" && d.view) {
      setView({ ...d.view, panX: d.view.panX + e.clientX - d.client.x, panY: d.view.panY + e.clientY - d.client.y });
      return;
    }
    let dx = p.x - d.start.x;
    let dy = p.y - d.start.y;
    if (e.shiftKey) {
      if (Math.abs(dx) > Math.abs(dy)) dy = 0;
      else dx = 0;
    }
    if (!d.pushed) {
      if (Math.hypot(e.clientX - d.client.x, e.clientY - d.client.y) < 3) return;
      past.current.push(layoutRef.current);
      future.current = [];
      lastKey.current = null;
      d.pushed = true;
    }
    const cur = layoutRef.current;
    setLayout({
      ...cur,
      layers: cur.layers.map((l) => (d.origin[l.id] ? { ...l, x: round(d.origin[l.id].x + dx), y: round(d.origin[l.id].y + dy) } : l)),
    });
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  const baseFitRef = useRef(baseFit);
  baseFitRef.current = baseFit;

  // Wheel: zoom the view; Alt+wheel scales the selected layer; Shift+wheel rotates it.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const sel = layoutRef.current.layers.find((l) => l.id === selectedIdRef.current);
      if (sel && e.altKey) {
        patchLayers([sel.id], (l) => ({ scale: round(l.scale * (e.deltaY < 0 ? 1.01 : 1 / 1.01), 4) }), `wheel-scale:${sel.id}`);
        return;
      }
      if (sel && e.shiftKey) {
        const delta = (e.deltaY || e.deltaX) < 0 ? 0.25 : -0.25;
        patchLayers([sel.id], (l) => ({ rotation: round(l.rotation + delta, 2) }), `wheel-rot:${sel.id}`);
        return;
      }
      const r = el.getBoundingClientRect();
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;
      setView((v) => {
        const zoom = Math.min(8, Math.max(0.5, v.zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
        const f = fitRef.current;
        const lx = (cx - f.x) / f.scale;
        const ly = (cy - f.y) / f.scale;
        const b = baseFitRef.current;
        // keep the logical point under the cursor fixed while zooming
        return { zoom, panX: cx - (lx * b.scale + b.x) * zoom, panY: cy - (ly * b.scale + b.y) * zoom };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [patchLayers]);
  // ------------------------------------------------------------ keys -----
  const save = useCallback(async () => {
    setStatus("Saving…");
    try {
      const res = await fetch("/__hero-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Hero-Editor": "1" },
        body: serialize(layoutRef.current),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("Saved to src/portfolio/hero2d/scene-layout.json");
    } catch (err) {
      setStatus(`Save failed — use Download instead (${err instanceof Error ? err.message : err})`);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA")) return;
      const mod = e.metaKey || e.ctrlKey;
      if (e.code === "Space") {
        spaceDown.current = e.type === "keydown";
        if (e.type === "keydown") e.preventDefault();
        return;
      }
      if (e.type !== "keydown") return;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") return redo();
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
        return;
      }
      if (e.key === "0" && !mod) return setView({ zoom: 1, panX: 0, panY: 0 });
      if (!selectedIdRef.current) return;
      const big = e.shiftKey ? 10 : 1;
      const map: Record<string, () => void> = {
        ArrowLeft: () => nudge("x", -big),
        ArrowRight: () => nudge("x", big),
        ArrowUp: () => nudge("y", -big),
        ArrowDown: () => nudge("y", big),
        "+": () => nudge("scale", e.shiftKey ? 0.05 : 0.01),
        "=": () => nudge("scale", e.shiftKey ? 0.05 : 0.01),
        "-": () => nudge("scale", e.shiftKey ? -0.05 : -0.01),
        "]": () => moveZ(selectedIdRef.current!, 1),
        "[": () => moveZ(selectedIdRef.current!, -1),
        h: () => patchLayers([selectedIdRef.current!], (l) => ({ visible: !l.visible })),
        Escape: () => setSelectedId(null),
      };
      const fn = map[e.key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [moveZ, nudge, patchLayers, redo, save, undo]);

  // ------------------------------------------------------------ files ----
  const importFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      commit(parseLayout(JSON.parse(await file.text())));
      setStatus(`Loaded ${file.name}`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err));
    }
  };
  const loadReference = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) setReference((r) => ({ ...r, src: URL.createObjectURL(file), show: true }));
  };

  // ------------------------------------------------------------ render ---
  const displayLayout = useMemo<SceneLayout>(
    () =>
      solo && selectedId
        ? { ...layout, layers: layout.layers.map((l) => (l.id === selectedId ? l : { ...l, opacity: l.opacity * 0.12 })) }
        : layout,
    [layout, solo, selectedId],
  );

  const px = 1 / fit.scale; // one screen pixel in logical units
  const outline = (l: SceneLayerConfig, color: string, width = 1.5, dashed = false): ReactNode => {
    const { w, h } = layerSize(l);
    return (
      <div
        key={`ol-${l.id}`}
        className="ed-outline"
        style={{
          left: l.x - w / 2,
          top: l.y - h / 2,
          width: w,
          height: h,
          transform: l.rotation ? `rotate(${l.rotation}deg)` : undefined,
          outline: `${width * px}px ${dashed ? "dashed" : "solid"} ${color}`,
        }}
      />
    );
  };

  const frames = STAGE_PRESETS.map((p) => {
    const f = fitScene(layout, p.w, p.h, "cover");
    return { ...p, x: -f.x / f.scale, y: -f.y / f.scale, w2: p.w / f.scale, h2: p.h / f.scale };
  });

  const field = (key: Step, step: number, digits: number) =>
    selected && (
      <label className="ed-field">
        <span>{key}</span>
        <input
          type="number"
          step={step}
          value={round(selected[key] as number, digits)}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isFinite(v)) return;
            if (key === "x" || key === "y") {
              const delta = v - (selected[key] as number);
              patchLayers(targetsFor(selected.id), (l) => ({ [key]: round(l[key] + delta, 1) }) as Partial<SceneLayerConfig>, `field:${selected.id}:${key}`);
            } else {
              patchLayers([selected.id], () => ({ [key]: v }) as Partial<SceneLayerConfig>, `field:${selected.id}:${key}`);
            }
          }}
        />
      </label>
    );

  return (
    <div className="ed">
      <div
        ref={canvasRef}
        className="ed-canvas"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={() => setPointer(null)}
      >
        <HeroScene layout={displayLayout} fit="contain" fitOverride={fit} className="ed-scene">
          <div className="ed-bounds" style={{ outlineWidth: 1 * px }} />
          {reference.src && reference.show && (
            <img
              className="ed-reference"
              src={reference.src}
              alt=""
              style={{ opacity: reference.opacity, mixBlendMode: reference.blend, zIndex: reference.above ? 900 : 0 }}
            />
          )}
          {showOutlines && layers.filter((l) => l.visible).map((l) => outline(l, "rgba(47,111,237,.45)", 1))}
          {showFraming && (
            <>
              <div
                className="ed-frame ed-frame--safe"
                style={{
                  left: layout.framing.hero.x,
                  top: layout.framing.hero.y,
                  width: layout.framing.hero.width,
                  height: layout.framing.hero.height,
                  outlineWidth: 2 * px,
                }}
              >
                <span style={{ fontSize: 11 * px }}>must stay visible</span>
              </div>
              {frames.map((f, i) => (
                <div
                  key={f.label}
                  className="ed-frame"
                  style={{ left: f.x, top: f.y, width: f.w2, height: f.h2, outlineWidth: 1.5 * px, outlineColor: f.color, color: f.color }}
                >
                  {/* stack labels so overlapping crops stay readable */}
                  <span style={{ fontSize: 11 * px, top: (6 + i * 20) * px, bottom: "auto", left: 6 * px }}>{f.label}</span>
                </div>
              ))}
            </>
          )}
          {selected && outline(selected, "#ff2d75", 2, true)}
        </HeroScene>
        <div className="ed-hud">
          {pointer ? `x ${pointer.x}  y ${pointer.y}` : "—"} · zoom {Math.round(view.zoom * 100)}%
          <button type="button" onClick={() => setView({ zoom: 1, panX: 0, panY: 0 })}>
            Fit
          </button>
        </div>
      </div>

      <aside className="ed-panel">
        <header className="ed-head">
          <div>
            <h1>Hero scene editor</h1>
            <p className={dirty ? "ed-dirty" : "ed-clean"}>{dirty ? "Unsaved changes" : "Matches scene-layout.json"}</p>
          </div>
          <div className="ed-actions">
            <button type="button" onClick={undo} disabled={!past.current.length} title="Undo (⌘/Ctrl+Z)">
              Undo
            </button>
            <button type="button" onClick={redo} disabled={!future.current.length} title="Redo (⇧⌘/Ctrl+Z)">
              Redo
            </button>
            <button type="button" className="ed-primary" onClick={() => void save()} title="Write scene-layout.json (⌘/Ctrl+S)">
              Save to project
            </button>
            <button type="button" onClick={() => download("scene-layout.json", serialize(layout))}>
              Download JSON
            </button>
            <button
              type="button"
              onClick={() =>
                navigator.clipboard.writeText(serialize(layout)).then(
                  () => setStatus("JSON copied"),
                  () => setStatus("Copy failed"),
                )
              }
            >
              Copy JSON
            </button>
            <label className="ed-file">
              Load JSON…
              <input type="file" accept="application/json,.json" onChange={importFile} />
            </label>
            <button type="button" onClick={() => commit(fileLayout)} disabled={!dirty} title="Discard edits and reload the file">
              Revert to file
            </button>
          </div>
          {restored && <p className="ed-note">Restored an unsaved draft from this browser. “Revert to file” discards it.</p>}
          {status && <p className="ed-status">{status}</p>}
        </header>

        <section className="ed-section">
          <h2>Reference</h2>
          <div className="ed-row">
            <label className="ed-check">
              <input
                type="checkbox"
                checked={reference.show}
                disabled={!reference.src}
                onChange={(e) => setReference((r) => ({ ...r, show: e.target.checked }))}
              />
              Overlay
            </label>
            <select value={reference.blend} onChange={(e) => setReference((r) => ({ ...r, blend: e.target.value as "normal" | "difference" }))}>
              <option value="normal">Normal</option>
              <option value="difference">Difference</option>
            </select>
            <label className="ed-check">
              <input type="checkbox" checked={reference.above} onChange={(e) => setReference((r) => ({ ...r, above: e.target.checked }))} />
              On top
            </label>
          </div>
          <label className="ed-slider">
            Opacity
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={reference.opacity}
              onChange={(e) => setReference((r) => ({ ...r, opacity: Number(e.target.value) }))}
            />
            <output>{Math.round(reference.opacity * 100)}%</output>
          </label>
          <label className="ed-file">
            {reference.src ? "Replace reference image…" : "Load reference image…"}
            <input type="file" accept="image/*" onChange={loadReference} />
          </label>
          {!AUTO_REFERENCE && <p className="ed-hint">Tip: put the original hero image in src/portfolio/hero2d/reference/ (git-ignored) to load it automatically.</p>}
        </section>

        <section className="ed-section">
          <h2>View</h2>
          <div className="ed-row">
            <label className="ed-check">
              <input type="checkbox" checked={showFraming} onChange={(e) => setShowFraming(e.target.checked)} />
              Stage crops
            </label>
            <label className="ed-check">
              <input type="checkbox" checked={showOutlines} onChange={(e) => setShowOutlines(e.target.checked)} />
              All outlines
            </label>
            <label className="ed-check">
              <input type="checkbox" checked={solo} onChange={(e) => setSolo(e.target.checked)} />
              Solo selected
            </label>
            <label className="ed-check">
              <input type="checkbox" checked={linkGroup} onChange={(e) => setLinkGroup(e.target.checked)} />
              Move group together
            </label>
          </div>
        </section>

        <section className="ed-section ed-section--layers">
          <h2>Layers</h2>
          <ol className="ed-layers">
            {[...layers].reverse().map((l) => (
              <li key={l.id} className={l.id === selectedId ? "is-selected" : undefined}>
                <button
                  type="button"
                  className="ed-eye"
                  aria-label={l.visible ? `Hide ${l.id}` : `Show ${l.id}`}
                  onClick={() => patchLayers([l.id], (x) => ({ visible: !x.visible }))}
                >
                  {l.visible ? "●" : "○"}
                </button>
                <button
                  type="button"
                  className="ed-lock"
                  aria-label={locked.includes(l.id) ? `Unlock ${l.id}` : `Lock ${l.id}`}
                  title="Locked layers can't be picked on the canvas"
                  onClick={() => setLocked((ls) => (ls.includes(l.id) ? ls.filter((x) => x !== l.id) : [...ls, l.id]))}
                >
                  {locked.includes(l.id) ? "🔒" : "·"}
                </button>
                <button type="button" className="ed-name" onClick={() => setSelectedId(l.id)}>
                  <span>{l.id}</span>
                  <small>
                    z{l.z} · {l.group}
                    {l.interaction ? ` · ${l.interaction}` : ""}
                  </small>
                </button>
              </li>
            ))}
          </ol>
        </section>

        <section className="ed-section">
          <h2>Selected</h2>
          {selected ? (
            <>
              <p className="ed-sel">
                <strong>{selected.id}</strong>
                <small>
                  {selected.file} · {selected.width}×{selected.height}px
                </small>
              </p>
              <div className="ed-grid">
                {field("x", 0.5, 1)}
                {field("y", 0.5, 1)}
                {field("scale", 0.001, 4)}
                {field("rotation", 0.1, 2)}
                {field("z", 1, 0)}
                {field("opacity", 0.01, 2)}
              </div>
              <div className="ed-row">
                <button type="button" onClick={() => moveZ(selected.id, 1)}>
                  Bring forward ]
                </button>
                <button type="button" onClick={() => moveZ(selected.id, -1)}>
                  Send backward [
                </button>
                <button
                  type="button"
                  onClick={() => patchLayers([selected.id], () => ({ visible: !selected.visible }))}
                >
                  {selected.visible ? "Hide (H)" : "Show (H)"}
                </button>
              </div>
            </>
          ) : (
            <p className="ed-hint">Click a layer on the canvas (Alt+click cycles through layers under the pointer) or pick one in the list.</p>
          )}
        </section>

        <section className="ed-section ed-help">
          <h2>Shortcuts</h2>
          <ul>
            <li>Drag: move · Shift+drag: lock axis</li>
            <li>Arrows: 1px · Shift+arrows: 10px</li>
            <li>+/−: scale 1% (Shift 5%) · Alt+wheel: scale · Shift+wheel: rotate</li>
            <li>[ ]: z order · H: hide · Esc: deselect</li>
            <li>Wheel: zoom view · Space/middle-drag: pan · 0: fit</li>
            <li>⌘/Ctrl+Z / ⇧⌘/Ctrl+Z: undo/redo · ⌘/Ctrl+S: save</li>
          </ul>
        </section>
      </aside>
    </div>
  );
}
