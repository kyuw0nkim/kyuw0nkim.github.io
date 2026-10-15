import { useEffect, useRef } from "react";
import { useNavigate, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Mode } from "../data/types";
import { portfolioStore, useRouteState } from "../hooks/usePortfolioState";
import { useCanHover, useIsWide, useReducedMotion } from "../hooks/useMedia";
import { SceneStage } from "../scene/SceneStage";
import { ProjectPreview } from "./ProjectPreview";

/**
 * Intro / Explore / About / Contact share this shell: the interactive scene
 * on the left (top on small screens) and a panel that changes with the route.
 */
export function HomeShell() {
  const outlet = useOutlet();
  const { view, selected } = useRouteState();
  const navigate = useNavigate();
  const isWide = useIsWide();
  const canHover = useCanHover();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);
  const lastView = useRef(view);

  // Bring the new panel into view. On small screens the scene sits on top,
  // so scroll to the panel unless we're back at the intro.
  useEffect(() => {
    if (lastView.current === view) return;
    lastView.current = view;
    if (isWide || view === "intro") {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    } else {
      panelRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  }, [view, isWide, reduced]);

  // A scroll moves the rows away from the floating preview: hide it.
  useEffect(() => {
    const onScroll = () => portfolioStore.get().previewId && portfolioStore.set({ previewId: null });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const select = (mode: Mode) => navigate(`/${mode}`);

  return (
    <motion.div
      className="home"
      data-view={view}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <SceneStage selected={selected} onSelect={select} />

      <main id="main" ref={panelRef} className="home__panel" tabIndex={-1}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            className={`panel panel--${view}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>

      {isWide && canHover && <ProjectPreview />}
    </motion.div>
  );
}
