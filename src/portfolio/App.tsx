import { useEffect, useRef } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { initVisitorNetwork, trackPageView } from "@/lib/analytics";
import { Header } from "./components/Header";
import { HomeShell } from "./components/HomeShell";
import { IntroPanel } from "./components/IntroPanel";
import { ExplorePanel } from "./components/ExplorePanel";
import { AboutPanel } from "./components/AboutPanel";
import { ContactPanel } from "./components/ContactPanel";
import { ProjectDetail } from "./components/ProjectDetail";
import { portfolioStore } from "./hooks/usePortfolioState";

/** Side effects that follow navigation: analytics, scroll, and clearing stale hover state. */
function RouteEffects() {
  const { pathname } = useLocation();
  const previous = useRef(pathname);

  useEffect(() => {
    void initVisitorNetwork();
  }, []);

  useEffect(() => {
    trackPageView(`/portfolio${pathname}`);
    portfolioStore.set({ hover: null });

    const wasProject = previous.current.startsWith("/works/");
    const isProject = pathname.startsWith("/works/");
    if (wasProject || isProject) window.scrollTo({ top: 0 });
    previous.current = pathname;
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  // The home shell (scene + right panel) persists across its sub-views;
  // each project page is its own top-level view.
  const key = location.pathname.startsWith("/works/") ? location.pathname : "home";

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={key}>
        <Route element={<HomeShell />}>
          <Route index element={<IntroPanel />} />
          <Route path="tracing" element={<ExplorePanel filter="tracing" />} />
          <Route path="shaping" element={<ExplorePanel filter="shaping" />} />
          <Route path="works" element={<ExplorePanel filter="all" />} />
          <Route path="about" element={<AboutPanel />} />
          <Route path="contact" element={<ContactPanel />} />
        </Route>
        <Route path="works/:id" element={<ProjectDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HashRouter>
      <MotionConfig reducedMotion="user">
        <RouteEffects />
        <Header />
        <AnimatedRoutes />
      </MotionConfig>
    </HashRouter>
  );
}
