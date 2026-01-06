import { MainLayout } from "@/components/layout";
import { siteData, formatDate } from "@/data/siteData";

const News = () => {
  // Sort news by date descending
  const sortedNews = [...siteData.news].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <MainLayout>
      <h1 className="text-3xl font-heading font-bold text-center mb-8">News</h1>

      <div className="divide-y divide-border">
        {sortedNews.map((item) => (
          <div key={item.id} className="flex gap-6 py-4">
            <span className="text-muted-foreground text-sm w-28 flex-shrink-0">
              {formatDate(item.date)}
            </span>
            <span className="text-foreground">
              {item.link ? (
                <a href={item.link} className="text-link hover:underline" target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </span>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default News;
