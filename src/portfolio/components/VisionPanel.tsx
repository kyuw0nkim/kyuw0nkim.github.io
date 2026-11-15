import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import type { Mode } from "../data/types";
import { MODES } from "../data/modes";
import { getProject, projectNumber } from "../data/projects";
import { chapters, next, traceDilemma, traceStates, traceTurns, vision } from "../data/vision";
import type { Chapter, Speaker, TraceTurn } from "../data/vision";
import { previewHandlers, setGlow } from "../hooks/usePortfolioState";
import { useReducedMotion } from "../hooks/useMedia";
import { ModeIcon } from "./ModeIcon";

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
} as const;

const SPEAKER_NAME: Record<Speaker, string> = {
  green: "Participant 1",
  white: "Participant 2",
  pink: "Participant 3",
  lilac: "Participant 4",
  agent: "AI agent",
};

/** Small avatar borrowing the look of the scene's characters; the agent is the laptop. */
function Avatar({ speaker }: { speaker: Speaker }) {
  return (
    <span className="vt-avatar" data-speaker={speaker} aria-hidden="true">
      {speaker === "agent" ? (
        <span className="vt-avatar__screen" />
      ) : (
        <>
          <span className="vt-avatar__eye" />
          <span className="vt-avatar__eye" />
        </>
      )}
    </span>
  );
}

function turnDelay(turn: TraceTurn | undefined) {
  if (!turn) return 1400;
  return turn.pivotal || turn.speaker === "agent" ? 2900 : 2000;
}

/**
 * "A discussion, traced": a scripted vignette of the research direction.
 * Turns appear one by one with their discourse code; the ribbon below shows
 * the dialogue state, and the agent waits for the pivotal moment to speak.
 * The scene glows with it — the characters at the pivotal moment, the laptop
 * when the agent speaks.
 */
function DiscussionTrace() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = traceTurns.length;
  const shown = reduced ? total : count;
  const done = shown >= total;

  useEffect(() => {
    if (reduced || paused || !inView || done) return;
    const id = window.setTimeout(() => setCount((c) => c + 1), count === 0 ? 500 : turnDelay(traceTurns[count - 1]));
    return () => window.clearTimeout(id);
  }, [reduced, paused, inView, done, count]);

  // Light up the scene to match the latest turn while the vignette is on screen.
  const latest = traceTurns[shown - 1];
  useEffect(() => {
    if (!inView || reduced) return;
    setGlow(latest?.speaker === "agent" ? "shaping" : latest?.pivotal ? "tracing" : null);
  }, [inView, reduced, latest]);

  const agentStatus = latest?.agent ?? "Listening";
  const speaking = latest?.speaker === "agent";

  return (
    <div ref={ref} className="vt" aria-labelledby="vt-title">
      <div className="vt__head">
        <h2 id="vt-title" className="vt__title">
          A discussion, traced
        </h2>
        <span className="tag tag--quiet">Illustrative sketch · not study data</span>
      </div>
      <p className="vt__dilemma">
        <span className="label">Dilemma</span> {traceDilemma}
      </p>

      <ol className="vt__turns">
        {traceTurns.map((t, i) => (
          <motion.li
            key={i}
            className="vt-turn"
            data-speaker={t.speaker}
            data-pivotal={t.pivotal || undefined}
            data-shown={i < shown || undefined}
            aria-hidden={i >= shown || undefined}
            initial={false}
            animate={i < shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Avatar speaker={t.speaker} />
            <div className="vt-turn__body">
              <p className="vt-turn__text">
                <span className="sr-only">{SPEAKER_NAME[t.speaker]}: </span>
                {t.text}
              </p>
              <p className="vt-turn__code">
                {t.pivotal && (
                  <span className="vt-turn__flag" aria-hidden="true">
                    ⚑
                  </span>
                )}
                {t.move}
                {t.pivotal && <span className="vt-turn__pivot"> · pivotal moment</span>}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>

      <div className="vt__agent" data-speaking={speaking || undefined} data-pivotal={latest?.pivotal || undefined}>
        <span className="vt__agent-dot" aria-hidden="true" />
        <span className="label">Agent</span>
        <span className="vt__agent-status">{shown === 0 ? "Listening" : agentStatus}</span>
      </div>

      <div className="vt__ribbon" aria-hidden="true">
        {traceTurns.map((t, i) => (
          <span key={i} className="vt__seg" data-state={t.state} data-on={i < shown || undefined}>
            {(i === 0 || traceTurns[i - 1].state !== t.state) && <span className="vt__seg-label">{traceStates[t.state]}</span>}
          </span>
        ))}
      </div>

      <div className="vt__foot">
        <p className="vt__caption">
          The agent stays quiet while the group converges, and speaks when someone voices uncertainty — the kind of timing I want
          to ground in evidence rather than in prompt heuristics.
        </p>
        {!reduced && (
          <div className="vt__controls">
            {done ? (
              <button type="button" className="pill-button" onClick={() => setCount(0)}>
                ↺ Replay
              </button>
            ) : (
              <button type="button" className="pill-button" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
                {paused ? "▶ Play" : "❚❚ Pause"}
              </button>
            )}
            {!done && (
              <button type="button" className="pill-button pill-button--quiet" onClick={() => setCount(total)}>
                Show all
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function WorkLink({ id }: { id: string }) {
  const project = getProject(id);
  if (!project) return null;
  return (
    <Link to={`/works/${id}`} className="vc-work">
      <span className="vc-work__num">{projectNumber(id)}</span>
      <span className="vc-work__title">{project.title}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}

/** Light up `mode` in the scene while the element is in the middle of the viewport. */
function useGlowWhileVisible(mode: Mode | null) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-35% 0px -35% 0px" });
  useEffect(() => {
    if (inView) setGlow(mode);
  }, [inView, mode]);
  return ref;
}

function ChapterBlock({ chapter, index }: { chapter: Chapter; index: number }) {
  const ref = useGlowWhileVisible(chapter.glow);
  return (
    <>
      <motion.section ref={ref} className="vc" data-glow={chapter.glow} aria-labelledby={`vc-${chapter.id}`} {...reveal}>
        <div className="vc__rail" aria-hidden="true">
          <span className="vc__num">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="vc__content">
          <p className="vc__meta">
            <span>{chapter.years}</span>
            {chapter.modes.map((m) => (
              <span key={m} className="mode-chip mode-chip--static" data-mode={m}>
                <ModeIcon mode={m} />
                {MODES[m].label}
              </span>
            ))}
          </p>
          <h3 id={`vc-${chapter.id}`} className="vc__title">
            {chapter.title}
          </h3>
          {chapter.body.map((p) => (
            <p key={p.slice(0, 24)} className="vc__text">
              {p}
            </p>
          ))}
          <ul className="vc__evidence" aria-label="Evidence">
            {chapter.evidence.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <p className="vc__methods">
            <span className="label">Methods</span> {chapter.methods.join(" · ")}
          </p>
          <div className="vc__works">
            {chapter.works.map((id) => (
              <WorkLink key={id} id={id} />
            ))}
          </div>
        </div>
      </motion.section>

      {chapter.pivot && (
        <motion.aside className="vp" aria-label="Pivotal moment" {...reveal}>
          <p className="vp__label">
            <span aria-hidden="true">⚑</span> Pivotal moment
          </p>
          <p className="vp__observed">{chapter.pivot.observed}</p>
          <p className="vp__question">{chapter.pivot.question}</p>
        </motion.aside>
      )}
    </>
  );
}

function NextLoop() {
  const ref = useGlowWhileVisible(null);
  return (
    <motion.section ref={ref} className="vn" aria-labelledby="vn-title" {...reveal}>
      <p className="vc__meta">
        <span>Next — doctoral research</span>
      </p>
      <h3 id="vn-title" className="vn__title">
        {next.title}
      </h3>
      <p className="vn__hypothesis">{next.hypothesis}</p>
      <ol className="vn__loop">
        {next.steps.map((s, i) => (
          <li key={s.label} className="vn__step" data-mode={s.mode} {...previewHandlers(s.mode as Mode)}>
            <span className="vn__step-head">
              <span className="vn__step-num">{i + 1}</span>
              <span className="vn__step-label">{s.label}</span>
              <ModeIcon mode={s.mode} />
            </span>
            <span className="vn__step-text">{s.text}</span>
          </li>
        ))}
      </ol>
      <p className="vn__cycle">
        <span aria-hidden="true">↺</span> Tracing informs shaping, and every intervention becomes new dialogue to trace.
      </p>
    </motion.section>
  );
}

export function VisionPanel() {
  useEffect(() => () => setGlow(null), []);

  return (
    <div className="vision">
      <p className="label vision__kicker">{vision.kicker}</p>
      <h1 className="statement">{vision.statement}</h1>
      <div className="prose">
        {vision.lede.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      <nav className="vision__arc" aria-label="Research arc">
        {chapters.map((c, i) => (
          <a key={c.id} href={`#vc-${c.id}`} className="vision__arc-step" data-mode={c.glow} onClick={(e) => {
            e.preventDefault();
            document.getElementById(`vc-${c.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}>
            <span className="vision__arc-num">{String(i + 1).padStart(2, "0")}</span>
            {c.short}
          </a>
        ))}
        <a href="#vn-title" className="vision__arc-step vision__arc-step--next" onClick={(e) => {
          e.preventDefault();
          document.getElementById("vn-title")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}>
          <span className="vision__arc-num">→</span>
          Close the loop
        </a>
      </nav>

      <motion.div {...reveal}>
        <DiscussionTrace />
      </motion.div>

      <motion.p className="vision__prologue" {...reveal}>
        {vision.prologue}
      </motion.p>

      <div className="vision__chapters">
        {chapters.map((c, i) => (
          <ChapterBlock key={c.id} chapter={c} index={i} />
        ))}
        <NextLoop />
      </div>

      <motion.div className="vision__close" {...reveal}>
        <p className="vision__closing">{next.closing}</p>
        <p className="vision__cta">
          <Link to="/works" className="pill-link">
            See all works <span aria-hidden="true">→</span>
          </Link>
          <Link to="/contact" className="pill-link">
            Say hello <span aria-hidden="true">→</span>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
