import { MainLayout } from "@/components/layout";
import { NewsContent } from "@/components/news/NewsContent";
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
          <article key={item.id} className="flex flex-col gap-3 py-6 sm:flex-row sm:gap-6">
            <time dateTime={item.date} className="text-muted-foreground text-sm w-28 flex-shrink-0">
              {formatDate(item.date)}
            </time>
            <div className="min-w-0 flex-1">
              <NewsContent item={item} />
            </div>
          </article>
        ))}
      </div>
    </MainLayout>
  );
};

export default News;

