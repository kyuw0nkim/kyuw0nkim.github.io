import { MainLayout } from "@/components/layout";
import { ProjectCard } from "@/components/cards/PublicationCard";
import { getProjectsByYear, getPublicationById } from "@/data/siteData";

const Projects = () => {
  const projectsByYear = getProjectsByYear();

  return (
    <MainLayout>
      <h1 className="text-3xl font-heading font-bold text-center mb-8">Projects</h1>

      {projectsByYear.map(({ year, projects }) => (
        <section key={year} className="mb-12">
          <h2 className="year-badge mb-4">{year}</h2>
          
          {projects.map((project) => {
            const relatedPubs = project.relatedPublications
              .map((id) => getPublicationById(id))
              .filter(Boolean);

            return (
              <div key={project.id} className="mb-8 pb-8 border-b border-border last:border-b-0">
                <ProjectCard project={project} />
                
                {/* Related Publications */}
                {relatedPubs.length > 0 && (
                  <div className="mt-6 pl-0 sm:pl-[calc(12rem+1.5rem)]">
                    <h4 className="font-semibold text-foreground mb-3">Related publications</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                      {relatedPubs.map((pub) => (
                        <li key={pub!.id}>
                          {pub!.authors.join(", ")} ({pub!.year}). {pub!.title}. {pub!.venue}.
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ))}
    </MainLayout>
  );
};

export default Projects;
