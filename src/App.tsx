import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search + location.hash,
      });
    }
  }, [location]);
  return null;
}

function PageFade({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.classList.remove("page-fade");
    void ref.current?.offsetWidth; // reflow to restart animation
    ref.current?.classList.add("page-fade");
  }, [location.pathname]);
  return <div ref={ref}>{children}</div>;
}
import Index from "./pages/Index";
import Publications from "./pages/Publications";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import News from "./pages/News";
import CV from "./pages/CV";
import { BlogList, BlogPost } from "./pages/Blog";
import Analytics from "./pages/Analytics";
import Design from "./pages/Design";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={0}>
      <Toaster />
      <Sonner />
      <HashRouter>
        <RouteTracker />
        <PageFade>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/design" element={<Design />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </PageFade>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
