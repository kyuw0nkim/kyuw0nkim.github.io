import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MainLayout } from "@/components/layout";
import { getProjectById, getPublicationById, formatDate } from "@/data/siteData";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : null;

  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-heading font-bold mb-4">Project not found</h1>
          <Link to="/projects" className="text-link hover:underline">
            ← Back to projects
          </Link>
        </div>
      </MainLayout>
    );
  }

  const relatedPubs = project.relatedPublications
    .map((pubId) => getPublicationById(pubId))
    .filter(Boolean);

  const formatDateRange = () => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  // Simple markdown to HTML converter for basic elements
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-4 text-foreground">
              {currentList.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          );
          currentList = [];
        }
        elements.push(
          <h2 key={index} className="text-xl font-heading font-semibold mt-8 mb-4">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // List items
      else if (line.startsWith('- ')) {
        currentList.push(line.replace('- ', ''));
      }
      // Numbered lists
      else if (/^\d+\. /.test(line)) {
        currentList.push(line.replace(/^\d+\. /, ''));
      }
      // Regular paragraphs
      else if (line.trim()) {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-4 text-foreground">
              {currentList.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          );
          currentList = [];
        }
        elements.push(
          <p key={index} className="text-foreground mb-4">
            {line}
          </p>
        );
      }
    });

    // Flush remaining list items
    if (currentList.length > 0) {
      elements.push(
        <ul key="list-end" className="list-disc list-inside space-y-1 mb-4 text-foreground">
          {currentList.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    }

    return elements;
  };

  return (
    <MainLayout>
      <Link to="/projects" className="inline-flex items-center gap-2 text-link hover:underline mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to projects
      </Link>

      {/* Hero */}
      <header className="mb-10">
        <h1 className="text-3xl font-heading font-bold mb-4">{project.title}</h1>
        <p className="text-muted-foreground">
          {formatDateRange()} · {project.role}
        </p>
      </header>

      {/* Content */}
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        {renderMarkdown(project.description)}
      </article>

      {/* Related Publications */}
      {relatedPubs.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-heading font-semibold mb-4">Related Publications</h2>
          <ul className="space-y-3">
            {relatedPubs.map((pub) => (
              <li key={pub!.id} className="text-sm text-muted-foreground">
                {pub!.authors.join(", ")} ({pub!.year}). <span className="text-foreground">{pub!.title}</span>. {pub!.venue}.
              </li>
            ))}
          </ul>
        </section>
      )}
    </MainLayout>
  );
};

export default ProjectDetail;
