import { Fragment } from "react";
import { MainLayout } from "@/components/layout";
import { PublicationCard } from "@/components/cards/PublicationCard";
import { siteData, getLatestPublication, formatDate } from "@/data/siteData";
import type { TextPart } from "@/data/types";
import { HoverTooltip } from "@/components/ui/HoverTooltip";

const renderParts = (parts: TextPart[]) =>
  parts.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : (
      <HoverTooltip key={i} content={part.tooltip}>
        <a href={part.href} className="text-link" target="_blank" rel="noopener noreferrer">
          {part.text}
        </a>
      </HoverTooltip>
    )
  );

const Index = () => {
  const { profile } = siteData;
  const latestPub = getLatestPublication();

  return (
    <MainLayout showProfile>
      {/* About Section */}
      <section id="about" className="content-section">
        <h1 className="text-3xl font-heading font-bold mb-1">{profile.name}</h1>
        <p className="text-muted-foreground mb-4" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          Always go with the choice that scares you the most
        </p>
        <p className="text-foreground leading-relaxed text-justify">
          {profile.bioParagraphs.map((para, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              {renderParts(para)}
            </Fragment>
          ))}
        </p>
      </section>

      {/* News Section */}
      <section id="news" className="content-section">
        <h2 className="section-title">Updates</h2>
        <div className="divide-y divide-border">
          {siteData.news.slice(0, 3).map(item => (
            <div key={item.id} className="flex gap-6 py-3">
              <span className="text-muted-foreground text-sm w-24 flex-shrink-0">
                {formatDate(item.date)}
              </span>
              <span className="text-foreground">
                {renderParts(item.title)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Publication Section */}
      <section id="publications" className="content-section">
        <h2 className="section-title">Latest Publication</h2>
        {latestPub && <PublicationCard publication={latestPub} />}
      </section>
    </MainLayout>
  );
};

export default Index;
