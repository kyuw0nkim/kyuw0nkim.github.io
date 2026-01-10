import { FormEvent, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { getSearchResults } from "@/data/searchIndex";

const navItems = [
  { name: "Home", path: "/" },
  { name: "News", path: "/news" },
  { name: "Publications", path: "/publications" },
  { name: "Projects", path: "/projects" },
  { name: "CV", path: "/cv" },
  { name: "Blog", path: "/blog" },
  { name: "Analytics", path: "/analytics" },
];

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = useMemo(
    () => getSearchResults(searchQuery, 5),
    [searchQuery],
  );

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    if (searchResults.length > 0) {
      navigate(searchResults[0].url);
      setSearchOpen(false);
      setSearchQuery("");
      return;
    }

    toast({
      title: "No results found",
      description: "Try another keyword to search the site.",
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <nav className="container-academic h-[60px] flex items-center justify-between">
        {/* Site Title */}
        <Link to="/" className="text-xl font-heading font-semibold text-primary hover:opacity-80 transition-opacity">
          Kyuwon Kim
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? "nav-link-active" : ""}`}
            >
              {item.name}
            </Link>
          ))}

          {/* Search Button */}
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <form className="flex flex-col gap-4" onSubmit={handleSearch}>
                <Input
                  placeholder="Search publications, projects..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  autoFocus
                />
                {searchQuery.trim() ? (
                  <div className="space-y-2">
                    {searchResults.length > 0 ? (
                      <ul className="space-y-2">
                        {searchResults.map((result) => (
                          <li key={result.id}>
                            <button
                              type="button"
                              onClick={() => {
                                navigate(result.url);
                                setSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="w-full text-left rounded-md border border-border px-3 py-2 transition-colors hover:bg-accent"
                            >
                              <div className="text-sm font-medium text-foreground">
                                {result.title}
                              </div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {result.category}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No matches yet. Try another keyword.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Type to search across all content
                  </p>
                )}
              </form>
            </DialogContent>
          </Dialog>

          {/* Dark Mode Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <div className="container-academic py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 nav-link ${isActive(item.path) ? "nav-link-active" : ""}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
