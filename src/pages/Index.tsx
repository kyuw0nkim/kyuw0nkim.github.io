import { Fragment } from "react";
import { MainLayout } from "@/components/layout";
import { siteData, getLatestPublication, formatDate } from "@/data/siteData";

const Index = () => {
  const { profile } = siteData;
  const latestPub = getLatestPublication();

  return (
    <MainLayout showProfile>
      {/* About Section */}
      <section id="about" className="content-section">
        <h1 className="text-3xl font-heading font-bold mb-4">{profile.name}</h1>
        <p className="text-foreground leading-relaxed text-justify">
          {profile.bioParagraphs.map((para, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              {para}
            </Fragment>
          ))}
        </p>
      </section>

      {/* News Section */}
      <section id="news" className="content-section">
        <h2 className="section-title">News</h2>
        <div className="divide-y divide-border">
          {siteData.news.map(item => (
            <div key={item.id} className="flex gap-6 py-3">
              <span className="text-muted-foreground text-sm w-24 flex-shrink-0">
                {formatDate(item.date)}
              </span>
              <span className="text-foreground">
                {item.link ? (
                  <a href={item.link} className="text-link hover:underline">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Publication Section */}
      <section id="publications" className="content-section">
        <h2 className="section-title">Latest Publication</h2>
        {latestPub && (
          <div>
            <h3 className="font-semibold text-foreground mb-1">{latestPub.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {latestPub.authors.join(", ")}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              {latestPub.venue}{" "}
              {latestPub.links.doi && (
                <a href={latestPub.links.doi} className="text-link hover:underline" target="_blank" rel="noopener noreferrer">
                  {latestPub.links.doi}
                </a>
              )}
            </p>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Index;
