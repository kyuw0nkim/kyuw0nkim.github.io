import { MainLayout } from "@/components/layout";
import { PublicationCard } from "@/components/cards/PublicationCard";
import { siteData, getLatestPublication, formatDate } from "@/data/siteData";
import { Award } from "lucide-react";
const Index = () => {
  const latestPub = getLatestPublication();
  return <MainLayout showProfile>
      {/* About Section */}
      <section id="about" className="content-section">
        <h1 className="text-3xl font-heading font-bold mb-4">Kyuwon Kim</h1>
        <p className="text-foreground leading-relaxed text-justify">
          Hi, I’m Kyuwon Kim, a master’s student in the Department of Educational Technology at Ewha Womans University, advised by Prof. Hyo-Jeong So.
          I am currently a member of the Interaction Design for Learning Lab.
          <br /><br />
          My research interests lie at the intersection of learning and human–computer interaction.
          I am guided by the question, “How might large language models transcend human limitations and contribute to building a better society?”
          <br /><br />
          In particular, I explore how LLMs can act as thoughtful opponents; supporting group dynamics and productive dialogue rather than replacing human-to-human interaction.
          Outside the lab, I enjoy listening to others’ stories, tinkering with computers—especially through design—and watching Let’s Play videos. Meeting new people and hearing their unique perspectives always inspires me. If any of this resonates with you, please feel free to reach out!
        </p>
      </section>

      {/* News Section */}
      <section id="news" className="content-section">
        <h2 className="section-title">News</h2>
        <div className="divide-y divide-border">
          {siteData.news.map(item => <div key={item.id} className="flex gap-6 py-3">
              <span className="text-muted-foreground text-sm w-24 flex-shrink-0">
                {formatDate(item.date)}
              </span>
              <span className="text-foreground">
                {item.link ? <a href={item.link} className="text-link hover:underline">
                    {item.title}
                  </a> : item.title}
              </span>
            </div>)}
        </div>
      </section>

      {/* Latest Publication Section */}
      <section id="publications" className="content-section">
        <h2 className="section-title">Latest Publication</h2>
        {latestPub && <div>
            <h3 className="font-semibold text-foreground mb-1">{latestPub.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {latestPub.authors.join(", ")}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              {latestPub.venue}, {latestPub.links.doi && <a href={latestPub.links.doi} className="text-link hover:underline" target="_blank" rel="noopener noreferrer">
                  {latestPub.links.doi}
                </a>}
            </p>
            
            {/* Award Badge */}
            <div className="award-badge">
              <Award className="w-4 h-4" />
              Best Poster Design Award
            </div>
          </div>}
      </section>
    </MainLayout>;
};
export default Index;
