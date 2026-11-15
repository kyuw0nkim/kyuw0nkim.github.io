import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteData } from "@/data/siteData";
import {
  PIVOT_INDEX,
  anchorOrder,
  dilemma,
  evidence,
  messages,
  otherWork,
  speakerName,
  stateLabel,
  vision,
  works,
} from "./data";
import type { AnchorId, Message, Speaker } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

// ------------------------------------------------------------------ hooks --

function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const on = () => setMatch(mql.matches);
    mql.addEventListener("change", on);
    return () => mql.removeEventListener("change", on);
  }, [query]);
  return match;
}

/**
 * The conversation plays once: typing → message, with the agent's "notice"
 * beat before it speaks. Steps: 0 = empty … STEPS = everything shown.
 * Step layout: each message takes one step; the notice is its own step.
 */
const STEPS = messages.length + 1;
const noticeStep = PIVOT_INDEX + 2; // right after the uncertain turn
const messageStep = (i: number) => (i <= PIVOT_INDEX ? i + 1 : i + 2);

function usePlayback(reduced: boolean) {
  const [step, setStep] = useState(reduced ? STEPS : 0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reduced || step >= STEPS) {
      setTyping(false);
      return;
    }
    const isNotice = step + 1 === noticeStep;
    setTyping(!isNotice);
    const wait = step === 0 ? 700 : isNotice ? 900 : step + 1 === messageStep(PIVOT_INDEX + 1) ? 1700 : 1150;
    const id = window.setTimeout(() => setStep((s) => s + 1), wait);
    return () => window.clearTimeout(id);
  }, [step, reduced]);

  return { step, typing, done: step >= STEPS, replay: () => setStep(0), skip: () => setStep(STEPS) };
}

// ------------------------------------------------------------- pieces ----

function Avatar({ speaker, size = 32 }: { speaker: Speaker; size?: number }) {
  return (
    <span className="av" data-speaker={speaker} style={{ width: size, height: speaker === "agent" ? size * 0.78 : size }} aria-hidden="true">
      {speaker === "agent" ? (
        <span className="av__screen" />
      ) : (
        <>
          <span className="av__eye" />
          <span className="av__eye" />
        </>
      )}
    </span>
  );
}

interface AnchorProps {
  id: AnchorId;
  active: AnchorId | null;
  onActivate: (id: AnchorId, how: "hover" | "press") => void;
  className?: string;
  children: ReactNode;
  inline?: boolean;
}

/** A tagged part of the conversation. Hover, focus or press reveals the research behind it. */
function Anchor({ id, active, onActivate, className = "", children, inline }: AnchorProps) {
  const Tag = inline ? "span" : "div";
  return (
    <Tag
      role="button"
      tabIndex={0}
      className={`anchor ${className}`}
      data-anchor={id}
      data-mode={evidence[id].mode}
      data-active={active === id || undefined}
      aria-pressed={active === id}
      aria-label={inline ? undefined : `${evidence[id].stands}: ${evidence[id].tag}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && onActivate(id, "hover")}
      onFocus={() => onActivate(id, "hover")}
      onClick={() => onActivate(id, "press")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate(id, "press");
        }
      }}
    >
      {children}
    </Tag>
  );
}

function AnchorTag({ id }: { id: AnchorId }) {
  return (
    <span className="atag" data-mode={evidence[id].mode}>
      {evidence[id].tag}
    </span>
  );
}

function MessageText({ m, active, onActivate }: { m: Message; active: AnchorId | null; onActivate: AnchorProps["onActivate"] }) {
  if (!m.highlight) return <>{m.text}</>;
  const [before, after] = m.text.split(m.highlight.text);
  return (
    <>
      {before}
      <Anchor id={m.highlight.anchor} active={active} onActivate={onActivate} inline className="anchor--phrase">
        <mark>{m.highlight.text}</mark>
        <AnchorTag id={m.highlight.anchor} />
      </Anchor>
      {after}
    </>
  );
}

function Bubble({ m, active, onActivate }: { m: Message; active: AnchorId | null; onActivate: AnchorProps["onActivate"] }) {
  const body = (
    <div className="msg__bubble">
      <p className="msg__name">{speakerName[m.speaker]}</p>
      <p className="msg__text">
        <MessageText m={m} active={active} onActivate={onActivate} />
      </p>
      {m.anchor && <AnchorTag id={m.anchor} />}
    </div>
  );
  return (
    <motion.li
      className="msg"
      data-speaker={m.speaker}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <Avatar speaker={m.speaker} />
      {m.anchor ? (
        <Anchor id={m.anchor} active={active} onActivate={onActivate} className="anchor--bubble">
          {body}
        </Anchor>
      ) : (
        body
      )}
    </motion.li>
  );
}

function Chat({
  active,
  onActivate,
  reduced,
}: {
  active: AnchorId | null;
  onActivate: AnchorProps["onActivate"];
  reduced: boolean;
}) {
  const { step, typing, done, replay, skip } = usePlayback(reduced);
  const nextSpeaker: Speaker | null = (() => {
    if (done || !typing) return null;
    const i = messages.findIndex((_, idx) => messageStep(idx) === step + 1);
    return i >= 0 ? messages[i].speaker : null;
  })();
  const shownStates = messages.filter((_, i) => messageStep(i) <= step).map((m) => m.state);

  return (
    <div className="chat" data-dim={active ? true : undefined}>
      <div className="chat__bar">
        <div className="chat__people" aria-hidden="true">
          {(["green", "white", "pink", "lilac", "agent"] as Speaker[]).map((s) => (
            <Avatar key={s} speaker={s} size={24} />
          ))}
        </div>
        <div className="chat__titles">
          <p className="chat__title">Group deliberation</p>
          <p className="chat__sub">4 people · 1 AI agent · illustrative conversation</p>
        </div>
        <button type="button" className="chat__ctl" onClick={done ? replay : skip}>
          {done ? "↺ Replay" : "Skip"}
        </button>
      </div>

      <div className="chat__body">
        <Anchor id="games" active={active} onActivate={onActivate} className="anchor--card">
          <div className="dcard">
            <p className="dcard__label">🃏 {dilemma.label}</p>
            <p className="dcard__text">{dilemma.text}</p>
            <AnchorTag id="games" />
          </div>
        </Anchor>

        <ol className="chat__list" aria-label="Conversation">
          {messages.map((m, i) => (
            <Fragment key={i}>
              {i === PIVOT_INDEX + 1 && step >= noticeStep && (
                <motion.li
                  className="notice"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <Anchor id="next" active={active} onActivate={onActivate} className="anchor--notice">
                    <span className="notice__flag" aria-hidden="true">
                      ⚑
                    </span>
                    <span className="notice__text">
                      Agent notices <b>uncertainty</b> — is this the moment to speak?
                    </span>
                    <AnchorTag id="next" />
                  </Anchor>
                </motion.li>
              )}
              {messageStep(i) <= step && <Bubble m={m} active={active} onActivate={onActivate} />}
            </Fragment>
          ))}
          <AnimatePresence>
            {nextSpeaker && (
              <motion.li
                key={`typing-${step}`}
                className="msg msg--typing"
                data-speaker={nextSpeaker}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                aria-hidden="true"
              >
                <Avatar speaker={nextSpeaker} />
                <span className="typing">
                  <i />
                  <i />
                  <i />
                </span>
              </motion.li>
            )}
          </AnimatePresence>
        </ol>
      </div>

      <Anchor id="states" active={active} onActivate={onActivate} className="anchor--ribbon">
        <div className="ribbon">
          <p className="ribbon__label">
            Dialogue state <AnchorTag id="states" />
          </p>
          <div className="ribbon__track" aria-hidden="true">
            {messages.map((m, i) => (
              <span key={i} className="ribbon__seg" data-state={m.state} data-on={i < shownStates.length || undefined}>
                {(i === 0 || messages[i - 1].state !== m.state) && <span className="ribbon__name">{stateLabel[m.state]}</span>}
              </span>
            ))}
          </div>
        </div>
      </Anchor>
    </div>
  );
}

function EvidenceCard({ id }: { id: AnchorId }) {
  const e = evidence[id];
  return (
    <motion.article
      key={id}
      className="ev"
      data-mode={e.mode}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <p className="ev__stands">{e.stands}</p>
      <p className="ev__venue">{e.venue}</p>
      <h3 className="ev__title">{e.title}</h3>
      <p className="ev__finding">{e.finding}</p>
      <ul className="ev__stats">
        {e.stats.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      {(e.methods || e.role || e.award) && (
        <dl className="ev__meta">
          {e.role && (
            <div>
              <dt>Role</dt>
              <dd>{e.role}</dd>
            </div>
          )}
          {e.methods && (
            <div>
              <dt>Methods</dt>
              <dd>{e.methods}</dd>
            </div>
          )}
          {e.award && (
            <div>
              <dt>Recognition</dt>
              <dd>{e.award}</dd>
            </div>
          )}
        </dl>
      )}
      {e.links.length > 0 && (
        <p className="ev__links">
          {e.links.map((l) => {
            const ext = l.href.startsWith("http");
            return (
              <a key={l.href} href={l.href} className="pill" {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}>
                {l.label} <span aria-hidden="true">{ext ? "↗" : "→"}</span>
              </a>
            );
          })}
        </p>
      )}
    </motion.article>
  );
}

function AnchorIndex({ active, onActivate }: { active: AnchorId | null; onActivate: AnchorProps["onActivate"] }) {
  return (
    <ul className="aindex" aria-label="Research behind the conversation">
      {anchorOrder.map((id) => (
        <li key={id}>
          <button
            type="button"
            className="aindex__item"
            data-mode={evidence[id].mode}
            aria-pressed={active === id}
            title={evidence[id].stands}
            aria-label={`${evidence[id].tag}: ${evidence[id].stands}`}
            onPointerEnter={(e) => e.pointerType === "mouse" && onActivate(id, "hover")}
            onClick={() => onActivate(id, "press")}
          >
            <span className="aindex__tag">{evidence[id].tag}</span>
            <span className="aindex__stands">{evidence[id].stands}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

// ------------------------------------------------------------ headline ---

function Headline({ force }: { force: "tracing" | "shaping" | null }) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [word, setWord] = useState<"tracing" | "shaping">("tracing");
  const [paused, setPaused] = useState(false);
  const shown = force ?? word;

  useEffect(() => {
    if (reduced || paused || force) return;
    const id = window.setInterval(() => setWord((w) => (w === "tracing" ? "shaping" : "tracing")), 3000);
    return () => window.clearInterval(id);
  }, [reduced, paused, force]);

  return (
    <h1 className="hl" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <span className="sr-only">Tracing and shaping how we think together.</span>
      <span aria-hidden="true" className="hl__visual">
        <span className="hl__box" data-word={shown}>
          <span className="hl__sizer">
            <span>Tracing</span>
            <span>Shaping</span>
          </span>
          <AnimatePresence initial={false}>
            <motion.span
              key={shown}
              className="hl__word"
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-105%" }}
              transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            >
              {shown === "tracing" ? "Tracing" : "Shaping"}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="hl__tail">how we think together.</span>
      </span>
    </h1>
  );
}

// ------------------------------------------------------------------ app ---

export default function App() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wide = useMediaQuery("(min-width: 1024px)");
  const [active, setActive] = useState<AnchorId | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const onActivate = useCallback(
    (id: AnchorId, how: "hover" | "press") => {
      setActive(id);
      if (!wide && how === "press") setSheetOpen(true);
    },
    [wide],
  );

  useEffect(() => {
    if (!sheetOpen) return;
    sheetRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  const mode = active ? evidence[active].mode : null;
  const { profile, cv } = siteData;

  return (
    <>
      <header className="top">
        <a href="#top" className="top__brand">
          Kyuwon Kim
        </a>
        <nav className="top__nav" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="/#/publications" target="_blank" rel="noopener">
            Publications ↗
          </a>
          <a href={cv.cvUrl} target="_blank" rel="noreferrer">
            CV ↗
          </a>
          <a href="#contact" className="top__hello">
            Say hello
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__left">
            <div id="hero-title">
              <Headline force={mode === "tracing" || mode === "shaping" ? mode : null} />
            </div>
            <p className="hero__vision">{vision}</p>

            {wide ? (
              <>
                <p className="hint__text">
                  Every tagged part of the conversation is grounded in my research. <b>Hover a tag</b> to see the study behind it.
                </p>
                <AnchorIndex active={active} onActivate={onActivate} />
                <div className="hero__evidence" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    {active ? (
                      <EvidenceCard key={active} id={active} />
                    ) : (
                      <motion.p key="empty" className="ev-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <span aria-hidden="true">→</span> The conversation on the right is playing. Tags appear as it unfolds.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <p className="hint__text hint__text--mobile">
                Every tagged part of the conversation below is grounded in my research. <b>Tap a tag</b> to see the study behind
                it.
              </p>
            )}
          </div>

          <div className="hero__right">
            <Chat active={active} onActivate={onActivate} reduced={reduced} />
            {!wide && <AnchorIndex active={active} onActivate={onActivate} />}
          </div>
        </section>

        <section id="work" className="work" aria-labelledby="work-title">
          <h2 id="work-title" className="sec-title">
            Selected work
          </h2>
          <p className="sec-sub">Case studies with the study design, methods, results, and my role.</p>
          <ul className="work__grid">
            {works.map((w) => (
              <li key={w.id}>
                <a href={`/portfolio/#/works/${w.id}`} className="wcard" data-mode={w.mode}>
                  <span className="wcard__img">
                    <img src={w.image} alt={w.alt} loading="lazy" />
                  </span>
                  <span className="wcard__venue">{w.venue}</span>
                  <span className="wcard__title">{w.title}</span>
                  <span className="wcard__line">{w.line}</span>
                  <span className="wcard__more">
                    Case study <span aria-hidden="true">→</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <h3 className="other__title">Also</h3>
          <ul className="other">
            {otherWork.map((o) => (
              <li key={o.href}>
                <a href={o.href} className="other__item">
                  <span>{o.title}</span>
                  <span className="other__venue">{o.venue}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className="contact" aria-labelledby="contact-title">
          <h2 id="contact-title" className="sec-title">
            Let's think together.
          </h2>
          <p className="sec-sub">I'm applying to PhD programs for Fall 2027.</p>
          <p className="contact__links">
            <a href={`mailto:${profile.email}`} className="pill pill--solid">
              {profile.email}
            </a>
            <a href={profile.googleScholar} className="pill" target="_blank" rel="noreferrer">
              Google Scholar ↗
            </a>
            <a href="/" className="pill">
              Academic website →
            </a>
          </p>
        </section>
      </main>

      {!wide && (
        <AnimatePresence>
          {sheetOpen && active && (
            <>
              <motion.div
                className="sheet__scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSheetOpen(false)}
              />
              <motion.div
                ref={sheetRef}
                className="sheet"
                role="dialog"
                aria-modal="true"
                aria-label={evidence[active].stands}
                tabIndex={-1}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <button type="button" className="sheet__close" onClick={() => setSheetOpen(false)}>
                  Close
                </button>
                <AnimatePresence mode="wait" initial={false}>
                  <EvidenceCard key={active} id={active} />
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
