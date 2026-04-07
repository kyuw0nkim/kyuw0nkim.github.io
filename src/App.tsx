import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { trackPageView, getSessionUtm } from "@/lib/analytics";
import { useScrollDepth } from "@/hooks/use-scroll-depth";

function RouteTracker() {
  const location = useLocation();
  useScrollDepth();
  useEffect(() => {
    // Make sure UTM params on the landing URL are captured once.
    getSessionUtm();
    trackPageView(location.pathname + location.search + location.hash);
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
import Insights from "./pages/Insights";
import { InsightsGate } from "./components/InsightsGate";
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
          <Route path="/overview" element={<Analytics />} />
          <Route
            path="/insights"
            element={
              <InsightsGate>
                <Insights />
              </InsightsGate>
            }
          />
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
