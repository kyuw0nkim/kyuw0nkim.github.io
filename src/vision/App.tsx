import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteData } from "@/data/siteData";
import {
  CASE,
  PIVOT_INDEX,
  anchorOrder,
  dilemma,
  evidence,
  messages,
  modeLabel,
  otherWork,
  speakerName,
  vision as baseVision,
  works as baseWorks,
} from "./data";
import type { AnchorId, Message, Speaker } from "./data";
import { currentVariant, variantOverrides } from "./variants";
import { cases, getCase } from "./cases";
import type { CaseFigure, CaseStudy } from "./cases";

// Apply the page variant (/vision/ = dialogue, /portfolio/ = STEM).
const overrides = variantOverrides[currentVariant()];
const vision = overrides.vision ?? baseVision;
const works = overrides.worksOrder
  ? overrides.worksOrder.map((id) => baseWorks.find((w) => w.id === id)).filter((w): w is (typeof baseWorks)[number] => !!w)
  : baseWorks;

const EASE = [0.22, 1, 0.36, 1] as const;

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

// ------------------------------------------------------------- playback ---
// Each message is one step; the "notice" before the agent speaks is its own step.
const STEPS = messages.length + 1;
const noticeStep = PIVOT_INDEX + 2;
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
    const wait = step === 0 ? 700 : isNotice ? 1000 : step + 1 === messageStep(PIVOT_INDEX + 1) ? 1700 : 1100;
    const id = window.setTimeout(() => setStep((s) => s + 1), wait);
    return () => window.clearTimeout(id);
  }, [step, reduced]);

  return { step, typing, done: step >= STEPS, replay: () => setStep(0), skip: () => setStep(STEPS) };
}

// --------------------------------------------------------------- pieces ---

function Avatar({ speaker, size = 30 }: { speaker: Speaker; size?: number }) {
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

type Activate = (id: AnchorId, how: "hover" | "press", el?: HTMLElement) => void;

function Anchor({
  id,
  active,
  onActivate,
  className = "",
  children,
}: {
  id: AnchorId;
  active: AnchorId | null;
  onActivate: Activate;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`anchor ${className}`}
      data-anchor={id}
      data-mode={evidence[id].mode}
      data-active={active === id || undefined}
      aria-pressed={active === id}
      aria-label={`${evidence[id].tag}: ${evidence[id].title}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && onActivate(id, "hover", e.currentTarget)}
      onFocus={(e) => onActivate(id, "hover", e.currentTarget)}
      onClick={(e) => onActivate(id, "press", e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate(id, "press", e.currentTarget);
        }
      }}
    >
      {children}
    </div>
  );
}

function Tag({ id }: { id: AnchorId }) {
  return (
    <span className="tag" data-mode={evidence[id].mode}>
      {evidence[id].tag}
    </span>
  );
}

function Bubble({ m, active, onActivate }: { m: Message; active: AnchorId | null; onActivate: Activate }) {
  const body = (
    <div className="bubble">
      <p className="bubble__text">
        <span className="sr-only">{speakerName[m.speaker]}: </span>
        {m.text}
      </p>
      <p className="bubble__move">
        {m.move}
        {m.anchor && <Tag id={m.anchor} />}
      </p>
    </div>
  );
  return (
    <motion.li
      className="msg"
      data-speaker={m.speaker}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
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

function Chat({ active, onActivate, reduced }: { active: AnchorId | null; onActivate: Activate; reduced: boolean }) {
  const { step, typing, done, replay, skip } = usePlayback(reduced);
  const nextIdx = !done && typing ? messages.findIndex((_, i) => messageStep(i) === step + 1) : -1;
  const nextSpeaker = nextIdx >= 0 ? messages[nextIdx].speaker : null;
  const shown = messages.filter((_, i) => messageStep(i) <= step).length;

  return (
    <div className="chat" data-dim={active ? true : undefined}>
      <div className="chat__bar">
        <div className="chat__people" aria-hidden="true">
          {(["green", "pink", "lilac", "agent"] as Speaker[]).map((s) => (
            <Avatar key={s} speaker={s} size={22} />
          ))}
        </div>
        <p className="chat__meta">3 participants and an AI agent. Example utterances from LAK ’26</p>
        <button type="button" className="chat__ctl" onClick={done ? replay : skip}>
          {done ? "Replay" : "Skip"}
        </button>
      </div>

      <Anchor id="games" active={active} onActivate={onActivate} className="anchor--dilemma">
        <div className="dilemma">
          <p className="dilemma__text">{dilemma}</p>
          <Tag id="games" />
        </div>
      </Anchor>

      <ol className="chat__list" aria-label="Conversation">
        {messages.map((m, i) => (
          <Fragment key={i}>
            {i === PIVOT_INDEX + 1 && step >= noticeStep && (
              <motion.li
                className="notice"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <Anchor id="next" active={active} onActivate={onActivate} className="anchor--notice">
                  <span className="notice__text">A pivotal moment? When and how should the agent intervene?</span>
                  <Tag id="next" />
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

      <Anchor id="modes" active={active} onActivate={onActivate} className="anchor--modes">
        <div className="modes">
          <p className="modes__head">
            Dialogue mode <Tag id="modes" />
          </p>
          <div className="modes__track" aria-hidden="true">
            {messages.map((m, i) => (
              <span key={i} className="modes__seg" data-mode={m.mode} data-on={i < shown || undefined} />
            ))}
          </div>
          <p className="modes__legend" aria-hidden="true">
            {(["affective", "mediation", "deliberative"] as const).map((k) => (
              <span key={k} data-mode={k}>
                {modeLabel[k]}
              </span>
            ))}
          </p>
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      <p className="ev__venue">{e.venue}</p>
      <h3 className="ev__title">{e.title}</h3>
      <p className="ev__finding">{e.finding}</p>
      {e.stats.length > 0 && (
        <ul className="ev__stats">
          {e.stats.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
      <dl className="ev__details">
        {e.details.map((d) => (
          <div key={d.label}>
            <dt>{d.label}</dt>
            <dd>{d.value}</dd>
          </div>
        ))}
      </dl>
      {e.links.length > 0 && (
        <p className="ev__links">
          {e.links.map((l) => {
            const ext = l.href.startsWith("http");
            return (
              <a key={l.href} href={l.href} className="link" {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}>
                {l.label} <span aria-hidden="true">{ext ? "↗" : "›"}</span>
              </a>
            );
          })}
        </p>
      )}
    </motion.article>
  );
}

function TagIndex({ active, onActivate }: { active: AnchorId | null; onActivate: Activate }) {
  const find = (id: AnchorId) => document.querySelector<HTMLElement>(`.chat [data-anchor="${id}"]`) ?? undefined;
  return (
    <ul className="tindex" aria-label="Research behind the conversation">
      {anchorOrder.map((id) => (
        <li key={id}>
          <button
            type="button"
            className="tag tag--button"
            data-mode={evidence[id].mode}
            aria-pressed={active === id}
            onPointerEnter={(e) => e.pointerType === "mouse" && onActivate(id, "hover", find(id))}
            onClick={() => onActivate(id, "press", find(id))}
          >
            {evidence[id].tag}
          </button>
        </li>
      ))}
    </ul>
  );
}

// ------------------------------------------------------------- headline ---

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

// ----------------------------------------------------------- case study ---

/** Current location hash, kept in sync with navigation. */
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

function Figure({ f }: { f: CaseFigure }) {
  return (
    <figure className="case__figure">
      <img src={f.src} alt={f.alt} loading="lazy" />
      <figcaption>{f.caption}</figcaption>
    </figure>
  );
}

function CaseView({ study }: { study: CaseStudy }) {
  const i = cases.findIndex((c) => c.id === study.id);
  const prev = cases[(i - 1 + cases.length) % cases.length];
  const next = cases[(i + 1) % cases.length];

  return (
    <motion.main
      id="top"
      key={study.id}
      className="case"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <a href="#work" className="case__back">
        <span aria-hidden="true">‹</span> All work
      </a>
      <h1 className="case__title">{study.title}</h1>
      <ul className="case__papers">
        {study.papers.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <dl className="case__meta">
        {study.meta.map((m) => (
          <div key={m.label}>
            <dt>{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>

      <Figure f={study.figure} />

      {study.sections.map((s) => (
        <section key={s.title} className="case__section">
          <h2>{s.title}</h2>
          <div className="case__body">
            {s.body?.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            {s.steps && (
              <ol className="case__steps">
                {s.steps.map((st) => (
                  <li key={st.title}>
                    <h3>{st.title}</h3>
                    <p>{st.text}</p>
                  </li>
                ))}
              </ol>
            )}
            {s.points && (
              <ul className="case__points">
                {s.points.map((p) => (
                  <li key={p.slice(0, 40)}>{p}</li>
                ))}
              </ul>
            )}
            {s.figure && <Figure f={s.figure} />}
          </div>
        </section>
      ))}

      {study.links.length > 0 && (
        <p className="case__links">
          {study.links.map((l) => (
            <a key={l.href} href={l.href} className="btn" target="_blank" rel="noreferrer">
              {l.label} ↗
            </a>
          ))}
        </p>
      )}

      <nav className="case__nav" aria-label="More case studies">
        <a href={CASE(prev.id)}>
          <span className="case__nav-label">Previous</span>
          {prev.title}
        </a>
        <a href={CASE(next.id)} className="case__nav-next">
          <span className="case__nav-label">Next</span>
          {next.title}
        </a>
      </nav>
    </motion.main>
  );
}

// ------------------------------------------------------------------ app ---

export default function App() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const floating = useMediaQuery("(min-width: 1200px)");
  const [active, setActive] = useState<AnchorId | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [cardTop, setCardTop] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const onActivate = useCallback<Activate>(
    (id, how, el) => {
      setActive(id);
      if (el) setAnchorEl(el);
      if (!floating && how === "press") setSheetOpen(true);
    },
    [floating],
  );

  // Float the card beside the part of the conversation it explains.
  useLayoutEffect(() => {
    if (!floating || !anchorEl || !stageRef.current) return;
    // Line the card up with the anchor, but keep it inside the visible area.
    const place = () => {
      const s = stageRef.current!.getBoundingClientRect();
      const a = anchorEl.getBoundingClientRect();
      const h = floatRef.current?.offsetHeight ?? 0;
      const want = a.top - s.top - 8;
      const lowest = window.innerHeight - 24 - h - s.top; // card bottom stays on screen
      const highest = 68 - s.top; // below the sticky header
      setCardTop(Math.max(0, Math.max(highest, Math.min(want, lowest))));
    };
    place();
    const ro = floatRef.current ? new ResizeObserver(place) : null;
    if (ro && floatRef.current) ro.observe(floatRef.current);
    window.addEventListener("resize", place);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [floating, anchorEl, active]);

  useEffect(() => {
    if (!sheetOpen) return;
    sheetRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  const hash = useHash();
  const study = hash.startsWith("#case/") ? getCase(hash.slice("#case/".length)) : undefined;

  // Opening a case study starts at its top; returning to the home sections
  // (e.g. "#work") scrolls to that section once it has rendered again.
  useEffect(() => {
    if (study) {
      window.scrollTo({ top: 0 });
      setSheetOpen(false);
      return;
    }
    if (/^#[a-z]+$/.test(hash)) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    }
  }, [hash, study]);

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
            Publications
          </a>
          <a href={cv.cvUrl} target="_blank" rel="noreferrer">
            CV
          </a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {study ? (
        <CaseView study={study} />
      ) : (
      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div id="hero-title">
            <Headline force={mode === "tracing" || mode === "shaping" ? mode : null} />
          </div>
          <p className="hero__vision">{vision}</p>
          <div className="hero__guide">
            <p className="hero__hint">Find the studies behind my research vision</p>
            <TagIndex active={active} onActivate={onActivate} />
          </div>

          <div className="stage" ref={stageRef}>
            <Chat active={active} onActivate={onActivate} reduced={reduced} />
            {floating && (
              <motion.aside
                ref={floatRef}
                className="ev-float"
                aria-live="polite"
                initial={false}
                animate={{ top: cardTop }}
                transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {active && <EvidenceCard key={active} id={active} />}
                </AnimatePresence>
              </motion.aside>
            )}
          </div>
        </section>

        <section id="work" className="work" aria-labelledby="work-title">
          <h2 id="work-title" className="sec-title">
            Selected work
          </h2>
          <ul className="work__grid">
            {works.map((w) => (
              <li key={w.id}>
                <a href={CASE(w.id)} className="wcard">
                  <span className="wcard__img">
                    <img src={w.image} alt={w.alt} loading="lazy" />
                  </span>
                  <span className="wcard__title">{w.title}</span>
                  <span className="wcard__venue">{w.venue}</span>
                  <span className="wcard__line">{w.line}</span>
                  <span className="link">
                    Case study <span aria-hidden="true">›</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <h3 className="other__title">More publications</h3>
          <ul className="other">
            {otherWork.map((o) => (
              <li key={o.href}>
                <a href={o.href} className="other__item" target="_blank" rel="noreferrer">
                  <span>{o.title}</span>
                  <span className="other__venue">{o.venue}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className="contact" aria-labelledby="contact-title">
          <h2 id="contact-title" className="sec-title">
            Contact
          </h2>
          <p className="contact__links">
            <a href={`mailto:${profile.email}`} className="btn btn--solid">
              {profile.email}
            </a>
            <a href={profile.googleScholar} className="btn" target="_blank" rel="noreferrer">
              Google Scholar ↗
            </a>
            <a href="/" className="btn">
              Academic website
            </a>
          </p>
        </section>
      </main>
      )}

      {!floating && !study && (
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
                aria-label={evidence[active].title}
                tabIndex={-1}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <button type="button" className="sheet__close" onClick={() => setSheetOpen(false)}>
                  Done
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
