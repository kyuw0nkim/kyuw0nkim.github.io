import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { MainLayout } from "@/components/layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { designWorks } from "@/data/designData";
import type { DesignWork } from "@/data/types";

const CATEGORIES = ["All", "Prototype", "Visual", "UX"] as const;

const Design = () => {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<DesignWork | null>(null);

  const filtered =
    filter === "All" ? designWorks : designWorks.filter((w) => w.category === filter);

  return (
    <MainLayout>
      <h1 className="text-3xl font-heading font-bold text-center mb-8">Design</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 justify-center mb-8 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
              filter === cat
                ? "bg-sub text-white border-sub"
                : "bg-background text-muted-foreground border-border hover:border-sub/50 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      {filtered.length > 0 ? (
        <div className="columns-1 sm:columns-2 gap-4">
          {filtered.map((work) => (
            <div
              key={work.id}
              onClick={() => setSelected(work)}
              className="break-inside-avoid mb-4 rounded-lg overflow-hidden border border-border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {work.thumbnail ? (
                <img
                  src={work.thumbnail}
                  alt={work.title}
                  className="w-full object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  No image
                </div>
              )}
              <div className="p-3">
                <h3 className="font-semibold text-sm text-foreground leading-snug">{work.title}</h3>
                <span className="text-xs text-sub">{work.category} · {work.year}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-16">
          No works yet — check back soon.
        </p>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              {selected.thumbnail && (
                <img
                  src={selected.thumbnail}
                  alt={selected.title}
                  className="w-full rounded-md object-cover mb-4"
                />
              )}
              <DialogHeader>
                <DialogTitle className="font-heading">{selected.title}</DialogTitle>
              </DialogHeader>
              <p className="text-xs text-sub font-medium mt-1">
                {selected.category} · {selected.year}
              </p>
              <p className="text-sm text-foreground leading-relaxed mt-3">
                {selected.description}
              </p>
              {selected.links && (
                <div className="flex gap-2 mt-4">
                  {selected.links.figma && (
                    <a
                      href={selected.links.figma}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Figma
                    </a>
                  )}
                  {selected.links.demo && (
                    <a
                      href={selected.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Demo
                    </a>
                  )}
                  {selected.links.video && (
                    <a
                      href={selected.links.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Video
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Design;
