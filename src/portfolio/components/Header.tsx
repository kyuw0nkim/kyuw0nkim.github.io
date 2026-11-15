import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { trackOutbound } from "@/lib/analytics";
import { site } from "../data/site";
import { useRouteState } from "../hooks/usePortfolioState";

const NAV = [
  { to: "/works", label: "Works" },
  { to: "/about", label: "About" },
];

export function Header() {
  const { view } = useRouteState();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [view]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const worksActive = view === "explore" || view === "project";

  return (
    <header className="site-header" data-view={view} data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <button
        type="button"
        className="skip-link"
        onClick={() => document.getElementById("main")?.focus()}
      >
        Skip to content
      </button>

      <Link to="/" className="brand" aria-label="Kyuwon Kim — Portfolio home">
        <span className="brand__name">Kyuwon Kim</span>
        <span className="brand__slash" aria-hidden="true">/</span>
        <span className="brand__sub">Portfolio</span>
      </Link>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>

      <nav id="site-nav" className="site-nav" aria-label="Primary">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `site-nav__link${isActive || (item.to === "/works" && worksActive) ? " is-active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
        <a
          className="site-nav__link site-nav__link--out"
          href={site.publicationsUrl}
          target="_blank"
          rel="noopener"
          onClick={() => trackOutbound(site.publicationsUrl, "Publications (nav)")}
        >
          Publications
          <span className="site-nav__out" aria-hidden="true">
            ↗
          </span>
          <span className="sr-only"> (academic website, opens in a new tab)</span>
        </a>
        <NavLink to="/contact" className={({ isActive }) => `say-hello${isActive ? " is-active" : ""}`}>
          Say hello <span className="say-hello__dot" aria-hidden="true" />
        </NavLink>
      </nav>
    </header>
  );
}
